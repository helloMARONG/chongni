<template>
  <div class="myCenter">
    <mu-load-more @refresh="refresh" :refreshing="refreshing">
      <div class="myCenter-top"></div>
      <div class="info">
        <div class="info-content">
          <div class="avatar">
            <img src="static/images/avatar.png" alt />
            <div>
              CGS/18856564848
              <br />
              <span>粉丝算力/粉丝</span>
            </div>
          </div>
          <div @click="LoginOut">
            <span class="icon iconfont">&#xe65c;</span>
          </div>
        </div>
      </div>
      <mu-list>
        <mu-list-item avatar button to="/Address">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe63c;</span>
          </mu-list-item-action>
          <mu-list-item-title>钱包地址</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button to="/login">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe697;</span>
          </mu-list-item-action>
          <mu-list-item-title>邀请好友</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button to="/Community">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe61e;</span>
          </mu-list-item-action>
          <mu-list-item-title>我的社区</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button to="/Safe">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe895;</span>
          </mu-list-item-action>
          <mu-list-item-title>安全中心</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button to="/ServiceCenter">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe7d5;</span>
          </mu-list-item-action>
          <mu-list-item-title>客服中心</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button @click="openVersionDialog">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe625;</span>
          </mu-list-item-action>
          <mu-list-item-title>版本更新</mu-list-item-title>
          <mu-list-item-action class="center">
            <span>{{version}}</span>
          </mu-list-item-action>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button @click="openWebview">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe625;</span>
          </mu-list-item-action>
          <mu-list-item-title>导航</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item avatar button to="/Tabs">
          <mu-list-item-action>
            <span class="icon iconfont color">&#xe625;</span>
          </mu-list-item-action>
          <mu-list-item-title>商城产品左右联动</mu-list-item-title>
          <mu-list-item-action>
            <span class="icon iconfont">&#xe695;</span>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <mu-dialog
        class="common-dialog"
        title
        width="400"
        max-width="80%"
        :esc-press-close="false"
        :overlay-close="false"
        :open.sync="showVersionDialog"
      >
        <div class="content">
          <div class="primaryColor">
            发现新版本:{{info.version}}
            <span>
              <br />
              (当前版本:{{version}})
            </span>
          </div>
        </div>
        <mu-button slot="actions" flat color="secondary">&nbsp;</mu-button>
        <mu-button slot="actions" flat color="primary" @click="update">更新</mu-button>
      </mu-dialog>
    </mu-load-more>
  </div>
</template>

