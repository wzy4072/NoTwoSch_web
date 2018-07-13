import login from '@/modules/user/login.vue';
import register from '@/modules/user/register/register.vue';
import resetPassword from '@/modules/user/password/reset.vue';
import maivaliresult from '@/modules/user/maiValiResult.vue';
import registerStepOne from '@/modules/user/register/stepOne.vue';
import registerStepTwo from '@/modules/user/register/stepTwo.vue';
import registerStepThree from '@/modules/user/register/stepThree.vue';
import emailChangePassword from '@/modules/user/emailChangePassword.vue';
import resetStepOne from '@/modules/user/password/resetStepOne.vue';
import resetStepTwo from '@/modules/user/password/resetStepTwo.vue';
import resetStepThree from '@/modules/user/password/resetStepThree.vue';
import payList from '@/modules/user/pay/list.vue';
import payView from '@/modules/user/pay/view.vue';
import payApply from '@/modules/user/pay/apply.vue';


export default {
    routes: [
        {   
            path: '/login', 
            component: login, 
            meta:{title:'用户登录'} 
        },
        {   
            path: '/login/:code', 
            component: login, 
            meta:{title:'用户登录'} 
        },
        {   
            path: '/register/:random',
            name: 'register',
            component: register,
            meta:{title:'用户注册'},
            children: [
                {
                    path: '1/:id',
                    name: 'registerStep1',
                    component: registerStepOne,
                    meta:{title:'用户注册'},
                    props: true,
                },
                {
                    path: '2/:id',
                    name: 'registerStep2',
                    component: registerStepTwo,
                    meta:{title:'用户注册'},
                    props: true,
                },
                {
                    path: '3/:id',
                    name: 'registerStep3',
                    component: registerStepThree,
                    meta:{title:'用户注册'},
                    props: true,
                },
                {
                    path: '*',
                    redirect: { name: 'register' }
                }
            ],
        },
        {
            path: '/resetpassword',
            name: 'resetpassword',
            component: resetPassword,
            meta:{title:'忘记密码'},
            children: [
                {
                    path: 'step1/:id',
                    name: 'resetStepOne',
                    component: resetStepOne,
                    meta:{title:'忘记密码'},
                    props: true,
                },
                {
                    path: 'step2/:id',
                    name: 'resetStepTwo',
                    component: resetStepTwo,
                    meta:{title:'忘记密码'},
                    props: true,
                },
                {
                    path: 'step3/:id',
                    name: 'resetStepThree',
                    component: resetStepThree,
                    meta:{title:'忘记密码'},
                    props: true,
                },
                {
                    path: '*',
                    redirect: { name: 'register' }
                }
            ],
        },
        {   
            path: '/resetpassword', 
            component: resetPassword,
            meta:{title:'忘记密码'}
        },
       
        // {   
        //     path: '/maivaliresult/:code',
        //     component: maivaliresult,
        //     meta:{title:'邮箱验证'} //邮箱验证链接访问地址
        // },
        {
            path: '/setpassword/:code',//邮箱发送验证码方式修改密码
            component: emailChangePassword,
            meta: {title:'修改密码'}
            
        },
        {
            path: '/listing',
            component: payList,
            name: "listing",
            meta:{title:'产品列表'}
        },
        {
            path: '/order/:info',
            component: payView,
            name: "orderView",
            meta:{title:'产品购买'},
            props: true
        },
        {
            path: '/buy/apply/:corporateId/:code/:variationCode/:qty',
            component: payApply,
            name: "payApply",
            meta:{title:'购买请求'},
            props: true
        },
        {   
            path: '*',
            redirect: '/login' 
        }
    ],
}