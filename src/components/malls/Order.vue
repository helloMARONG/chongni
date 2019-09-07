<template>
  <div class="accountStore">
    <app-header title="我的订单"></app-header>
    <mu-tabs :value.sync="active" full-width>
      <mu-tab>待付款</mu-tab>
      <mu-tab>待收货</mu-tab>
      <mu-tab>已完成</mu-tab>
    </mu-tabs>
    <div v-if="active === 0">
      <div class="bscroll" ref="bscroll">
        <ul class="account">
          <li v-for="(item) in info" :key="item.id">
            <a href="javascript:void(0);">
              <div class="part1">{{item.created}}<span>待兑换</span></div>
              <div class="part2">
                <router-link :to="{path:'MyOrderDetails', query:{id:item.id, status: 0}}">
                  <img :src="item.cover" alt="">
                  <div class="content">{{item.name}}<br><span>数量：x{{item.goods_num}}<br>价格：{{item.price/item.goods_num}}CGS</span></div>
                  <div>兑换CGS数量：{{item.price}}</div>
                </router-link>
              </div>
              <div class="part3">
                <mu-button class="common-btn black" @click="openAlert(item.order_no,item.remark)">立即兑换</mu-button>
                <mu-button class="common-btn" @click.stop="openAlert2(item.order_no)">取消兑换</mu-button>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="active === 1">
      <div class="bscroll" ref="bscroll">
        <ul class="account">
          <li v-for="(item,index) in info2" :key="index">
            <a href="javascript:void(0);">
              <div class="part1">{{item.created}}<span>待收货</span></div>
              <div class="part2">
                <router-link :to="{path:'MyOrderDetails', query:{id:item.id, status: 1}}">
                  <img :src="item.cover" alt="">
                  <div class="content">{{item.name}}<br><span>数量：x{{item.goods_num}}<br>价格：{{item.price/item.goods_num}}CGS</span></div>
                  <div>兑换CGS数量：{{item.price}}</div>
                </router-link>
              </div>
              <div class="part3">
                <mu-button class="common-btn black" @click="openAlert3(item.order_no)">确认收货</mu-button>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="active === 2">
      <div class="bscroll" ref="bscroll">
        <ul class="account">
          <li v-for="(item,index) in info3" :key="index">
            <a href="javascript:void(0);">
              <div class="part1">{{item.created}}<span class="color1">已完成</span></div>
              <div class="part2">
                <router-link :to="{path:'MyOrderDetails', query:{id:item.id, status: 2}}">
                  <img :src="item.cover" alt="">
                  <div class="content">{{item.name}}<br><span>数量：x{{item.goods_num}}<br>价格：{{item.price/item.goods_num}}CGS</span></div>
                  <div>兑换CGS数量：{{item.price}}</div>
                </router-link>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 兑换弹出 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert">
      <mu-text-field type="password" placeholder="请输入交易密码" v-model="password"></mu-text-field><br/>
      <mu-button slot="actions" flat color="secondary" @click="closeAlert">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit()">确定</mu-button>
    </mu-dialog>
    <!-- 取消兑换 -->
    <mu-dialog class="common-dialog" title="取消兑换？" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert2">
      <mu-button slot="actions" flat color="secondary" @click="closeAlert2">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="cancelSubmit()">确定</mu-button>
    </mu-dialog>
    <!-- 确认收货弹出 -->
    <mu-dialog class="common-dialog" title="确定收货？" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="alert3">
      <mu-button slot="actions" flat color="secondary" @click="closeAlert3">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submitTake()">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'AccountFlow',
  data () {
    return {
      active: 0,
      info:[], //待付款
      info2:[], //待收货
      info3:[], //已完成
      alert: false,
      alert2: false,
      alert3: false,
      password:"",
      id: "",
      orderNo:"",
      remarks:"",
    }
  },
  created() {
    // this.getInfo();
    // this.getInfo2();
    // this.getInfo3();
  },
  methods: {
    // 待付款
    getInfo() {
      const params = {
        type: "1"
      }
      this.$http("/shop/my_order", {params: params}).then(response => {
        const res = response.data.data;
        // console.log(res);
        this.info = res;
      })
    },
    // 待收货
    getInfo2() {
      const params = {
        type: "2"
      }
      this.$http("/shop/my_order", {params: params}).then(response => {
        const res = response.data.data;
        // console.log(res);
        this.info2 = res;
      })
    },
    // 已完成
    getInfo3() {
      const params = {
        type: "3"
      }
      this.$http("/shop/my_order", {params: params}).then(response => {
        const res = response.data.data;
        // console.log(res);
        this.info3 = res;
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
          this.getInfo();
          this.getInfo2();
        }
        this.$toast.message(res.msg);
      })
    },
    // 取消兑换弹出
    openAlert2 (order_no) {
      this.orderNo = order_no;
      this.alert2 = true;
    },
    closeAlert2 () {
      this.alert2 = false;
    },
    // 取消兑换
    cancelSubmit() {
      const params = {
        order_no: this.orderNo,
      };
      this.$http("/shop/order_cancel", {params: params}).then(response => {
        const res = response.data;
        if(res.status === 0){
          this.alert2 = false;
          this.getInfo();
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
          this.getInfo2();
          this.getInfo3();
        }
        this.$toast.message(res.msg);
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.accountStore { position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #F4EFF6;}
.mu-tabs{ background: #fff;}
.bscroll{ width: 100%; overflow: hidden;}
.account{ width: 100%; padding: 0; color: #585858;}
.account li{ margin-top: 8px; background: #fff;}
.account li>a{ width: 100%; padding: 0 4%; display: block;}
.account .part1{ display: flex; width: 100%; padding: 15px 0; justify-content: space-between; align-items: center;}
.account .part1 span{ color: #AE3EE5; font-size: 16px;}
.account .part2{ width: 100%; padding-left: 10px;}
.account .part2 a{ display: flex; padding: 8px 0; justify-content: space-between; border-bottom: solid 1px #f3f3f3; border-top: solid 1px #f3f3f3; align-items: center;}
.account .part2 img{ height: 80px; margin-right:10px;}
.account .part2 .content{ font-size: 14px;}
.account .part2 .content span{ color: #7A7A7A; font-size: 12px;}
.account .part2 div:last-of-type{ margin-top: 51px; color: #7A7A7A;}
.account .part3{ display: flex; flex-direction: row-reverse; padding: 10px 0;}
.common-btn{ height: 25px; background: #fff; box-shadow: none; border: solid 1px #484848; color: #484848; font-size: 13px; min-width: auto; margin-left: 10px;}
.black{color: #fff; background:rgba(72,72,72,1);}


.color1{ color: #484848!important;}
/* .color2{ color: #FF3C00;} */
</style>
