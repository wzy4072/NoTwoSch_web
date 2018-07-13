// import voucherList from '@/modules/company/shoppingCart/voucherList.vue';
import home from '@/modules/company/home.vue';
import role from '@/modules/company/account/roleSetting.vue';
import roleEdit from '@/modules/company/account/roleEdit.vue';
import staff from '@/modules/company/account/staffList.vue';
import importStaff from '@/modules/company/account/staffImport.vue'; //导入员工

import message from '@/modules/company/message/message.vue';
import appStaffAdd from '@/modules/company/app/appStaffAdd.vue';
import testPage from '@/components/dataDisplay/try.vue';
import userInfo from '@/modules/company/account/personalInfo.vue'; //个人信息
import companyInfo from '@/modules/company/account/companyInfo.vue';
import changePassword from '@/modules/user/password/change.vue';
import initLoginChangePassWord from '@/modules/company/account/initLoginChangePassWord.vue';

import goodsList from '@/modules/company/goods/listing.vue';
import goodsOrder from '@/modules/company/goods/orderView.vue';
import goodsExisting from '@/modules/company/goods/existing.vue';

export default {
    routes: [ 
        { path: '/home', component: home ,meta:{title:'公司主页'}},
        { path: '/home/:id?',
            redirect: to => {
                const { hash, params, query } = to;
                return '/home'
            }
        },
        { path: '/account/role', component: role, name: "role",meta:{title:'岗位设置'} },
        { path: '/account/roleedit', component: roleEdit , name: "roleEdit" ,meta:{title:'部门编辑'}},
        { path: '/account/staff', component: staff, name: "staff" ,meta:{title:'员工设置'}},
        { path: '/account/importstaff', component: importStaff, name: "importstaff" ,meta:{title:'导入员工'}},
        { path: '/apps/order/addstaff/:id', component: appStaffAdd, name: "appStaffAdd",meta:{title:'员工管理'}}, //新增app员工
        // { path: '/voucher/list', component: voucherList ,name:'voucherList', meta:{title:'凭证列表'}}, //凭证列表
        { path: '/companyinfo', component: companyInfo ,meta:{title:'企业信息'}}, // 企业信息
        { path: '/userinfo', component: userInfo ,meta:{title:'个人信息'}},   // 个人信息
        { path: '/userinfo/:code', component: userInfo ,meta:{title:'个人信息'}},   // 个人信息(绑定邮箱)
        { path: '/message', component: message, name: "message" ,meta:{title:'消息中心'}},
        { path: '/message/:code', component: message, name: "handleinvite" ,meta:{title:'消息中心'}},
        { path: '/test', component: testPage ,meta:{title:'测试页'}},
        {path:'/initpassword',component:initLoginChangePassWord,meta:{title:'初始密码修改'}},
        { path: '/changepassword', component: changePassword ,meta:{title:'修改密码'}}, // 企业信息

        { 
            path: '/goods/listing/:goodCode?', 
            component: goodsList, 
            name: "goodsList",
            meta:{title:'产品列表'},
            props: true
        },
        { 
            path: '/goods/order/:info',
            component: goodsOrder, 
            name: "goodsOrder",
            meta:{title:'产品购买'},
            props: true
        },
        {
            path: '/myproduct',
            component: goodsExisting,
            name: "goodsExisting",
            meta:{title:'我的产品'},
        },
        
        { path: '*', redirect: '/home' },
        
    ],
}