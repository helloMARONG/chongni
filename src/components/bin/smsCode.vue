<template>
  <div class="sms-code">
      <mu-text-field type="tel" :errorText="errorText" v-model="currentValue" fullWidth/>
      <mu-button class="common-btn" @click="getSMSCode" :disabled="canSend">{{codeMsg}}</mu-button>
  </div>
</template>

<script>
export default {
  name:'smsCode',
  mounted () {
    if(localStorage.SMSCodeStratTime){
      this.sended = true;
      this.startTime = localStorage.SMSCodeStratTime;
      this.sending();
    }
  },
  methods:{
    getSMSCode(){
      let app = this;
      app.sended = true;
      app.$emit('getCode')
      app.startTime = new Date().getTime();
      localStorage.setItem('SMSCodeStratTime',app.startTime);
      app.sending()
    },
    sending(){
      let app = this;
      let now = new Date().getTime();
      let time = Math.round((now - app.startTime)/1000);
      app.codeMsg = `稍等${app.time - time}秒`
      if(time>=app.time){
        app.sended = false;
        app.startTime = null;
        app.timer = null;
        app.codeMsg = `获取验证码`
        localStorage.removeItem('SMSCodeStratTime')
      }else{
        app.timer = setTimeout(function(){
          app.sending();
        },1000)
      }
    }
  },
  data () {
    return {
      codeMsg:'获取验证码',
      sended:false,
      timer:null,
      startTime:null,
    }
  },
  props: {
    phone:{
      type:String,
      require:true,
    },
    time:{
      type:Number,
      require:true,
      default:60
    },
    value:{
      default:''
    },
    errorText:{
      default:''
    }
  },
  computed:{
    canSend(){
      let app = this;
      return !(!app.sended)
    },
    currentValue:{
      get(){
        return this.value
      },
      set(val){
        return this.$emit('input',val)
      }
    }
  },
  watch:{
    value:{
      handler:function(val,oldVal){
        this.$emit('input',val);
      },
      deep:true
    },
  }
}
</script>

<style scoped>
.sms-code{ position: relative; width: 100%;}
.sms-code button{ position: absolute; top: -20px; right: 0; width: 90px; height: 30px; border-radius: 22px; font-size: 12px; color: #fff; }
</style>
