<template>
  <div class="app-container">
    <!-- 搜索栏表单 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="省份名称" prop="provinceName">
        <el-input
          v-model="queryParams.provinceName"
          placeholder="请输入省份名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="区划代码" prop="zoningCode">
        <el-input
          v-model="queryParams.zoningCode"
          placeholder="请输入区划代码"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简称" prop="abbreviation">
        <el-input
          v-model="queryParams.abbreviation"
          placeholder="请输入简称"
          clearable
          size="small"
          style="width: 120px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="启用状态"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">搜索重置</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetOrder">排序重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表上方菜单栏 -->
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
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="syncData">同步</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表数据 fixed="left" :header-cell-class-name="handleHeaderClass" @header-click="handleHeaderClick" :default-sort = "{prop: 'create_time', order: 'ascending'}"-->
    <!-- <el-table v-loading="loading" :data="provinceList" @selection-change="handleSelectionChange" style="width: 100%" height="650" border=true :cell-style="{padding:'5px'}"> -->
    <el-table
      v-loading="loading"
      :data="provinceList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      class="dictionary-xzqh-table"
      style="width: 100%"
      height="650"
      :border="true"
      :cell-style="{padding:'1px'}"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        label="省份编号"
        align="center"
        key="pkProvinceId"
        prop="pkProvinceId"
        width="80"
        v-if="columns[0].visible"
      />
      <el-table-column
        label="省份名称"
        align="center"
        key="provinceName"
        prop="provinceName"
        v-if="columns[1].visible"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="区划代码"
        align="center"
        key="zoningCode"
        prop="zoningCode"
        width="130"
        v-if="columns[2].visible"
      />
      <el-table-column
        label="简称"
        align="center"
        key="abbreviation"
        prop="abbreviation"
        width="90"
        v-if="columns[3].visible"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="省会"
        align="center"
        key="provinceCapital"
        prop="provinceCapital"
        v-if="columns[4].visible"
      />
      <el-table-column
        label="首字母"
        align="center"
        key="szm"
        prop="szm"
        width="90"
        sortable="custom"
        v-if="columns[5].visible"
      />
      <el-table-column
        label="排序"
        align="center"
        key="sort"
        prop="sort"
        sortable
        v-if="columns[6].visible"
        width="80"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="create_time"
        width="160"
        sortable
        v-if="columns[7].visible"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="160"
        v-if="columns[8].visible"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" v-if="columns[9].visible" width="65">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作栏  fixed="right"-->
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 1修改 -->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <!-- 2删除 -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <!-- 3查看下级 arrow-down-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-arrow-down"
            @click="handleChildren(scope.row)"
          >查看下级</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页操作 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改省份配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="省份名称" prop="provinceName">
          <el-input v-model="form.provinceName" placeholder="请输入省份名称" />
        </el-form-item>
        <el-form-item label="区划代码" prop="zoningCode">
          <el-input v-model="form.zoningCode" placeholder="请输入区划代码" />
        </el-form-item>
        <el-form-item label="简称" prop="abbreviation">
          <el-input v-model="form.abbreviation" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="省会" prop="provinceCapital">
          <el-input v-model="form.provinceCapital" placeholder="请输入省会" />
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-radio-group v-model="form.type" disabled>
            <el-radio :label="1">省</el-radio>
            <el-radio :label="2">直辖市</el-radio>
            <el-radio :label="3">自治区</el-radio>
            <el-radio :label="4">特别行政区</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { listProvince, getProvince, delProvince, addProvince, updateProvince, changeProvinceStatus, syncProvinceData } from "@/api/dictionary/xzqh/province";
export default {
  name: "Province",
  data () {
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
      // 省份表格数据
      provinceList: [],
      // 弹出层标题
      title: "",
      // 是否显示添加修改的弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        orderBy: [],
        zoningCode: undefined,
        provinceName: undefined,
        abbreviation: undefined,
        status: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `街道编号`, visible: true },
        { key: 1, label: `街道名称`, visible: true },
        { key: 2, label: `区划代码`, visible: true },
        { key: 3, label: `简称`, visible: true },
        { key: 4, label: `省会`, visible: true },
        { key: 5, label: `首字母`, visible: true },
        { key: 6, label: `排序`, visible: true },
        { key: 7, label: `创建时间`, visible: true },
        { key: 8, label: `更新时间`, visible: true },
        { key: 9, label: `状态`, visible: true },
      ],
      // 排序列信息
      orderBys: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        provinceName: [
          { required: true, message: "省份名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询省份列表 */
    getList () {
      this.loading = true;
      listProvince(this.queryParams).then(response => {
        this.provinceList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }
      );
    },
    //排序操作
    sortChange ({ order, prop }) {
      let isHave = false;
      //先判断该排序规则，在本地缓存中是否有
      for (const i in this.orderBys) {
        if (this.orderBys[i].indexOf(prop) > -1) {
          isHave = true;
        }
      }
      if (!isHave) {
        this.orderBys.push(prop);
      }
      for (let i = 0; i < this.orderBys.length; i++) {
        //触发的排序和本地缓存的排序相同
        if (this.orderBys[i].indexOf(prop) > -1) {
          if (order === 'ascending' || order === 'descending') {
            if (order === 'ascending') {
              this.orderBys[i] = prop + ' asc';
            } else {
              this.orderBys[i] = prop + ' desc';
            }
          } else {
            //该排序规则置为空
            this.orderBys.splice(i, 1);
          }
        }
      }
      this.queryParams.orderBy = this.orderBys;
      //调用后端查询接口
      this.getList();
    },

    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        provinceName: undefined,
        zoningCode: undefined,
        abbreviation: undefined,
        provinceCapital: undefined,
        sort: 1,
        status: 1
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 排序重置按钮操作 */
    resetOrder () {
      this.orderBys = [];
      this.queryParams.orderBy = [];
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.pkProvinceId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加省份";
    },


    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const provinceIds = row.pkProvinceId || this.ids
      getProvince(provinceIds).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改省份";
      });
    },
    // 省份状态修改
    handleStatusChange (row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.provinceName + '"省份吗？').then(function () {
        return changeProvinceStatus(row.pkProvinceId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkProvinceId != undefined) {
            updateProvince(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProvince(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作，多选删除和单个删除 */
    handleDelete (row) {
      const provinceIds = row.pkProvinceId || this.ids;
      this.$modal.confirm('是否确认删除省份编号为"' + provinceIds + '"的数据项？').then(function () {
        return delProvince(provinceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 查看下级按钮操作 */
    handleChildren (row) {
      const provinceId = row.pkProvinceId
      this.$router.push({
        path: '/dictionary/xzqh/city',
        query: {
          pId: provinceId
        }
      })
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = "省份导入";
      this.upload.open = true;
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('dictionary/xzqh/province/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    },
    /** 同步按钮操作 同步后台数据库中使用python从统计局爬取到的数据*/
    syncData () {
      syncProvinceData().then(response => {
      }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.dictionary-xzqh-table {
  width: 100% !important;
  height: 650px !important;
  border: true !important;
  // font-size: 30px
  // padding:5px
}
</style>>