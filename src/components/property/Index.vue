<template>
  <div class="property">
    <div class="property-top">
      <div>我的CGS<br><strong>22999.9600</strong><br>~￥56955.0096</div>
    </div>
    <div class="item">
      <div class="content">
        <div><img src="static/images/wallet-cgs.png" alt="">&nbsp;CGS</div>
        <div class="right"><strong>0.0000</strong><br>~￥0.0000</div>
      </div>
      <div class="content">
        <router-link to="/Historys" style="margin-top:10px;">交易记录</router-link>
        <div>
          <mu-button class="black" @click="toCash('USDT')">提币</mu-button>
          <mu-button class="common-btn" to="/Recharge">充币</mu-button>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="content">
        <div><img src="static/images/wallet-usdt.png" alt="">&nbsp;USDT</div>
        <div class="right"><strong>0.0000</strong><br>~￥0.0000</div>
      </div>
      <div class="content">
        <router-link to="/Historys" style="margin-top:10px;">交易记录</router-link>
        <div>
          <mu-button class="black" @click="toCash('USDT')">提币</mu-button>
          <mu-button class="common-btn" to="/Recharge">充币</mu-button>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="content">
        <div><img src="static/images/wallet-eth.png" alt="">&nbsp;ETH</div>
        <div class="right"><strong>0.0000</strong><br>~￥0.0000</div>
      </div>
      <div class="content">
        <router-link to="/Historys" style="margin-top:10px;">交易记录</router-link>
        <div>
          <mu-button class="black" @click="toCash('USDT')">提币</mu-button>
          <mu-button class="common-btn" to="/Recharge">充币</mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Property',
  data () {
    return {
      open: false,
      wallets:[],
      address:"",
      refreshing: false,
      carryAddress: false,
      carryBank:false,
    }
  },
  created() {
    // this.getInfo();
  },
  methods: {
    getAdderss() {
      return this.$http.post("/api/info/moneyadress");
    },
    getWallets() {
      return this.$http.post("/api/Other/ethapi1");
    },
    getInfo() {
      this.$http.all([this.getAdderss(), this.getWallets()])
      .then(this.$http.spread((address, wallets) => {
        this.address = address.data.wallet_address;
        this.wallets = wallets.data;
        console.log(this.wallets);
      }));
    },
    // 提币跳转
    toCash(name) {
      // if(!this.carryAddress) {
      //   this.$toast.message("请先添加提币地址！")
      // }else{
        this.$router.push({path: '/Cash', query:{name:name}})
      // }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.property{ background: #f4f4f4; position: absolute; top:0; left:0; height: 100%; width: 100%; color: #A6A1A7; padding-top: 0;}
.property-top{ width: 100%; height:150px; background:linear-gradient(113deg,rgba(54,25,63,1),rgba(59,23,67,1),rgba(33,26,36,1)); text-align: center; font-size: 15px; padding-top: 40px;}
.property-top strong{ font-size: 24px; color: #C19E76;}
.property-info{ display: flex; justify-content: space-between; width: 92%; margin: 1% 4%; padding: 6% 0 4% 0; color: #FFFEFE; text-align: center; background-color: #352A54; box-shadow:0px 1px 26px 0px rgba(34,34,34,0.08); border-radius:10px;line-height: 30px; margin-top: -70px; height: 140px;}
.property-info li{ width: 33.33%; position: relative;}
.property-info li a{ color: #fff;}
.property-info li::after{ content: ""; position: absolute; top: 25%; right:0; height: 50%; width: 1px; background-color: #463F5A;}
.property-info li img{ width: 28px; height: 28px;}
.property-info li div:last-of-type{ color: #fff;}

.property .item{ width: 92%; margin: 1% 4%; height: 102px; padding: 3% 4% 2% 4%; text-align:center; font-size: 14px; background-color: #352A54; box-shadow:0px 1px 26px 0px rgba(34,34,34,0.08); border-radius:10px;}
.property .item p{ margin: 2px 0 0 0; word-break: break-all; padding: 0 10%; line-height: 16px;}
.property .item a { font-size: 15px;}
.property .item a span{ font-size: 30px; display: inline-block; height: 40px;}
.property .item{ text-align: left;}
.property .item .content{ display: flex; justify-content: space-between; align-items: center;}
.property .item .content>a{ color: #C55BE7; font-size: 13px; margin-left: 0!important;} 
.property .item button,.property .item a{ border-radius: 15px; height: 30px; width: 70px; min-width: auto; margin-left: 8px;}
.property .item >div:first-of-type{ font-size: 15px; font-weight: bold;}
.property .item >div:last-of-type{ margin-top: 0;}
.property .item .content img{ height: 24px; width: 24px;}
.property .item .content>div:first-of-type{ display: flex; align-items: center;}
.property .item .content .right{ text-align: right; font-size: 12px;}
.property .item .content .right strong{ color: #C19E76; font-size: 16px;}
.black{border: solid 1px #C19E76; color: #fff; box-shadow:0px 2px 5px 0px rgba(84, 52, 12, 0.35); background: none;}
</style>
