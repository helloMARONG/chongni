<template>
  <div class="goods">
    <app-header title="商品详情"></app-header>
    <div class="address" @click="toAddress">
      <div class="address01">
        <span class="icon iconfont">&#xe63c;</span>
        <p v-if="!address"><font>请先添加收货地址</font></p>
        <p v-else>{{address.province+address.city+address.town+address.address}}<br><span>{{address.name}} {{address.mobile}}</span></p>
      </div>
      <div><span class="icon iconfont">&#xe695;</span></div>
    </div>
    <div class="goods-content">
      <div class="part1" v-if="product" >
        <img :src="product.cover" alt="">
        <div class="content">{{product.name}}<br><span>数量：x1&nbsp;&nbsp;(剩余：{{product.sku}})<br>{{product.price}}&nbsp;&nbsp;CGS</span></div>
        <div class="btn">
          <span class="icon iconfont" @click="subtract">&#xe7a7;</span><strong>{{number}}</strong><span class="icon iconfont" @click="add">&#xe619;</span>
        </div>
      </div>
      <div class="part2">商品总价: <p>{{total.toFixed(4)}} <span>CGS</span></p></div>
      <mu-text-field multi-line :rows="3" :rows-max="4" v-model="remarks" placeholder="留言备注："></mu-text-field>
    </div>
    <!-- <div class="cgs">
      <div>CGS支付</div>
      <div>流通CGS：23774.77 </div>
    </div> -->
    <div class="prompt">温馨提示：尊敬的用户您好，若您的余额不足需支付的金额时，您将无法完成付款</div>
    <div class="submit">
      <div>实付款：<strong>{{total.toFixed(4)}}</strong> CGS</div>
      <mu-button class="common-btn" @click="openAlert">确定兑换</mu-button>
    </div>
    <!-- 兑换弹出 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert">
      <mu-text-field type="password" placeholder="请输入交易密码" v-model="password"></mu-text-field><br/>
      <mu-button slot="actions" flat color="secondary" @click="closeAlert">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit()">确定</mu-button>
    </mu-dialog>
  </div>   
</template>

<script>
export default {
  name: "GoodsDetails",
  data() {
    return {
      product:{},
      address:"",
      number: 1,
      remarks:"",
      alert: false,
      password:"",
      orderNo: "", //订单编号
      auth_status:false,
    };
  },
  props:["id"],
  created() {
    this.getInfo();
    this.getAddress();
    this.getUserInfo();
  },
  computed: {
    total() {
      return this.number*parseFloat(this.product.price);
    }
  },
  methods: {
    // 个人信息
    getUserInfo() {
      this.$http("/user/info").then(response => {
        const res = response.data.data;
        this.auth_status = res.auth_status;
      })
    },
    // 收获地址
    getAddress() {
      this.$http("shop/address").then(response => {
        const res = response.data;
        // console.log(res);
        this.address = res.data;
      })
    },
    // 商品详情
    getInfo() {
      const params = {
        id: this.id
      };
      this.$http("/shop/info", {params: params}).then(response => {
        const res = response.data;
        this.product = res.data;
      })
    },
    // 减
    subtract() {
      if(this.number > 1){
        this.number--;
      }
    },
    add() {
      this.number++;
    },
    // 兑换弹出
    openAlert () {
      if(!this.address) {
        this.$toast.message("请先添加收货地址");
        return;
      }else if(this.product.sku == 0){
        this.$toast.message("库存不足！");
        return;
      }else if(!this.auth_status){
        this.$toast.message("请先进行实名认证！");
        return;
      }else{
        // 生成订单
        const formData = {
          goods_id: this.id,
          goods_num: this.number,
          remark: this.remarks,
        };
        this.$http.post("/shop/order_add", formData).then(response => {
          const res = response.data;
          console.log(res);
          if(res.status === 0){
            this.orderNo = res.data.order_no;
            this.alert = true;
          }
        })
      }
    },
    closeAlert () {
      this.alert = false;
    },
    submit() {
      if(!this.password) {
        this.$toast.message("请输入交易密码");
        return false;
      }
      const formData = {
        order_no: this.orderNo,
        trade: this.password,
        remark: this.remarks,
      };
      this.$http.post("/shop/order_pay", formData).then(response => {
        const res = response.data;
        this.$toast.message(res.msg);
        if(res.status === 0){
          this.alert = false;
          this.$router.back();
        }
      })
    },
    toAddress() {
      this.$router.push('/MyAddress');
    }
  }
};
</script>
<style scoped>
.goods { position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #F4EFF6;}
.address{ width: 100%; padding: 20px 4%; display: flex; justify-content: space-between; background: #fff;}
.address01{ display: flex;}
.address01 p{ font-size: 15px;}
.address01 p span{  color: #7A7A7A; font-size: 13px;}
.address01 p font{ color: #7A7A7A; line-height: 39px; display: inline-block;}
.address .iconfont{ color: #7A7A7A;}
.address01>span{ margin-right: 12px; color: #AE3EE5!important;}

.goods-content{ background: #fff; margin-top: 6px; padding: 20px 4% 0 4%;}
.goods-content .part1{ display: flex; padding: 0 0 10px 10px; justify-content: space-between; border-bottom: solid 1px #f3f3f3;}
.goods-content .part1 img{height: 80px;}
.goods-content .part1 .content{ font-size: 16px;}
.goods-content .part1 .content span{ color: #7A7A7A; font-size: 12px;}
.goods-content .part1 .btn{ margin-top: 40px; display: flex; align-items: center;}
.goods-content .part1 .btn span{ font-size: 20px;}
.goods-content .part1 .btn strong{ font-size: 20px; width: 40px; text-align: center; font-weight: normal;}
.goods-content .part2{ display: flex; padding: 20px 0; font-size: 14px; justify-content: space-between; border-bottom: solid 1px #f3f3f3;}
.goods-content .part2 p{ color: #AE3EE5; font-size: 16px; }
.goods-content .part2 p span{ font-size: 12px;}

.cgs{ font-size: 14px; padding: 0 4%; margin-top: 6px; border-bottom: solid 1px #f3f3f3; background: #fff;}
.cgs div:first-of-type{ padding: 12px 0; color: #7A7A7A; border-bottom: solid 1px #f3f3f3;}
.cgs div:last-of-type{ padding: 15px 0; }
.prompt{ padding: 20px 4%; color: #AA0503;}
.submit{ position: fixed; bottom: 0; left: 0; width: 100%; display: flex; justify-content: space-between; padding: 10px 4%; background: #fff; font-size: 14px; align-items: center;}
.submit strong{ font-size: 20px;}
.submit button{ height: 36px;}
</style> 
