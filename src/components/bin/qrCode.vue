<template>
  <div class="qr-code">
    <app-header title="扫码"></app-header>
    <div style="background: black; position: fixed; top: 65px; left: 0; right: 0; bottom: 0;">
      <div id="bcid"></div>
      <div class="flash">
        <mu-button class="flash-btn" color="primary" @click="openFlash()">{{flashName}}</mu-button>
      </div>
    </div>
  </div>
</template>

<script>
let scan = null;
export default {
  data() {
    return {
      open: false,
      flashName: "开启手电筒"
    };
  },
  mounted() {
    setTimeout(() => {
      this.startRecognize();
    }, 500);
  },
  methods: {
    //创建扫描控件
    startRecognize() {
      let _this = this;
      if (!window.plus) return;
      scan = new plus.barcode.Barcode(
        "bcid",
        [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13],
        { frameColor: "#00FF00", scanbarColor: "#00FF00" }
      );
      scan.onmarked = onmarked;
      //开始扫描
      scan.start();
      function onmarked(type, result, file) {
        let codes = result.split(":");
        let key = codes[0];
        let value = codes[1];
        switch (type) {
          case plus.barcode.QR:
            type = "QR";
            break;
          case plus.barcode.EAN13:
            type = "EAN13";
            break;
          case plus.barcode.EAN8:
            type = "EAN8";
            break;
          default:
            _this.$toast.message("未能识别二维码");
            scan.start();
            break;
        }
        result = result.replace(/\n/g, "");
        _this.$router.replace({path:"/PointTrade2",query:{codeUrl: result}});
      }
    },
    // 开启闪光灯
    openFlash() {
      if(!this.open) {
        scan.setFlash(true);
        this.open = true;
        this.flashName = "关闭手电筒";
      }else{
        scan.setFlash(false);
        this.open = false;
        this.flashName = "开启手电筒";
      }
    },
  },
  beforeDestroy() {
    if (scan) {
      scan.close();
    }
  },
};
</script>

<style lang="css">
.qr-code {
  background-color: #faf8f5;
}
#bcid {
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 65px; 
  bottom: 3rem;
  text-align: center;
  color: #fff;
  background: #000;
}
.flash{ position: absolute; bottom: 30px; left: 50%; margin-left: -44px;}
</style>

