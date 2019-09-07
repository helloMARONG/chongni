<template>
  <!-- 身份认证，图片存储自己服务器版 -->
  <div class="card">
    <app-header title="身份认证"></app-header>
    <div class="tip">为了您的资金安全，需验证您的身份才可以进行其他操作；认证信息一经验证不能修改，请务必如实填写</div>
    <mu-form ref="form" :model="validateForm" class="card-content">
      <mu-form-item label="真实姓名：" prop="name" :rules="nameRules">
        <mu-text-field v-model="validateForm.name" prop="name" :disabled="info.status===1 || info.status===2"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="身份证号码：" prop="cardId" :rules="cardIdRules">
        <mu-text-field v-model="validateForm.cardId" prop="cardId" :disabled="info.status===1 || info.status===2"></mu-text-field>
      </mu-form-item>
      <div class="cardUp">
        <p>请上传公民身份证正面</p>
        <div class="img">
          <img :src="card.cardOne">
        </div>
        <div class="addname" @click="setCardOne">
          <input type="file" name="card1" accept="image/*" style="display:none" ref="setCardOne" @change="uploadCardOne($event)" :disabled="info.status===1 || info.status===2"/>
        </div>
      </div>
      <div class="cardUp">
        <p>请上传公民身份证反面</p>
        <div class="img">
          <img :src="card.cardTwo">
        </div>
        <div class="addname" @click="setCardTwo">
          <input type="file" name="avatar" accept="image/*" style="display:none" ref="setCardTwo" @change="uploadCardTwo($event)" :disabled="info.status===1 || info.status===2"/>
        </div>
      </div>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit" :disabled="info.status===1 || info.status===2">提交认证</mu-button>
        <div class="status" v-if="info.status===1">(待审核)</div>
        <div class="status" v-if="info.status===2">(已认证)</div>
        <div class="status" v-if="info.status===3">(驳回)</div>
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
      info:{},
      card:{
        cardOne:"static/images/card1.png", //正面
        cardTwo:"static/images/card2.png",  //背面
      },
      cardCut:{  // 用于提交审核时候保存的信息，去掉了http..
        cardOne:"",
        cardTwo:"",
      }, 
      baseUrl: this.$store.state.baseUrl,
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http.post("/api/member/member_info").then(response => {
        const res = response.data;
        // console.log(res)
        if(res.status === 'y'){
          this.info = res.data;
          this.validateForm.name = this.info.name;
          this.validateForm.cardId = this.info.card_no;
          if(this.info.zm_img){
            this.card.cardOne = this.baseUrl+this.info.zm_img;
            this.cardCut.cardOne = this.info.zm_img;
          }
          if(this.info.bm_img){
            this.card.cardTwo = this.baseUrl+this.info.bm_img;
            this.cardCut.cardTwo = this.info.bm_img;
          }
        }
      })
    },
    //1.1.上传：正面照
    setCardOne() {
      this.$refs.setCardOne.click();
    },
    //1.2.上传：正面照
    uploadCardOne(e) {
      this.$refs.form.validate().then((result) => {
        if(result){
          let file = e.target.files[0];
          // 通过canvas压缩图片
          let reader = new FileReader();
          reader.readAsDataURL(file);
          let img = new Image;
          reader.onload = function (e) {
            let width = 400, //图像大小
            quality = 0.8, //图像质量
            canvas = document.createElement("canvas"),
            drawer = canvas.getContext("2d")
            img.src = this.result;
            img.onload = function () {
              canvas.width = width;
              canvas.height = width * (img.height / img.width);
              drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
              img.src = canvas.toDataURL("image/png", quality);
            }
          }
          setTimeout(()=> {
            // console.log(img.src)
            let param = new FormData();
            param.append('file', img.src);
            this.$http.post("/api/other/member_img", param).then((response)=> {
              const res = response.data;
              // console.log(res)
              if(res.status === 'y'){
                this.card.cardOne = this.baseUrl + res.img;
                this.cardCut.cardOne = res.img;
              }
              this.$toast.message(res.msg);
            })
          }, 1000)
        }  
      }) 
    },
    //2.1.上传：背面照
    setCardTwo() {
        this.$refs.setCardTwo.click()
    },
    //2.2.上传：背面照
    uploadCardTwo(e) {
      this.$refs.form.validate().then((result) => {
        if(result){
          let file = e.target.files[0];
          // 通过canvas压缩图片
          let reader = new FileReader();
          reader.readAsDataURL(file);
          let img = new Image;
          reader.onload = function (e) {
            let width = 400, //图像大小
            quality = 0.8, //图像质量
            canvas = document.createElement("canvas"),
            drawer = canvas.getContext("2d")
            img.src = this.result;
            img.onload = function () {
              canvas.width = width;
              canvas.height = width * (img.height / img.width);
              drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
              img.src = canvas.toDataURL("image/png", quality);
            }
          }
          setTimeout(()=> {
            console.log(img.src)
            let param = new FormData();
            param.append('file', img.src);
            this.$http.post("/api/other/member_img", param).then((response)=> {
              const res = response.data;
              console.log(res)
              if(res.status === 'y'){
                this.card.cardTwo = this.baseUrl + res.img;
                this.cardCut.cardTwo = res.img;
              }
              this.$toast.message(res.msg);
            })
          }, 1000)
        }  
      }) 
    },
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result){
          const formData = {
            zm_img: this.cardCut.cardOne,
            bm_img: this.cardCut.cardTwo,
            name: this.validateForm.name,
            card_no: this.validateForm.cardId
          };
          this.$http.post("/api/member/member_infoadd", formData).then(response => {
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
.addname{ position: absolute; top: 30px; left: 0; width: 100%; height: 80%;}
</style>
