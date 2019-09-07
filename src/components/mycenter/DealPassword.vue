<template>
  <div class="dealPassword">
    <app-header title="设置交易密码"></app-header>
    <mu-form ref="form" :model="validateForm" class="form-content">
      <mu-form-item label="输入交易密码" prop="newPassWord" :rules="newPassWordRules">
        <mu-text-field type="password" v-model="validateForm.newPassWord" prop="newPassWord"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="确认交易密码" prop="newPassWord2" :rules="newPassWord2Rules">
        <mu-text-field type="password" v-model="validateForm.newPassWord2" prop="newPassWord2"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="输入验证码" prop="smscode" :rules="smscodeRules">
        <sms-code v-model="validateForm.smscode" :phone="validateForm.username" @getCode="getCode" prop="smscode"></sms-code>
      </mu-form-item>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit">确定</mu-button>
      </mu-form-item>
    </mu-form>
    <div class="form-tip">
      <div class="title">温馨提示：</div>
      <p>1.请不要设置之前用过的旧密码，否则密码修改不成功。</p>
      <p>2.请不要频繁修改密码，每日最多可修改3次。</p>
    </div>
  </div>
</template>

<script>
import smsCode from "@/components/bin/smsCode";
export default {
  name: "DealPassword",
  components: {
    smsCode
  },
  data() {
    return {
      newPassWordRules: [
        { validate: val => !!val, message: "请输入交易密码" },
        { validate: val => val.length >= 6 && val.length <= 20, message: "密码长度大于等于6小于20"}
      ],
      newPassWord2Rules: [
        { validate: val => !!val, message: "请确认交易密码" },
        { validate: val => (val == this.validateForm.newPassWord), message: "2次密码不一致"}
      ],
      smscodeRules: [{ validate: val => !!val, message: "请输入验证码" }],
      validateForm: {
        newPassWord: "",
        newPassWord2: "",
        smscode: ""
      }
    };
  },
  methods: {
    // 手机验证码
    getCode() {
      const formData = {
        phone: localStorage.getItem("username"),
        forget: true
      }
      console.log(formData)
      this.$http.post("/api/index/sendSms", formData).then(response => {
        const res = response.data;
        this.$toast.message(res.msg);
      })
    },
    submit() {
      this.$refs.form.validate().then(result => {
        if (result) {
          const formData = {
            PayToken: this.validateForm.newPassWord,
            rePayToken: this.validateForm.newPassWord2,
            sms_code: this.validateForm.smscode,
          };
          this.$http.post('/api/member/reset_PayPassword', formData)
          .then((response) => {
            // console.log(response.data);
            const res = response.data;
            this.$toast.message(res.msg);
            if(res.status === 0) {
              this.$router.back();
            }
          })
        }
      });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dealPassword{ background: #F2F3F9; height: 100%; width: 100%; position: absolute;}
</style>
