<template>
  <div class="guide">
    <mu-carousel hide-controls :cycle="cycle">
      <!-- <mu-carousel-item v-if="!isGuide">
        <img src="static/images/index.png">
      </mu-carousel-item>
      <mu-carousel-item v-if="!isGuide">
        <img src="static/images/index.png">
      </mu-carousel-item> -->
      <mu-carousel-item class="guide-index">
        <img src="static/images/index.png">
        <mu-button color="primary" @click="goIndex">立即体验</mu-button>
      </mu-carousel-item>
    </mu-carousel>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  data () {
    return {
      cycle:false,
      isGuide: false
    }
  },
  created() {
    if(!localStorage.getItem("isGuide")){
      this.isGuide = false;
    }else{
      this.isGuide = true;
    }
  },
  mounted() {
    
  },
  methods: {
    goIndex() {
      localStorage.setItem("isGuide","1")
      this.$router.push("/Index")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.guide{ height: 100%; width: 100%; padding-top: 0px;} 
.guide .mu-carousel{ height: 100%;}
.guide .mu-carousel img{ height: 100%; }
.guide .guide-index{ position: relative;}
.guide .guide-index button{ position: absolute; width: 100px; z-index: 100; bottom: 15px; left: 50%; margin-left: -50px;}
</style>
