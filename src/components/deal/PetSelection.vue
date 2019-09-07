<template>
  <div class="pet">
    <app-header title="宠物"></app-header>
    <div class="wrapper">
      <mu-carousel
        :cycle="false"
        hide-indicators
        hide-controls
      >
        <mu-carousel-item>
          <div class="pet-wrapper">
            <div class="position-num">
              <div style="margin-top: 9%;
    font-size: 24px;"><span>{{name}}</span> <img
                  src="../../../static/images/man_icon.png"
                  style="width:30px"
                  v-if="this.sex==1"
                />
                <img
                  src="../../../static/images/woman_ion.png"
                  style="width:30px"
                  v-if="this.sex==0"
                />
              </div>
              <div>
              </div>
            </div>
            <div class="info-wrapper">
              <!-- <div class="pet-number">028</div>
              <div class="pet-name">穿山王</div>-->
              <marquee
                class="pet-info"
                direction="left"
                behavior="scroll"
              >{{sign}}</marquee>
            </div>
            <div class="pet-img">
              <img :src="petImg" />
            </div>
          </div>
        </mu-carousel-item>
      </mu-carousel>
    </div>
    <div class="coinage-number">
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
          <p class="item-num">0</p>
          <p class="item-count">邀请数量</p>
        </div>
      </div>
    </div>
    <div class="pet-option">
      <router-link
        tag="div"
        to="/Feed"
        class="option-item"
      >
        <div class="opitem-img">
          <img src="../../../static/images/icon1.png" />
        </div>
        <p>喂养</p>
      </router-link>
      <router-link
        tag="div"
        to="/Coinage"
        class="option-item"
      >
        <div class="opitem-img">
          <img src="../../../static/images/icon2.png" />
        </div>
        <p>产币</p>
      </router-link>
      <router-link
        tag="div"
        to="/chatRobot"
        class="option-item"
      >
        <div class="opitem-img">
          <img src="../../../static/images/icon3.png" />
        </div>
        <p>聊天</p>
      </router-link>
      <div
        class="option-item"
        @click="hanldTribalUrl"
      >
        <div class="opitem-img">
          <img src="../../../static/images/icon4.png" />
        </div>
        <p>部落</p>
      </div>
    </div>
    <!--查询加入部落弹框-->
    <div
      class="tribal-main"
      v-if="tribalAertInquire"
    >
      <div class="tribal-wrapper">
        <div class="tribal-header">
          <div class="tribal-img">
            <img src="../../../static/images/icon4.png" />
          </div>您还未加入部落
        </div>
        <mu-form
          :model="formJoin"
          class="mu-demo-form"
          label-width="100"
        >
          <mu-form-item
            prop="input"
            label="请输入部落账号"
          >
            <mu-text-field
              v-model.number="formJoin.team_id"
              type="number"
              style="font-size: 14px;color: #C2D8E0;"
            ></mu-text-field>
          </mu-form-item>
        </mu-form>
        <div
          class="tribal-buttom"
          style="margin-top:0"
        >
          <mu-button
            color="primary"
            style="width: 100%; background-color:#46B5F9;"
            @click="hanldJoinSubmit"
          >立即加入</mu-button>
        </div>
      </div>
    </div>

    <!--自动加入部落弹框-->
    <div
      class="tribal-main"
      v-if="tribalAertAuto"
    >
      <div class="tribal-wrapper">
        <div class="tribal-header">
          <div class="tribal-img">
            <img src="../../../static/images/icon4.png" />
          </div>您的邀请人：
          <span style="color:#141627">13893849898</span>
        </div>
        <div class="tribal-join">
          <p style="margin-top: 20px;color:#898A8F">已邀请您加入</p>
          <p style="font-size: 21px;color: #46B5F9;">部落名称</p>
        </div>
        <div class="tribal-buttom">
          <mu-button
            color="primary"
            style="width: 100%; background-color:#46B5F9;"
            @click="hanldAlertSubmit"
          >立即加入</mu-button>
        </div>
      </div>
    </div>
    <!--弹框遮罩-->
    <div
      class="tribal-mask"
      v-if="tribalMask"
      @click="tribalMaskMode"
    ></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Deal",
  data() {
    return {
      form: {
        input: "",
        radio: ""
      },
      formJoin: {
        team_id: "" //加入部落id
      },
      tribalMask: false,
      tribalAertInquire: false, //查询加入部落弹窗
      tribalAertAuto: false, //自动加入部落弹窗
      userPet: "",
      name: "", //宠物姓名
      sign: "", //宠物个性签名
      userPid: "", //宠物id
      petImg: null, // 宠物图片
      userTeam: "", //用户所属部落
      tlakImg: "",
      sex: "" //宠物性别
    };
  },
  mounted() {
    // const item = this.$route.query.item;
    // this.sex = item;
    // console.log(this.sex);
  },
  created() {
    this.getUserPet();
  },
  methods: {
    tribalMaskMode() {
      this.tribalMask = false;
      this.tribalAertInquire = false;
    },
    //部落路由跳转
    hanldTribalUrl() {
      this.getUserTeam();
    },
    hanldJoinSubmit() {
      const params = {
        team_id: this.formJoin.team_id
      };
      // 获取到所有参数时 ，调用接口 保存数据
      this.$http.post("/api/v1/pet/team/join", params).then(response => {
        let res = response.data;
        console.log(res);
        if (res.code === 200) {
          this.$toast.message(res.msg);
          this.$router.push("/Tribal");
        } else {
          this.$toast.message(res.msg);
        }
      });
    },
    //拉取用户宠物详情
    getUserPet() {
      this.$http.get("/api/v1/pet").then(response => {
        const res = response.data;
        console.log("用户" + res);
        if (res.code === 200) {
          this.userPet = res.data;
          if (!this.userPet) {
            this.$router.push("/deal");
          }
          this.name = res.data.name;
          this.sign = res.data.sign;
          this.sex = res.data.sex;
          // this.six = parseInt(res.data.sex);
          console.log(this.sex + "idddd");
          this.userPid = res.data.id;
          this.petImg = axios.defaults.baseURL + "/uploads/" + res.data.pet.pic;
          localStorage.setItem("petImg", this.petImg);
          localStorage.setItem("petPid", this.userPid);
          console.log("pid" + res.data.pid);
          this.getUserId(res.data.pid);
        } else {
          this.$toast.message(res.msg);
          console.log(this.userPet);
          if (!this.userPet) {
            this.$router.push("/deal");
          }
        }
      });
    },
    //拉取宠物图片
    getUserId(pid) {
      console.log("img" + pid);
      // return;
      this.$http.get("/api/v1/pets/" + pid).then(response => {
        const res = response.data;
        if (res.code === 200) {
          this.userImg = res.data.no;
          console.log("请求成功" + this.userImg);
        } else {
          this.$toast.message(response.data.msg);
        }
      });
    },
    //拉取用户所属部落信息
    getUserTeam() {
      const params = {
        uid: 0
      };
      this.$http.get("/api/v1/pet/u/" + params.uid + "/team").then(response => {
        const res = response.data;
        if (res.code === 200) {
          this.userTeam = res.data;
          if (this.userTeam) {
            this.$router.push("/Tribal");
          } else {
            // if (有推荐人) {
            // }
            this.tribalMask = true;
            this.tribalAertInquire = true;
          }
          console.log("请求成功" + this.userTeam);
        } else {
          this.$toast.message(response.data.msg);
          this.tribalMask = true;
          this.tribalAertInquire = true;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.router-view {
  position: initial;
}
.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-image: url("../../../static/images/no_pet_wrapper.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  position: absolute;
}
.position >>> .mu-carousel-button.mu-icon-button {
  top: 20% !important;
  background: blue !important;
}
.position-num {
  position: absolute;
  height: 100px;
  width: 100%;
  font-size: 14px;
}
.position-info {
  position: absolute;
  bottom: 10px;
  height: 100px;
  width: 100%;
}
.info {
  width: 200px;
  height: 40px;
  background: red;
  border-radius: 20px;
  margin: auto;
  line-height: 40px;
  color: #fff;
}
.pet >>> .mu-carousel {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.pet-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
}
.pet-img {
  width: 300px;
  height: 300px;
  margin: auto;
  border-radius: 50%;
}
.pet-img img {
  width: 100%;
  height: 100%;
}
.position-num p {
  color: #000;
  margin-top: 9%;
  font-size: 22.5px;
}

.info-wrapper {
  width: 100%;
  height: 120px;
}
.pet-number {
  margin-top: 32%;
  font-size: 25px;
  color: #b3eafe;
}
.pet-name {
  font-size: 30px;
  color: #fff;
  text-shadow: 0 0 3px #000, 2px 2px 7px #9be1ff, -2px -2px 7px #9be1ff;
}
.pet-info {
  margin-top: 20%;
  font-size: 14px;
  color: #fff;
  text-shadow: 0 0 3px #000, 2px 2px 7px #9be1ff, -2px -2px 7px #9be1ff;
  padding-right: 200px;
}
.opitem-img {
  width: 30px;
  margin: auto;
}
.option-img img {
  width: 100%;
  height: 100%;
}

/*iphone 6 plus*/
@media only screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) {
  .pet-img {
    margin-top: 6%;
  }
}
/*iphone x*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .pet >>> .mu-carousel-button.mu-icon-button {
    top: 15.5% !important;
  }
  .pet-option {
    bottom: 60px !important;
  }
}
@media only screen and (device-width: 411px) and (device-height: 731px) {
  .pet-img {
    margin-top: 6%;
  }
}
@media only screen and (device-width: 411px) and (device-height: 823px) {
  .pet-img {
    margin-top: 6%;
  }
}
/*iphone 5*/
@media only screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) {
  .pet-img {
    width: 200px;
    height: 200px;
  }
}

.pet >>> .mu-carousel-button.mu-icon-button {
  top: 18.8%;
}

.pet >>> svg:not(:root) {
  display: none;
}

.pet-option {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 49px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #ecf0f3;
  text-align: center;
  position: fixed;
  background: rgb(16, 29, 43);
}
.option-item {
  width: 20%;
  height: 60px;
  margin: 7px;
}
.option-item img {
  width: 100%;
  height: 100%;
}
/*选择宠物按钮*/
.selection-img {
  margin: 0 50px;
}
.selection-img img {
  width: 100%;
  height: 100%;
}
.selection-text {
  margin-top: -56px;
  display: block;
  font-size: 16px;
  color: #c7d7db;
  font-weight: bold;
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
  top: 120px;
  z-index: 999999999;
  margin: 0 40px;
}
.pet >>> .mu-form {
  padding: 0 20px;
  margin-top: 10px;
}

.tribal-wrapper {
  width: 300px;
  height: 300px;
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
  margin-top: -40px;
}
.pet >>> .mu-form-item-label {
  color: #898a8f;
}
.pet >>> .mu-text-field-input {
  color: #c2d8e0;
}
.pet >>> .mu-input-line {
  background-color: #d7ecf4;
}
.pet >>> .mu-table tr.is-hover {
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

.pet >>> .mu-radio-icon > svg:not(:root) {
  display: block;
}
.man_icon {
  width: 25px;
  height: 25px;
  margin-top: -60px;
}
.man_icon img {
  width: 100%;
  height: 100%;
}

/*等级*/
.coinage-number {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  height: 80px;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: #ecf0f3;
  position: absolute;
  top: 80%;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  /* background: #0b1623; */
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
  text-align: left;
}
.item-count {
  color: #999;
  font-size: 10px;
}
</style>
