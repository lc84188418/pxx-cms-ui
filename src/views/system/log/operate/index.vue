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
      <el-form-item label="操作模块" prop="modules">
        <el-input
          v-model="queryParams.modules"
          placeholder="请输入模块"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作说明" prop="operateDesc">
        <el-input
          v-model="queryParams.operateDesc"
          placeholder="请输入操作说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员id" prop="userId" label-width="100px">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入操作人员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员姓名" prop="userName" label-width="100px">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入操作人员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主机地址" prop="ip" label-width="100px">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入主机地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作地点" prop="location" label-width="100px">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入操作地点"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作版本号" prop="version" label-width="100px">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="业务类型"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in dict.type.sys_oper_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option label="成功" value="1" />
          <el-option label="失败" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求方式" prop="requestMethod">
        <el-select
          v-model="queryParams.requestMethod"
          placeholder="请求方式"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in dict.type.request_method"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类别" prop="operateType">
        <el-select
          v-model="queryParams.operateType"
          placeholder="操作类别"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option label="其它" value="0" />
          <el-option label="后台用户" value="1" />
          <el-option label="PC用户" value="2" />
          <el-option label="手机端用户" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表上方菜单栏 -->
    <el-row :gutter="10" class="mb8">
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
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表数据-->
    <el-table
      v-loading="loading"
      :data="logList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      height="650"
      :border="true"
      :cell-style="{padding:'0px'}"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        label="模块"
        align="center"
        key="modules"
        prop="modules"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="业务类型"
        align="center"
        key="businessType"
        prop="businessType"
        width="80"
      />
      <el-table-column
        label="操作类别"
        align="center"
        key="operateType"
        prop="operateType"
        width="90"
      />
      <el-table-column label="操作人员id" align="center" key="userId" prop="userId"/>
      <el-table-column label="操作人员姓名" align="center" key="userName" prop="userName"/>
      <el-table-column label="请求URL" align="center" key="url" prop="url"/>
      <el-table-column label="主机地址" align="center" key="ip" prop="ip" width="150"/>
      <el-table-column label="操作地点" align="center" key="location" prop="location"/>
      <el-table-column label="操作版本号" align="center" key="version" prop="version"/>

      <el-table-column label="操作时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="65">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作栏  fixed="right"-->
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 1详情 -->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)">详情</el-button>
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
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看日志详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form">
        <el-form-item label="日志id:" prop="pkOperateId">
          <span >{{form.pkOperateId}}</span>
        </el-form-item>
        <el-form-item label="模块:" prop="modules">
          <span >{{form.modules}}</span>
        </el-form-item>
        <el-form-item label="业务类型:" prop="businessType">
          <span >{{form.businessType}}</span>
        </el-form-item>
        <el-form-item label="操作说明:" prop="operateDesc">
          <span >{{form.operateDesc}}</span>
        </el-form-item>
        <el-form-item label="方法名称:" prop="method">
          <span >{{form.method}}</span>
        </el-form-item>
        <el-form-item label="请求方式:" prop="requestMethod">
          <span >{{form.requestMethod}}</span>
        </el-form-item>
        <el-form-item label="操作类别:" prop="operateType">
          <span >{{form.operateType}}</span>
        </el-form-item>
        <el-form-item label="操作人员id:" prop="userId">
          <span >{{form.userId}}</span>
        </el-form-item>
        <el-form-item label="操作人员姓名:" prop="userName">
          <span >{{form.userName}}</span>
        </el-form-item>
        <el-form-item label="部门名称:" prop="deptName">
          <span >{{form.deptName}}</span>
        </el-form-item>
        <el-form-item label="请求URL:" prop="url">
          <span >{{form.url}}</span>
        </el-form-item>
        <el-form-item label="主机地址:" prop="ip">
          <span >{{form.ip}}</span>
        </el-form-item>
        <el-form-item label="操作地点:" prop="location">
          <span >{{form.location}}</span>
        </el-form-item>
        <el-form-item label="请求参数:" prop="requestParam">
          <span >{{form.requestParam}}</span>
        </el-form-item>
        <el-form-item label="返回参数:" prop="jsonResult">
          <span >{{form.jsonResult}}</span>
        </el-form-item>
        <el-form-item label="操作状态:" prop="status">
          <span >{{form.status}}</span>
        </el-form-item>
        <el-form-item label="操作时间:" prop="createTime">
          <span >{{form.createTime}}</span>
        </el-form-item>
        <el-form-item label="操作版本号:" prop="version">
          <span >{{form.version}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOperate, getOperate, delOperate} from "@/api/system/log/operate";
export default {
  name: "Operate",
  dicts: ['sys_oper_type','request_method'],
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
      // 日志数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示编辑的弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        modules: undefined,
        businessType: undefined,
        operateDesc: undefined,
        requestMethod: undefined,
        operateType: undefined,
        userId: undefined,
        userName: undefined,
        ip: undefined,
        location: undefined,
        status: undefined,
        version: undefined,
        dateParam: undefined,
      },
      // 表单参数
      form: {},
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询日志列表 */
    getList () {
      this.loading = true;
      listOperate(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.logList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }
      );
    },

    // 取消按钮
    cancel () {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.pkOperateId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    /** 查看详情操作 */
    handleDetail (row) {
      const pkOperateId = row.pkOperateId
      getOperate(pkOperateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "操作日志详情";
      });
    },

    /** 删除按钮操作，多选删除和单个删除 */
    handleDelete (row) {
      const operateIds = row.pkOperateId || this.ids;
      this.$modal.confirm('是否确认删除日志编号为"' + operateIds + '"的数据项？').then(function () {
        return delOperate(operateIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 导出按钮操作 */
    handleExport () {
      this.download('dictionary/operate/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>