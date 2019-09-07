<template>
  <div class="pet">
    <div class="wrapper">
      <mu-carousel
        :cycle="false"
        hide-indicators
      >
        <mu-carousel-item
          v-for="item in optionalDetails"
          :key="item.id"
        >
          <div class="pet-wrapper">
            <div class="position-num">
              <p>{{item.name}}</p>
            </div>
            <div class="info-wrapper">
              <div class="pet-number">{{item.no}}</div>
              <!-- <div class="pet-name">aa</div>
              <div class="pet-info">阿罗拉的样子</div>-->
            </div>
            <div class="pet-img">
              <img :src="item.pic" />
            </div>
            <!--选择宠物按钮-->
            <div class="pet-option">
              <div class="selection-img">
                <!-- <img src="../../../static/images/pet-buttom.png" /> -->
                <span
                  class="selection-text"
                  @click="hanldPetButton(item)"
                >选择此宠物</span>
              </div>
            </div>
          </div>
        </mu-carousel-item>
      </mu-carousel>
    </div>

    <!--设置宠物弹框-->
    <div
      class="tribal-main"
      v-if="PetAlart"
    >
      <div class="tribal-wrapper">
        <div class="tribal-title">设置新宠物</div>
        <mu-form
          class="mu-demo-form"
          label-width="100"
          ref="form"
          :model="validateForm"
        >
          <mu-form-item
            label="宠物名称"
            style="margin-bottom: 0px;"
            prop="name"
            :rules="usernameRules"
          >
            <mu-text-field
              v-model="validateForm.name"
              placeholder="给您的爱宠取个爱称吧～"
              style="font-size: 14px;color: #C2D8E0;"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            style="margin-bottom: 0px;"
            label="个性签名"
            prop="sign"
            :rules="userSignRules"
          >
            <mu-text-field
              v-model="validateForm.sign"
              style="font-size: 14px;color: #C2D8E0;"
              placeholder="没有个性，怎么签名"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            prop="radio"
            label="宠物性别"
          >
            <mu-radio
              v-model="validateForm.sex"
              value="1"
              style="margin-top: -60px; padding-left: 70px;margin-right:0"
            ></mu-radio>
            <span class="man_icon">
              <img src="../../../static/images/man_icon.png" />
            </span>
            <mu-radio
              v-model="validateForm.sex"
              value="0"
              style="margin-top: -60px;padding-left: 20px;margin-right:0"
            ></mu-radio>
            <span class="man_icon">
              <img src="../../../static/images/woman_ion.png" />
            </span>
          </mu-form-item>
        </mu-form>
        <div class="tribal-buttom">
          <mu-button
            color="primary"
            style="width: 100%; background-color:#46B5F9;"
            @click="hanldAlertNewPet()"
          >确认保存</mu-button>
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
import { constants } from "fs";
export default {
  name: "Deal",
  data() {
    return {
      usernameRules: [{ validate: val => !!val, message: "必须填写宠物姓名" }],
      userSignRules: [{ validate: val => !!val, message: "必须填写个性签名" }],
      validateForm: {
        name: "", //设置宠物姓名
        sign: "", //设置宠物个性签名
        sex: Number //设置宠物性别
      },
      tribalMask: false, //遮罩
      PetAlart: false, //选择宠物弹窗
      optionalDetails: [], //可选宠物详情
      optionalPic: "", //可选宠物详情图片
      optionalDetailsID: "", //可选宠物详情ID
      after_pid: 0, //分页PID, 以PID值后的数据起始数据
      order_by: "asc", //倒序
      page: 0,
      pageCount: 0, //总页数
      limit: 200, // 每次请求的数据行数
      index: 0 // 当前index
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getOptionalPet(1);
  },
  methods: {
    //点击遮罩 弹窗关闭
    tribalMaskMode() {
      this.tribalMask = false;
      this.PetAlart = false;
    },
    //选择宠物按钮
    hanldPetButton(item) {
      this.optionalDetailsID = item.id;
      console.log("已选id" + this.optionalDetailsID);
      this.tribalMask = true;
      this.PetAlart = true;
    },
    //拉取可选宠物详情
    getOptionalPet(n) {
      const params = {
        order_by: this.order_by,
        after_pid: this.after_pid,
        limit: this.limit
      };
      this.$http.get("/api/v1/pets", { params: params }).then(response => {
        const res = response.data;
        if (res.code === 200) {
          if (res.data.length === 0) {
            console.log("无数据");
            return;
          }
          let data = res.data;
          for (let i in data) {
            data[i].pic = axios.defaults.baseURL + "/uploads/" + data[i].pic;
          }
          this.optionalDetails = this.optionalDetails.concat(data);
          console.log(this.optionalDetails);
          this.after_pid = res.data[res.data.length - 1]["id"];
          // console.log("after_pid=" + this.after_pid);
          this.pageCount += res.data.length;
          // 需要预加载
          if (n) {
            this.getOptionalPet(0);
          } else {
            console.log("start...");
            for (let i = 0; i < this.optionalDetails.length; i++) {
              console.log(this.optionalDetails[i]["id"]);
            }
          }
          console.log(this.optionalDetails);
        } else {
          this.$toast.message(res.msg);
        }
      });
    },
    hanldAlertNewPet() {
      this.$refs.form.validate().then(result => {
        if (result) {
          const params = {
            pid: this.optionalDetailsID,
            name: this.validateForm.name,
            sign: this.validateForm.sign,
            sex: this.validateForm.sex
          };
          // 获取到所有参数时 ，调用接口 保存数据
          this.$http.post("/api/v1/pet", params).then(response => {
            let res = response.data;
            console.log(res);
            if (res.code === 200) {
              this.$toast.message("选择成功");
            } else {
              this.$toast.message(res.msg);
            }
            this.$router.push({
              path: "/PetSelection",
              query: { item: this.validateForm.sex }
            });
          });
        }
      });
    }
    // petcChange(index) {
    //   if (index - this.index > 5) {
    //     console.log("倒序翻页");

    //     this.optionalDetails = [];
    //     this.order_by = "desc";
    //     this.after_pid = 0;

    //     this.getOptionalPet(0);
    //   } else if (this.page == this.pageCount) {
    //     this.page = 0;
    //   } else {
    //     this.index++;
    //   }
    //   this.page++;
    //   console.log("thisPage = " + this.page + " pageCount=" + this.pageCount);

    //   if (this.page == this.pageCount - this.limit) {
    //     console.log("触发请求数据");
    //     this.getOptionalPet(0);
    //   }
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pet {
  padding-top: 0;
}
.router-view {
  position: initial;
}
.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-image: url("../../../static/images/pet_wrapper.png");
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
  height: 80px;
  margin-top: 32%;
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
  font-size: 22px;
  color: #fff;
  text-shadow: 0 0 3px #000, 2px 2px 7px #9be1ff, -2px -2px 7px #9be1ff;
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
  flex-direction: row;
  height: 80px;
  width: 100%;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: center;
  color: #ecf0f3;
  text-align: center;
}
.option-item {
  width: 20%;
  height: 60px;
  margin: 0 15px;
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
  display: block;
  font-size: 16px;
  color: #c7d7db;
  font-weight: bold;
  -webkit-box-shadow: 0 0 0.25em 0.03em #00b7ee;
  box-shadow: 0 0 0.25em 0.03em #00b7ee;
  margin: 0.5em 0.25em;
  border: 1px solid #000;
  height: 30px;
  border-radius: 1em;
  border-color: #14f5ff;
  background-color: #00b7ee;
  width: 150px;
  line-height: 30px;
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
  top: 200px;
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
</style>
