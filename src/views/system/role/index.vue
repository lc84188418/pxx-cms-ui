<template>
  <div class="app-container">
    <!-- 搜索栏表单 -->
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据范围" prop="dataScope">
        <el-select
          v-model="queryParams.dataScope"
          placeholder="数据范围"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option label="全部" value="1" />
          <el-option label="自定义" value="2" />
          <el-option label="本部门" value="3" />
          <el-option label="本部门及以下" value="4" />
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
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表数据 -->
    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      height="650"
      :border="true"
      :cell-style="{padding:'5px'}"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column label="角色编号" align="center" key="pkRoleId" prop="pkRoleId" />
      <el-table-column
        label="角色名称"
        align="center"
        key="roleName"
        prop="roleName"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="权限字符" align="center" key="roleKey" prop="roleKey" />
      <el-table-column
        label="权限范围"
        align="center"
        key="dataScope"
        prop="dataScope"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="过期时间" align="center" prop="expireTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
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
      <!-- 操作栏 -->
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
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
          <!-- 3更多 -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
          >数据权限</el-button>
          <!-- 4分配用户 -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleAuthUser(scope.row)"
          >分配用户</el-button>
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

    <!-- 添加或修改角色基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="infoOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-input v-model="form.expireTime" placeholder="空 代表永不过期" />
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="authPermsOpen" width="500px" append-to-body>
      <el-form :model="authPermsForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="authPermsForm.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="authPermsForm.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="authPermsForm.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 全部时，即dataScope=1 展示所有菜单数据-->
        <el-form-item label="菜单权限" v-show="authPermsForm.dataScope == 1">
          <el-checkbox v-model="menuOptions" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >全选/全不选</el-checkbox>
          <div class="head-container">
            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              default-expand-all
              ref="menu"
              node-key="id"
              :check-strictly="!authPermsForm.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-form-item>
        <!-- 自定义时，即dataScope=2 展示下方已选菜单数据-->
        <!-- 本部门时，即dataScope=3 不展示-->
        <!-- 本部门及以下时，即dataScope=4 不展示-->
        <el-form-item label="菜单权限" v-show="authPermsForm.dataScope == 2">
          <el-checkbox v-model="menuOptions" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >全选/全不选</el-checkbox>
          <div>
            <treeselect
              :multiple="true"
              :options="options"
              placeholder="Select menu..."
              v-model="menuOptions"
            />
            <treeselect-value :value="value" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, changeRoleStatus, getRoleAuthPerms } from "@/api/system/role";
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "County",
  // register the component
  components: { Treeselect },
  data () {
    return {
      // define the default value
      value: null,
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
      // 角色列表数据
      roleList: [],
      // 菜单树选项
      menuOptions: undefined,
      // 弹出层标题
      title: "",
      // 角色基本信息弹出层
      infoOpen: false,
      // 角色授权用户弹出层
      authUserOpen: false,
      // 角色授权菜单弹出层
      authPermsOpen: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 15,
        roleName: undefined,
        roleKey: undefined,
        dataScope: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 授权菜单表单参数
      authPermsForm: {
        roleName: undefined,
        roleKey: undefined,
        dataScope: undefined
      },
      // 数据范围选项
      dataScopeOptions: [
        {
          value: 1,
          label: "全部数据权限"
        },
        {
          value: 2,
          label: "自定数据权限"
        },
        {
          value: 3,
          label: "本部门数据权限"
        },
        {
          value: 4,
          label: "本部门及以下数据权限"
        },
      ],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    //再请求数据
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList () {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.roleList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      }
      );
    },
    // 取消按钮
    cancel () {
      this.infoOpen = false;
      this.authUserOpen = false;
      this.authPermsOpen = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        roleName: undefined,
        roleKey: undefined,
        expireTime: undefined,
        sort: 1,
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
      this.ids = selection.map(item => item.pkRoleId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.infoOpen = true;
      this.title = "添加角色";
    },

    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const roleId = row.pkRoleId || this.ids
      getRole(roleId).then(response => {
        this.form = response.data;
        this.infoOpen = true;
        this.title = "修改角色";
      });
    },

    /** 分配菜单权限 回显 */
    handleDataScope (row) {
      this.reset();
      const roleId = row.pkRoleId
      const roleName = row.roleName
      const roleKey = row.roleKey
      const dataScope = row.dataScope
      getRoleAuthPerms(roleId).then(response => {
        const data = response.data;
        this.menuOptions = data.menus;
        this.authPermsForm.roleName = roleName;
        this.authPermsForm.roleKey = roleKey;
        this.authPermsForm.dataScope = dataScope;
        this.authPermsOpen = true;
        this.title = "分配菜单权限";
      });
    },
    // 菜单树权限（全选/全不选）
    handleCheckedTreeNodeAll (value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },

    // 角色状态修改
    handleStatusChange (row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(function () {
        return changeRoleStatus(row.pkRoleId, row.status);
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
          if (this.form.pkRoleId != undefined) {
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.infoOpen = false;
              this.getList();
            });
          } else {
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.infoOpen = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作，多选删除和单个删除 */
    handleDelete (row) {
      const roleIds = row.pkRoleId || this.ids;
      this.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function () {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 导出按钮操作 */
    handleExport () {
      this.download('system/role/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    },

  }
};
</script>