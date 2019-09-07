<template>
  <div class="myorder">
    <app-header title="我的发布"></app-header>
    <mu-container>
      <mu-tabs :value.sync="active" full-width>
        <mu-tab @click="changeTab">发布出售</mu-tab>
        <mu-tab @click="changeTab">发布收购</mu-tab>
      </mu-tabs>
      <div v-if="active === 0">
        <div class="bscroll" ref="bscroll">
          <ul class="content">
            <li class="list-item" v-for="item in sells" :key="item.id">
              <div class="title">
                <div>出售 XC</div>
                <div class="color-blue" v-if="item.status == 1">进行中</div>
                <div v-if="item.status == 2">已完成</div>
                <div v-if="item.status == 3">已取消</div>
              </div>
              <div class="info">
                <div class="info-item"><span>价格(CNY)</span><span>{{item.cny}}</span></div>
                <div class="info-item"><span>数量/剩余(个)</span><span>{{item.total_price}}/{{item.surplus}}</span></div>
                <div class="info-item"><span>发布时间</span><span>{{item.created | filterDate}}</span></div>
              </div>
              <div class="btn"><mu-button class="common-btn" @click="cancel(item)">下架</mu-button></div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="active === 1">
        <div class="bscroll" ref="bscroll">
          <ul class="content">
            <li class="list-item" v-for="item in buys" :key="item.id">
              <div class="title">
                <div>收购 XC</div>
                <div class="color-blue" v-if="item.status == 1">进行中</div>
                <div v-if="item.status == 2">已完成</div>
                <div v-if="item.status == 3">已取消</div>
              </div>
              <div class="info">
                <div class="info-item"><span>价格(CNY)</span><span>{{item.cny}}</span></div>
                <div class="info-item"><span>数量/剩余(个)</span><span>{{item.total_price}}/{{item.surplus}}</span></div>
                <div class="info-item"><span>发布时间</span><span>{{item.created | filterDate}}</span></div>
              </div>
              <div class="btn"><mu-button class="common-btn" @click="cancel(item)">下架</mu-button></div>
            </li>
          </ul>
        </div>
      </div>
    </mu-container>
    <!-- 下架 -->
    <mu-dialog class="common-dialog" title="" width="400" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      <div class="tit">确定下架？</div>
      <mu-button slot="actions" flat color="secondary" @click="closeDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import formatDate from '@/components/bin/date.js';
export default {
  name: 'Myorder',
  data () {
    return {
      active: 0,
      page:1,
      totalPage:1,
      page2:1,
      totalPage2:1,
      price: '',
      buys:[],
      sells:[],
      openAlert:false,
      item: {}, //操作的项
      scroll: {},
    }
  },
  created() {
    this.getSells(1);
    this.getBuys(1);
  }, 
  methods: {
    changeTab() {
      this.scroll.scrollTo(0,0);
    },
    creatBscroll(){
      const bscroll = document.querySelector('.bscroll');
      const scrollHeight = window.screen.height - bscroll.offsetTop;
      bscroll.style.height = scrollHeight + 'px';
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.bscroll,{
          click: true,
          pullUpLoad: {
            threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
          }
        });
        this.scroll.on('pullingUp', () => {
          console.log("上拉加载");
          if(this.active === 0){
            this.getSells(this.page2);
          }else if(this.active ===1){
            this.getBuys(this.page);
          }
          this.scroll.finishPullUp(); 
          this.scroll.refresh();
        })
      });
    },
    // 我发布的售卖
    getSells(page) {
      if(page <= this.totalPage2){
        const formData = {
          page:page,
        }
        this.$http.post("/transaction/vipsale_list", formData).then(response => {
          const res = response.data.data;
          this.sells = this.sells.concat(res.data);
          this.totalPage2 = res.last_page;
          // console.log(res);
          this.page2++;
          if(this.page2 == 2) {
            setTimeout(() => {
              this.creatBscroll();  
            }, 300);
          }
        })
      }
    },
    // 购买列表
    getBuys(page) {
      if(page <= this.totalPage){
        const formData = {
          page:page,
        }
        this.$http.post("/transaction/vipbuy_list", formData).then(response => {
          const res = response.data.data;
          this.buys = this.buys.concat(res.data);
          this.totalPage = res.last_page;
          // console.log(res)
          this.page++;
        })
      }
    },
    closeDialog() {
      this.openAlert = false;
    },
    // 取消
    cancel(item) {
      this.openAlert = true;
      this.item = item;
    },
    // 取消,下架
    submit() {
      const formData = {
        order_id: this.item.id,
      }
      this.$http.post("/transaction/lshelf", formData).then(response => {
        const res = response.data;
        if(res.status == "1") {
          this.openAlert = false;
          if(this.active === 0) {
            this.page = 1;
            this.totalPage = 1;
            this.sells = [];
            this.getSells(1);
          }else{
            this.page2 == 1;
            this.totalPage2 == 1;
            this.buys = [];
            this.getBuys(1);
          }
        }
        this.$toast.message(res.msg);
      })
    }
  },
  filters: {
    filterDate(time) {
      if(time){
        const date = new Date(time*1000);
        return formatDate(date, 'yyyy/MM/dd');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myorder{ background: #F5F7FA; width: 100%; height: 100%;}
.mu-tabs{ background: #fff; color: #7A7A7A;}
.mu-tab{ font-size: 15px; font-weight: bold;}
.myorder .content{ width: 100%; padding: 0 4%;}
.list-item{ display: flex; flex-direction: column; width: 100%; padding: 10px 0; color: #9FAACB; box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.06);
border-radius:5px; background: #FFFFFF; margin-top: 10px;}
.list-item>div{ display: flex; justify-content: space-between;}
.list-item .title{ font-size: 16px; color: #0F2748; padding: 0 4%;}
.list-item .info{ background: #F5F7FA; padding: 12px 3%; margin-top: 10px; font-size: 13px; line-height: 22px;}
.list-item .info-item{ display: flex; flex-direction: column; }
.color-blue{ color: #4071FF; font-size: 15px;}
.list-item .btn{ justify-content: flex-end; padding: 0 4%;}
.common-btn{ width: 80px; background: none; margin-top: 10px; border: solid 1px #EBEDF0; border-radius: 15px; color: #0F2748; box-shadow: none; height: 30px;}
.tit{ font-size: 18px; text-align: center;}
.bscroll{ width: 100%; overflow: hidden;}
</style>
