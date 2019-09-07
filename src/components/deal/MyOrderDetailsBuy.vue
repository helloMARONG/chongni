<template>
  <div class="details">
    <app-header title="订单详情"></app-header>
    <!-- 待付款 -->
    <div class="prompt" v-if="info.status == 1">
      <div class="title">待付款</div>
      <p>请及时付款，如已付款请务必点击“我已付款”，否则造成资金损失后果自负</p>
    </div>
    <!-- 待放行 -->
    <div class="prompt" v-if="info.status == 2">
      <div class="title">待放行</div>
      <p>您已完成付款，等待卖家放行</p>
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
    <div class="payInfo" v-show="payStatus == 1">
      <div class="title">付款信息</div>
      <div class="content">
        <div class="part1"><span class="icon iconfont">&#xe66f;<font>银行卡</font></span><span class="icon iconfont" @click="openBottomSheet"><font>切换付款方式</font>&#xe695;</span></div>
        <div class="part2">
          <div>
            <font>收款人：</font>
            <span>{{account.bank_username}}</span>
            <mu-button class="common-btn copyCard" v-clipboard:copy="account.bank_username" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</mu-button>
          </div>
          <div><font>银行信息：</font><span>{{account.bank_name}}</span></div>
          <div>
            <font>卡号：</font>
            <span>{{account.bank_num}}</span>
            <mu-button class="common-btn copyCard" v-clipboard:copy="account.bank_num" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</mu-button>
          </div>
        </div>
      </div>
    </div>
    <div class="payInfo" v-show="payStatus == 2">
      <div class="title">付款信息</div>
      <div class="content">
        <div class="part1"><span class="icon iconfont" style="color:#689ef0;">&#xe665;<font>支付宝</font></span><span class="icon iconfont" @click="openBottomSheet"><font>切换付款方式</font>&#xe695;</span></div>
        <div class="part2">
          <div><font>收款人：</font><span>{{account.aliname}}</span></div>
          <div><font>支付宝账号：</font><span>{{account.alipay}}</span></div>
          <div><font>收款二维码：</font><span class="icon iconfont" @click="openQrCode(account.alipay_img)">&#xe7b1;</span></div>
          <div class="tip">(注：点击二维码可放大;请截图保存此二维码)</div>
        </div>
      </div>
    </div>
    <!-- <div class="payInfo" v-show="payStatus == 3">
      <div class="title">付款信息</div>
      <div class="content">
        <div class="part1"><span class="icon iconfont" style="color:#6cb37a;">&#xe61d;<font>微信</font></span><span class="icon iconfont" @click="openBottomSheet"><font>切换付款方式</font>&#xe695;</span></div>
        <div class="part2">
          <div><font>微信账号：</font><span>{{account.wechat}}</span></div>
          <div><font>收款二维码：</font><span class="icon iconfont" @click="openQrCode(account.wechat_img)">&#xe7b1;</span></div>
          <div class="tip">(注：点击二维码可放大;请截图保存此二维码)</div>
        </div>
      </div>
    </div> -->
    
    <!-- 待付款 -->
    <div class="bottom-btn" v-if="info.status == 1">
      <mu-button flat @click="openDialog" class="flat">取消订单</mu-button>
      <mu-button flat @click="openDialogAlready"><span>我已付款</span></mu-button>
    </div>
    <!-- 待放行 -->
    <div class="bottom-btn" v-if="info.status == 2">
      <a class="flat" :href="'tel:'+info.mobile">联系承兑商</a>
      <mu-button flat to="/ServiceCenter">申诉</mu-button>
    </div>
    <!-- 我已付款 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlertAlready">
      <div class="title">付款确认</div>
      <div>请确认您已向卖家付款</div>
      <mu-button slot="actions" flat color="primary" @click="closeDialogAlready">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="confirmDialogAlready">确定</mu-button>
    </mu-dialog>
    <!-- 取消 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      <div class="title">确定取消订单？</div>
      <mu-button slot="actions" flat color="secondary" @click="closeDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="cancel">确定</mu-button>
    </mu-dialog>
    <!-- 底部弹出 -->
    <mu-bottom-sheet :open.sync="open">
      <mu-list>
        <mu-list-item button @click="choose(1)" v-if="account.bank_num">
          <mu-list-item-title>银行卡</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="choose(2)" v-if="account.alipay">
          <mu-list-item-title>支付宝</mu-list-item-title>
        </mu-list-item>
        <!-- <mu-list-item button @click="choose(3)" v-if="account.wechat">
          <mu-list-item-title>微信</mu-list-item-title>
        </mu-list-item> -->
        <mu-list-item button @click="closeBottomSheet()">
          <mu-list-item-title>取消</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
    <!-- 二维码弹出 -->
    <mu-dialog title="收款二维码" width="260" :open.sync="openSimple">
      <img :src="qrcode" alt="">
      <mu-button class="common-btn save-btn" @click="saveImg">保存二维码至相册</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import formatDate from '@/components/bin/date.js';
