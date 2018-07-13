import login from '@/modules/admin/login/login.vue';
import home from '@/modules/admin/home.vue';
import info from '@/modules/admin/info.vue';
import checkcompany from '@/modules/admin/operations/checkCompany.vue';
import person from '@/modules/admin/operations/person.vue';
import application from '@/modules/admin/operations/application.vue';
import product from '@/modules/admin/operations/product.vue';
import financeAccount from '@/modules/admin/finance/accountList.vue';
import financeBill from '@/modules/admin/finance/bill.vue';
import promotion from '@/modules/admin/operations/promotion.vue';
import statistics from '@/modules/admin/statistics/main.vue';
import platform from '@/modules/admin/statistics/platform/main.vue';
import platformTotal from '@/modules/admin/statistics/platform/total.vue';
import platformDelta from '@/modules/admin/statistics/platform/delta.vue';
import cmsPerson from '@/modules/admin/statistics/cms/person.vue';
import cmsEntity from '@/modules/admin/statistics/cms/entity.vue';
import cmsArea from '@/modules/admin/statistics/cms/area.vue';
import cmsChannel from '@/modules/admin/statistics/cms/channel.vue';
import certifimanag from '@/modules/admin/operations/certifimanag.vue';
import createCertify from '@/modules/admin/operations/createCertify.vue';



export default {
    routes: [
        { path: '', name: 'login', component: login, redirect: '/login' },
        {
            path: '/home', component: home, children: [
                { path: '/', component: info },
                { path: '/company', component: checkcompany },
                { path: '/voucher/imanag', component: certifimanag },
                { path: '/voucher/create', component: createCertify },
                { path: '/person', component: person },
                { path: '/application', component: application },
                { path: '/product', component: product },
                { path: '/financeaccount', component: financeAccount },
                { path: '/financebill/:id', component: financeBill, props: true },
                { path: '/promotion', component: promotion },
                {
                    path: '/statistics', component: statistics, children: [
                        {
                            path: '/statistics/platform', component: platform, children: [
                                { path: '/statistics/platform/delta', component: platformDelta },
                                { path: '/statistics/platform/total', component: platformTotal },
                            ]
                        },
                        {
                            path: '/statistics/cms', component: platform, children: [
                                { path: '/statistics/cms/person', component: cmsPerson },
                                { path: '/statistics/cms/entity', component: cmsEntity },
                                { path: '/statistics/cms/area', component: cmsArea },
                                { path: '/statistics/cms/channel', component: cmsChannel },
                            ]
                        }
                    ]
                }
            ]
        },
        { path: '/login', component: login },
    ],
}