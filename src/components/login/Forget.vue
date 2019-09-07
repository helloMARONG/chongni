<template>
  <div class="register">
    <app-header title="忘记密码"></app-header>
    <div class="logo"><img src="static/images/logo.png" alt=""></div>
    <mu-form ref="form" :model="validateForm" class="login-content">
      <mu-form-item label="输入手机号" prop="username" :rules="usernameRules">
        <mu-text-field type="tel" v-model="validateForm.username" prop="username"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="输入验证码" prop="smscode" :rules="smscodeRules">
        <sms-code v-model="validateForm.smscode" :phone="validateForm.username" @getCode="getCode" prop="smscode"></sms-code>
      </mu-form-item>
      <mu-form-item label="输入新密码" prop="password" :rules="passwordRules">
        <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
      </mu-form-item>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit">确定</mu-button>
      </mu-form-item>
    </mu-form>
    <div class="login-bottom">
      已注册? <router-link to="/Login">登陆</router-link>
    </div>
  </div>
</template>

<script>
import smsCode from "@/components/bin/smsCode";
export default {
  name: 'Login',
  components: {
    smsCode
  },
  data () {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '请输入手机号'},
        { validate: val => (/^[1][3-9][0-9]{9}$/.test(val)), message: "请输入正确的手机号" }
      ],
      passwordRules: [
        { validate: val => (/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/.test(val)), message: "密码为6-20位字母数字组合"}
      ],
      smscodeRules: [
        { validate: (val) => !!val, message: '请输入验证码'},
      ],
      validateForm: {
        username: '',
        password: '',
        smscode: '',
      }
    }
  },
  methods: {
    // 手机验证码
    getCode() {
      const formData = {
        mobile: this.validateForm.username
      }
      if(!(/^[1][3-9][0-9]{9}$/.test(this.validateForm.username))){
        this.$toast.message("请输入正确的手机号！");
      }else{
        this.$http.post("/api/index/sendSms", formData).then(response => {
          const res = response.data;
          this.$toast.message(res.msg);
        })
      }
    },
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result) {
          const formData = {
            mobile: this.validateForm.username,
            password: this.validateForm.password,
            sms_code: this.validateForm.smscode,
          }
          this.$http.post("/api/index/forget", formData).then(response => {
            console.log(response.data);
            const res = response.data;
            this.$toast.message(res.msg);
            if (res.status === 0) {
              this.$router.push('/Login');
            }
          })
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{ margin-top: 20px;}
</style>
