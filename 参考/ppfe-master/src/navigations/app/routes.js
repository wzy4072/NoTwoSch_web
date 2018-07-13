
import home from '@/modules/person/home.vue';
import userinfo from '@/modules/person/account/userinfo.vue';
import createCom from '@/modules/person/account/createCom.vue';
import joinCom from '@/modules/person/account/joinCom.vue';




import accountConfig from '@/modules/person/account/accountConfig.vue';
// import myApp from '@/modules/person/account/myApp.vue';
import message from '@/modules/person/message/message.vue';

// import wallet from '@/modules/person/wallet/wallet.vue';
// import recharCreateOrder from '@/modules/person/wallet/recharCreateOrder.vue';
// import payOrder from '@/modules/person/wallet/payOrder.vue';
// import recharResault from '@/modules/company/wallet/recharResault.vue';


export default {
    routes: [ 
        { path: '/home', component: home ,meta:{title:'个人首页'},},
        { path: '/account/userinfo', component: userinfo  ,meta:{title:'基础设置'}},
        { path: '/account/createcom', component: createCom  ,meta:{title:'创建公司'}},
        { path: '/account/joincom', component: joinCom  ,meta:{title:'加入公司'}},
        { path: '/message', component: message ,meta:{title:'个人消息'}, },

    //    { path: '/account/config', component: accountConfig },
    //    { path: '/account/app', component: myApp },
    //    { path: '/account/wallet', component: wallet },//钱包
    //    { path: '/account/order', component: createOrder },//充值 充值购买
    //    { path: '/account/order', component: recharCreateOrder, name: "order"},//充值 下单页
    //    { path: '/account/order/pay/:code', component: payOrder, name: "payOrder" },//付款（充值/购买）
    //    { path: '/account/order/pay/:code', component: payOrder },//付款（充值/购买）
    //    { path: '/account/order/rcarult/:code', component: recharResault },//充值结果
    //    { path: '/account/order/rcarult/:code', component: recharResault, name: "recharResault" },//充值结果
      

        { path: '*', redirect: '/home' },
 
    ],
}