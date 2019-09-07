<template>
  <!-- 我的出售订单 -->
  <div class="details">
    <app-header title="订单详情"></app-header>
    <!-- 待付款 -->
    <div class="prompt" v-if="info.status == 1">
      <div class="title">待付款</div>
      <p>等待买家付款</p>
    </div>
    <!-- 待放行 -->
    <div class="prompt" v-if="info.status == 2">
      <div class="title">待放行</div>
      <p>请在24小时内完成放行，并务必点击“放行”，系统会将数字资产划转给买家</p>
    </div>
    <!-- 申诉-->
    <div class="prompt" v-if="info.status == 3">
      <div class="title">申诉中</div>
    </div>
    <!-- 已完成 -->
    <div class="prompt" v-if="info.status == 4">
      <div class="title">已完成</div>
      <p>订单已完成</p>
    </div>
    <!-- 已取消-->
    <div class="prompt" v-if="info.status == 5">
      <div class="title">已取消</div>
      <p>订单已取消</p>
    </div>
    <div class="order-content">
      <div class="title"><span>交易总额：</span><strong>￥{{info.rmb}}</strong></div>
      <div class="info">
        <div><span>账号：</span><font>{{info.mobile}}</font></div>
        <div><span>单价：</span><font>￥{{info.price_xc}}</font></div>
        <div><span>数量：</span><font>{{info.num}} XC</font></div>
        <div><span>交易时间：</span><font>{{info.created | filterDate}}</font></div>
        <div><span>订单号：</span><font>{{info.order_sn}}</font></div>
      </div>
    </div>
    <!-- 待付款 -->
    <div class="bottom-btn" v-if="info.status == 1">
      <mu-button class="flat" flat @click="openDialog2">取消订单</mu-button>
    </div>
    <!-- 待放行 -->
    <div class="bottom-btn" v-if="info.status == 2">
      <mu-button class="flat" flat to="/ServiceCenter">申诉</mu-button>
      <mu-button flat @click="openDialog"><span>放行</span></mu-button>
    </div>
    <!-- 放行 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      <div class="title">确定放行？请确认您已收到款！</div>
      <mu-button slot="actions" flat color="secondary" @click="closeDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit">确定</mu-button>
    </mu-dialog>
    <!-- 取消 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert2">
      <div class="title">确定取消订单？</div>
      <mu-button slot="actions" flat color="secondary" @click="closeDialog2">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="cancel">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import formatDate from '@/components/bin/date.js';
export default {
  name: 'MyOrderDetails',
  data () {
    return {
      info:[],
      openAlert:false,
      openAlert2:false,
      password: "",
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getInfo();
  },
  methods: {
    getInfo() {
      const formData = {
        id: this.id,
      }
      this.$http.post("/transaction/trans_detail", formData).then(response => {
        const res = response.data.data;
        console.log(res);
        this.info = res;
      })
    },
    // 密码框弹出
    openDialog (id) {
      this.openAlert = true;
    },
    closeDialog () {
      this.openAlert = false;
    },
    // 确认订单，放行
    submit() {
      const formData = {
        order_id: this.id,
      }
      this.$http.post("/transaction/release", formData).then(response => {
        const res = response.data
        if(res.status === 1) {
          this.openAlert = false;
          this.getInfo();
        }
        this.$toast.message(res.msg)
      })
    },
    // 取消
    openDialog2() {
      this.openAlert2 = true;
    },
    closeDialog2() {
      this.openAlert2 = false;
    },
    // 取消订单
    cancel() {
      const formData = {
        order_id: this.id,
      }
      this.$http.post("/transaction/cancel", formData).then(response => {
        const res = response.data;
        if(res.status === 1) {
          this.openAlert2 = false;
        }
        this.$toast.message(response.data.msg)
        this.getInfo();
      })
    },
  },
  filters: {
    filterDate(time) {
      if(time){
        const date = new Date(time*1000);
        return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
      }
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.details{ min-height: 100%; width: 100%; padding-bottom: 60px; position: absolute; background: #F2F3F9;}
.prompt{ padding: 16px 4% 6px 4%; color: #A5B0BF;}
.prompt .title{ font-size: 18px; color: #0F2748;}
.prompt p { line-height: 22px; margin-top: 4px}

.order-content{margin: 10px 4%; width: 92%; background-color: #fff; color: #A5B0BF; box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.05); border-radius:5px;}
.order-content .title{ padding: 10px 3%; display: flex; flex-direction: column; background: #F5F7FA; border-radius:5px 5px 0 0;}
.order-content .title strong{ color: #4071FF; font-size: 21px; margin-top: 5px;}
.order-content .info>div{ padding: 10px 3%; display: flex; justify-content: space-between; border-bottom:1px solid #F2F4F7; font-size: 15px;}
.order-content .info>div font{ color: #0F2748;}

.bottom-btn{ position: fixed; display: flex; padding: 10px 4%; justify-content: flex-end; left: 0; bottom: 0; width: 100%; background-color: #ffffff; font-size: 16px!important; border-top: solid 1px #F2F3F9;}
.bottom-btn a,.bottom-btn button{ display: flex; justify-content: center; margin-left: 8%; width: 82px; height: 30px; line-height: 30px; align-items: center; border: solid 1px #4071FF; border-radius:15px; font-size: 13px; color: #4071FF;}
.bottom-btn .flat{ border: solid 1px #EBEDF0; color: #0F2748;}

.common-dialog .title{ font-size: 18px;}
</style>
