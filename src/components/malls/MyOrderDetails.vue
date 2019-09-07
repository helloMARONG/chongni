<template>
  <div class="goods">
    <app-header title="商品详情"></app-header>
    <div class="address">
      <div class="address01">
        <span class="icon iconfont">&#xe63c;</span>
        <p>{{product.province+product.city+product.town+product.address}}<br><span>{{product.name}} {{product.mobile}}</span></p>
      </div>
      <!-- <div><span class="icon iconfont">&#xe695;</span></div> -->
    </div>
    <div class="goods-content">
      <div class="part1">
        <img src="static/images/test2.png" alt="">
        <div class="content">{{product.goods_name}}<br><span>数量：x{{product.goods_num}}<br>{{product.price/product.goods_num}}&nbsp;&nbsp;CGS</span></div>
        <div class="btn">
          <!-- <span class="icon iconfont" @click="subtract">&#xe676;</span><strong>{{number}}</strong><span class="icon iconfont" @click="add">&#xe60d;</span> -->
        </div>
      </div>
      <div class="part2">商品总价: {{product.price}}<p> <span>CGS</span></p></div>
      <mu-text-field v-if="status==0" :disabled="true" multi-line :rows="3" :rows-max="4" v-model="product.remark" placeholder="留言备注："></mu-text-field>
    </div>
    <div class="info" v-if="status==1 || status==2">
      <h4>订单信息</h4>
      <p>下单时间：{{product.created}}<br>
        配送单号：{{product.order_no}}<br>
        订单备注：{{product.remark}}
      </p>
    </div>
    <div class="prompt" v-if="status==0">
      温馨提示：尊敬的用户您好，若您的余额不足需支付的金额时，您将无法完成付款
    </div>
    <div class="submit" v-if="status==0 || status==1">
      <div>实付款：<strong>{{product.price}}</strong> CGS</div>
      <mu-button v-if="status==0" class="common-btn" @click="openAlert(product.order_no,product.remark)">确定兑换</mu-button>
      <mu-button v-if="status==1" class="common-btn" @click="openAlert3(product.order_no)">确认收货</mu-button>
    </div>
    <!-- 兑换弹出 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert">
      <mu-text-field type="password" placeholder="请输入交易密码" v-model="password"></mu-text-field><br/>
      <mu-button slot="actions" flat color="secondary" @click="closeAlert">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit()">确定</mu-button>
    </mu-dialog>
    <!-- 确认收货弹出 -->
    <mu-dialog class="common-dialog" title="确定收货？" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert3">
      <mu-button slot="actions" flat color="secondary" @click="closeAlert3">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submitTake()">确定</mu-button>
    </mu-dialog>
  </div>   
</template>

<script>
export default {
  name: "GoodsDetails",
  data() {
    return {
      id: this.$route.query.id,
      status: this.$route.query.status,
      product:{remark:""},
      alert: false,
      alert3: false,
      password:"",
    };
  },
  created() {
    // this.getInfo();
  },
  methods: {
    // 订单详情
    getInfo() {
      const params = {
        id: this.id
      };
      this.$http("/shop/order_info", {params: params}).then(response => {
        const res = response.data;
        console.log(res);
        this.product = res.data;
        if(!this.product.remark) {
          this.product.remark = "无"
        }
      })
    },
    // 立即兑换弹出
    openAlert (order_no, remark) {
      this.orderNo = order_no;
      this.remarks = remark;
      this.alert = true;
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
        console.log(res)
        if(res.status === 0){
          this.alert = false;
          this.$router.back();
        }
        this.$toast.message(res.msg);
      })
    },
    // 确认收货弹出
    openAlert3 (order_no) {
      this.orderNo = order_no;
      this.alert3 = true;
    },
    closeAlert3 () {
      this.alert3 = false;
    },
    submitTake() {
      const params = {
        order_no: this.orderNo,
      };
      this.$http("/shop/confirm_receipt", {params: params}).then(response => {
        const res = response.data;
        console.log(res)
        if(res.status === 0){
          this.alert3 = false;
          this.$router.back();
        }
        this.$toast.message(res.msg);
      })
    },
  }
};
</script>
<style scoped>
.goods { position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #F4EFF6;}
.address{ width: 100%; padding: 20px 4%; display: flex; justify-content: space-between; background: #fff;}
.address01{ display: flex;}
.address01>span{ margin-right: 12px;}
.address01 p{ font-size: 15px;}
.address01 p span{  color: #7A7A7A; font-size: 13px;}
.address .iconfont{ color: #7A7A7A;}

.goods-content{ background: #fff; margin-top: 6px; padding: 20px 4% 0 4%;}
.goods-content .part1{ display: flex; padding: 0 0 10px 10px; border-bottom: solid 1px #f3f3f3;}
.goods-content .part1 img{ height: 80px; margin-right: 30px;}
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

.info{background: #fff; margin-top: 6px; padding: 10px 4%; color: #7A7A7A; line-height: 26px;}
.info h4{ margin: 0; font-size: 14px; color: #191918;}
</style> 
