<template>
  <div class="login">
    <app-header title="登陆"></app-header>
    <div class="logo"><img
        src="static/images/logo.png"
        alt=""
      ></div>
    <mu-form
      ref="form"
      :model="validateForm"
      class="login-content"
    >
      <mu-form-item
        label="输入手机号"
        prop="username"
      >
        <mu-text-field
          type="tel"
          v-model="validateForm.username"
          prop="username"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="输入密码">
        <mu-text-field
          type="password"
          v-model="validateForm.password"
        ></mu-text-field>
      </mu-form-item>
      <drag-verify
        :width="width"
        :height="height"
        text="请按住滑块，拖动到最右边"
        success-text="验证通过"
        background="#e8e8e8"
        text-size="14px"
        progress-bar-bg="#2196f3"
        completed-bg="#2196f3"
        handler-bg="#FFFFFF"
        handler-icon="fa fa-angle-double-right"
        success-icon="fa fa-check"
        ref="Verify"
      >
      </drag-verify>
      <mu-form-item>
        <mu-button
          class="common-btn"
          @click="submit"
        >登录</mu-button>
      </mu-form-item>
    </mu-form>
    <div class="login-bottom">
      新用户？<router-link to="/Register">注册</router-link><span>|</span>
      <router-link to="/Forget">忘记密码？</router-link>
    </div>
  </div>
</template>

<script>
import dragVerify from "vue-drag-verify";
import "font-awesome/css/font-awesome.css";
export default {
  name: "Login",
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "请输入手机号" },
        {
          validate: val => /^[1][3-9][0-9]{9}$/.test(val),
          message: "请输入正确的手机号"
        }
      ],
      // passwordRules: [
      //   { validate: val => (/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/.test(val)), message: "密码为6-20位字母数字组合"}
      // ],
      validateForm: {
        username: "",
        password: ""
      },
      width: 300,
      height: 42
    };
  },
  components: {
    dragVerify
  },
  mounted() {
    this.width = document.querySelector(".mu-form-item").clientWidth;
  },
  methods: {
    submit() {
      this.$refs.form.validate().then(result => {
        if (result) {
          if (this.$refs.Verify.isPassing) {
            const formData = {
              mobile: this.validateForm.username,
              password: this.validateForm.password
            };
            this.$http.post("/api/v1/user/login", formData).then(response => {
              console.log(response.data);
              const res = response.data;
              if (res.code === 200) {
                // 登录成功
                this.$http.defaults.headers.Authorization = res.data.token;
                console.log("登录时token" + `Token ${res.data.token}`);
                localStorage.setItem("accessToken", `Token ${res.data.token}`);
                this.$router.push("/MyCenter");
              } else {
                this.$toast.message(res.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
