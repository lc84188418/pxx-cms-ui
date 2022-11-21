<template>
<el-form ref="form" :model="form" label-width="80px" >
  <div v-for="(item) in templateList" :key="item.id">
  <el-form-item :label="'标题'+item.sort" v-if="item.title">
    <el-input v-model="item.title"></el-input>
  </el-form-item>
  <el-form-item :label="'子标题'+item.sort" v-if="item.secondTitle">
    <el-input v-model="item.secondTitle"></el-input>
  </el-form-item>
  <el-form-item label="内容" v-if="item.content">
    <el-input type="textarea" v-model="item.content"></el-input>
  </el-form-item>
  <el-form-item label="富文本内容" v-if="item.contentJs">
    <el-input type="textarea" v-model="item.contentJs"></el-input>
  </el-form-item>
  <el-form-item label="封面" v-if="item.img">
    <el-image :src="item.img"></el-image>
  </el-form-item>
  <el-form-item label="alt" v-if="item.imgAlt">
    <el-input v-model="item.imgAlt"></el-input>
  </el-form-item>
  <el-form-item label="视频" v-if="item.videoUrl">
    <el-avatar shape="square" :size="100" :fit="fill" :src="item.videoUrl"></el-avatar>
  </el-form-item>
  <el-divider content-position="left"></el-divider>
</div>
<el-form-item>
    <el-button type="primary" @click="onSubmit">保存</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import { listTemplate, updateTemplate} from "@/api/system/page";

export default {
  name: "PageTemplate",
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
      // 参数表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configKey: undefined,
        configValue: undefined,
        configDesc: undefined,
      },
      // 表单参数
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      // 表单校验
      rules: {
        configValue: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSubmit() {
        console.log('submit!');
      },
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listTemplate(this.$route.query.pageId).then(response => {
        this.templateList = response.data;
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
        configValue: undefined,
        configDesc: undefined,
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configKey = row.configKey || this.ids
      getParam(configKey).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改参数";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configKey != undefined) {
            updateParam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
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