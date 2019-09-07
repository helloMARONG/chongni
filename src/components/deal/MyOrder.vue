<template>
  <div class="myorder">
    <app-header title="交易订单"></app-header>
    <mu-container>
      <mu-tabs :value.sync="active" full-width>
        <mu-tab>购买订单</mu-tab>
        <mu-tab>出售订单</mu-tab>
      </mu-tabs>
      <div v-if="active === 0">
        <div class="bscroll" ref="bscroll">
          <ul class="content">
            <li class="list-item" v-for="item in buys" :key="item.id">
              <router-link :to="{path:'/MyOrderDetailsBuy', query:{id: item.id}}">
                <div class="title">
                  <div>购买 XC</div>
                  <div class="color-blue" v-if="item.status == 1">待付款</div>
                  <div class="color-blue" v-if="item.status == 2">待放行</div>
                  <div v-if="item.status == 3">申诉中</div>
                  <div v-if="item.status == 4">已完成</div>
                  <div v-if="item.status == 5">已取消</div>
                </div>
                <div class="info">
                  <div class="info-item">
                    <span>价格(CNY)</span>
                    <span>{{item.price_xc}}</span>
                  </div>
                  <div class="info-item">
                    <span>数量(个)</span>
                    <span>{{item.num}}</span>
                  </div>
                  <div class="info-item">
                    <span>交易时间</span>
                    <span>{{item.created | filterDate}}</span>
                  </div>
                </div>
                <div class="phone">{{item.mobile | filterPhone}}</div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="active === 1">
        <div class="bscroll" ref="bscroll">
          <ul class="content">
            <li class="list-item" v-for="item in sells" :key="item.id">
              <router-link :to="{path:'/MyOrderDetailsSell', query:{id: item.id}}">
                <div class="title">
                  <div>出售 XC</div>
                  <div class="color-blue" v-if="item.status == 1">待付款</div>
                  <div class="color-blue" v-if="item.status == 2">待放行</div>
                  <div v-if="item.status == 3">申诉中</div>
                  <div v-if="item.status == 4">已完成</div>
                  <div v-if="item.status == 5">已取消</div>
                </div>
                <div class="info">
                  <div class="info-item">
                    <span>价格(CNY)</span>
                    <span>{{item.price_xc}}</span>
                  </div>
                  <div class="info-item">
                    <span>数量(个)</span>
                    <span>{{item.num}}</span>
                  </div>
                  <div class="info-item">
                    <span>交易时间</span>
                    <span>{{item.created | filterDate}}</span>
                  </div>
                </div>
                <div class="phone">{{item.mobile | filterPhone}}</div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </mu-container>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import formatDate from "@/components/bin/date.js";
export default {
  name: "Myorder",
  data() {
    return {
      petId: localStorage.getItem("petPid"),
      active: 0,
      page: 1,
      totalPage: 1,
      page2: 1,
      totalPage2: 1,
      price: "",
      buys: [],
      sells: [],
      scroll: {}
    };
  },
  created() {
    this.getBuys(1);
    this.getSells(1);
  },
  methods: {
    changeTab() {
      this.scroll.scrollTo(0, 0);
    },
    creatBscroll() {
      const bscroll = document.querySelector(".bscroll");
      const scrollHeight = window.screen.height - bscroll.offsetTop;
      bscroll.style.height = scrollHeight + "px";
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.bscroll, {
          click: true,
          pullUpLoad: {
            threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
          }
        });
        this.scroll.on("pullingUp", () => {
          console.log("上拉加载");
          if (this.active === 0) {
            this.getBuys(this.page);
          } else if (this.active === 1) {
            this.getSells(this.page2);
          }
          this.scroll.finishPullUp();
          this.scroll.refresh();
        });
      });
    },
    // 购买列表
    getBuys(page) {
      if (page <= this.totalPage) {
        const formData = {
          type: "2",
          page: page
        };
        this.$http
          .get("/api/v1/pet/feed/logs/" + this.petId, formData)
          .then(response => {
            const res = response.data;
            if (res.code === 200) {
              this.buys = this.buys.concat(res.data);
              this.totalPage = res.last_page;
              console.log(this.buys.concat(res.data));
              console.log(res);
              this.page++;
              if (this.page2 == 2) {
                setTimeout(() => {
                  this.creatBscroll();
                }, 300);
              }
            }
          });
      } else {
        this.$toast.message("没有更多了！");
      }
    },
    // 出售列表
    getSells(page) {
      if (page <= this.totalPage2) {
        const formData = {
          type: "1",
          page: page
        };
        this.$http.post("/transaction/trans_list", formData).then(response => {
          const res = response.data.data;
          this.sells = this.sells.concat(res.data);
          this.totalPage2 = res.last_page;
          //console.log(res);
          this.page2++;
        });
      } else {
        this.$toast.message("没有更多了！");
      }
    }
  },
  filters: {
    filterDate(time) {
      if (time) {
        const date = new Date(time * 1000);
        return formatDate(date, "yyyy/MM/dd");
      }
    },
    filterPhone(phone) {
      if (phone) {
        return phone.substr(0, 3) + "****" + phone.substr(7);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myorder {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f5f7fa;
}
.mu-tabs {
  background: #fff;
  color: #7a7a7a;
}
.mu-tab {
  font-size: 15px;
  font-weight: bold;
}
.myorder .content {
  width: 100%;
  padding: 0 4%;
}
.list-item {
  margin-top: 10px;
}
.list-item a {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
  color: #9faacb;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  background: #ffffff;
}
.list-item a > div {
  display: flex;
  justify-content: space-between;
}
.list-item .title {
  font-size: 16px;
  color: #0f2748;
  padding: 0 4%;
}
.list-item .info {
  background: #f5f7fa;
  padding: 12px 3%;
  margin-top: 10px;
  font-size: 13px;
  line-height: 22px;
}
.list-item .info-item {
  display: flex;
  flex-direction: column;
}
.list-item .phone {
  font-size: 14px;
  padding: 0 4%;
  color: #0f2748;
  margin-top: 10px;
}
.color-blue {
  color: #4071ff;
  font-size: 15px;
}

.bscroll {
  width: 100%;
  overflow: hidden;
}
</style>
