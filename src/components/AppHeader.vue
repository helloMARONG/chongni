<template>
  <div>
    <mu-appbar
      style="width: 100%;background:#101D2B;color:#FFFFFF"
      :title="title"
    >
      <mu-button
        icon
        @click="routerBack"
        slot="left"
      >
        <span class="icon iconfont">&#xe647;</span>
      </mu-button>
    </mu-appbar>
  </div>
</template>

<script>
export default {
  props: ["title"],
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
