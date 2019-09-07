import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import Notices from '@/components/Notices'
// 登陆注册
import Login from '@/components/login/Login'
import Register from '@/components/login/Register'
import Forget from '@/components/login/Forget'
// 我的
import MyCenter from '@/components/mycenter/Index'
import Card from '@/components/mycenter/Card'
import Share from '@/components/mycenter/Share'
import Question from '@/components/mycenter/Question'
import QuestionList from '@/components/mycenter/QuestionList'
import Safe from '@/components/mycenter/Safe'
import ResetPassword from '@/components/mycenter/ResetPassword'
import DealPassword from '@/components/mycenter/DealPassword'
import ServiceCenter from '@/components/mycenter/ServiceCenter'
import ServiceWechat from '@/components/mycenter/ServiceWechat'
import Community from '@/components/mycenter/Community'
// 资产钱包
import Property from '@/components/property/Index'
import Recharge from '@/components/property/Recharge'
import Cash from '@/components/property/Cash'
import Historys from '@/components/property/Historys'
import Address from '@/components/property/Address'

// 宠物
import Deal from '@/components/deal/Index' //主页
import PetSelection from '@/components/deal/PetSelection' //宠物选择
import Coinage from '@/components/deal/Coinage' //产币
import Feed from '@/components/deal/Feed' //喂养
import FeedEdit from '@/components/deal/FeedEdit' //编辑喂养
import FeedAuto from '@/components/deal/FeedAuto' //自动喂养
import FeedSetting from '@/components/deal/FeedSetting' //设置自动喂养
import FeesSettinAuto from '@/components/deal/FeesSettinAuto' //设置手动喂养
import Tribal from '@/components/deal/Tribal' //部落名称
import TribalMember from '@/components/deal/TribalMember' //部落成员喂养信息
import chatRobot from '@/components/deal/chatRobot' //聊天
import FeedHelp from '@/components/deal/FeedHelp' //喂养说明
import CoinHelp from '@/components/deal/CoinHelp' //产币说明


//
import MyIssuance from '@/components/deal/MyIssuance'
import MyOrder from '@/components/deal/MyOrder'
import MyOrderDetailsBuy from '@/components/deal/MyOrderDetailsBuy'
import MyOrderDetailsSell from '@/components/deal/MyOrderDetailsSell'

// 商城
import Malls from '@/components/malls/Index'
import MyAddress from '@/components/malls/MyAddress'
import GoodsDetails from '@/components/malls/GoodsDetails'
import Order from '@/components/malls/Order'
import MyOrderDetails from '@/components/malls/MyOrderDetails'
import Tabs from '@/components/malls/Tabs'

// 引导页
import Guide from '@/components/Guide'

Vue.use(Router)

export default new Router({
    routes: [
        // 登陆注册
        { path: '/', name: 'home', redirect: "/Index" },
        { path: '/Guide', name: 'guide', component: Guide, },
        { path: '/Index', name: '首页', component: Index, },
        { path: '/Login', name: '登陆', component: Login, meta: { keepAlive: true }, },
        { path: '/Register', name: '注册', component: Register, },
        { path: '/Forget', name: '忘记密码', component: Forget, },
        { path: '/Notices', name: '公告中心', component: Notices, },

        // 我的
        { path: '/MyCenter', name: '个人中心', component: MyCenter, },
        { path: '/Card', name: '实名认证', component: Card, },
        { path: '/Share', name: '我的推广码', component: Share, },
        { path: '/Question', name: '问题反馈', component: Question, },
        { path: '/QuestionList', name: '我的反馈', component: QuestionList },
        { path: '/Safe', name: '安全中心', component: Safe, },
        { path: '/ResetPassword', name: '设置登录密码', component: ResetPassword, },
        { path: '/DealPassword', name: '设置交易密码', component: DealPassword, },
        { path: '/ServiceCenter', name: '客服中心', component: ServiceCenter, },
        { path: '/ServiceWechat/:id', name: '客服中心 ', component: ServiceWechat, },
        { path: '/Community', name: '我的社区', component: Community, },

        // 宠物
        { path: '/Deal', name: '交易', component: Deal, },
        { path: '/PetSelection', name: '宠物选择', component: PetSelection, },
        { path: '/Coinage', name: '产币 ', component: Coinage },
        { path: '/Feed', name: '喂养 ', component: Feed },
        { path: '/FeedSetting', name: '设置自动喂养 ', component: FeedSetting },
        { path: '/FeesSettinAuto', name: '设置手动喂养 ', component: FeesSettinAuto },
        { path: '/FeedEdit', name: '喂养编辑 ', component: FeedEdit },
        { path: '/FeedAuto', name: '自动喂养 ', component: FeedAuto },
        { path: '/Tribal', name: '部落名称', component: Tribal },
        { path: '/TribalMember', name: '部落成员信息', component: TribalMember },
        { path: '/chatRobot', name: '聊天', component: chatRobot },
        { path: '/CoinHelp', name: '产币说明', component: CoinHelp },
        { path: '/FeedHelp', name: '喂养说明', component: FeedHelp },


        { path: '/MyIssuance', name: '我的发布 ', component: MyIssuance },
        { path: '/MyOrder', name: '我的订单', component: MyOrder, },
        { path: '/MyOrderDetailsBuy', name: 'MyOrderDetailsBuy', component: MyOrderDetailsBuy },
        { path: '/MyOrderDetailsSell', name: 'MyOrderDetailsSell ', component: MyOrderDetailsSell },

        // 商城
        { path: '/Malls', name: '商城', component: Malls, },
        { path: '/MyAddress', name: '收货地址', component: MyAddress, },
        { path: '/GoodsDetails/:id', name: '商品详情', component: GoodsDetails, props: true, },
        { path: '/Order', name: '我的订单', component: Order },
        { path: '/MyOrderDetails', name: '订单详情', component: MyOrderDetails, },
        { path: '/Tabs', name: 'Tabs', component: Tabs, },

        // 钱包
        { path: '/Property', name: '钱包', component: Property, },
        { path: '/Recharge', name: '充币', component: Recharge, },
        { path: '/Cash/', name: '提币', component: Cash, },
        { path: '/Historys', name: '交易记录', component: Historys, },
        { path: '/Address', name: '钱包地址', component: Address, },
    ],
    linkActiveClass: 'router-link-active'
})