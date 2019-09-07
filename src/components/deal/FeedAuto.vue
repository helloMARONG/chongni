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
          <mu-data-table
            style="background:#101D2B;"
            :columns="columnsAuto"
            :data="feedList"
          >
            <template slot-scope="scope">
              <td>{{scope.row.symbol}}</td>
              <td class="is-right">{{ Number(scope.row.amount).toFixed(2)}}</td>
              <td class="is-right">{{scope.row.interval_time}}</td>
              <td class="is-right">{{scope.row.created_at.slice(5)}}</td>
              <td class="is-right">
                <span
                  style="color:#46B5F9"
                  @click="hanldFeedAuto(scope)"
                >编辑</span>
              </td>
            </template>
          </mu-data-table>
          <div class="fauto-buttom">
            <mu-button
              color="primary"
              to="/FeesSettinAuto"
            >新增喂食时间</mu-button>
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
      historyList: [], //喂养历史
      page: 1,
      feedList: [], //喂养列表
      petId: localStorage.getItem("petPid"),
      totalPage: 1,
      columnsAuto: [
        {
          title: "币种",
          name: "calories",
          width: 10,
          align: "center",
          sortable: true
        },
        {
          title: "数量",
          name: "fat",
          width: 50,
          align: "center",
          sortable: true
        },
        {
          title: "间隔/小时",
          name: "carbs",
          width: 10,
          align: "center",
          sortable: true
        },
        {
          title: "时间",
          name: "protein",
          width: 80,
          align: "center",
          sortable: true
        },
        {
          title: "",
          name: "protein",
          width: 20,
          align: "center",
          sortable: true
        }
      ],
      listAuto: [
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "18:09:48"
        },
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "18:09:48"
        },
        {
          name: "BTC",
          calories: 1.339,
          fat: 59786,
          carbs: "18:09:48"
        }
      ],
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
          title: "喂食量",
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
        }
      ]
    };
  },
  created() {
    this.getFeedHistory(1);
  },
  mounted() {
    this.getFeedList();
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
      if (page <= this.totalPage) {
        const params = {
          page: page
        };
        this.$http
          .get("/api/v1/pet/feed/logs/" + this.petId, { params: params })
          .then(response => {
            const res = response.data;
            if (res.code === 200) {
              this.historyList = this.historyList.concat(
                response.data.data.data
              );
              // for (let i = 0; i < 20; i++) {
              //   this.historyList = this.historyList.concat({
              //     amount: "0.00100000",
              //     cost: "0.17",
              //     created_at: "2019-08-29 15:33:09",

              //     pid: 1,
              //     price: "167.79000000",
              //     symbol: "eth",
              //     user_id: 1
              //   });
              // }
              console.log(this.historyList + "arr");
              this.totalPage = response.data.data.last_page;
              console.log(this.totalPage + "最后一页");
              console.log(this.historyList);
              if (this.page == 2) {
                setTimeout(() => {
                  this.createdBscroll(); //避免接口请求太慢导致bscroll不生效
                }, 300);
              }
            }
          });
        this.page++;
      } else {
        this.$toast.message("没有更多了！");
      }
    },
    //拉取喂养
    getFeedList() {
      this.$http.get("/api/v1/pet/feed/set/" + this.petId).then(response => {
        const res = response.data;
        if (res.code === 200) {
          this.feedList = res.data;
          console.log("请求列表成功" + this.feedList);
        } else {
          this.$toast.message(response.data.msg);
        }
      });
    },
    hanldFeedAuto(data) {
      this.$router.push({
        path: "/FeedEdit",
        query: {
          data
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
  background-color: rgb(16, 29, 43);
  overflow: hidden;
  padding: 0px 0 20px 0;
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
.fauto-buttom {
  margin: 0 20px;
}

.coinage >>> .mu-table th {
  padding-left: 0;
}
</style>