<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">PXX后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号/手机号/邮箱"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <!-- 
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      -->

      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-if="loading">登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
      <!-- 第三方授权登录 -->
      <div class="just-auth">
        <span>其他登录方式</span>
        <el-row :data="justAuths">
          <el-button icon="el-icon-search" circle @click="handleAuthRender('gitee')">示例</el-button>
          <el-button
            circle
            @click="handleAuthRender(item.clientSign)"
            v-for="item,index in justAuths"
            :key="index"
          >{{item.clientSign}}</el-button>
          <svg-icon
            :icon-class="item.clientSign"
            @click="handleAuthRender(item.clientSign)"
            v-for="item,index in justAuths"
            :key="index"
          />
          <svg-icon icon-class="qq" @click="handleAuthRender(qq)" />
        </el-row>
      </div>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 liushuaiguo All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getJustAuth, authRender, } from "@/api/login";
// import { authRender } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import TIM from '@/utils/tim'

export default {
  name: "Login",
  data () {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号/手机号/邮箱" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        //code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: false,
      // 注册开关
      register: false,
      redirect: undefined,
      //登录结果
      loginResult: {},
      justAuths: []
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created () {
    this.getJustAuth();
    // this.getCode();
    this.getCookie();
  },
  methods: {
    /** 获取系统支持的第三方授权平台 */
    getJustAuth () {
      getJustAuth().then(res => {
        this.justAuths = res.data;
      });
    },
    /** 获取验证码 */
    getCode () {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
        }
      });
    },

    /** 访问第三方授权 */
    handleAuthRender (source) {
      console.log('访问第三方授权' + source);
      authRender(source).then(res => {
        // console.log(res);
        //window.open(res).then(result => {})
        var width = width || 900;
        var height = height || 540;
        var left = (window.screen.width - width) / 2;
        var top = (window.screen.height - height) / 2;
        var win = window.open(res, "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, left=" + left + ", top=" + top + ", width=" + width + ", height=" + height);
        // console.log(win.closed);

        //监听登录窗口是否关闭,登录成功后 后端返回关闭窗口的代码
        var listener = setInterval(function () {
          //监听窗口是否关闭
          if (win.closed) {
            //进入这个if代表后端验证成功!直接跳转路由
            //关闭监听
            clearInterval(listener);
            //跳转路由
            this.$router.push('/')
            // var path = this.$route.query.redirect;
            // this.$router.replace({
            //   path:
            //   path === "/" || path === undefined ? "/admin/dashboard" : path
            // });
            // this.$router.go(0) //刷新
          }
        }, 500)


      });

    },

    getCookie () {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },

    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          //请求登录方法
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(() => { });
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              // this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.just-auth {
  text-align: center;
}
</style>
