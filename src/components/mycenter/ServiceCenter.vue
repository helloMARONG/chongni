<template>
  <div class="safe">
    <app-header title="客服中心"></app-header>
    <mu-list>
      <mu-list-item avatar button :to="`/ServiceWechat/1`">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#6cb37a;">&#xe63d;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;微信客服<span></span></mu-list-item-title>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item avatar button :to="`/ServiceWechat/1`">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#1caafd;">&#xe60f;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;QQ客服<span></span></mu-list-item-title>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item avatar button :to="`/ServiceWechat/1`">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#6cb37a;">&#xe63d;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;微信公众号<span></span></mu-list-item-title>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>

      <mu-list-item avatar button to="/Question">
        <mu-list-item-action>
          <span class="icon iconfont" style="color:#6174FE;">&#xe7c0;</span>
        </mu-list-item-action>
        <mu-list-item-title>&nbsp;问题反馈<span></span></mu-list-item-title>
        <mu-list-item-action>
          <span class="icon iconfont">&#xe695;</span>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
export default {
  name: 'ServiceCenter',
  data () {
    return {
      services:'',
    }
  },
  created() {
    // this.getServices();
  },
  methods: {
    // 客服列表
    getServices() {
      this.$http.post("/api/allurl/kefu").then((response) => {
        this.services = response.data.kefu;
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
.safe .iconfont{ font-size: 22px;}
</style>
