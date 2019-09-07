<template>
  <div class="coinage">
    <app-header title="自动喂养"></app-header>
    <router-link
      tag="div"
      class="coin-header"
      to="/FeedHelp"
    >喂养说明</router-link>
    <div
      class="bscroll"
      ref="bscroll"
    >
      <div>
        <div class="coinage-number">
          <div class="coin-item">
            <img :src="petImg" />
          </div>
          <div class="coin-item">
            <div class="item-img">
              <img src="../../../static/images/pet_icon3.png" />
            </div>
            <div class="item-right">
              <p class="item-num">初级</p>
              <p class="item-count">当前等级</p>
            </div>
          </div>
          <div class="coin-item">
            <div class="item-img">
              <img src="../../../static/images/pet_icon2.png" />
            </div>
            <div class="item-right">
              <p class="item-num">1032</p>
              <p class="item-count">喂养总量</p>
            </div>
          </div>
          <div class="coin-item">
            <div class="item-img">
              <img src="../../../static/images/pet_icon1.png" />
            </div>
            <div class="item-right">
              <p class="item-num">76</p>
              <p class="item-count">今日喂量</p>
            </div>
          </div>
        </div>
        <div class="coin-feed">
          <div class="select-left">
            <span class="coin-time">喂养币种</span>
            <mu-select
              v-model="select"
              style="border: 1px solid #21374F;border-radius: 5px;width: 97%;"
            >
              <mu-option
                v-for="(item,index) in coinInfo"
                :key="index"
                :label="index"
                :value="index"
              ></mu-option>
            </mu-select>
          </div>
          <div class="select-right">
            <span class="coin-time">间隔时间</span>
            <mu-text-field
              v-model="feedTime"
              placeholder="以小时为单位"
            ></mu-text-field>
          </div>

          <div style="clear:both"></div>
          <div class="feed-number">
            <div style="float: left;margin: 10px 0;">
              喂养数量
              <span style="color:#ECF0F3">(1BTC=2930喂食量)</span>
            </div>
            <div style="float: right;margin: 10px 0;">
              当前可用:
              <span style="color:#ECF0F3">1332.8900 BTC</span>
            </div>
            <mu-text-field
              v-model="feedNumber"
              placeholder="请输入"
            ></mu-text-field>
            <span class="all">全部</span>
            <div class="feed-count">合计:109934喂食量</div>
            <mu-button
              color="primary"
              @click="hanldEditFeed()"
            >保存</mu-button>
          </div>
        </div>
        <div class="coin-history">喂币历史</div>
        <mu-data-table
          style="background:#101D2B;"
          :columns="columns"
          :data="historyList"
        >
          <template slot-scope="scope">
            <td>{{scope.row.symbol}}</td>
            <td class="is-right">{{scope.row.cost}}</td>
            <td class="is-right">{{ Number(scope.row.amount).toFixed(2)}}</td>
            <td class="is-right">{{(scope.row.created_at).slice(5)}}</td>
          </template>
        </mu-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {
      petImg: localStorage.getItem("petImg"),
      historyList: [],
      page: 1,
      totalPage: 1,
      id: "",
      coinInfo: "", //币种
      pid: localStorage.getItem("petPid"), //用户养取宠物的id
      feedNumber: "", //喂养数量
      feedTime: "", //间隔时间
      select: "eth",
      columns: [
        {
          title: "币种",
          name: "calories",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "数量",
          name: "fat",
          width: 60,
          align: "center",
          sortable: true
        },
        {
          title: "币种单价",
          name: "carbs",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "时间",
          name: "protein",
          width: 140,
          align: "center",
          sortable: true
        }
      ],
      list: [
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        }
      ]
    };
  },
  created() {
    this.getFeedHistory(1);
  },
  mounted() {
    const item = this.$route.query;
    this.id = item.data.row.id;
    this.select = item.data.row.symbol;
    this.feedNumber = item.data.row.amount;
    this.feedTime = item.data.row.interval_time;
    console.log("先执行");
    console.log(this.$route.query);
    this.getCoinInfo();
  },
  methods: {
    createdBscroll() {
      let scroll = null;
      const bscroll = document.querySelector(".bscroll");
      const scrollHeight = window.screen.height - bscroll.offsetTop;
      bscroll.style.height = scrollHeight + "px";
      this.$nextTick(() => {
        scroll = new BScroll(this.$refs.bscroll, {
          click: true,
          pullUpLoad: {
            threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
          }
        });
        scroll.on("pullingUp", () => {
          console.log("上拉加载");
          this.getFeedHistory(this.page);
          scroll.finishPullUp();
          scroll.refresh();
        });
      });
    },
    //喂养历史记录
    getFeedHistory(page) {
      console.log(page);
      if (page <= this.totalPage) {
        const params = {
          page: page
        };
        console.log(params);
        this.$http
          .get("/api/v1/pet/feed/logs/" + this.pid, { params: params })
          .then(response => {
            const res = response.data;
            if (res.code === 200) {
              this.historyList = this.historyList.concat(
                response.data.data.data
              );
              this.totalPage = response.data.data.last_page;
              console.log(this.totalPage + "最后一页");
              console.log(this.historyList);
              if (this.page == 2) {
                setTimeout(() => {
                  this.createdBscroll(); //避免接口请求太慢导致bscroll不生效
                }, 1000);
              }
            }
          });
        this.page++;
      } else {
        this.$toast.message("没有更多了！");
      }
    },
    getCoinInfo() {
      this.$http.get("/api/v1/pet/feed/coins").then(response => {
        const res = response.data;
        if (res.code === 200) {
          this.coinInfo = res.data;
          console.log("请求成功" + this.coinInfo);
        } else {
          this.$toast.message(response.data.msg);
        }
      });
    },
    //编辑喂养
    hanldEditFeed() {
      const params = {
        symbol: this.select,
        amount: this.feedNumber,
        interval_time: this.feedTime,
        is_open: 1
      };
      this.$http
        .put("/api/v1/pet/feed/set/" + this.id, params)
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$router.push("/FeedAuto");
            console.log("添加成功");
          } else {
            this.$toast.message(response.data.msg);
          }
        });
    }
  }
};
</script>

