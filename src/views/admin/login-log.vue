<template>
  <my-container>
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.createdUserName"
            placeholder="登录账号"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
    >
      <el-table-column prop="createdUserName" label="操作账号">
        <template #default="{row}">
          {{ row.createdUserName }}<br>{{ row.nickName }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址"  />
      <el-table-column prop="browser" label="浏览器"  />
      <el-table-column prop="os" label="操作系统"  />
      <el-table-column prop="elapsedMilliseconds">
            <template  #header>
              耗时<br>毫秒
            </template>
          </el-table-column>
      <el-table-column prop="status" label="登录状态">
        <template #default="{row}">
          <el-tag
            :type="row.status ? 'success' : 'danger'"
            disable-transitions
          >{{ row.status ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="登录消息" />
      <el-table-column prop="creationTime" label="登录时间" :formatter="formatCreatedTime"   />
    </el-table>

    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        @get-page="getList"
      />
    </template>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getLoginLogPage } from '@/api/admin/login-log'
import MyContainer from '@/components/my-container'

export default {
  name: 'LoginLog',
  components: { MyContainer },
  data() {
    return {
      filter: {
        name: ''
      },
      list: [],
      total: 0,
      listLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getList()
    },
    // 获取列表
    async getList() {
      const pager = this.$refs.pager.getPager()
      const para = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getLoginLogPage(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      this.list = res.data.list
    }
  }
}
</script>

<style scoped>
.a{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  /* box-sizing: border-box; */
  flex-direction: column;
}
.b{
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  flex-grow: 1;
}
</style>
