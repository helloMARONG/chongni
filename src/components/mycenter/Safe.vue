<template>
  <div class="safe">
    <app-header title="安全中心"></app-header>
    <mu-list>
      <mu-divider></mu-divider>
      <mu-list-item avatar button to="/ResetPassWord">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#8697f4;">&#xe671;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;登录密码<span></span></mu-list-item-title>
        <mu-list-item-action class="center">修改登录密码</mu-list-item-action>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item avatar button to="/DealPassword">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#8b3001;">&#xe671;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;交易密码<span></span></mu-list-item-title>
        <mu-list-item-action class="center">设置交易密码</mu-list-item-action>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item avatar button to="/Card">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#32587d;">&#xe684;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;实名认证<span></span></mu-list-item-title>
        <mu-list-item-action class="center" v-if="info.status==0">未认证</mu-list-item-action>
        <mu-list-item-action class="center" v-if="info.status==1">待审核</mu-list-item-action>
        <mu-list-item-action class="center" v-if="info.status==2">已认证</mu-list-item-action>
        <mu-list-item-action class="center" v-if="info.status==3">驳回</mu-list-item-action>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
export default {
  name: 'Safe',
  data () {
    return {
      info:{}
    }
  },
  mounted() {
    // this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http.post("/api/member/member_info").then(response => {
        const res = response.data;
        this.info = res.data;
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mu-list{ padding: 0; background: #fff;}
.mu-list li{ border-bottom: solid 1px #F3F3F3;}
.mu-item-title{ font-size: 14px; color: #555;}
.mu-item-title span{ float: right; color: #A8A9A9;}
.mu-item-action{ min-width: auto;}
.mu-item .center{ width: 180px;}
</style>
