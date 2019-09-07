<template>
  <div class="accountStore">
    <app-header title="记录"></app-header>
    <mu-tabs :value.sync="active" full-width>
      <mu-tab>充币</mu-tab>
      <mu-tab>提币</mu-tab>
    </mu-tabs>
    <div v-if="active === 0">
      <ul class="account account-title">
        <li><span>时间</span><span>数量</span></li>
      </ul>
      <div class="bscroll" ref="bscroll">
        <ul class="account">
          <li v-for="(item,index) in 30" :key="index">
            <span>{{item}}</span>
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="active === 1">
      <ul class="account account-title">
         <li><span>时间</span><span>数量</span></li>
      </ul>
      <div class="bscroll" ref="bscroll">
        <ul class="account">
          <li v-for="(item,index) in info2" :key="index">
            <span>{{item.add_time}}</span>
            <span>{{parseFloat(item.num).toFixed(4)}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'AccountFlow',
  data () {
    return {
      active: 0,
      info:[], // 定投记录
      info2:[], // 提现记录
      total:{   // 流通
        allmoney: 0,
        okfine: "0.00000"
      },
      page:1,
      totalPage:1,
      page2:1,
      totalPage2:1,
    }
  },
  created() {
    // this.getInfo(1);
    // this.getInfo2(1);
    // this.getTotalMoney();
  },
  mounted() {
    const bscroll = document.querySelector('.bscroll');
    const scrollHeight = window.screen.height - bscroll.offsetTop;
    bscroll.style.height = scrollHeight + 'px';
    this.$nextTick(() => {
      let scroll = new BScroll(this.$refs.bscroll,{
        click: true,
        pullUpLoad: {
          threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
        }
      });
      scroll.on('pullingUp', () => {
        console.log("上拉加载");
        if(this.active === 0){
          this.getInfo(this.page);
        }else if(this.active ===1){
          this.getInfo2(this.page2);
        }
        scroll.finishPullUp(); 
        scroll.refresh();
      })
    });
  },
  methods: {
    // 定投记录
    getInfo(page) {
      if(page <= this.totalPage){
        const formData = {
          type: "2",
          page:page,
        }
        this.$http.post("/api/regular/money_log", formData)
        .then(response => {
          const res = response.data.data;
          this.info = this.info.concat(res.data);
          this.totalPage = res.last_page;
          console.log(res)
          this.page++;
        })
      }else{
        this.$toast.message("没有更多了！")
      }
    },
    // 提现记录
    getInfo2(page) {
      if(page <= this.totalPage2){
        const formData = {
          type: "OKFINE",
          page:page,
        }
        this.$http.post("/api/regular/draw_log",formData)
        .then(response => {
          const res = response.data.data;
          this.info2 = this.info2.concat(res.data);
          this.totalPage2 = res.last_page;
          console.log(res)
          this.page2++;
        })
      }else{
        this.$toast.message("没有更多了！")
      }
    },
    // 流通
    getTotalMoney() {
      this.$http.post("/api/info/moneyadress")
      .then(response => {
        const res = response.data;
        this.total = res.data;
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bscroll{ width: 100%; overflow: hidden;}
.account{ width: 100%; padding: 0; color: #585858;}
.account li{ width: 100%; padding: 0 6%; display: flex; justify-content: space-between; height: 36px; align-items: center;}
.account li span{ width: 30%; text-align: center; }
.account li:nth-of-type(2n-1){ background-color: #f3f3f3;}
.account-title li { background: #fff!important; height: 40px;}
.account-title li span{ font-size: 13px;}
.color1{ color: #1C82D4;}
.color2{ color: #FF3C00;}
</style>
