<template>
  <div class="coinage">
    <app-header title="产币"></app-header>
    <router-link
      tag="div"
      class="coin-header"
      to="/CoinHelp"
    >产币说明</router-link>
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
              <p class="item-num">1%/天</p>
              <p class="item-count">产出比例</p>
            </div>
          </div>
        </div>
        <div class="coin-history">产币历史</div>
        <mu-data-table
          style="background:#101D2B;"
          :columns="columns"
          :data="historyList"
        >
          <template slot-scope="scope">
            <td>{{scope.row.symbol}}</td>
            <td class="is-right">{{scope.row.number}}</td>
            <td class="is-right">{{scope.row.price}}</td>
            <td class="is-right">{{scope.row.created_at.slice(5)}}</td>
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
      pid: localStorage.getItem("petPid"), //用户养取宠物的id
      historyList: [],
      page: 1,
      totalPage: 1,
      columns: [
        {
          title: "币种",
          name: "calories",
          width: 50,
          align: "center",
          sortable: true
        },
        {
          title: "数量",
          name: "fat",
          width: 100,
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
          width: 150,
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
  mounted() {
    this.getCoinHistory(1);
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
          this.getCoinHistory(this.page);
          scroll.finishPullUp();
          scroll.refresh();
        });
      });
    },
    //产币历史记录
    getCoinHistory(page) {
      if (page <= this.totalPage) {
        const params = {
          page: page
        };
        this.$http
          .get("/api/v1/pet/output/logs/" + this.pid, { params: params })
          .then(response => {
            const res = response.data;
            if (res.code === 200) {
              this.historyList = this.historyList.concat(
                response.data.data.data
              );
              this.totalPage = response.data.data.last_page;
              console.log(this.totalPage + "最后一页");
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
</style>