<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <my-search :fields="fields" @click="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
        </el-form-item>
          <el-form-item v-if="checkPermission(['api:admin:dictionary:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
              <el-form-item v-if="checkPermission(['api:admin:dictionary:batchsoftdelete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
            :validate="batchDeleteValidate"
            style="margin-left: 0px;"
            @click="onBatchDelete"
          >
            <template #content>
              <p>确定要批量删除吗？</p>
            </template>
            批量删除
          </my-confirm-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="article"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="onSelsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="id" width />
      <el-table-column prop="title" label="文章标题" width />
      <el-table-column prop="portrait" label="封面图" width />
      <el-table-column prop="pV" label="访问量" width />
      <el-table-column prop="explain" label="文章备注" width />
      <el-table-column prop="creationTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="creatorStr" label="创建人" width />
      <el-table-column v-if="checkPermission(['api:admin:article:update','apI:admin:article:delete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:admin:article:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['apI:admin:article:delete'])"
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
        @get-page="getarticle"
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
      v-if="checkPermission(['api:admin:article:update'])"
      title="编辑文章"
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
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title" auto-complete="off" />
        </el-form-item>

         <el-form-item label="封面图" prop="portrait">
          <el-input v-model="editForm.portrait" auto-complete="off" />
        </el-form-item>

       <el-form-item label="文章备注" prop="explain">
          <el-input v-model="editForm.explain" auto-complete="off" />
        </el-form-item>

        <el-form-item label="文章信息" prop="commentInfo">
          <el-input v-model="editForm.commentInfo" auto-complete="off" />
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
import { getListPage, remove, edit, get } from '@/api/admin/modules_user_article'
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
      // 高级查询字段
      fields: [
        { value: 'title', label: '文章标题', default: true },
        { value: 'explain', label: '文章备注', default: true },
        { value: 'creationTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,
      article: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,
      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        portrait: [{ required: true, message: '请输入封面图', trigger: 'blur' }],
        explain: [{ required: true, message: '请输入文章备注', trigger: 'blur' }],
        commentInfo: [{ required: true, message: '请输入文章信息', trigger: 'blur' }]
      },
      userNameReadonly: true,
      // 编辑界面数据
      editForm: {
        id: '',
        title: '',
        portrait: '',
        explain: '',
        commentInfo: '',
      },
      deleteLoading: false
    }
  },
  async mounted() {
    await this.getarticle()
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getarticle()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getarticle()
      this.searchWindowVisible = false
    },

    // 获取用户列表
    async getarticle() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }

      this.listLoading = true
      const res = await getListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      console.log(res)
      data.forEach(d => {
        d._loading = false
      })
      this.article = data
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
      this.getarticle()
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
      this.getarticle()
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