<script>
let webview = null;
import formatDate from "../bin/date.js";
export default {
  name: "MyCenter",
  data() {
    return {
      info: {},
      user: {
        userName: ""
      },
      version: "1.0 ",
      showVersionDialog: false,
      refreshing: false
    };
  },
  created() {
    this.userName = localStorage.getItem("username");
    // this.getInfo();
  },
  methods: {
    // 判断版本是否需要更新
    getInfo() {
      this.$http.post("/api/Allurl/version").then(response => {
        this.info = response.data;
        console.log(response.data);
        if (parseFloat(this.info.version) > parseFloat(this.version)) {
          this.showVersionDialog = true;
        }
      });
    },
    //打开弹出
    openVersionDialog() {
      if (parseFloat(this.info.version) > parseFloat(this.version)) {
        this.showVersionDialog = true;
      } else {
        this.$toast.message("当前为最新版本！");
      }
    },
    //关闭弹出
    closeVersionDialog() {
      this.showVersionDialog = false;
    },
    //确认版本更新
    update() {
      this.showVersionDialog = false;
      let userAgent = navigator.userAgent.toLowerCase();
      let wgtWaiting = null; // 提示框
      if (/iphone|ipad|ipod/.test(userAgent)) {
        document.location.href = this.info.apk; //ios版fir下载地址
      } else if (/android/.test(userAgent)) {
        wgtWaiting = plus.nativeUI.showWaiting("开始下载");
        let dtask = plus.downloader.createDownload(this.info.apk1, {}, function(
          down,
          status
        ) {
          if (status == 200) {
            let path = down.filename; //下载apk
            wgtWaiting.setTitle("开始安装");
            plus.runtime.install(path); // 自动安装apk文件
          } else {
            plus.nativeUI.alert("版本更新失败:" + status);
            wgtWaiting.close();
          }
        });
        dtask.addEventListener("statechanged", function(download, status) {
          switch (download.state) {
            case 2:
              break;
            case 3:
              setTimeout(function() {
                let percent =
                  (download.downloadedSize / download.totalSize) * 100;
                wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
              }, 0);
              break;
            case 4:
              wgtWaiting.setTitle("下载完成");
              wgtWaiting.close();
              break;
          }
        });
        dtask.start();
      }
    },
    // 退出登陆
    LoginOut() {
      localStorage.clear();
      this.$router.push("/Index");
    },
    // 下拉刷新
    refresh() {
      this.refreshing = true;
      // this.getInfo();
      this.$store.dispatch("hideloader");
      document.querySelector(".loading").style.display = "none";
      setTimeout(() => {
        this.refreshing = false;
      }, 1500);
    },
    // 应用内打开新窗口
    // 28.1963000000,112.9765600000 // latitude纬度，浮点数，范围为90 ~ -90 // longitude经度，浮点数，范围为180 ~ -180
    openWebview() {
      webview = plus.webview.open(
        "https://uri.amap.com/marker?position=112.9765600000,28.1963000000&name=长沙五一广场",
        "导航",
        {
          titleNView: {
            backgroundColor: "#110B15",
            titleText: "导航",
            titleColor: "#FFFFFF",
            buttons: [
              { type: "close", float: "right", onclick: this.closeWebview }
            ]
          }
        },
        "slide-in-left"
      );
    },
    closeWebview() {
      webview.close();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myCenter {
  padding-top: 0;
  padding-bottom: 50px;
}
.myCenter {
  background: #f4f4f4;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: 0;
}
.myCenter-top {
  width: 100%;
  height: 156px;
  background: linear-gradient(90deg, rgba(59, 23, 67, 1), rgba(33, 26, 36, 1));
  box-shadow: 0px 2px 5px 0px rgba(12, 14, 7, 0.35);
}

.info {
  width: 92%;
  margin: 1% 4%;
  padding: 5% 2% 4% 2%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 10px 0px rgba(189, 182, 221, 0.35);
  border-radius: 10px;
  line-height: 28px;
  margin-bottom: 10px;
  margin-top: -80px;
}
.info-content {
  display: flex;
  justify-content: space-between;
  padding: 0 4%;
  align-items: center;
}
.info-content .avatar {
  display: flex;
  font-size: 15px;
  line-height: 20px;
  align-items: center;
}
.info-content .avatar img {
  width: 56px;
  height: 56px;
  margin-right: 12px;
}
.info-content .avatar span {
  font-size: 12px;
}
.info .nav {
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 18px 0 0 0;
  width: 100%;
}

.mu-list {
  width: 92%;
  margin: 0 4%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 10px 0px rgba(189, 182, 221, 0.35);
  border-radius: 10px;
}
.mu-list .mu-item-action {
  min-width: auto;
}
.mu-list .mu-item .color {
  color: #ae3ee5;
}
.mu-list .mu-item-title {
  font-size: 13px;
  padding-left: 6px;
  color: #2f2f2f;
  font-weight: 400;
}
.mu-list .mu-item .icon {
  font-size: 20px;
}
.mu-list {
  padding: 0 15px;
}
.mu-list li {
  height: 50px;
  border-bottom: solid 1px RGBA(212, 212, 212, 0.3);
}
.mu-item div:last-of-type .icon {
  font-size: 30px;
  color: RGBA(191, 191, 191, 0.7);
}
.no-border {
  border: 0 !important;
}
.mu-divider {
  height: 4px;
  background-color: RGBA(221, 221, 221, 0.3);
}
.mu-dialog-body {
  padding-bottom: 16px;
}
.primaryColor {
  color: #ae3ee5;
  font-size: 16px;
  text-align: center;
  margin-bottom: 16px;
}
.primaryColor span {
  font-size: 12px;
  color: #666;
}
.mu-dialog-body p {
  margin: 6px 0;
  display: flex;
  font-size: 12px;
}
.mu-dialog-body p span {
  padding: 0 6px;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
}
</style>
