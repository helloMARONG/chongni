<template>
  <div class="recharge">
    <app-header title="钱包地址"></app-header>
    <div class="white">
      <div class="title">XC</div>
      <div class="imtoken">
        <p>注意：该地址只接受XC资产，如充值其他币种，将无法找回。</p>
        <div class="QRcode">
          <div id="qr">
            <div class="qr-title">XC钱包地址</div>
          </div>
        </div>
        <div class="text">钱包地址<br>{{info.address}}</div>
        <mu-button class="common-btn" v-clipboard:copy="info.address" v-clipboard:success="onCopy" v-clipboard:error="onError">复制钱包地址</mu-button>
        <!-- <div class="tip">请务必填写并仔细核对</div> -->
        <!-- <mu-button class="common-btn" @click="saveImg">保存图片到相册</mu-button> -->
      </div>
    </div>
    <div class="prompt">
      <p class="title">温馨提示：</p>
      <p><span>1.请勿向上述地址充值非XC资产，否则将不可找回。</span><br>2.使用XC地址充值需要2个网络确认才能到账。</p>
    </div>
  </div>   
</template>

<script>
import QRCode from "../bin/qr";
export default {
  name: "Recharge",
  data() {
    return {
      info: {},
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http.post("/info/address").then(response => {
        console.log(response.data.data)
        this.info = response.data.data;
        let width = 144;
        let qr = new QRCode(document.getElementById("qr"), {
          width: width,
          height: width,
          colorDark: "#000000",
          colorLight: "rgba(255,255,255,1)"
        });
        qr.makeCode(this.info.address);
      })
    }, 
    //复制地址
    onCopy: function(e) {
      this.$toast.message("复制成功");
    },
    onError: function(e) {
      this.$toast.message("复制失败");
    },
    // saveImg() {
    //   let img = document.getElementsByTagName('img')[0];
    //   console.log(img.src);
    //   plus.gallery.save(img.src, this.successCB, this.errorCB);
    // },
    // successCB() {
    //   this.$toast.message("保存成功");
    // },
    // errorCB() {
    //   this.$toast.message("保存失败");
    // },
  }
};
</script>
<style scoped>
.QRcode{ margin-top: 20px; background: #fff; padding: 0 8px; display: flex; justify-content: center; }
.QRcode #qr{box-shadow:0px 1px 5px 0px rgba(28, 7, 20, 0.35); padding: 8px;}

.white{  background-color: #FFFFFF;}
.recharge{ position: absolute; top: 0; left: 0; height: 100%; width: 100%; background-color: #F2F3F9; }
.recharge div.title{ text-align: center; font-size: 15px; padding: 12px 0; border-bottom: solid 1px #F1F1F1; background: #F2F3F9;}
.recharge .mu-list{ padding: 0;}
.recharge .mu-list img{ width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; border: solid 1px #F1F1F1; padding: 4px;}
.recharge .mu-list .mu-item-action  { min-width: auto;}
.recharge .mu-list .mu-item{ border-bottom: solid 1px #F1F1F1;}
.imtoken{ text-align: center; padding: 10px 10% 20px 10%;}
.imtoken>p{ color: #7A7A7A; text-align: left;}
.imtoken>div{ margin-top: 10px;}
.imtoken .text{ margin-top: 20px; word-break: break-word; font-size: 12px;}
.common-btn{ width: 100%; margin-top: 20px;}
.imtoken .tip{ color: #ED2B36; font-size: 12px;}
.recharge .prompt{ padding: 30px 10% 0 10%; font-size: 12px; color: #868686;}
.recharge .prompt .title{ color: #2A2D2D; font-size: 15px;}
.recharge .prompt p{ margin: 0; line-height: 24px;}
.recharge .prompt p span{ color: #ED2B36; }
.qr-title{ font-size: 14px; font-weight: bold; padding-bottom: 5px;}
</style> 
