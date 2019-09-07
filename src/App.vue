<template>
  <div id="app">
    <!-- 加载状态 -->
    <div
      v-show="showLoading"
      class="loading"
    >
      <mu-circular-progress :size="36"></mu-circular-progress>
    </div>
    <!-- router-view -->
    <transition :name="transitionName">
      <keep-alive>
        <router-view
          class="router-view"
          v-if="$route.meta.keepAlive"
        ></router-view>
      </keep-alive>
    </transition>
    <transition :name="transitionName">
      <router-view
        class="router-view"
        v-if="!$route.meta.keepAlive"
      ></router-view>
    </transition>
    <!-- 公共底部 -->
    <mu-container v-if="isBottom">
      <mu-bottom-nav>
        <router-link
          to="/Index"
          class="mu-bottom-item"
        ><i class="icon iconfont">&#xe61a;</i>
          <span class="mu-bottom-item-text">首页</span>
        </router-link>
        <router-link
          to="/Property"
          class="mu-bottom-item"
        >
          <i class="icon iconfont">&#xe722;</i>
          <span class="mu-bottom-item-text">钱包</span>
        </router-link>
        <router-link
          to="/PetSelection"
          class="mu-bottom-item"
        >
          <i class="icon iconfont">&#xe678;</i>
          <span class="mu-bottom-item-text">宠物</span>
        </router-link>
        <router-link
          to="/Malls"
          class="mu-bottom-item"
        >
          <i class="icon iconfont">&#xe602;</i>
          <span class="mu-bottom-item-text">商城</span>
        </router-link>
        <router-link
          to="/MyCenter"
          class="mu-bottom-item"
        >
          <i class="icon iconfont">&#xe64f;</i>
          <span class="mu-bottom-item-text">我的</span>
        </router-link>
      </mu-bottom-nav>
    </mu-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      paddingRight: "",
      transitionName: ""
    };
  },
  computed: {
    showLoading() {
      return this.$store.state.showLoading;
    },
    isBottom() {
      return (
        this.$route.path === "/Index" ||
        this.$route.path === "/Property" ||
        this.$route.path === "/MyCenter" ||
        this.$route.path === "/Malls" ||
        this.$route.path === "/PetSelection"
      );
    }
  },
  watch: {
    $route(to, from) {
      const arr = [
        "/Index",
        "/Property",
        "/MyCenter",
        "/PetSelection",
        "/Malls"
      ];
      // console.log(from.path, to.path);
      if (!(arr.indexOf(from.path) != -1 && arr.indexOf(to.path) != -1)) {
        if (arr.indexOf(to.path) != -1) {
          this.transitionName = "slide-right";
        } else {
          this.transitionName = "slide-left";
        }
      } else {
        this.transitionName = "";
      }
    }
  },
  mounted() {
    this.paddingRight = window.screen.width / 3;
  },
  methods: {
    routerBack() {
      if (this.$route.path == "/Login") {
        this.$router.push("/Index");
      } else {
        this.$router.back();
      }
    }
  }
};
</script>

<style>
/* 路由切换动画 */
.router-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding-top: 65px;
  transition: all 0.2s ease;
}
/* iphoneX、iphoneXs */
@media only screen and (device-width: 375px) and (device-height: 812px) {
  .router-view {
    padding-top: 85px;
  }
}
/* iphone Xs Max */
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .router-view {
    padding-top: 85px;
  }
}
/* iphone XR */
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .router-view {
    padding-top: 85px;
  }
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}
.loading {
  position: fixed;
  top: 38%;
  left: 50%;
  margin-left: -30px;
  z-index: 999999;
  width: 60px;
  background: rgba(0, 0, 0, 0.3);
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}
.coinage >>> .mu-table tr.is-hover {
  background-color: #162332;
}
.mu-snackbar {
  z-index: 99999999999999999 !important;
}
</style>
