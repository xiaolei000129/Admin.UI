<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-checkbox v-model="isRecommendValue" border >只查看推荐任务</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-select v-model="missionStateValue" placeholder="请选择任务状态">
            <el-option
              v-for="item in missionStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="hallTypeValue" placeholder="请选择任务大厅">
            <el-option
              v-for="item in hallTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <my-search :fields="fields" @click="onSearch" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger">曝光任务</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="merchantMission"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="onSelsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="id" width v-if="false" />
      <el-table-column prop="articleTypeName" label="任务类型" width="80" />
      <el-table-column prop="coding" label="任务编码" width />
      <el-table-column prop="name" label="任务名称" width />
      <el-table-column prop="money" label="金额（报酬）"  width="120" />
      <el-table-column prop="overNum" label="剩余任务个数" width="120" />
      <el-table-column prop="operatingNumber" label="任务数" width="100" />
      <el-table-column prop="claimNumber" label="已认领任务数" width="120" />
      <el-table-column prop="fulfilNumber" label="已完成任务数" width />
      <el-table-column prop="noHotRate" label="未认领率" width />
      <el-table-column prop="userName" label="发布人" width />
      <el-table-column prop="userID" label="用户id" width v-if="false"/>
      <el-table-column prop="portrait" label="头像" width>
        <template #default="{row}">
           <el-avatar :src="row.portrait"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="isRecommend" label="是否推荐" width />
      <el-table-column prop="arriveAccount" label="？xx账户" width />
      <el-table-column prop="verifyStatus" label="审核状态" width  v-if="false"/>
      <el-table-column prop="verifyStatusName" label="审核状态" width/>
      <el-table-column prop="updateTime" label="更新时间" width :formatter="formatCreatedTime"/>
      <el-table-column prop="time" label="time ？" width/>
      <el-table-column prop="creationTime" label="任务创建时间" :formatter="formatCreatedTime" width/>
      <el-table-column prop="creatorID" label="创建人" width v-if="false"/>
      
      <el-table-column v-if="checkPermission(['api:admin:bank-card:update','apI:admin:bank-card:delete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:admin:bank-card:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['apI:admin:bank-card:delete'])"
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        :checked-count="sels.length"
        @get-page="getmerchantMission"
      />
    </template>

    <!--高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      :modal="false"
      @click="onSearchFilter"
    />

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:bank-card:update'])"
      title="编辑银行卡"
      :visible.sync="editFormVisible"
      @close="closeEditForm"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="银行卡" prop="bankCard">
          <el-input v-model="editForm.bankCard" auto-complete="off" />
        </el-form-item>

         <el-form-item label="所属银行" prop="ownedBank">
          <el-input v-model="editForm.ownedBank" auto-complete="off" />
        </el-form-item>

       <el-form-item label="开户银行所在地" prop="bankCardLocation">
          <el-input v-model="editForm.bankCardLocation" auto-complete="off" />
        </el-form-item>

        <el-form-item label="银行预留手机号码" prop="bankPhone">
          <el-input v-model="editForm.bankPhone" auto-complete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormvalidate" :loading="editLoading" @click="onEditSubmit" />
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getListPage, remove, edit, get, exposure } from '@/api/admin/mission/merchant'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'

export default {
  name: 'User',
  components: { MyContainer, MyConfirmButton, MySearch, MySearchWindow, MyWindow },
  data() {
    return {
      // 任务状态下拉框数据源
      missionStateOptions:[{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '审核通过'
        }, {
          value: '4',
          label: '审核拒绝'
        }, {
          value: '3',
          label: '待支付'
        }],
      missionStateValue:'0',
      // 任务大厅
      hallTypeOptions:[{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '最新发布'
        }, {
          value: '3',
          label: '关注商家'
        }, {
          value: '4',
          label: '高价'
        }, {
          value: '5',
          label: '火爆'
        }],
      hallTypeValue:'1',
      // 是否只查看推荐任务
      isRecommendValue:false,

      // 高级查询字段
      fields: [
        { value: 'name', label: '任务名称', default: true },
        // { value: 'isRecommend', label: '是否推荐', default: true },
        { value: 'coding', label: '任务编号', default: true },
        // { value: 'eTaskHallType', label: '任务大厅', default: true },
        // { value: 'eManageTaskType', label: '任务状态', type: 'string' }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,
      merchantMission: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,
      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        bankCard: [{ required: true, message: '请输入银行卡', trigger: 'blur' }],
        ownedBank: [{ required: true, message: '请输入所属银行', trigger: 'blur' }],
        bankCardLocation: [{ required: true, message: '请输入开户银行所在地', trigger: 'blur' }],
        bankPhone: [{ required: true, message: '请输入银行预留手机号码', trigger: 'blur' }]
      },
      userNameReadonly: true,
      // 编辑界面数据
      editForm: {
        id: '',
        bankCard: '',
        ownedBank: '',
        bankCardLocation: '',
        bankPhone: '',
      },
      deleteLoading: false
    }
  },
  async mounted() {
    await this.getmerchantMission()
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getmerchantMission()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getmerchantMission()
      this.searchWindowVisible = false
    },

    // 获取商家任务列表
    async getmerchantMission() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }

      this.listLoading = true
      const res = await getListPage(params)
      console.log(res)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.merchantMission = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        this.editForm = res.data
        this.editFormVisible = true
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 编辑验证
    editFormvalidate() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true
      const para = _.cloneDeep(this.editForm)

      const res = await edit(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getmerchantMission()
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await remove(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getmerchantMission()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true

      return isValid
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search ::v-deep .el-input-group__prepend {
  background-color: #fff;
}
</style>
