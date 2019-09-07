<template>
  <div class="community">
    <app-header title="我的团队"></app-header>
    <ul class="account account-title">
      <li><span>我的会员</span><span>昵称</span><span>注册时间</span><span>级别</span></li>
    </ul>
    <div
      class="bscroll"
      ref="bscroll"
    >
      <ul class="account">
        <li
          v-for="(item,index) in info"
          :key="index"
        >
          <span>{{item.amount}}</span>
          <span>{{item.cost}}</span>
          <span>{{item.symbol}}</span>
          <span>{{item.id}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Community",
  data() {
    return {
      pid: localStorage.getItem("petPid"), //用户养取宠物的id
      info: [],
      totalMoney: "",
      page: 1,
      totalPage: 1,
      total: ""
    };
  },
  props: ["id"],
  created() {
    this.getInfo(1);
  },
  mounted() {
    const bscroll = document.querySelector(".bscroll");
    const scrollHeight = window.screen.height - bscroll.offsetTop;
    bscroll.style.height = scrollHeight + "px";
    this.$nextTick(() => {
      let scroll = new BScroll(this.$refs.bscroll, {
        click: true,
        pullUpLoad: {
          threshold: 30 // 当上拉距离超过30px时触发 pullingUp 事件
        }
      });
      scroll.on("pullingUp", () => {
        console.log("上拉加载");
        this.getInfo(this.page);
        scroll.finishPullUp();
        scroll.refresh();
      });
    });
  },
  methods: {
    // 我的分享
    getInfo(page) {
      if (page <= this.totalPage) {
        const formData = {
          page: page
        };
        this.$http
          .get("/api/v1/pet/feed/logs/" + this.pid, formData)
          .then(response => {
            const res = response.data;
            console.log(res);
            this.total = res.myteamteam;
            this.info = this.info.concat(res.data.data);
            this.totalPage = res.last_page;
            this.page++;
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bscroll {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.account-top {
  width: 100%;
  padding: 10px 0;
  background: #f7f7f7;
  font-size: 14px;
  color: #fff;
  color: #585858;
  line-height: 28px;
  text-align: center;
}
.account-top strong {
  color: #ff8700;
}
.account {
  width: 100%;
  padding: 0 0 0 0;
  color: #585858;
}
.account li {
  width: 100%;
  padding: 0 4%;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #f3f3f3;
}
.account li:nth-of-type(2n + 1) {
  background-color: #f3f3f3;
}
.account li span {
  width: 30%;
  text-align: center;
}
.account-title li span {
  font-size: 13px;
}
.account-title li {
  background-color: #ffffff !important;
}
</style>