export default {
  name: 'MyOrderDetails',
  data () {
    return {
      info: {},
      open: false,
      openSimple: false,
      openAlertAlready: false, //我已付款
      openAlert:false, // 取消
      payStatus: 1,
      qrcode:"",
      account: {}, //付款方式
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
        this.account = this.info.account;
        if(this.account.bank_num) {
          this.payStatus = 1;
        }else if(this.account.alipay){
          this.payStatus = 2;
        }
        // else if(this.account.wechat){
        //   this.payStatus = 3;
        // }
      })
    },
    // 取消
    openDialog() {
      this.openAlert = true;
    },
    closeDialog() {
      this.openAlert = false;
    },
    // 取消订单
    cancel() {
      const formData = {
        order_id: this.id,
      }
      this.$http.post("/transaction/cancel", formData).then(response => {
        const res = response.data;
        if(res.status === 1) {
          this.openAlert = false;
        }
        this.$toast.message(response.data.msg)
        this.getInfo();
      })
    },
    // 我已经付款
    openDialogAlready () {
      this.openAlertAlready = true;
    },
    closeDialogAlready () {
      this.openAlertAlready = false;
    },
    confirmDialogAlready() {
      const formData = {
        order_id: this.id,
        paytype: this.payStatus,
      }
      this.$http.post("/transaction/want_pay", formData).then(response => {
        this.$toast.message(response.data.msg);
        this.getInfo();
        this.openAlertAlready = false;
      })
    },
    // 底部弹出控制
    openBottomSheet() {
      this.open = true;
    },
    closeBottomSheet () {
      this.open = false;
    },
    // 选择支付方式
    choose(id) {
      if(id === 1) {
        this.payStatus = 1;
      }else if( id === 2) {
        this.payStatus = 2;
      }
      // else if( id === 3) {
      //   this.payStatus = 3;
      // }
      this.open = false;
    },
    // 展示收款二维码
    openQrCode (url) {
      this.openSimple = true;
      this.qrcode = url;
    },
    closeQrCode () {
      this.openSimple = false;
    },
    // 保存图片至系统相册
    saveImg() {
      plus.gallery.save(this.qrcode, this.successCB, this.errorCB);
    },
    successCB() {
      this.$toast.message("保存成功");
    },
    errorCB() {
      this.$toast.message("保存失败");
    },
    //复制地址
    onCopy: function(e) {
      this.$toast.message("复制成功");
    },
    onError: function(e) {
      this.$toast.message("复制失败");
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

.payInfo{margin: 10px 4%; width: 92%; background-color: #fff; color: #0F2748; box-shadow:0px 0px 10px 0px #0000000d; border-radius:5px; font-size: 15px;}
.payInfo .title{ padding: 12px 4%; font-size: 16px; background: #F5F7FA; border-radius:5px 5px 0 0;}
.payInfo .content .part1{ display: flex; padding: 2px 0; align-items: center; justify-content: space-between; border-bottom: solid 1px #f3f3f3;}
.payInfo .content .part1 span{ display: flex; align-items: center;}
.payInfo .content{ padding: 0 4%; background-color: #ffffff; border-radius:0 0 5px 5px;}
.payInfo .content .icon font{ font-size: 15px;}
.payInfo .content .part2{ padding: 5px 0 10px 0;}
.payInfo .content .part2 div{ display: flex; padding: 10px 0; justify-content: space-between; align-items: center;}
.payInfo .content .part2 div font{ color: #A5B0BF;}
.payInfo .content .part2 div .icon{ font-size: 22px;}
.payInfo .content .part2 .tip{ font-size: 12px; color: #DA4600;}

.bottom-btn{ position: fixed; display: flex; padding: 10px 4%; justify-content: flex-end; left: 0; bottom: 0; width: 100%; background-color: #ffffff; font-size: 16px!important; border-top: solid 1px #F2F3F9;}
.bottom-btn a,.bottom-btn button{ display: flex; justify-content: center; margin-left: 8%; width: 82px; height: 30px; line-height: 30px; align-items: center; border: solid 1px #4071FF; border-radius:15px; font-size: 13px; color: #4071FF;}
.bottom-btn .flat{ border: solid 1px #EBEDF0; color: #0F2748;}

.mu-dialog-body img{ width: 100%;}
.common-dialog .title{ font-size: 18px;}

.save-btn{ width: 100%;}
.copyCard{ height: 30px; min-width: 60px;}
</style>
