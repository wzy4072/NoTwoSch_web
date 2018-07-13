<template>
    <div style="padding-bottom: 80px">
        <v-spin :spinning="spinning" tip="处理中">
            <div class="register-step-3" >
                <v-form direction="vertical"
                        :model="registrationForm"
                        :rules="rules"
                        ref="registrationFormRef">
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>邮箱
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="email"
                                         class="register-input-box"
                                         has-feedback>
                                <v-input class="register-input"
                                         v-model="registrationForm.email"
                                         type="text"
                                         placeholder="请输入邮箱" ></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>设置密码
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="password"
                                         class="register-input-box"
                                         has-feedback>
                                <v-row>
                                    <v-col :xs="24">
                                        <v-input class="register-input" v-model="registrationForm.password" type="password" placeholder="密码" v-on:input="checkPassword(registrationForm.password)"></v-input>
                                    </v-col>
                                    <v-col :xs="{ offset: 24 }">
                                        <ul id="password-strength">
                                            <li class="weak" v-bind:class="{show:passwordStrength.weak}">
                                                <div>
                                                    <div class="strength-bar-bg" >
                                                        <div class="strength-bar weak-bar" ></div>
                                                    </div>
                                                    &nbsp;&nbsp;弱
                                                    </div>
                                            </li>
                                            <li class="medium" v-bind:class="{show:passwordStrength.medium}">
                                                <div class="strength-bar-bg" >
                                                    <div class="strength-bar medium-bar"></div>
                                                </div>
                                                &nbsp;&nbsp;中
                                                </li>
                                            <li class="strong" v-bind:class="{show:passwordStrength.strong}">
                                                <div class="strength-bar-bg" >
                                                    <div class="strength-bar strong-bar"></div>
                                                </div>
                                                &nbsp;&nbsp;强
                                                </li>
                                        </ul>
                                    </v-col>
                                </v-row>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>确认密码
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="password2"
                                         class="register-input-box"
                                         has-feedback>
                                <v-input class="register-input"
                                         v-model="registrationForm.password2"
                                         type="password"
                                         placeholder="再次确认密码" ></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>姓名
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="personName"
                                         class="register-input-box"
                                         has-feedback>
                                <v-input class="register-input"
                                         v-model="registrationForm.personName"
                                         type="text"
                                         placeholder="请输入真实姓名" ></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>企业名称
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="corpName"
                                         class="register-input-box"
                                         has-feedback>
                                <v-input class="register-input"
                                         v-model="registrationForm.corpName"
                                         type="text"
                                         placeholder="请输入正确的公司名称" ></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="register-label" span="5" pull="1">
                            <span class="register-red-star">*&nbsp;</span>所属行业
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="industry"
                                         class="register-input-box"
                                         has-feedback>
                                <v-select size="lg"
                                          class="register-input"
                                          :data="industryOptions"
                                          v-model="registrationForm.industry"></v-select>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col span="19" push="5">
                            <v-checkbox v-model="agreeState" :true-value="1" :false-value="0" ></v-checkbox><span>请认真阅读并签署<span style="color: #00aee0;cursor: pointer;" @click="readAgreement">《平台注册协议》</span></span>
                        </v-col>
                    </v-row>
                    <v-row class="register-next-box">
                        <v-button class="register-next-btn"
                                  type="primary"
                                  html-type="submit"
                                  @click.prevent="register">下一步</v-button>
                    </v-row>
                </v-form>
            </div>
        </v-spin>
        <v-modal title="平台注册协议"
                 class="register-agreement"
                 :hasMask="hasMask"
                 :visible="agreementShow"
                 okText="同意"
                 @ok="agreementOk"
                 @cancel="agreementCancel">
            <div class="section">
                <h3>《平台注册协议》</h3>
                <p>您在使用深圳市慧通关网络科技有限公司，以下服务简称“云报关”提供的各项服务之前，请您务必审慎阅读、充分理解本协议各条款内容。若,您不同意本协议条款或随时对其修改的，您可以主动停止使用“云报关”提供的相关服务；您一旦使用“云报关”相关服务，即视为您已了解并完全同意本协议各项内容，包括“云报关”对服务协议所做的任何修改，并成为“云报关”用户。</p>
                <h4>一、总则</h4>
                <p>1.1  您在注册完成后并已同时开通平台相关免费的相应服务，点击相关注册完成后,即视为已经充分阅读并理解了本协议约定的条款，若,您不同意本协议内容或对本协议内容有异议，请您立即停止注册。</p>
                <p>1.2  用户应当同意本协议的条款并按照页面上的提示完成全部的注册程序。用户在进行注册程序过程中需勾选《平台注册协议》，点击"下一步"按钮即表示用户与“云报关”公司达成协议，完全接受本协议项下的全部条款。</p>
                <p>1.3　用户注册成功后，成为“云报关”用户，将得到一个用户名及相应的密码，并对以此组用户名和密码登陆录系统所发生的所有活动和事件负责，自行承担一切使用该用户名的言语、行为等而直接或者间接导致的法律责任。</p>
                <p>1.4　本平台提供互联网办公应用服务，提供的服务会随着公司的经营而不断调整和变化，平台将持续不断的升级，平台及应用升级不需征得您的同意。</p>
                <p>1.5　本平台项下服务标准与服务内容根据平台中产品介绍说明为准。</p>
            </div>

            <h4>二、注册信息和隐私保护</h4>
            <p>2.1　“云报关”用户包括用户名和密码，您可使用设置的用户名（包括：手机号、验证后的邮箱）和密码登录云报关平台。</p>
            <p>1.2用户应当同意本协议的条款并按照页面上的提示完成全部的注册程序。用户在进行注册程序过程中需勾选《平台注册协议》，点击"下一步"按钮即表示用户与“云报关”公司达成协议，完全接受本协议项下的全部条款。</p>
            <p>2.2　用户不应将其用户名、密码转让、出售或出借予他人使用，若用户授权他人使用，应对被授权人在该用户名下发生所有行为负全部责任。</p>
            <p>2.3 用户有义务维护自己在“云报关”平台中的账户信息的完整性、密码的保密性。因用户维护或保密不善致使相关信息泄露，或由于第三方盗用用户名和密码进行各种操作而造成的损失，由用户自行负责。</p>
            <p>2.4  在需要终止使用“云报关”服务时，符合以下条件的，您可以申请注销您的“云报关”用户名</p>
            <p>2.4.1    您仅能申请注销或解绑您本人的用户名，并依照“云报关”平台的流程进行注销；</p>
            <p>2.4.2    您仍应对您在注销用户名前且使用“云报关”服务期间的行为承担相应责任，同时“云报关”仍可保存您注销前的相关信息</p>
            <p>2.4.3    注销成功后，用户名相关信息、 交易记录、会员权益等将无法恢复或提供；</p>
            <p>2.5  在如下情况下，“云报关”可能会披露您的信息:</p>
            <p>2.5.1    事先获得您的授权；</p>
            <p>2.5.2    您使用共享功能；</p>
            <p>2.5.3    根据法律、法规、法律程序的要求或政府主管部门的强制性要求；</p>
            <p>2.5.4    以学术研究或公共利益为目的；</p>
            <p>2.5.5    为维护“云报关”的合法权益，例如查找、预防、处理欺诈或安全方面的问题；</p>
            <p>2.5.6    符合相关服务条款或使用协议的规定；</p>
            <p>2.6  您知悉并授权，“云报关”仅在必需的情况下使用或与关联公司同步您的信息，以为用户提供征信相关服务；</p>
            <p>2.7　为更好地向用户提供服务，您同意“云报关”通过短信等形式向您发送相关商业性服务信息。</p>
            <h4>三、使用规则</h4>
            <p>3.1　用户在使用“云报关”服务时，必须遵守《网络安全法》、《互联网新闻信息服务管理规定》、《中华人民共和国合同法》、《中华人民共和国海关法》、《中华人民共和国进出口商品检验法》等中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为:</p>
            <p>3.1.1    上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：</p>
            <p>3.1.2    反对宪法所确定的基本原则的；</p>
            <p>3.1.3    危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
            <p>3.1.4    损害国家荣誉和利益的；</p>
            <p>3.1.5    煽动民族仇恨、民族歧视、破坏民族团结的；</p>
            <p>3.1.6    破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
            <p>3.1.7    散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
            <p>3.1.8    散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
            <p>3.1.9    侮辱或者诽谤他人，侵害他人合法权利的；</p>
            <p>3.1.10   含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</p>
            <p>3.2  含有中国法律、法规、规章、条例以及任何具有法律效力规范所限制或禁止的其它内容：</p>
            <p>3.2.1    未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</p>
            <p>3.2.2   未经允许，对计算机信息网络功能进行删除、修改或者增加的；</p>
            <p>3.2.3   未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</p>
            <p>3.2.4   故意制作、传播计算机病毒等破坏性程序的；</p>
            <p>3.2.5   其他危害计算机信息网络安全的行为。</p>

            <h4>四、服务内容</h4>
            <p>4.1 “云报关”网络服务平台具体内容由“云报关”根据实际情况提供；</p>
            <p>4.2 除非本协议另有其它明示规定，“云报关”所推出的新产品、新功能、新服务，均受到本协议之规范；</p>
            <p>4.3 为使用本服务，用户必须自行配备上网和使用电信增值业务所需的设备，自行负担上网或第三方（包括但不限于电信或移动通信提供商）收取的通讯费、信息费等有关费用。如涉及电信增值服务的，请与您的电信增值服务提供商确认相关的费用问题；</p>
            <p>4.4 鉴于网络服务的特殊性，用户同意“云报关”有权不经事先通知，随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。“云报关”不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保；</p>
            <p>4.5 “云报关”将尽最大努力保障用户数据的安全备份，“云报关”承诺在有任何用户数据因服务器存储设备损坏时以最快的速度从最近的备份中恢复数据，但无法承诺100%的数据恢复，对因数据丢失带来的其他连带或间接损失不承担任何责任；</p>
            <p>4.5 “云报关”将尽最大努力保障用户数据的安全备份，“云报关”承诺在有任何用户数据因服务器存储设备损坏时以最快的速度从最近的备份中恢复数据，但无法承诺100%的数据恢复，对因数据丢失带来的其他连带或间接损失不承担任何责任；</p>
            <p> 4.6 免责声明：因以下情况造成网络服务在合理时间内的中断，“云报关”无需为此承担任何责任；</p>
            <p> 4.6.1 “云报关”需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，“云报关”保留不经事先通知为维修保养、升级或其它目的暂停本协议任何部分的权利；</p>
            <p> 4.6.2因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；</p>
            <p> 4.6.3用户的电脑软硬件和通信线路、供电线路出现故障的；</p>
            <p> 4.6.4因病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、银行原因、第三方服务瑕疵或政府行为等原因。尽管有前款约定，“云报关”将采取合理行动积极促使服务恢复正常。</p>

            <h4>五、平台收费标准及支付标准</h4>
            <p>5.1 本平台所有应用系统收费将由官方公布为准；</p>
            <p>5.2 本平台所有应用系统的结算均先支付后消费的模式；</p>
            <p>5.3 用户购买应用产品确认后从相应账户中直接扣取；</p>
            <p>5.4 本平台所有收费均开电子发票，发票开出将无法作废或重开（发票属性根据“云报关”相应税务资质调整）；</p>
            <p>5.5 “云报关”有权根据实际情况调整费用标准及收费方式，并公示于“云报关”网站，但调整日前已经订购服务并已全额支付服务费用的用户在相应的服务期内不受影响；</p>
            <p>5.6 除非本协议另有约定，用户在成功购买本服务后，所支付的服务费用均不做退返：</p>
            <p>5.7 在下列情况下, “云报关”同意将用户订购费用中的剩余款项进行退返，退款款项不计利息并以人民币形式支付：</p>
            <p>5.7.1 非因用户违约原因，“云报关”在用户订购后无理由终止向该用户提供服务；</p>
            <p>5.7.2 为保护用户权益,“云报关”另行规定的情况；</p>
            <p>5.7.3 涉及退款环节将由线下操作完成。</p>
            
            <h4>六、知识产权和其他合法权益（包括但不限于名誉权、商誉权）</h4>
            <p>6.1 “云报关”完全拥有“云报关”平台的全部知识产权，用户签署本协议后并未拥有“云报关”平台的所有权。“云报关”的公司名称、标志、LOGO、产品名字，以及“云报关”平台的应用程序、源代码、界面设计、应用程序编程接口（API）等所关联的知识产权都已经属于深圳市慧通关网络科技有限公司，未经授权不能使用；</p>
            <p>6.2. 用户不得将涉及“云报关”拥有知识产权的相关内容用于本协议范围以外的任何商业目的或泄露给第三方。用户不得出售、转售或复制“云报关”产品，亦不可基于商业目的模仿“云报关”的产品和服务。用户不可复制和模仿“云报关”的设计理念、界面、功能和文字及图形说明。未经“云报关”许可，用户不得基于此协议所约定的服务对“云报关”平台进行修改或制造、衍生其它产品；</p>
            <p>6.3、服务中涉及的“云报关”等文字或图形及其组成，均是“云报关”的商标。未经“云报关”事先书面同意，您不得擅自使用或展示这些商标，一经发现，“云报关”将追究法律责任；</p>
            <p>6.4、您理解并同意授权“云报关”在宣传和推广中使用您的名称、商标、标识，但仅限于表明您属于我们的用户。</p>
            
            <h4>七、其他</h4>
            <p>7.1　本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律；</p>
            <p>7.2　如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向深圳仲裁委员会提起仲裁，按照其届时有效的规则进行仲裁。仲裁裁决是终局的，对各方均有约束力，不可上诉。仲裁费用由败诉方承担，除非仲裁裁决另有规定。当任何争议发生时以及在对任何争议进行仲裁时，除争议事项外，各方应继续行使各自在本协议项下的其他权利，履行各自在本协议项下的其他义务；</p>
            <p>7.3　“云报关”未行使或执行协议中任何权利或规定，不构成对前述权利或权利之放弃；</p>
            <p>7.4　如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>
            
            <h4>八、终止服务</h4>
            <p>8.1 用户自动申请注销，在注销完成后将自动终止服务；</p>
            <p>8.2“云报关”终止向您提供服务后，您涉嫌再一次直接或间接或以他人名义注册为“云报关”用户的；</p>
            <p>8.3 其它“云报关”认为应当终止服务的情况。</p>
            <br>
            <p style="text-align: right">深圳市慧通关网络科技有限公司</p>
            <p style="text-align: right">2017年12月22日</p>
        </v-modal>
    </div>
