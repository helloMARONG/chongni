<template>
  <div class="feedhelp">
    <app-header title="产币说明"></app-header>
    <div
      v-html="info"
      class="info"
    >{{info}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: ""
    };
  },
  mounted() {
    this.getFeedInfo();
  },
  methods: {
    getFeedInfo() {
      const params = {
        label: "chongni.output.explain"
      };
      this.$http
        .get("/api/v1/information/get_label_info", { params: params })
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.info = res.data.info;
            console.log("请求成功" + this.info);
          } else {
            this.$toast.message(response.data.msg);
          }
        });
    }
  }
};
</script>

<style  scoped>
.feedhelp {
  height: 100%;
  width: 100%;
  background-color: rgb(16, 29, 43);
}
.info {
  color: #ecf0f3;
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding: 20px;
}
</style>