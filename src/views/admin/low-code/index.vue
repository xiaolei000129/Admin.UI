<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <my-search :fields="fields" @click="onSearch" />
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:low-code-table:add'])">
          <el-button type="primary" @click="onAdd">新增表</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:low-code-table:delete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
            style="margin-left: 0px"
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
      :data="pageList"
      highlight-current-row
      height="'100%'"
      style="width: 100%; height: 100%"
      @selection-change="onSelsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="lowCodeTableName" label="表名称" width />
      <el-table-column prop="taxon" label="代码类名" width />
      <el-table-column prop="menuName" label="菜单名称" width />
      <el-table-column prop="functionModule" label="业务场景" width />
      <el-table-column prop="description" label="描述" width />
      <el-table-column
        prop="creationTime"
        label="创建时间"
        :formatter="formatCreatedTime"
        width="180"
      ></el-table-column>
      <el-table-column
        v-if="
          checkPermission([
            'api:admin:low-code-table:update',
            'api:admin:low-code-table:delete',
            'api:admin:low-code-table:generate',
          ])
        "
        label="操作"
        width="300"
      >
        <template #default="{ $index, row }">
          <el-button
            v-if="checkPermission(['api:admin:low-code-table:generate'])"
            @click="onGenerateLowCodeTable($index, row)"
            type="primary"
            >生成</el-button
          >
          <el-button
            v-if="checkPermission(['api:admin:low-code-table:generate'])"
            @click="onGenerateConfig($index, row)"
            type="info"
            >配置</el-button
          >
          <el-button
            v-if="checkPermission(['api:admin:low-code-table:update'])"
            @click="onEdit($index, row)"
            >编辑</el-button
          >
          <my-confirm-button
            v-if="checkPermission(['api:admin:low-code-table:delete'])"
            type="delete"
            :loading="row._loading"
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
        @get-page="pageList"
      />
    </template>

    <!-- 添加 -->
    <my-window
      v-if="checkPermission(['api:admin:low-code-table:add'])"
      title="添加"
      :visible.sync="addDialogFormVisible"
      @close="closeAddForm"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item prop="parentIds" label="上级视图">
          <el-cascader
            :key="addFormKey"
            v-model="addForm.parentIds"
            placeholder="请选择，支持搜索功能"
            :options="modules"
            :props="{ checkStrictly: true, value: 'id' }"
            filterable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item prop="lowCodeTableName" label="选择表">
          <el-select
            v-model="addForm.lowCodeTableName"
            placeholder="请选择表"
            style="width: 100%"
          >
            <el-option
              v-for="item in tableOptions"
              :key="item.tableName"
              :label="item.tableComment"
              :value="item.tableName"
            >
              <span style="float: left">{{ item.tableName }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >{{ item.tableComment }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表名称" prop="lowCodeTableName">
          <el-input v-model="addForm.lowCodeTableName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="代码类名" prop="taxon">
          <el-input v-model="addForm.taxon" auto-complete="off" />
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addForm.menuName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="业务场景" prop="functionModule">
          <el-input v-model="addForm.functionModule" auto-complete="off" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="2"
            auto-complete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click.native="addDialogFormVisible = false">取消</el-button>
        <my-confirm-button
          type="submit"
          :validate="addFormvalidate"
          :loading="addLoading"
          @click="onAddSubmit"
        />
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:low-code-table:update'])"
      title="编辑"
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
        <el-form-item prop="parentIds" label="上级视图">
          <el-cascader
            :key="editFormKey"
            v-model="editForm.parentIds"
            placeholder="请选择，支持搜索功能"
            :options="modules"
            :props="{ checkStrictly: true, value: 'id' }"
            filterable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="表名称" prop="lowCodeTableName">
          <el-input v-model="editForm.lowCodeTableName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="代码类名" prop="taxon">
          <el-input v-model="editForm.taxon" auto-complete="off" />
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="业务场景" prop="functionModule">
          <el-input v-model="editForm.functionModule" auto-complete="off" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="2"
            auto-complete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button
          type="submit"
          :validate="editFormvalidate"
          :loading="editLoading"
          @click="onEditSubmit"
        />
      </template>
    </my-window>

    <!--配置窗口-->
    <my-window
      v-if="checkPermission(['api:admin:low-code-table:generate'])"
      title="配置"
      :visible.sync="tableColumnListVisible"
      @close="closeTableColumnList"
    >
      <!--列表-->
      <el-table
        v-loading="tableColumnListLoading"
        :data="tableColumnList"
        highlight-current-row
        height="'100%'"
        style="width: 100%; height: 100%"
        @selection-change="onSelsChange"
      >
        <el-table-column prop="columnName" label="字段" width="" />
        <el-table-column prop="columnComment" label="字段描述" width />
        <el-table-column prop="maxLength" label="最大长度" width />
        <el-table-column prop="netType" label="字段类型" width />
        <el-table-column
          v-if="checkPermission(['api:admin:low-code-table:generate'])"
          label="字段维护"
        >
          <template #default="{ row }">
            <el-checkbox v-model="row.isWebShow">前端显示</el-checkbox>
            <el-checkbox v-model="row.isWebAdd">前端添加</el-checkbox>
            <el-checkbox v-model="row.isWebUpdate">前端修改</el-checkbox>
            <el-checkbox v-model="row.isWebSelect">前端查询</el-checkbox>
            <el-checkbox v-model="row.isNullable">可空</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['api:admin:low-code-table:generate'])"
          label="查询方式"
        >
          <template #default="{ row }">
            <el-select v-model="row.queryType" placeholder="查询方式">
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['api:admin:low-code-table:generate'])"
          label="输入类型"
        >
          <template #default="{ row }">
            <el-select v-model="row.inputType" placeholder="输入类型">
              <el-option
                v-for="item in inputTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click.native="tableColumnListVisible = false"
          >取消</el-button
        >
        <my-confirm-button
          type="submit"
          :validate="tableColumnListFormvalidate"
          :loading="tableColumnListLoading"
          @click="onTableColumnSubmit"
        />
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime, listToTree, getTreeParents } from "@/utils";
import { editLowCodeTableConfig } from "@/api/admin/low-code-table/low-code-table-config";
import {
  getLowCodeTable,
  addLowCodeTable,
  getLowCodeTableListPage,
  removeLowCodeTable,
  editLowCodeTable,
  batchLowCodeTable,
  getTableEntityList,
  getColumnListByTableName,
  generateLowCodeTable,
} from "@/api/admin/low-code-table/low-code-table";
import { getViewList } from "@/api/admin/view";
import MyContainer from "@/components/my-container";
import MyConfirmButton from "@/components/my-confirm-button";
import MySearch from "@/components/my-search";
import MySearchWindow from "@/components/my-search-window";
import MyWindow from "@/components/my-window";

