<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="100px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" maxlength="30" />
    </el-form-item> 
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" style="width:50%" :disabled = "inputPhone"/>
      <el-button type="info" style="width:50%" @click="changeBindingPhone(binDingPhone)">{{binDingPhone}}绑定</el-button>
    </el-form-item>
        <el-form-item label="手机验证码" v-if="!inputPhone">
      <div>
        <el-input v-model="user.phoneVerificationCode" style="width:100px"/>
        <el-button round @click="handleVerifyCode('phone')">获取验证码</el-button>
      </div>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <div>
        <el-input v-model="user.email" maxlength="50" style="width:50%" :disabled = "inputEmail"/>
        <el-button type="info" style="width:50%" @click="changeBindingEmail(binDingEmail)">{{binDingEmail}}绑定</el-button>
      </div>
    </el-form-item>
    <el-form-item label="邮箱验证码" v-if="!inputEmail">
      <div>
        <el-input v-model="user.emailVerificationCode" style="width:100px"/>
        <el-button round @click="handleVerifyCode('email')">获取验证码</el-button>
      </div>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio :label="0">男</el-radio>
        <el-radio :label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";
import { getVerifyCode } from "@/api/tool/gen";

export default {

  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      inputPhone: true,
      inputEmail: true,
      binDingPhone: '更改',
      binDingEmail: '更改',
    
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    console.log('666666666666666');
  },
  methods: {
    //提交按钮
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    //关闭按钮
    close() {
      this.$tab.closePage();
    },
    //获取验证码
    handleVerifyCode () {
      //验证邮箱
      const email = this.user.email;
      if(email === ''){
          return;
      }
      //调后台接口，发送验证码到该邮箱
      getVerifyCode(email).then(response => {
        this.$modal.msgSuccess(response.data.msg);
      }
      );
      
   },
    //更改手机绑定
    changeBindingPhone(binDingType) {
      if('更改' === binDingType){
        this.binDingPhone='取消'
        //将手机输入框置为可输入状态
        this.inputPhone = false;
      }else{
        this.binDingPhone='更改'
        //将手机输入框置为不可输入状态
        this.inputPhone = true;
      }
    },
    //更改邮箱绑定
    changeBindingEmail(binDingType) {
      if('更改' === binDingType){
        this.binDingEmail='取消'
        //将邮箱输入框置为可输入状态
        this.inputEmail = false;
      }else{
        this.binDingEmail='更改'
        //将邮箱输入框置为不可输入状态
        this.inputEmail = true;
      }
    }
  }
};
</script>
