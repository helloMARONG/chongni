<template>
  <!-- 身份认证，OSS版本 -->
  <div class="card">
    <app-header title="身份认证"></app-header>
    <div class="tip">为了您的资金安全，需验证您的身份才可以进行其他操作；认证信息一经验证不能修改，请务必如实填写</div>
    <mu-form ref="form" :model="validateForm" class="card-content">
      <mu-form-item label="真实姓名：" prop="name" :rules="nameRules">
        <mu-text-field v-model="validateForm.name" prop="name" :disabled="status===0 || status===1"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="身份证号码：" prop="cardId" :rules="cardIdRules">
        <mu-text-field v-model="validateForm.cardId" prop="cardId" :disabled="status===0 || status===1"></mu-text-field>
      </mu-form-item>
      <div class="cardUp">
        <p>请上传公民身份证正面</p>
        <div class="img"><img :src="card.cardOne"></div>
       <input class="upLoad" :disabled="status===0 || status===1" type="file" accept="image/*" @change="doUpload($event,'one')">
      </div>
      <div class="cardUp">
        <p>请上传公民身份证反面</p>
        <div class="img"><img :src="card.cardTwo"></div>
        <input class="upLoad" :disabled="status===0 || status===1" type="file" accept="image/*" @change="doUpload($event,'two')">
      </div>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit" :disabled="status===0 || status===1">提交认证</mu-button>
        <div class="status" v-if="status===0">(待审核)</div>
        <div class="status" v-if="status===1">(已认证)</div>
        <div class="status" v-if="status===2">(驳回)</div>
      </mu-form-item>
    </mu-form>
    <div class="prompt">
      <div>注意：</div>
      <p>1.所有图片禁止含有其他水印，否则无法通过；<br>2.拍照请勿拍的太远，否则看不清字面将无法通过审核；<br>3.点击提交认证后请耐心等待上传，请勿重复点击。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
      nameRules: [
        { validate: (val) => !!val, message: '请输入真实姓名：'},
      ],
      cardIdRules: [
        { validate: (val) => !!val, message: '请输入身份证号码'},
        { validate: (val) => (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)), message: '请输入合法的身份证号码'}
      ],
      validateForm: {
        name: '',
        cardId: '',
      },
      status:"",
      card:{
        cardOne:"static/images/card1.png", //正面
        cardTwo:"static/images/card2.png",  //背面
      },
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http("/user/certify").then(response => {
        console.log(response.data.data);
        const res = response.data.data;
        if (res) { 
          this.status = res.status;
          this.validateForm.name = res.name;
          this.validateForm.cardId = res.card_no;
          this.card.cardOne = res.obverse;
          this.card.cardTwo = res.reverse;
        }
      })
    },
    //上传图片
    doUpload(e,type) {
      this.$http("/space/oss").then(response => {
        const res = response.data.data;
        let OSS = require("ali-oss");
        let file = e.target.files[0];
        let client = new OSS({
          region: res.regionId,
          endpoint: res.endpoint,
          accessKeyId: res.AccessKeyId,
          accessKeySecret: res.AccessKeySecret,
          stsToken: res.SecurityToken,
          bucket: res.bucket
        });
        console.log(client);
        let randomName = new Date().getTime() + '.' + file.name.split('.').pop();
        // 上传
        client.put(randomName,file, {
          progress: function* (percentage, cpt) {
            this.$store.dispatch('showloader'); //上传状态
          }  
        }).then(results => {
          this.$store.dispatch('hideloader'); // 上传完成
          if(type === "one") {
            this.card.cardOne = results.res.requestUrls[0];
          }else if(type === "two") {
            this.card.cardTwo = results.res.requestUrls[0];
          }
        }).catch(err => {
          this.$toast.message("上传失败！");
        });
      })
    },
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result){
          const formData = {
            name: this.validateForm.name,
            card_no: this.validateForm.cardId,
            obverse: this.card.cardOne,
            reverse: this.card.cardTwo,
          };
          this.$http.post("/user/certify", formData).then(response => {
            this.$toast.message(response.data.info);
            if(response.data.status === 0) {
              this.$router.back();
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
.card{ background: #F2F3F9; height: 100%; width: 100%; position: absolute;}
.card .tip{ color: #ED2B36; padding: 15px; font-size: 12px;}
.card-content{ background: #fff; padding: 10px 20px 0 20px;}
.card-content button,.card-content a{ height: 40px; width: 80%; margin:10px 0 0 10%!important;}
.cardUp{ width: 100%; text-align: center; position: relative; margin-bottom: 15px;}
.cardUp p{ margin-bottom: 15px;}
.cardUp img{ height: 142px; max-width: 70%; border-radius: 5px;}
.card .prompt{ padding: 16px 10% 0 10%; background: #F2F3F9;}
.card .prompt>div{ font-size: 15px;}
.card .prompt>p{ margin: 0; color:#585858; padding-bottom: 20px;}
.card .status{ width: 100%; text-align: center; padding-top: 4px; color: #FF3C00; }
.upLoad{ opacity: 0; position: absolute; top: 34px; left: 0; width: 100%; height: 140px;}
</style>