</template>

<script>
import api from '@/api/root/register.js';
import passwordApi from '@/api/root/password';

export default {
    props: {
        id: String,
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (this.registrationForm.password2 != null && this.registrationForm.password2 != "") {
                if (value != this.registrationForm.password2) {
                    callback(new Error("与设置密码不符"));
                    return;
                }
            }
            callback();
        };
        var validatePass2 = (rule, value, callback) => {
            if (this.registrationForm.password != value) {
                callback(new Error("与设置密码不符"));
                return;
            }
            callback();
        };
        var validateEmail = (rule, value, callback) => {
            api.isEmailRegistered(value)
                .then(resp => {
                    if(resp.success === true) {
                        callback();
                    }else {
                        callback(new Error(resp.error));
                    }
                })
                .catch(error => {
                    this.$message.error(error);
                    callback();
                }
            );
            callback();
            
        };
        
        return {
            spinning: false,
            industryOptions: [
                { value: 0, label: '报关行' },
                { value: 1, label: '货代' },
                { value: 2, label: '供应链' },
                { value: 3, label: '电商' },
                { value: 4, label: '工厂' },
                { value: 5, label: '物流' },
                { value: 6, label: '贸易公司' },
                { value: 7, label: '仓库' },
            ],
            passwordStrength: {
                weak: false,
                medium: false,
                strong: false
            },
            registrationForm: {
                email: null,
                personName: null,
                corpName: null,
                industry: null,
                password: null,
                password2: null,
            },
            
            hasMask: false,
            agreementShow: false,
            agreeState: 0,
            
            rules: {
                password: passwordApi.passwordVerifiedRules.concat({ validator: validatePass }),
                password2: passwordApi.rePasswordVerifiedRules.concat({ validator: validatePass2 }),
                email: [
                    { 
                        required: true, 
                        message: '请输入邮箱', 
                        trigger: 'blur' },
                    { 
                        type: 'email', 
                        message: '请输入正确的邮箱地址', 
                        trigger: 'blur,change' 
                    },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                personName: [
                    { 
                        required: true, 
                        message: '请输入姓名', 
                        trigger: 'blur' },
                    { 
                        type: "string", 
                        max: 8, 
                        message: '最大不超过8个字', 
                        trigger: 'blur,change' },
                ],
                corpName: [
                    { 
                        required: true, 
                        message: '请输入企业名', 
                        trigger: 'blur' 
                    },
                    { 
                        type: "string", 
                        max: 25, 
                        message: '最大不超过25个字', 
                        trigger: 'blur,change' 
                    },
                ],
                industry: [
//                    { required: true, message: '请输入行业', trigger: 'blur' }
                ]
            },
        };
    },
    created() {
        
    },
    methods: {
        
        register() {
            this.$refs['registrationFormRef'].validate(ok => {
                if (ok) {
                    if(!this.agreeState) {
                        this.$message.error("请同意协议");
                        return;
                    }
                    if(this.registrationForm.industry == null) {
                        this.spinning = false;
                        this.$message.error("请您输入行业");
                        return;
                    }
                    this.spinning = true;

                    api.register(this.registrationForm, this.id)
                        .then(resp => {
                            this.spinning = false;
                            if(resp.success === true) {
                                this.$router.push({ name: 'registerStep3', params: { id: this.id}})
                            }else {
                                this.$message.error(resp.error, 4);
                            }
                        })
                        .catch(msg => {
                            this.spinning = false;
                            this.$message.error(msg);
                    });
                } else {
                    this.spinning = false;
                    this.$message.error("请输入完整信息才可以进入下一步");
                }
            })
        },
        checkPassword: function(password) {
            this.passwordStrength = {
                weak: false,
                medium: false,
                strong: false
            }
            var count = 0;
            if (/\d/.test(password)) {
                count++;
            }
            if (/[a-z]/.test(password)) {
                count++;
            }
            if (/[A-Z]/.test(password)) {
                count++;
            }
            if (/\W/.test(password)) {
                count++;
            }
            switch (count) {
                case 1:
                    this.passwordStrength.weak = true
                    break;
                case 2:
                    this.passwordStrength.medium = true
                    break;
                case 3:
                case 4:
                    this.passwordStrength.strong = true
                    break;
            }
        },
        readAgreement() {
            this.agreementShow = true;
        },
        agreementCancel() {
            this.agreementShow = false;
            this.agreeState = 0;
        },
        agreementOk() {
            this.agreeState = 1;
            this.agreementShow = false;
        }
    },
    computed: {
        
    },
}
</script>
<style>
    @import '/static/css/password-strength.css';
    .agreement
    .register-step-text p {
        display: inline-block;
        font-size: 16px;
        color: #aaa;
    }
    .register-step-text p.on-step{
        color: #666;
    }
    .register-tips h3 {
        text-align: center;
        font-size: 20px;
        color: #00aee0;
        padding-bottom: 20px;
    }
    .register-tips li {
        position: relative;
        left: 7px;
        list-style-type: square;
        line-height: 23px;
        padding-bottom: 15px;
    }
    
    .register-label {
        position: relative;
        top: 10px;
        text-align: right;
        font-size: 16px;
    }
    .register-next-box {
        padding-top: 30px;
    }
    .register-next-btn {
        position: relative;
        left: 90px;
        width: 200px;
        height: 42px;
        font-size: 20px;
        background-color: #00aee0;  
    }
    
     .register-input {
        height: 42px;
        width: 300px;
        font-size: 15px;
    }
     .register-input-box {
        width: 300px;
    }
     .regist-submit {
        height: 42px;
        width: 100%;
        font-size: 18px;
        background-color: #00aee0;
    }
    .register-step-3 {
        position: relative;
        left: 135px;
        width: 450px;
    }
    .register-red-star {
        color: red;
    }
    .register-agreement h3 {
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
    }
    .register-agreement h4 {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 5px;
    }
    .register-agreement p {
        font-size: 14px;
        padding-bottom: 5px;
    }
    .register-agreement .section {
        padding: 10px 0;
    }
    
    /* 对vue-beaury样式的修正*/
    .ant-select-search__field__placeholder, .ant-select-selection__placeholder {
        margin-top: -6px;
    }
    .ant-select-lg .ant-select-selection--single {
        height: 42px;
    }
    .has-error.has-feedback:after, .has-success.has-feedback:after, .has-warning.has-feedback:after, .is-validating.has-feedback:after {
        top: 4px;
    }
    .ant-select-selection-selected-value {
        position: relative;
        top: 5px;
    }
</style>
