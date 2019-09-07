<template>
  <div class="malls">
    <div class="nav">
      <router-link to="/MyAddress"><img src="static/images/malls01.png" alt="">收货地址</router-link>
      <router-link to="/Order"><img src="static/images/malls02.png" alt="">订单管理</router-link>
    </div>
    <ul class="goods">
      <li v-for="item in info" :key="item.id">
        <router-link :to="`/GoodsDetails/${item.id}`">
          <img :src="item.cover" alt="">
          <h4>{{item.name}}</h4>
          <p><strong>{{item.price}}<font>CGS&nbsp;</font></strong><span>兑换</span></p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Malls',
  data () {
    return {
      info:[],
    }
  },
  created() {
    // this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http("/shop/lists").then((response) => {
        console.log(response.data.data);
        this.info = response.data.data;
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.malls { position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #f4f4f4; padding-top: 30px;}
.malls .nav{ display: flex; width: 100%; padding: 20px 20%; justify-content: space-between; text-align: center; background: #fff;}
.malls .nav img{ width: 50px; height: 50px; display: block; margin-bottom: 4px;}
.goods{ display: flex; width: 100%; padding:2%; justify-content: space-between; flex-wrap: wrap; background: #F4EFF6;}
.goods li{ width: 49%; padding: 10px 4%; margin-bottom: 2%; text-align: center; background: #fff;}
.goods li img{ height: 134px; padding: 16px;}
.goods li h4{ text-align: left; margin: 5px 0; font-size: 15px; font-weight: normal;}
.goods li p{ text-align: left;display: flex; justify-content: space-between; align-items: center;}
.goods li p strong{ color: #110B15; font-size: 16px;}
.goods li p strong font{ color: #585858; font-size: 12px; font-weight: 500;}
.goods li p span{ display: inline-block; width:46px; height:23px; line-height: 23px; text-align: center; color: #fff; background:rgba(174,62,229,1); border-radius:11px;}
.mu-divider{ height: 8px; background-color: #F4EFF6;}
</style>
