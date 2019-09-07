<template>
  <div class="service-content">
    <app-header title="客服中心"></app-header>
    <div class="tip">这是CGS系统{{info.title}}，您可以截图保存至相册后用扫一扫添加，或者复制{{info.title}}号直接添加！ </div>
    <div class="imtoken">
      <p>官方{{info.title}}<br>{{info.number}}</p>
      <div class="QRcode" v-if="info.thumb">
        <img :src="baseUrl+info.thumb" alt="">
        <!-- <img src="static/images/test.png" alt=""> -->
      </div>
      <mu-button class="common-btn white" v-clipboard:copy="info.number" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</mu-button>
      <mu-button class="common-btn" @click="saveImg">保存图片至相册</mu-button>
    </div>
    <div class="prompt">
      <div>温馨提示：</div>
      <p>CGS官方{{info.title}}，您在使用的过程中遇到任何问题，请与系统客服联系。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceWechat",
  data() {
    return {
      info: {},
      baseUrl: this.$store.state.baseUrl,
    };
  },
  props:['id'],
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const formData = {
        id: this.id
      }
      this.$http.post("/api/allurl/kefu_img", formData).then(response => {
        // console.log(response.data)
        this.info = response.data.img;
      })
    }, 
    //复制地址
    onCopy: function(e) {
      this.$toast.message("复制成功");
    },
    onError: function(e) {
      this.$toast.message("复制失败");
    },
    // 保存图片至系统相册
    saveImg() {
      let path = this.baseUrl + this.info.thumb;
      plus.gallery.save(path, this.successCB, this.errorCB);
    },
    successCB() {
      this.$toast.message("保存成功");
    },
    errorCB() {
      this.$toast.message("保存失败");
    },
  }
};
</script>
<style scoped>
.service-content { background: #F2F3F9; height: 100%; width: 100%; position: absolute;}
.service-content .tip{ padding: 20px 6%; background: #F2F3F9; color: #7B7C86;}
.QRcode{ max-width: 60%; background: #fff; margin: 20px auto;}
.QRcode img{box-shadow:0px 1px 5px 0px rgba(28, 7, 20, 0.35); padding: 8px; width: 100%;}
.service-content .mu-list{ padding: 0;}
.service-content .mu-list img{ width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; border: solid 1px #F1F1F1; padding: 4px;}
.service-content .mu-list .mu-item-action  { min-width: auto;}
.service-content .mu-list .mu-item{ border-bottom: solid 1px #F1F1F1;}
.imtoken{ text-align: center; padding: 10px 10% 10px 10%; font-size: 15px; background: #FFFFFF;}
.imtoken>div{ margin-top: 10px;}
.imtoken .text{ padding: 20px 0; word-break: break-word; font-size: 12px; }
.service-content button{ width:100%; margin-top: 20px;}
.service-content .prompt{ padding: 16px 10% 0 10%; background: #F2F3F9;}
.service-content .prompt>div{ font-size: 15px;}
.service-content .prompt>p{ margin: 0; color:#585858; padding-bottom: 20px;}
.service-content button.white{ background: none; color: #110B15; box-shadow: none; border: solid 1px #110B15; }
  </style> 
