<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标签" prop="metaLabel">
        <el-input
          v-model="queryParams.metaLabel"
          placeholder="请输入元数据标签"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="metaType">
        <el-input
          v-model="queryParams.metaType"
          placeholder="请输入元数据类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否默认" prop="whetherDefault">
        <el-select
          v-model="queryParams.whetherDefault"
          placeholder="是否默认"
          clearable
          size="small"
          style="width: 100px"
        >
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 列表数据 -->
    <el-table v-loading="loading" :data="metadataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="元数据编码" align="center" prop="pkMetaId" />
      <el-table-column label="元数据标签" align="center" prop="metaLabel" />
      <el-table-column label="元数据值" align="center" prop="metaValue" />
      <el-table-column label="元数据类型" align="center" prop="metaType"/>
      <el-table-column label="样式属性" align="center" prop="cssClass" />
      <el-table-column label="表格回显样式" align="center" prop="listClass"/>
      <el-table-column label="默认" align="center" width="65">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.whetherDefault"
            :active-value="1"
            :inactive-value="0"
            @change="handleDefaultChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="65">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="60"/>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加修改元数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型">
          <el-select v-model="form.metaType" placeholder="请选择">
            <el-option
              v-for="item in metatypeList"
              :key="item.dictType"
              :label="item.dictName"
              :value="item.dictType"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="元数据标签" prop="metaLabel">
          <el-input v-model="form.metaLabel" placeholder="元数据标签" />
        </el-form-item>
        <el-form-item label="元数据值" prop="metaValue">
          <el-input v-model="form.metaValue" placeholder="请输入元数据值" />
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" />
        </el-form-item>
        <el-form-item label="表格回显样式" prop="listClass">
          <el-input v-model="form.listClass" />
        </el-form-item>
        <el-form-item label="是否默认" prop="whetherDefault">
          <el-radio-group v-model="form.whetherDefault">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="元数据顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMetaData, getMetaData, addMetaData,updateMetaData,changeMetadataStatus,changeMetadataDefault,deleteMetaData,listMetaType} from "@/api/system/meta";

export default {
  name: "Meta",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 元数据类型数据
      metatypeList: [],
      // 元数据表格数据
      metadataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询元数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        metaLabel: undefined,
        metaType: undefined,
        whetherDefault: undefined,
      },
      // 表单元数据
      form: {},
      // 表单校验
      rules: {
        metaLabel: [
          { required: true, message: "元数据标签不能为空", trigger: "blur" }
        ],
        metaValue: [
          { required: true, message: "元数据值不能为空", trigger: "blur" }
        ],
        metaType: [
          { required: true, message: "元数据类型不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询元数据列表 */
    getList() {
      this.loading = true;
      listMetaData(this.queryParams).then(response => {
        this.metadataList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        metaLabel: undefined,
        metaType: undefined,
        whetherDefault: 0,
        sort: 1,
        status: 1
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.configKey)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 获取元数据类型数据 */
    getMetaTypeList () {
      listMetaType().then(response => {
        this.metatypeList = response.data;
      });
    },
    /** 新增按钮操作 */
    handleAdd () {
      //重置表单
      this.reset();
      //获取元数据类型数据
      this.getMetaTypeList();
      this.open = true;
      this.title = "添加元数据";
    },
    // 启用状态修改
    handleStatusChange (row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.metaLabel + '"元数据吗？').then(function () {
        return changeMetadataStatus(row.pkMetaId, row.status);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    // 设置为默认
    handleDefaultChange (row) {
      let text = row.whetherDefault === 1 ? "设置" : "取消";
      this.$modal.confirm('确认要'+ text + '"默认值？').then(function () {
        return changeMetadataDefault(row.pkMetaId,row.metaType, row.whetherDefault);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");

      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkMetaId = row.pkMetaId || this.ids
      getMetaData(pkMetaId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改元数据";
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const metadataIds = row.pkMetaId || this.ids;
      this.$modal.confirm('是否确认删除元数据编号为"' + metadataIds + '"的数据项？').then(function () {
        return deleteMetaData(metadataIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkMetaId != undefined) {
            updateMetaData(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMetaData(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/param/export', {
        ...this.queryParams
      }, `param_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>