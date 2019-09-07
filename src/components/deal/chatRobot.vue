<template>
  <div>
    <app-header title="聊天"></app-header>
    <div class="talk-wrapper">
      <div id="chatRobot">
        <!-- <div id="header">
           <p>chatRobot</p>
      </div> -->
        <div id="convo">
          <ul class="chat_thread">
            <li
              v-for="
              (msg,index)
              in
              msgs"
              :key="index"
              v-bind:class="msg.class"
            >{{ msg.message}}</li>
          </ul>
        </div>
      </div>
      <div id="foot">
        <!-- <p
          contenteditable="true"
          id="message"
        >{{humanInput}}</p> -->
        <div style="width:75%;position:relative;height:auto;float:left;">
          <textarea
            ref="tet"
            id="message"
            v-model="humanInput"
          >这里写内容</textarea>
        </div>

        <button
          id="postMessage"
          @click="postMessage"
        >发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../../assets/css/style.css";
export default {
  name: "chatRobot",
  data() {
    return {
      humanInput: "",
      msgs: [],
      responseCode: "",
      responseText: "",
      petImg: "" //用户宠物
    };
  },
  created() {
    this.getMessage();
  },
  mounted() {
    this.getUserPet();
    this.getCss();
  },
  methods: {
    //textarea跟随文本高度自适应
    getCss() {
      var $textarea = document.getElementById("message");
      var lastLength = 0;
      var lastHeight = 0;
      $textarea.addEventListener("input", function() {
        var currentLength = $textarea.value.length;
        // 判断字数如果比之前少了，说明内容正在减少，需要清除高度样式，重新获取
        if (currentLength < lastLength) {
          $textarea.style.height = "";
        }
        var currentHeight = $textarea.scrollHeight;
        // 如果内容高度发生了变化，再去设置高度值
        if (lastHeight !== currentHeight || !$textarea.style.height) {
          $textarea.style.height = currentHeight + 2 + "px";
        }
        let textHeight = 130;
        let parTextarea = parseInt($textarea.style.height);
        console.log(parTextarea);

        if (parTextarea > textHeight) {
          $textarea.style.height = 100 + "px";
          //$textarea.style.overflow = "hidden";
        }
        lastLength = currentLength;
        lastHeight = currentHeight;
      });
    },

    //拉取用户宠物详情
    getUserPet() {
      this.$http.get("/api/v1/pet").then(response => {
        const res = response.data;
        console.log("用户" + res);
        if (res.code === 200) {
          this.petImg = axios.defaults.baseURL + "/uploads/" + res.data.pet.pic;

          // 支持IE
          document.styleSheets[0].addRule(
            ".chat_thread .agent::before",
            'background: url("' + this.petImg + '")'
          );
          // 支持非IE的现代浏览器
          document.styleSheets[0].insertRule(
            '.chat_thread .agent::before{background:url("' +
              this.petImg +
              '")}',
            0
          );

          // document.styleSheets[0].insertRule(
          //   '.chat_thread .agent::before{background:url("' +
          //     this.petImg +
          //     '")}',
          //   0
          // );

          // Create a new style tag
        } else {
          this.$toast.message(res.msg);
        }
      });
    },
    getMessage() {
      this.scrollHeight();
      let jsonSet = JSON.parse(localStorage.getItem("tlak"));
      console.log(jsonSet);
      if (jsonSet && jsonSet.length != 0) {
        this.msgs = jsonSet;
      } else {
        let msg = [{ class: "agent", message: "hello" }];
        this.msgs = msg;
        localStorage.setItem("tlak", JSON.stringify(msg));
      }
    },
    postMessage() {
      var humanInput = { class: "human", message: this.humanInput };
      this.msgs.push(humanInput);
      var data = {
        text: this.humanInput
      };
      //读取历史聊天
      let jsonSet = JSON.parse(localStorage.getItem("tlak"))
        ? JSON.parse(localStorage.getItem("tlak"))
        : [];
      console.log(jsonSet);
      jsonSet.push(humanInput);
      this.humanInput = "";
      this.$refs.tet.style.height = "";

      this.scrollHeight();

      this.$http.post("/api/v1/pet/talk", data).then(response => {
        const res = response.data;
        if (res.code === 200) {
          console.log(res);
          this.responseText = res.data;
          let robotText = this.responseText.map(function(v) {
            return v.values.text;
          });
          let robot = robotText.join(",");
          console.log(robotText);
          console.log(this.responseText);

          //插入宠物聊天
          var agentInput = { class: "agent", message: robot };
          this.msgs.push(agentInput);

          jsonSet.push(agentInput);
          localStorage.setItem("tlak", JSON.stringify(jsonSet));
          // localStorage.removeItem("tlak");

          this.scrollHeight();
        } else {
          this.$toast.message(response.data.msg);
        }
      });
    },
    scrollHeight() {
      this.$nextTick(() => {
        let msg = document.getElementById("convo"); // 获取对象
        msg.scrollTop = msg.scrollHeight; // 滚动高度
      });
    }
  }
};
</script>



<style scoped>
.router-view {
  height: 100%;
}
</style>