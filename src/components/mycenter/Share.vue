<template>
  <div class="share">
    <app-header title="我的分享"></app-header>
    <div class="share1">
      <div>方式一：推广链接</div>
      <div class="url">
        <p>{{info.url}}</p>
        <span class="btn-copy"  primary v-clipboard:copy="info.url" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
      </div>
      <p>这是您的专属推荐链接，您可点击【复制】按钮，将本链接粘贴并发送给推荐代理。</p>
    </div>
    <div class="share2">
      <div class="title">方式二：推广二维码</div>
      <div class="QRcode">
        <span class="text">分享码:{{info.code}}</span>
        <div id="qr"></div>
        <span>扫一扫，免费下载注册</span>
      </div>
      <p>这是您的专属推荐二维码，您可截图或者保存图片送给推荐代理。</p>
    </div>
  </div>
</template>

<script>
import QRCode from '@/components/bin/qr';
export default {
  name: 'Share',
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
      this.$http.post("/api/member/invitation")
      .then(response => {
        console.log(response.data)
        this.info = response.data;
        let width = window.innerWidth / 2.2;
        let qr = new QRCode(document.getElementById("qr"), {
          width: width,
          height: width,
          colorDark: "#000000",
          colorLight: "rgba(255,255,255,1)"
        });
        qr.makeCode(this.info.url);
      })
    }, 
    //复制地址
    onCopy: function (e) {
      this.$toast.message("复制成功");
    },
    onError: function (e) {
      this.$toast.message("复制失败");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.share{ width: 100%; color: #585858;}
.share1{ width: 100%; color: #fff; padding: 12px 28px; background: rgb(9, 82, 142) url('/static/images/sharebg.png') center/100% 100% no-repeat;}
.share1 .url{ display: flex; justify-content: space-between; padding: 15px 10px; margin-top: 10px; background:rgba(255,255,255,0.2); border-radius: 4px; word-wrap: break-word; margin-bottom: 10px;}
.share1 .url p{ margin: 0; width: 75%;}
.share1 .url span{ margin-top: 6px; background-color: #D0AE52; height: 28px; line-height: 28px;; padding: 0 20px;  border-radius: 4px;}
.share2{ padding: 20px 28px;}
.QRcode{ width: 84%; margin: 20px 0 0 8%; padding: 10px 20px; text-align: center; background: #EDEDED; font-size: 15px; border-radius: 4px;}
.QRcode #qr{ padding: 4%; display: flex; justify-content: center;}
.QRcode .text{ color: #070812; font-size: 18px;}
.share2 p{ margin-top: 20px;}
</style>