export default {
  name: "low-code-table",
  components: {
    MyContainer,
    MyConfirmButton,
    MySearch,
    MySearchWindow,
    MyWindow,
  },
  data() {
    return {
      // 高级查询字段
      fields: [
        { value: "lowCodeTableName", label: "名称", default: true },
        {
          value: "creationTime",
          label: "创建时间",
          type: "date",
          operator: "daterange",
          config: {
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
        },
      ],
      dynamicFilter: null,
      pageList: [],
      tableColumnList: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,
      tableColumnListLoading: false,
      pageLoading: false,
      editLoading: false,
      addLoading: false,
      deleteLoading: false,
      editFormKey: 1,
      addFormKey: 1,
      // 添加界面
      addDialogFormVisible: false,
      // 编辑界面是否显示
      editFormVisible: false,
      // 配置界面
      tableColumnListVisible: false,
      editFormRules: {
        functionModule: [
          { required: true, message: "请输入业务场景", trigger: "blur" },
        ],
        lowCodeTableName: [
          { required: true, message: "请输入表名称", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        taxon: [{ required: true, message: "请输入代码类名", trigger: "blur" }],
      },
      addFormRules: {
        functionModule: [
          { required: true, message: "请输入业务场景", trigger: "blur" },
        ],
        lowCodeTableName: [
          { required: true, message: "请输入表名称", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        taxon: [{ required: true, message: "请输入代码类名", trigger: "blur" }],
      },
      modules: [],
      tableOptions: [],
      queryTypeOptions: [
        {
          label: "输入框",
          value: 1,
        },
        {
          label: "下拉框",
          value: 2,
        },
      ],
      inputTypeOptions: [
        {
          label: "输入框",
          value: 1,
        },
        {
          label: "选择器",
          value: 2,
        },
        {
          label: "单选框",
          value: 3,
        },
        {
          label: "多选框",
          value: 4,
        },
        {
          label: "计数器",
          value: 5,
        },
        {
          label: "开关",
          value: 6,
        },
        {
          label: "日期选择器",
          value: 7,
        },
        {
          label: "上传",
          value: 8,
        },
        {
          label: "多行文本框",
          value: 9,
        },
      ],
      // 编辑界面数据
      editForm: {
        id: "",
        parentIds: [],
        taxon: "",
        functionModule: "",
        lowCodeTableName: "",
        menuName: "",
        description: "",
      },
      // 添加界面数据
      addForm: {
        id: "",
        parentIds: [],
        taxon: "",
        functionModule: "",
        lowCodeTableName: "",
        menuName: "",
        description: "",
      },
    };
  },
  async mounted() {
    await this.onGetPageList();
    await this.onGetApiList();
    await this.onGetTableEntityList();
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, "YYYY-MM-DD HH:mm");
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1);
      this.dynamicFilter = dynamicFilter;
      this.onGetPageList();
    },
    // 显示添加界面
    async onAdd(index, row) {
      this.addDialogFormVisible = true;
    },
    // 显示生成代码配置
    async onGenerateConfig(index, row) {
      await this.onGetColumnListByTableName(row.id);
    },
    // 关闭添加
    closeAddForm() {
      this.$refs.addForm.resetFields();
      this.addDialogFormVisible = false;
    },
    // 关闭配置
    closeTableColumnList() {
      this.tableColumnListLoading = false;
    },
    // 关闭编辑
    closeEditForm() {
      this.$refs.editForm.resetFields();
      this.editFormVisible = false;
    },
    // 添加验证
    addFormvalidate() {
      let isValid = false;
      this.$refs.addForm.validate((valid) => {
        isValid = valid;
      });
      return isValid;
    },
    // 编辑验证
    editFormvalidate() {
      let isValid = false;
      this.$refs.editForm.validate((valid) => {
        isValid = valid;
      });
      return isValid;
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true;
      return isValid;
    },
    // 配置提交验证
    tableColumnListFormvalidate(row) {
      let isValid = true;
      return isValid;
    },
    // 获取列表
    async onGetApiList() {
      const res = await getViewList();
      if (!res?.success) {
        return;
      }
      const list = _.cloneDeep(res.data);
      const keys = list
        .filter(
          (l) =>
            l.parentId === "" ||
            l.parentId === "00000000-0000-0000-0000-000000000000"
        )
        .map((l) => l.id + "");
      this.modules = listToTree(_.cloneDeep(list), {
        id: "00000000-0000-0000-0000-000000000000",
        parentId: "00000000-0000-0000-0000-000000000000",
        label: "顶级",
      });

      list.forEach((l) => {
        l._loading = false;
      });
    },
    // 获取列表
    async onGetPageList() {
      var pager = this.$refs.pager.getPager();
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter,
      };
      this.listLoading = true;
      const res = await getLowCodeTableListPage(params);
      this.listLoading = false;
      if (!res?.success) {
        return;
      }
      this.total = res.data.total;
      const data = res.data.list;
      data.forEach((d) => {
        d._loading = false;
      });
      this.pageList = data;
    },
    // 获取实体表列表
    async onGetTableEntityList() {
      const res = await getTableEntityList();
      if (!res?.success) {
        return;
      }
      this.tableOptions = res.data;
    },
    // 生成代码
    async onGenerateLowCodeTable(index, row) {
      const res = await generateLowCodeTable({ id: row.id });
      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });
    },
    // 获取表字段
    async onGetColumnListByTableName(id) {
      this.tableColumnListVisible = false;
      this.tableColumnList = [];
      const res = await getColumnListByTableName({ id: id });
      if (!res?.success) {
        return;
      }
      this.tableColumnList = res.data;
      this.tableColumnListVisible = true;
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true;
      const res = await getLowCodeTable({ id: row.id });
      this.pageLoading = false;
      if (res && res.success) {
        const parents = getTreeParents(this.pageList, row.id);
        const parentIds = parents.map((p) => p.id);
        parentIds.unshift("00000000-0000-0000-0000-000000000000");
        const data = res.data;
        data.parentIds = parentIds;
        this.editForm = data;
        this.editFormVisible = true;
        ++this.editFormKey;
      }
    },
    // 提交配置表
    async onTableColumnSubmit() {
      this.tableColumnListLoading = true;
      const para = _.cloneDeep(this.tableColumnList);
      const res = await editLowCodeTableConfig(para);
      this.tableColumnListLoading = false;

      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });
      this.tableColumnListVisible = false;
      await this.onGetTableEntityList();
    },
    // 添加
    async onAddSubmit() {
      this.addLoading = true;
      const para = _.cloneDeep(this.addForm);
      para.menuParentId = para.parentIds.pop();

      const res = await addLowCodeTable(para);
      this.addLoading = false;

      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });

      this.$refs["addForm"].resetFields();
      this.addDialogFormVisible = false;
      this.onGetApiList();
      this.onGetPageList();
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true;
      const para = _.cloneDeep(this.editForm);
      para.menuParentId = para.parentIds.pop();
      const res = await editLowCodeTable(para);
      this.editLoading = false;

      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });

      this.$refs["editForm"].resetFields();
      this.editFormVisible = false;
      this.onGetPageList();
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] };
      para.ids = this.sels.map((s) => {
        return s.id;
      });
      console.log(para);
      this.deleteLoading = true;
      const res = await batchLowCodeTable(para.ids);
      this.deleteLoading = false;

      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });
      this.onGetPageList();
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true;
      const para = { id: row.id };
      const res = await removeLowCodeTable(para);
      row._loading = false;

      if (!res?.success) {
        this.$message({
          message: res.msg,
          type: "error",
        });
        return;
      }

      this.$message({
        message: res.msg,
        type: "success",
      });
      this.onGetPageList();
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true;
      return isValid;
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-search ::v-deep .el-input-group__prepend {
  background-color: #fff;
}
</style>
