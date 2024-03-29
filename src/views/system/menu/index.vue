<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否外链" prop="isFrame">
        <el-select v-model="queryParams.isFrame" clearable size="small">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="meta in dict.type.sys_normal_disable"
            :label="meta.label"
            :value="meta.value"
            :key="meta.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="menuType">
        <el-select v-model="queryParams.menuType" placeholder="菜单类型" clearable size="small">
          <el-option
            v-for="meta in dict.type.sys_menu_type"
            :label="meta.label"
            :value="meta.value"
            :key="meta.value"
          />
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
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="pkMenuId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="menuType" label="菜单类型" width="80"></el-table-column>
      <el-table-column prop="isFrame" label="是否外链" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isFrame"
            :active-value="1"
            :inactive-value="0"
            @change="handleIsFrameChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="60">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录(M)</el-radio>
                <el-radio label="C">菜单(C)</el-radio>
                <el-radio label="F">按钮(F)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，处理后上级菜单的path会添加到该项值前。如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C' && form.isFrame != 1">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>权限标识
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content="访问路由的默认传递参数，如：`{'id': 1, 'name': 'ry'}`" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio :label="1">缓存</el-radio>
                <el-radio :label="0">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>显示状态
              </span>

              <!-- <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.label"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>-->
              <el-radio-group v-model="form.visible">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>菜单状态
              </span>

              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.label"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  dicts: ['sys_show_hide', 'sys_normal_disable', 'sys_menu_type', 'sys_yes_no'],
  components: { Treeselect, IconSelect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 全部菜单表格树数据
      menuAllList: [],
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined,
        status: undefined,
        menuType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        perms: [
          { required: true, message: "权限标识不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 选择图标
    selected (name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList () {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        // console.log(JSON.stringify(this.queryParams));
        //如果是首次进入，将得到的所有菜单数据放置到menuAllList中
        if (JSON.stringify(this.queryParams) == '{}') {
          this.menuAllList = this.handleTree(response.data, "pkMenuId");
        }
        this.menuList = this.handleTree(response.data, "pkMenuId");
        // console.log(this.menuList);
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.pkMenuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect () {
      if (this.menuList.length > 0) {
        this.menuOptions = [];
        const menu = { pkMenuId: 0, menuName: '主类目', children: [] };
        menu.children = this.menuAllList;
        this.menuOptions.push(menu);
      } else {
        listMenu().then(response => {
          this.menuOptions = [];
          const menu = { pkMenuId: 0, menuName: '主类目', children: [] };
          menu.children = this.handleTree(response.data, "pkMenuId");
          this.menuOptions.push(menu);
        });
      }
    },
    //是否外链修改
    handleIsFrameChange (row) {
      let text = row.isFrame === 1 ? "设置外链" : "取消外链";
      this.$modal.confirm('确认要"' + text + '""' + row.menuName + '"菜单吗？').then(function () {
        let data = {
          pkMenuId: row.pkMenuId,
          isFrame: row.isFrame,
        }
        return updateMenu(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.isFrame = row.isFrame === 1 ? 0 : 1;
      });
    },
    // 启用状态修改
    handleStatusChange (row) {
      let text = row.status === 1 ? "启用" : "停用";
      if (row.parentId === 0) {
        text = text + "顶级目录"
      }
      this.$modal.confirm('确认要"' + text + '""' + row.menuName + '"菜单吗？').then(function () {
        let data = {
          pkMenuId: row.pkMenuId,
          status: row.status,
        }
        return updateMenu(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
        //由于可能改了父级菜单，因此需刷新下列表
        this.getList();
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        pkMenuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "C",
        isFrame: 0,
        isCache: 0,
        visible: 1,
        status: 1,
        sort: 1
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.pkMenuId) {
        this.form.parentId = row.pkMenuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll () {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.pkMenuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkMenuId != undefined) {
            //修改菜单时，某些值需要重新设置一下
            if (this.form.menuType === 'M') {
              this.form.perms = '';
              this.form.component = '';
              this.form.isCache = 0;
            } else if (this.form.menuType === 'F') {
              this.form.path = '';
            }
            if (this.form.isFrame === 1) {
              this.form.component = '';
              this.form.isCache = 0;
            }
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项？').then(function () {
        return delMenu(row.pkMenuId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    }
  }
};
</script>
