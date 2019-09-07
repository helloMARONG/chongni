<template>
  <div class="notices">
    <app-header title="公告中心"></app-header>
    <div class="bscroll" ref="bscroll">
      <ul>
        <li v-for='(item,index) in notices' :key="index">
           <p>{{item.value}}</p>
           <span>{{item.create_time | filterDate}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import formatDate from '@/components/bin/date.js';
export default {
  name: 'Notices',
  data () {
    return {
      notices:[],
    }
  },
  created() {
    // this.getNews();
  },
  mounted() {
   
  },
  methods: {
    creatBscroll() {
      const bscroll = document.querySelector('.bscroll');
      const scrollHeight = window.screen.height - bscroll.offsetTop;
      bscroll.style.height = scrollHeight + 'px';
      this.$nextTick(() => {
        let scroll = new BScroll(this.$refs.bscroll,{
          click: true,
        });
      });
    },
    // 新闻公告
    getNews() {
      this.$http.post("/api/Other/gonggaolog").then(response => {
        const res = response.data.log;
        console.log(res)
        this.notices = res.data;
        this.creatBscroll();
      })
    },
  },
  filters: {
    filterDate(time) {
      if(time){
        const date = new Date(time*1000);
        return formatDate(date, 'yyyy/MM/dd');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notices ul{ padding: 0 4%;}
.notices ul li{ padding: 10px 0; border-bottom: solid 1px #f3f3f3;}
.notices ul li p{ margin: 0 0 6px 0;}
.notices ul li span{ color: #7B7C86;}
</style>
