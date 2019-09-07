<template>
  <div class="question">
    <app-header title="反馈问题"></app-header>
    <mu-form ref="form" :model="validateForm" class="card-content">
      <mu-form-item prop="question" :rules="questionRules">
        <mu-text-field v-model="validateForm.question" multi-line :rows="6" full-width placeholder="请描述您的问题"></mu-text-field><br/>
      </mu-form-item>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit">反馈问题</mu-button>
        <mu-button class="common-btn" to="/QuestionList">我的反馈</mu-button>
      </mu-form-item>
    </mu-form>
  </div>
</template>

<script>
export default {
  name: 'Question',
  data () {
    return {
      questionRules: [
        { validate: (val) => !!val, message: '内容不能为空'},
        { validate: (val) => val.length >= 6 && val.length <= 240, message: '内容长度大于10小于240'}
      ],
      validateForm: {
        question: ''
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result) {
          const formData = {
            content: this.validateForm.question,
            action: 'set'
          }
          this.$http.post("/api/member/message", formData)
          .then((response) => {
            if(response.data.status === 1){
              this.$toast.message("提交成功！");
            }else{
              this.$toast.message(response.data.info);
            }
          })
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-content{ padding: 10px 0!important;}
.question .mu-raised-button{ margin: 10px 10%; width: 80%;}
.question a{ background: none; box-shadow: none; border:1px solid rgba(17,11,21,1); color: #110B15;}
</style>
