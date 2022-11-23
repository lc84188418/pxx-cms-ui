<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--左边会话列表框-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <li @node-click="handleNodeClick">
            系统通知
          </li>
        </div>
      </el-col>
      <!--右边消息框-->
      <el-col :span="20" :xs="24" >
        <div class="infinite-list-wrapper" style="overflow:auto" @scroll="handleScroll" ref="list">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
          <!-- <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="item in listData" class="list-item">{{ item.noticeContent }}</li>
          </ul> -->
          <div v-for="(item,index) in arrayItem" :key="index">
                <div>{{item}}</div>
              </div>
        </div>

        <!-- <div class="daily-list" ref="list" @scroll="handleScroll">
          <template >
              <div v-for="(item,index) in arrayItem" :key="index">
                <div>{{item}}</div>
              </div>
          </template>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userGetNoticeList} from "@/api/system/notice";

export default {
  name: "ImMsgSystem",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  data () {
    return {
      arrayItem: 100,
      isLoading: false,
      count: 10,
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 列表数据
      listData: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: undefined,
        pageSize: 50,
        previousId:undefined,
        nextId:undefined,
      },
    };
  },
  mounted() {
         // 获取dom
         const $list = this.$refs.list;
         // 监听内容的滚动事件
            $list.addEventListener('scroll', () => {
                if (this.isLoading) return;
                // 已经滚动的距离加页面的高度，等于整个内容区域高度时，视为接触底部
                console.log('已经滚动距离',$list.scrollTop);
                console.log('页面的高度',document.body.clientHeight);
                console.log('内容区域高度',$list.scrollHeight);
                if($list.scrollTop+ document.body.clientHeight>= $list.scrollHeight){
                   console.log('到底了');
                   this.isLoading = true;
                   setTimeout(()=>{
                       this.arrayItem = 500;
                       this.isLoading = false;
                   },2000)
                }
            });
  },
  
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    this.getList();
  },
  computed: {
      noMore () {
        return this.count >= 20
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
  methods: {
    load () {
        this.loading = true
        setTimeout(() => {
          this.count += 2
          this.loading = false
        }, 2000)
      },
    /** 查询用户列表 */
    getList () {
      this.loading = true;
      userGetNoticeList(this.queryParams).then(response => {
        this.listData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }
      );
    },
    // 左侧部分数据节点单击筛选事件
    handleNodeClick (data) {
    },
    handleScroll(){
      console.log('触发了吗');
    const $list = this.$refs.list;
    if(this.isLoading) return;
    if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight){
        console.log('到底了');
        this.isLoading = true;
        setTimeout(()=>{
            this.arrayItem += 10;
            this.isLoading = false;
        },2000)
      }
    }

  }
};
</script>
<style lang="scss" scoped>
  .infinite-list-wrapper{
    width: 100%;
    height: 100%;
    // overflow: auto;
    background: yellow;
  }
  .list{
    width: 100%;
    height: 750px;
    background: red;
  }




</style>

