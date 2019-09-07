<template>
  <div class="qusetion">
    <app-header title="我的反馈"></app-header>
    <ul class="questionList">
      <li v-for="item in questionList" :key="item.id">
        <div>用户名：{{item.username}}</div>
        <div>反馈内容：{{item.content}}</div>
        <div>客服回复：
          <span v-if="item.state == 1">{{item.content_admin}}</span>
          <span v-else class="colorRed">未处理</span>
        </div>
        <div>反馈时间：{{item.add_time}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'QuestionList',
  data () {
    return {
      questionList:[]
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const formData = {
        action: 'list'
      }
      this.$http.post("/api/member/message", formData)
      .then((response) => {
        const res = response.data;
        if( res.status === "y") {
          console.log(res)
          this.questionList = res.data.data;
        }else{
          this.$toast.message(response.data.info);
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.questionList li{ padding: 10px; margin-top: 10px; color: #555; font-size: 13px; border-bottom: solid 1px #ddd;}
.questionList li>div{ padding: 4px 0;}
.colorRed{ color: #FF3C00;}
</style>
