<template>
  <div class="malls">
    <mu-appbar style="width: 100%;" title="商城">
      <mu-button icon @click="routerBack" slot="left">
        <span class="icon iconfont">&#xe647;</span>
      </mu-button>
      <mu-button flat slot="right" to="/Order"><span class="icon iconfont">&#xe634;</span></mu-button>
    </mu-appbar>
    <!-- 搜索 -->
    <div class="search">
      <mu-text-field v-model="keywords" placeholder="请输入商品关键字"></mu-text-field>
      <mu-button class="common-btn" :to="{path: '/GoodsSearch',query:{keywords: keywords}}"><span class="iconfont">&#xe684;</span></mu-button>
    </div>
    <div class="shop">
      <!-- 左边 -->
      <div class="menu-wrapper">
        <ul>
          <li class="menu-item" v-for="(goods,index) in goodsList" :key="index" :class="{current: index === currentIndex}" @click="clickList(index)" ref="menuList">
            <span>{{goods.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右边 -->
      <div class="shop-wrapper">
        <ul ref="itemList">
          <li class="shops-li" v-for="(goods, index1) in goodsList" :key="index1">
            <!-- <div class="shops-title"><span>{{goods.name}}</span></div> -->
            <ul class="shops-items">
              <router-link v-for="(item, index2) in goods.goods" :key="index2" tag="li" :to="`/Details/${item.id}`">
                <img :src="item.cover" alt />
                <div class="info">
                  <div class="title">{{item.name}}</div>
                  <!-- <div class="tip">{{item.name}}</div> -->
                  <div class="btn">
                    <span>¥{{item.price}}</span>
                    <mu-button class="common-btn">购买</mu-button>
                  </div>
                </div>
              </router-link>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Malls",
  data() {
    return {
      keywords: "",
      goodsList: [],
      scroll: 0, //右侧列表滑动的y轴坐标
      rightLiTops: [], //所有分类头部位置
      scrollY: 0,
      type: this.$route.query.type,
    };
  },
  computed: {
    //动态绑定class类名
    currentIndex() {
      return this.rightLiTops.findIndex((tops, index) => {
        this._initLeftScroll(index); //调用左右联调滚动效果
        return this.scrollY >= tops && this.scrollY < this.rightLiTops[index + 1];
      });
    }
  },
  watch: {
    // watch监听goodsList数据是否有，并通过this.$nextTick去调用_initBScroll方法
    goodsList() {
      //监听数据
      this.$nextTick(() => {
        //左右两边滚动
        setTimeout(() => {
          this._initBScroll(); //右边列表高度
          this._initRightHeight();
        }, 1000);
      });
    }
  },
  created() {
    this.getInfo();
    localStorage.setItem("shopType",this.type);
  },
  methods: {
    // 1.better-scroll的初始化一定要在数据渲染完成后进行
    _initBScroll() {
      //左边滚动
      this.leftBscroll = new BScroll(".menu-wrapper", {click: true});
      //右边滚动
      this.rightBscroll = new BScroll(".shop-wrapper", {
        probeType: 2, //在滚动中触发scroll 事件
        click: true
      });
      this.rightBscroll.on("scroll", pos => {
        this.scrollY = Math.abs(pos.y);
        // console.log(this.scrollY);
      });
    },
    // 2.计算出每一个li标签的高度，并把它存放在一个数组当中,//求出右边列表的高度
    _initRightHeight() {
      let itemArray = []; //定义一个伪数组
      let top = 0;
      itemArray.push(top);
      //获取右边所有li的礼
      let allList = this.$refs.itemList.getElementsByClassName("shops-li");
      //allList伪数组转化成真数组
      Array.prototype.slice.call(allList).forEach(li => {
        top += li.clientHeight; //获取所有li的每一个高度
        itemArray.push(top);
      });
      this.rightLiTops = itemArray;
      console.log(this.rightLiTops)
    },
    // 3.点击左边实现滚动和左右滚动联调
    clickList(index) {
      this.scrollY = this.rightLiTops[index];
      this.rightBscroll.scrollTo(0, -this.scrollY, 200);
    },
    //左右滚动联调
    _initLeftScroll(index) {
      let menu = this.$refs.menuList;
      let el = menu[index];
      this.leftBscroll.scrollToElement(el, 300, 0, -300);
    },
    getInfo() {
      // const params = {
      //   goods_type: this.type,
      // }
      // this.$http("/shop/lists", {params: params}).then(response => {
      //   console.log(response.data);
      //   const res = response.data;
      //   if(res.status == 0) {
      //     this.goodsList = res.data;
      //     localStorage.setItem("shopList",JSON.stringify(res.data));
      //   }
      // });
      this.goodsList = [
        {name:'产品分类1', goods:[{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"},{name:"商品1",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类2', goods:[{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类3', goods:[{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品3",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类4', goods:[{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品4",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"},{name:"商品2",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类5', goods:[{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"},{name:"商品5",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类6', goods:[{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"},{name:"商品6",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类7', goods:[{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"},{name:"商品7",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类8', goods:[{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"},{name:"商品8",price: "100",cover:"static/images/sharebg.png"}]},
        {name:'产品分类9', goods:[{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"},{name:"商品9",price: "100",cover:"static/images/sharebg.png"}]},
      ];
    },
    routerBack() {
      this.$router.back();
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.malls { width: 100%; height: 100%; overflow: hidden;}
.search{ display: flex; justify-content: space-between; align-items: center; width: 92%; margin: 0 4%; height: 34px; margin-top: 10px; border-radius: 20px; border:1px solid #F6D989;}
.search .common-btn{ width: 16%; height: 100%; font-size: 14px; border-radius: 0 20px 20px 0;box-shadow: none; min-width: auto;}
.search .iconfont{ font-size: 20px;}
.shop { display: flex; position: absolute; top: 120px; bottom: 0px; width: 100%; overflow: hidden;}
@media only screen and (min-height: 760px){
  .shop{ top: 145px;}
}
.menu-wrapper { width: 80px; flex: 0 0 80px; -webkit-overflow-scrolling: touch; overflow: hidden;}
.menu-item { width: 100%; height: 60px; padding: 0 10px; background: #fafafa; display: flex; justify-content: center; align-items: center; color: #666; position: relative; font-size: 14px; border-bottom: solid 2px #fff;}
.current { color: #F97271; background: #ffffff;}
.current:before { content: ""; background-color: #F97271; width: 3px; height: 26px; position: absolute; left: 0;}
.shop-wrapper {flex: 1;background: #fff; -webkit-overflow-scrolling: touch; overflow: hidden;}
.shops-title {display: flex;flex-direction: row; padding: 0 4%; height: 36px; align-items: center; justify-content: space-between; color: #F97271; font-size: 14px; margin: 0 2%; border-bottom: 1px #ddd solid;}
.shops-title a { text-decoration: none; color: #9c9c9c; font-size: 14px;}
.shops-items { display: flex; flex-wrap: wrap;}
.shops-items li { display: flex; width: 96%; height: 100px; padding: 0 4%; align-items: center; border-bottom: solid 1px #f4f4f4; margin: 0 2%; justify-content: space-between;}
.shops-items li img { width: 80px; height: 80px; margin-right: 10px;}
.shops-items li .info{ width: 64%;}
.shops-items li .title{ font-size: 13px;}
.shops-items li .tip{ color: #787878;}
.shops-items li .btn{ display: flex; justify-content: space-between; align-items: center;}
.shops-items li .btn span{ color: #F97271; font-size: 16px;}
.shops-items li .btn button{ height: 27px; min-width: 68px; font-size: 12px;}

</style>
