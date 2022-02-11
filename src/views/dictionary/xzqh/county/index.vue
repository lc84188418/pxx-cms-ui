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
      <!-- 用query获取值 -->
      <p>提示：{{this.$route.query.fkStreetId}}</p>
      <p>提示2：{{parentId}}</p>
      <el-form-item label="所属街道" prop="parentId">
        <el-input
          v-model="queryParams.fkStreetId"
          value="this.$route.query.fkStreetId"
          placeholder="请输入街道编码"
          clearable
          size="small"
          :disabled="!isParentLink"
        />
      </el-form-item>
      <el-form-item label="乡镇名称" prop="countyName">
        <el-input
          v-model="queryParams.countyName"
          placeholder="请输入乡镇名称"
          clearable
          size="small"
          style="width: 250px"
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
      <el-form-item label="邮编" prop="youbian">
        <el-input
          v-model="queryParams.youbian"
          placeholder="请输入邮编"
          clearable
          size="small"
          style="width: 120px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="乡镇状态"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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

    <!-- 列表数据 -->
    <el-table v-loading="loading" :data="countyList" @selection-change="handleSelectionChange" style="width: 100%" height="650" :border="true" :cell-style="{padding:'5px'}">
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        label="乡镇编号"
        align="center"
        key="pkCountyId"
        prop="pkCountyId"
        v-if="columns[0].visible"
      />
      <el-table-column
        label="乡镇名称"
        align="center"
        key="countyName"
        prop="countyName"
        width="250"
        v-if="columns[1].visible"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="区划代码"
        align="center"
        key="zoningCode"
        prop="zoningCode"
        v-if="columns[2].visible"
      />
      <el-table-column
        label="所属街道"
        align="center"
        key="fkStreetId"
        prop="fkStreetId"
        v-if="columns[3].visible"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="邮编"
        align="center"
        key="youbian"
        prop="youbian"
        v-if="columns[4].visible"
      />
      <el-table-column label="排序" align="center" key="sort" prop="sort" v-if="columns[5].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" v-if="columns[7].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" v-if="columns[8].visible" width="65">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作栏 -->
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页操作 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改乡镇对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属街道" prop="fkStreetId">
          <el-select v-model="form.fkStreetId" filterable placeholder="请选择">
            <el-option
              v-for="item in streetList"
              :key="item.pkStreetId"
              :label="item.streetName"
              :value="item.pkStreetId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乡镇名称" prop="countyName">
          <el-input v-model="form.countyName" placeholder="请输入乡镇名称" />
        </el-form-item>
        <el-form-item label="区划代码" prop="zoningCode">
          <el-input v-model="form.zoningCode" placeholder="请输入区划代码" />
        </el-form-item>
        <el-form-item label="邮编" prop="youbian">
          <el-input v-model="form.youbian" placeholder="请输入邮编" />
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
import { listCounty, getCounty, delCounty, addCounty, updateCounty, changeCountyStatus } from "@/api/dictionary/xzqh/county";
import { apiStreets } from "@/api/dictionary/xzqh/street";

export default {
  name: "County",
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
      //父级ID
      parentId: undefined,
      //是否是从上级跳转过来的,默认否
      isParentLink: false,
      // 街道表格数据
      streetList: [],
      // 乡镇列表数据
      countyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        zoningCode: undefined,
        countyName: undefined,
        status: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `乡镇编号`, visible: true },
        { key: 1, label: `乡镇名称`, visible: true },
        { key: 2, label: `区划代码`, visible: true },
        { key: 3, label: `所属街道`, visible: true },
        { key: 4, label: `邮编`, visible: true },
        { key: 5, label: `排序`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
        { key: 7, label: `更新时间`, visible: true },
        { key: 8, label: `状态`, visible: true },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        countyName: [
          { required: true, message: "乡镇名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
    // this.parentId = this.$router.query.fkStreetId
    // console.log(this.parentId);
  },
  // components: {
  //   parentId: this.$router.query.fkStreetId
  // },
  // computed: {
  //   parentId: this.$router.query.fkStreetId
  // },
  methods: {
    /** 查询乡镇列表 */
    getList () {
      this.loading = true;
      listCounty(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.countyList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      }
      );
    },
    /** 查询街道列表 */
    getStreetList () {
      apiStreets(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.streetList = response.data;
      }
      );
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        countyName: undefined,
        zoningCode: undefined,
        youbian: undefined,
        sort: 0,
        status: 1
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.pkCountyId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加街道";
      //获取到所有街道的数据
      this.getStreetList();
    },


    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const countyId = row.pkCountyId || this.ids
      getCounty(countyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改乡镇";
      });
    },
    // 乡镇状态修改
    handleStatusChange (row) {
      let text = row.status === 0 ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.countyName + '"乡镇吗？').then(function () {
        return changeCountyStatus(row.pkCountyId, row.status);
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
          if (this.form.pkCountyId != undefined) {
            updateCounty(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCounty(this.form).then(response => {
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
      const countyIds = row.pkCountyId || this.ids;
      this.$modal.confirm('是否确认删除乡镇编号为"' + countyIds + '"的数据项？').then(function () {
        return delCounty(countyIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = "乡镇导入";
      this.upload.open = true;
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('dictionary/county/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    },
    /** 同步按钮操作 同步后台数据库中使用python从统计局爬取到的数据*/
    syncData () {
      syncCountyData(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
      }
      );
    }
  }
};
</script>