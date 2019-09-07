<template>
  <div class="index">
    <div class="banner">
      <router-link to="/Jump"><img src="static/images/banner.png" alt></router-link>
    </div>
    <div class="news">
      <div class="title">FFC
        <span>公告</span>
      </div>
      <div class="content">
        <router-link to="/Notices">
          <marquee class="marquee" direction="left" behavior="scroll">CGS2018总公司新产品需要知道上线啦</marquee>
          <span class="icon iconfont">&#xe695;</span>
        </router-link>
      </div>
    </div>
    <!-- <div class="select-control-group" style="background:#fff;">
      Selects: {{checkboxValue}}
      <mu-flex class="select-control-row">
        <mu-checkbox label="全选" :input-value="checkAll" @change="handleCheckAll" ></mu-checkbox>
      </mu-flex>
      <mu-flex class="select-control-row" :key="'Checkbox ' + i" v-for="i in 3">
        <mu-checkbox :value="'Checkbox' + i" v-model="checkboxValue" :label="'Checkbox' + i"></mu-checkbox>
      </mu-flex>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      active: 0,
      checkboxValue:[],
    };
  },
  computed: {
    checkAll() {
      let check = false;
      if(this.checkboxValue.length < 3) {
        check = false;
      }else{
        check = true;
      }
      return check;
    }
  },
  methods: {
    handleCheckAll() { 
      if(this.checkboxValue.length===3) {
        for(let i=1; i<=3; i++) {
          this.checkboxValue.splice(0,1);
        }
      }else{
        this.checkboxValue = [];
        for(let i=1; i<=3; i++) {
          this.checkboxValue.push('Checkbox'+i);
        }
      }
    },
    // 显示开发中
    developing() {
      this.$toast.message("该功能开发中");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.router-view{ padding-top: 0;}
.index{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #f3f3f3;}
.banner{ width: 100%; height: 177px; }
.banner img{ width: 100%;}
.news { display: flex; padding: 10px 15px; background: #ffffff; line-height: 30px;}
.news .title{text-align: center; font-weight: bold; font-size: 18px; display: flex; align-items: center;} 
.news .title span{ padding: 0 6px; margin: -2px 10px 0 6px; font-size: 12px; color: #fff; background:linear-gradient(90deg,rgba(174,62,229,1),rgba(90,34,234,1)); border-radius:2px; word-break: keep-all; display: block; height: 20px; line-height: 20px;}
.news .content{ font-size: 14px; width: 80%;}
.news .content a{width: 100%; display: flex; align-items: center; color: #787878;}
.news .content a span{ width: 10%;}
.news .content a .marquee{ width: 90%;}
</style>
