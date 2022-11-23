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
      <el-form-item label="主题" prop="topic">
        <el-input
          v-model="queryParams.topic"
          placeholder="请输入主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      :data="listData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      height="650"
      :border="true"
      :cell-style="{padding:'0px'}"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        label="主键"
        align="center"
        key="pkConsumerId"
        prop="pkConsumerId"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="主题" align="center" key="topic" prop="topic" />
      <!-- <el-table-column label="flag" align="center" key="flag" prop="flag" width="50"/> -->
      <!-- <el-table-column label="properties" align="center" key="properties" prop="properties"/> -->
      <!-- <el-table-column label="消息体" align="center" key="body" prop="body"/> -->
      <!-- <el-table-column label="队列id" align="center" key="queueId" prop="queueId" width="50"/> -->
      <!-- <el-table-column label="分区名" align="center" key="brokerName" prop="brokerName"/> -->
      <!-- <el-table-column label="出生地址" align="center" key="bornHost" prop="bornHost" width="180"/> -->
      <!-- <el-table-column label="存储地址" align="center" key="storeHost" prop="storeHost" width="180"/> -->
      <el-table-column
        label="事务id"
        align="center"
        key="transactionId"
        prop="transactionId"
        width="150"
      />
      <el-table-column label="消息id" align="center" key="msgId" prop="msgId" width="300" />
      <el-table-column label="存储大小" align="center" key="storeSize" prop="storeSize" />

      <el-table-column label="消费时间" align="center" prop="bornTimeStamp">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bornTimeStamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存储时间" align="center" prop="storeTimeStamp">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.storeTimeStamp) }}</span>
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

    <!-- 查看mq日志详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1250px" append-to-body>
      <el-descriptions class="margin-top" title :column="2" size="small" colon border="true">
        <el-descriptions-item label="主键ID">{{form.pkConsumerId}}</el-descriptions-item>
        <el-descriptions-item label="主题">{{form.topic}}</el-descriptions-item>
        <el-descriptions-item label="flag">{{form.flag}}</el-descriptions-item>
        <el-descriptions-item label="事务ID">{{form.transactionId}}</el-descriptions-item>
        <el-descriptions-item label="消息id">{{form.msgId}}</el-descriptions-item>
        <el-descriptions-item label="队列ID">{{form.queueId}}</el-descriptions-item>
        <el-descriptions-item label="存储大小">{{form.storeSize}}</el-descriptions-item>
        <el-descriptions-item label="queueOffset">{{form.queueOffset}}</el-descriptions-item>
        <el-descriptions-item label="sysFlag">{{form.sysFlag}}</el-descriptions-item>
        <el-descriptions-item label="消费时间">{{parseTime(form.bornTimeStamp)}}</el-descriptions-item>
        <el-descriptions-item label="出生地址">{{form.bornHost}}</el-descriptions-item>
        <el-descriptions-item label="存储时间">{{parseTime(form.storeTimeStamp)}}</el-descriptions-item>
        <el-descriptions-item label="存储地址">{{form.storeHost}}</el-descriptions-item>
        <el-descriptions-item label="分区名">{{form.brokerName}}</el-descriptions-item>
        <el-descriptions-item label="commitLogOffset">{{form.commitLogOffset}}</el-descriptions-item>
        <el-descriptions-item label="bodyCrc">{{form.bodyCrc}}</el-descriptions-item>
        <el-descriptions-item label="reconsumeTimes">{{form.reconsumeTimes}}</el-descriptions-item>
        <el-descriptions-item label="preparedTransactionOffset">{{form.preparedTransactionOffset}}</el-descriptions-item>
        <el-descriptions-item label="properties">{{form.properties}}</el-descriptions-item>
        <el-descriptions-item label="消息体">{{form.body}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { listMqConsumer, getMqConsumer, delMqConsumer } from "@/api/system/log/mq";
export default {
  name: "ConsumerMq",
  dicts: ['sys_oper_type', 'request_method'],
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
      // 列表数据
      listData: [],
      // 弹出层标题
      title: "",
      // 是否显示编辑的弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: undefined,
        pageSize: 20,
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
      listMqConsumer(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.listData = response.data.list;
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
      const pkConsumerId = row.pkConsumerId
      getMqConsumer(pkConsumerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "MQ日志：消费日志详情";
      });
    },

    /** 删除按钮操作，多选删除和单个删除 */
    handleDelete (row) {
      const consumerIds = row.pkConsumerId || this.ids;
      this.$modal.confirm('是否确认删除日志编号为"' + consumerIds + '"的数据项？').then(function () {
        return delMqConsumer(consumerIds);
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