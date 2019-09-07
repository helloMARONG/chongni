<template>
  <div class="coinage">
    <app-header :title="teamName"></app-header>
    <div
      class="coin-header"
      @click="hanldAlertStatus"
      v-if="this.master_id==this.user_id"
    >领主设置</div>
    <div
      class="bscroll"
      ref="bscroll"
    >
      <div>
        <div class="coinage-number">
          <div class="coin-item">
            <img src="../../../static/images/icon4.png" />
          </div>
          <div class="coin-item">
            <div class="item-right">
              <p class="item-num">3</p>
              <p class="item-count">当前排名</p>
            </div>
          </div>
          <div class="coin-item">
            <div class="item-right">
              <p class="item-num">{{memberCount}}</p>
              <p class="item-count">成员总数</p>
            </div>
          </div>
          <div class="coin-item">
            <div
              class="item-right"
              v-if="this.ratio!==0"
            >
              <p class="item-num">{{ratio}}%</p>
              <p class="item-count">基金分成</p>
            </div>
          </div>
        </div>
        <div class="coin-history">成员明细</div>
        <mu-data-table
          style="background:#101D2B;"
          :columns="columns"
          :data="userTeamList"
          @row-click="hanldListTribl"
        >
          <template slot-scope="scope">
            <td :style="{color:getUserId == scope.row.id?'red':'#ecf0f3'}">{{scope.row.index}}</td>
            <td
              class="is-right"
              :style="{color:getUserId == scope.row.id?'red':'#ecf0f3'}"
            >{{scope.row.user_pet.number}}</td>
            <td
              class="is-right"
              :style="{color:getUserId == scope.row.id?'red':'#ecf0f3'}"
            >{{scope.row.user_pet.level}}</td>
            <td
              class="is-right"
              :style="{color:getUserId == scope.row.id?'red':'#ecf0f3'}"
            >{{scope.row.created.slice(5)}}</td>
          </template>
        </mu-data-table>
      </div>
    </div>
    <!--领主设置弹窗-->
    <div
      class="tribal-mask"
      v-if="tribalMask"
      @click="tribalMaskMode"
    ></div>
    <div
      class="tribal-main"
      v-if="tribalAert"
    >
      <div class="tribal-wrapper">
        <div class="tribal-title">领主设置</div>
        <mu-form
          :model="form"
          class="mu-demo-form"
          label-width="100"
        >
          <mu-form-item
            prop="input"
            label="部落名称"
          >
            <mu-text-field
              v-model="form.teamName"
              placeholder="给您的部落取个爱称吧～"
              style="font-size: 14px;color: #C2D8E0;"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            prop="input"
            label="基金分成(%)"
          >
            <mu-text-field
              v-model="form.ratio"
              style="font-size: 14px;color: #C2D8E0;"
            ></mu-text-field>
          </mu-form-item>
        </mu-form>
        <div class="tribal-buttom">
          <mu-button
            color="primary"
            style="width: 100%; background-color:#46B5F9;"
            @click="hanldFundSubmit"
          >确认保存</mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {
      master_id: 0,
      user_id: -1,
      page: 1,
      totalPage: 1,
      userTeamList: [], //部落成员列表
      memberCount: "", //成员总数
      teamName: "", //部落名称
      //userTeamList: [], //成员
      userTeam: "", //拉取用户所属部落信息
      ratio: "", //基金
      tribalMask: false, //领主设置遮罩
      tribalAert: false, //领主设置弹框
      form: {
        teamName: "", //部落名称
        ratio: "" //基金分成
      },
      columns: [
        {
          title: "名次",
          name: "calories",
          width: 90,
          align: "center",
          sortable: true
        },
        {
          title: "推荐人数",
          name: "fat",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "等级",
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
          name: "1",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "2",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "3",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        },
        {
          name: "4",
          calories: 1.339,
          fat: 59786,
          carbs: "09-10 18:09:48"
        }
      ]
    };
  },
  mounted() {
    this.getUserTeam();
    this.getUserTeamList(1);
    const bscroll = document.querySelector(".bscroll");
    const scrollHeight = window.screen.height - bscroll.offsetTop;
    document.querySelector(".bscroll").style.height = scrollHeight + "px";
    this.$nextTick(() => {
      let scroll = new BScroll(this.$refs.bscroll, {
        click: true,
        pullUpLoad: {
          threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
        }
      });
      scroll.on("pullingUp", () => {
        // console.log("上拉加载");
        this.getUserTeamList();
        scroll.finishPullUp();
        scroll.refresh();
      });
    });
  },
  computed: {
    getUserId() {
      return this.user_id;
    }
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
          this.getUserTeamList(this.page);
          scroll.finishPullUp();
          scroll.refresh();
        });
      });
    },
    hanldAlertStatus() {
      this.tribalAert = true;
      this.tribalMask = true;
    },
    hanldAlertSubmit() {
      this.tribalAert = false;
      this.tribalMask = false;
    },
    tribalMaskMode() {
      this.tribalAert = false;
      this.tribalMask = false;
    },
    hanldListTribl(row) {
      this.$router.push({
        path: "/TribalMember",
        query: this.userTeamList[row]
      });
      console.log("data:" + row);
    },
    //拉取用户所属部落信息
    getUserTeam() {
      const params = {
        uid: 0
      };
      this.$http.get("/api/v1/pet/u/" + params.uid + "/team").then(response => {
        const res = response.data;
        if (res.code === 200) {
          this.master_id = res.data.master_id;
          this.user_id = res.data.user_team.user_id;
          this.userTeam = res.data;
          this.teamName = res.data.name;
          this.memberCount = res.data.count;
          this.ratio = res.data.ratio;
        } else {
          this.$toast.message(response.data.msg);
        }
      });
    },
    //领主设置
    hanldFundSubmit() {
      const params = {
        name: this.form.teamName,
        ratio: this.form.ratio
      };
      this.$http
        .put("/api/v1/pet/team/" + this.userTeam.id, params)
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.tribalMask = false; //领主设置遮罩
            this.tribalAert = false; //领主设置弹框
            this.$toast.message("设置成功");
            this.getUserTeam();
          } else {
            this.$toast.message(response.data.msg);
          }
        });
    },
    //拉取用户所属部落成员列表
    getUserTeamList(page) {
      if (page <= this.totalPage) {
        const params = {
          page: page
        };
        this.$http
          .get("/api/v1/pet/team/users", { params: params })
          .then(response => {
            if (response.data.code === 200) {
              this.userTeamList = this.userTeamList.concat(
                response.data.data.data
              );
              for (var n = 0; n < this.userTeamList.length; n++) {
                this.userTeamList[n].index = n + 1;
              }
              this.totalPage = response.data.data.last_page;
              console.log(this.totalPage + "最后一页");
              console.log(this.userTeamList);
              if (this.page == 2) {
                setTimeout(() => {
                  this.createdBscroll(); //避免接口请求太慢导致bscroll不生效
                }, 300);
              }
            } else {
              this.$toast.message("没有更多了！");
            }
          });
        this.page++;
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
/*iphone 6/7*/
@media only screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) {
  .tribal-main {
    top: -450px !important;
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
  height: 60px;
  margin: 5px 10px;
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

.coinage >>> .mu-table td,
.mu-table td.is-left {
  text-align: center;
}
/*弹窗样式*/
.tribal-mask {
  z-index: 9999999;
  top: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.7);
}
.tribal-main {
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
  top: -450px;
  z-index: 999999999;
  margin: 0 40px;
}
.coinage >>> .mu-form {
  padding: 0 20px;
  margin-top: 10px;
}

.tribal-wrapper {
  width: 300px;
  height: 280px;
  background: rgba(244, 252, 255, 1);
  border-radius: 5px;
}
.tribal-title {
  height: 45px;
  background: rgba(230, 248, 255, 1);
  border-radius: 5px 5px 0 0px;
  text-align: center;
  font-size: 15px;
  line-height: 45px;
}
.tribal-buttom {
  padding: 0 20px;
  margin-top: -6px;
}
.coinage >>> .mu-form-item-label {
  color: #898a8f;
}
.coinage >>> .mu-text-field-input {
  color: #c2d8e0;
}
.coinage >>> .mu-input-line {
  background-color: #d7ecf4;
}
.coinage >>> .mu-table tr.is-hover {
  background-color: #162332;
}
.tribal-header {
  height: 100px;
  text-align: center;
  padding-top: 20px;
  color: #898a8f;
}
.tribal-img {
  height: 60px;
  width: 70px;
  margin: 0 auto;
}
.tribal-img img {
  width: 100%;
  height: 100%;
}

.tribal-join {
  text-align: center;
  height: 80px;
}
</style>