<style  scoped>
.bscroll {
  height: 100%;
  position: relative;
  width: 100%;
  overflow: hidden;
}
.coinage >>> .mu-table-empty {
  color: #4b535c;
}
.coinage >>> .mu-table tr.is-hover {
  background-color: #162332;
}
.coinage {
  background-color: #101d2b;
  height: 100%;
  width: 100%;
}
.coin-header {
  position: fixed;
  right: 25px;
  top: 37px;
  color: #fff;
  z-index: 9999999;
  font-size: 13px;
}
/*iphone x*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .coin-header {
    top: 55px;
  }
}
.coinage-number {
  flex-direction: row;
  height: 80px;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: #ecf0f3;
  background-color: #0a141e;
}
.coin-item {
  width: 19%;
  height: 70px;
  margin: 0 10px;
  text-align: center;
}
.coin-item img {
  width: 100%;
  height: 100%;
}
.item-img {
  width: 20px;
  height: 25px;
  float: left;
  margin-top: 30px;
}
.item-img img {
  width: 100%;
  height: 100%;
}
.item-right {
  float: right;
  margin-top: 20px;
}
.item-num {
  font-size: 14px;
  color: #ecf0f3;
}
.item-count {
  color: #4b535c;
  font-size: 10px;
}
.coin-history {
  width: 100%;
  height: 30px;
  background-color: #0a141e;
  color: #4b535c;
  text-align: center;
  line-height: 30px;
}
.coinage >>> .mu-table th {
  color: #4b535c;
}
.coinage >>> .mu-table tr {
  color: #ecf0f3;
}
.coin-time {
  color: #818f9e;
  display: block;
  margin-bottom: 10px;
}
.coin-feed {
  margin: 0 20px;
  overflow: hidden;
  padding-top: 20px;
}
.coinage >>> .align-items-start {
  width: 100%;
}
.coinage >>> .mu-input-line {
  display: none;
}
.coinage >>> .mu-input-focus-line {
  display: none;
}
.select-left {
  float: left;
  width: 50%;
}
.select-right {
  float: right;
  width: 50%;
}
.feed-number {
  color: #818f9e;
  margin-bottom: 20px;
  position: relative;
}
.coinage >>> .mu-input {
  min-height: 40px;
  padding-bottom: 0;
  padding-top: 0;
}
.coinage >>> .mu-text-field-input {
  border: 1px solid #21374f;
  border-radius: 5px;
  height: 40px;
  color: #ecf0f3;
  padding: 0 10px;
  font-size: 14px;
}
.select {
  border: 1px solid rgb(33, 55, 79);
  border-radius: 5px;
  width: 95%;
  margin-left: 8px;
}

.coinage >>> svg:not(:root) {
  color: #21374f;
}
.coinage >>> .mu-select-input {
  color: #ecf0f3;
  padding: 0 10px;
  font-size: 14px;
}
.feed-count {
  text-align: center;
  color: #46b5f9;
  margin-bottom: 10px;
}
.all {
  position: absolute;
  top: 30%;
  right: 10px;
  color: #46b5f9;
}
.coinage >>> .mu-raised-button {
  box-shadow: none;
  height: 40px;
  width: 100%;
  background-color: #162332;
  color: #46b5f9;
}
</style>