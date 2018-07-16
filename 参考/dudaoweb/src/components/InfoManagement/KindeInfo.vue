<style scoped lang='less'>
  .form-item-con{
    .item-title{
      padding: 8px 0 20px 0; 
      span{ 
        &:first-child{
          color: #3C7AFF;
        }
      }
    }
    .item-content{
      padding-right: 40px;
      &.left-item{
        border-right:1px dashed #c0c4cc;
      }
    }
  }
</style>
<style scoped>
  .radioBox, .radioBox>>>.el-radio-button__inner {
    width: 100%;
    height: 40px;
  }
  .el-input >>>.el-input-group__append{
    width:80px!important;
    padding: 0;
    text-align: center;
  }
  .el-radio-button{
    width:50%;
  }
</style>

<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
			<returnBtn :title="'幼儿园信息管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
		<div class="ins-page-type type1">
    <div class="ins-page-btn" >
			<div class="ins-opa-btn">
        <el-button type="primary" size="small" @click="isEdit=1" v-if="isEdit===0">编辑</el-button>
        <el-button type="success" size="small" @click="saveFn" v-if="isEdit===1">保存</el-button>
        <el-button type="danger" size="small" @click="cancelFn" v-if="isEdit===1">取消</el-button>
      </div>
    </div>
    <div class="ins-page-main">
      <div class="ins-content">
        <div class="ins-title">
          <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
          <span>幼儿园信息管理</span>
        </div>
        <div class="ins-content-con ins-s-ofx-a">
          <el-form :model="formdata" ref="ruleForms" label-width="140px" :rules="rulesObj">
            <!-- 基本信息 -->
            <div class="form-item-con">
              <div class="item-title">
                <span>|</span>
                <span>基本信息</span>
              </div>
              <!-- 基本信息内容 -->
              <el-row>
                <el-col :span="9">
                  <div class="item-content left-item">
                    <el-form-item label="幼儿园名称：" prop="krtenName">
                      <el-input v-show="isEdit" v-model="formdata.krtenName"></el-input>
                      <span v-show="!isEdit" v-text='formdata.krtenName'></span>
                    </el-form-item>
                    <el-form-item label="办学编码：" prop="runSchoolCode">
                      <el-input v-show="isEdit" type="number" v-model="formdata.runSchoolCode"></el-input>
                      <span v-show="!isEdit" v-text='formdata.runSchoolCode'></span>
                    </el-form-item>
                    <el-form-item label="幼儿园性质：" prop="schoolNatrue">
                      <el-select class="ins-s-wf" v-model="formdata.schoolNatrue" @change="selValChangeFn(formdata.certificatesType,'certificatesType')" placeholder="请选择" v-show="isEdit">
                        <el-option v-for="(item,key) in certificatesTypeList" :key="key" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <span v-show="!isEdit" v-text="certificatesTypeList[formdata.schoolNatrue-1]['name']"></span>
                    </el-form-item>
                    <el-form-item label="幼儿园等级：" prop="schoolLevel">
                      <el-select class="ins-s-wf" v-model="formdata.schoolLevel" @change="selValChangeFn(formdata.politicalOutlook,'politicalOutlook')" placeholder="请选择" v-show="isEdit">
                        <el-option v-for="item in politicsStatusList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <span v-show="!isEdit" v-text="politicsStatusList[formdata.schoolLevel-1]['name']"></span>
                    </el-form-item>
                    <el-form-item label="规范化幼儿园：">
                      <el-radio-group v-show="isEdit" v-model="formdata.isNormalizationKrten" class="radioBox" size="medium" >
                        <el-radio-button label="1">是</el-radio-button>
                        <el-radio-button :disabled="isDisabNormal" label="0">否</el-radio-button>
                      </el-radio-group>
                      <span v-show="!isEdit">{{formdata.isNormalizationKrten?'是':'否'}}</span>
                    </el-form-item>
                    <el-form-item label="普惠性幼儿园：">
                      <el-radio-group v-show="isEdit" v-model="formdata.isUniversalityKrten" class="radioBox"  size="medium" >
                        <el-radio-button label="1">是</el-radio-button>
                        <el-radio-button label="0">否</el-radio-button>
                      </el-radio-group>
                      <span v-show="!isEdit">{{formdata.isUniversalityKrten?'是':'否'}}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                    <el-form-item label="所在地区：" prop="nativeList">
                      <el-cascader class="ins-s-wf" placeholder="请选择" v-model="formdata.nativeList" :options="cityList" :props="{value: 'label',children: 'children'}" filterable change-on-select v-show="isEdit"></el-cascader>
                      <span v-show="!isEdit">{{formdata.nativeList===undefined?'':formdata.nativeList.join('')}}</span>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="nativeAddress">
                      <el-input v-model="formdata.nativeAddress" v-show="isEdit"></el-input>
                      <span v-show="!isEdit" v-text='formdata.nativeAddress'></span>
                    </el-form-item>
                    <el-form-item label="联系电话：" prop="areaTel">
                      <el-input v-model="formdata.areaTel" v-show="isEdit"></el-input>
                      <span v-show="!isEdit" v-text='formdata.areaTel'></span>
                    </el-form-item>
                    <el-form-item label="联系传真：">
                      <el-input v-model="formdata.areaFax" v-show="isEdit"></el-input>
                      <span v-show="!isEdit" v-text='formdata.areaFax'></span>
                    </el-form-item>
                    <el-form-item label="联系邮箱：">
                      <el-input v-model="formdata.areaEmail" v-show="isEdit"></el-input>
                      <span v-show="!isEdit" v-text='formdata.areaEmail'></span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 设施信息 -->
            <div class="form-item-con">
              <div class="item-title">
                <span>|</span>
                <span>设施信息</span>
              </div>
              <!-- 设施信息内容 -->
              <el-row>
                <el-col :span="9">
                  <div class="item-content left-item">
                    <el-form-item label="占地面积：" prop="areaCovered">
                      <el-input type="number" v-show="isEdit" v-model.number="formdata.areaCovered">
                        <template slot="append">平方米</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.areaCovered?(formdata.areaCovered+'平方米'):''}}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                    <el-form-item label="教室数量：" prop="classroomNum">
                      <div class="row-width" v-show="isEdit">
                        <el-input  type="number" v-model.number="formdata.classroomNum">
                          <template slot="append">间</template>
                        </el-input>
                      </div>
                      <span v-show="!isEdit">{{formdata.classroomNum?(formdata.classroomNum+'间'):''}}</span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="户外游戏场地：">
                    <el-radio-group size="medium" v-show="isEdit" v-model="formdata.outdoor" class="radioBox" >
                      <el-radio-button label="1">有</el-radio-button>
                      <el-radio-button label="0">无</el-radio-button>
                    </el-radio-group>
                    <span v-show="!isEdit">{{formdata.outdoor==1?('有'+(formdata.outdoorGameField&&formdata.outdoorGameField!=-1?('，'+formdata.outdoorGameField+'平方米'):'')):'无'}}</span>
                  </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="占地面积：" v-show="formdata.outdoor==='1'&&isEdit" prop="outdoorGameField">
                      <el-input  v-model.number="formdata.outdoorGameField">
                        <template slot="append">平方米</template>
                      </el-input>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="室内游戏场地：">
                    <el-radio-group size="medium" v-show="isEdit"  v-model="formdata.indoor" class="radioBox"  >
                      <el-radio-button label="1">有</el-radio-button>
                      <el-radio-button label="0">无</el-radio-button>
                    </el-radio-group>
                    <span v-show="!isEdit">{{formdata.indoor==1?('有'+(formdata.indoorGameField&&formdata.indoorGameField!=-1?('，'+formdata.indoorGameField+'平方米'):'')):'无'}}</span>
                  </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="占地面积：" v-show="formdata.indoor==='1'&&isEdit" prop="indoorGameField">
                      <el-input  v-model.number="formdata.indoorGameField">
                        <template slot="append">平方米</template>
                      </el-input>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="音乐教室：">
                    <el-radio-group size="medium" v-show="isEdit" v-model="formdata.musicClass" class="radioBox"  >
                      <el-radio-button label="1">有</el-radio-button>
                      <el-radio-button label="0">无</el-radio-button>
                    </el-radio-group>
                    <span v-show="!isEdit">{{formdata.musicClass==1?('有'+(formdata.musicClassroom&&formdata.musicClassroom!=-1?('，'+formdata.musicClassroom+'平方米'):'')):'无'}}</span>
                  </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                  <el-form-item label="占地面积：" v-show="formdata.musicClass==='1'&&isEdit" prop="musicClassroom">
                      <el-input  v-model.number="formdata.musicClassroom">
                        <template slot="append">平方米</template>
                      </el-input>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 收费信息 -->
            <div class="form-item-con">
              <div class="item-title">
                <span>|</span>
                <span>收费信息</span>
              </div>
              <!-- 收费信息内容 -->
              <el-row>
                <el-col :span="9">
                  <div class="item-content left-item">
                    <el-form-item label="全日保教费：" prop="fulldayFee">
                      <el-input type="number" v-show="isEdit" v-model.number="formdata.fulldayFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.fulldayFee?(formdata.fulldayFee+'元/月/生'):''}}</span>
                    </el-form-item>
                    <el-form-item label="假期保教费：" prop="vacationFee">
                      <el-input type="number" v-show="isEdit" v-model.number="formdata.vacationFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.vacationFee?(formdata.vacationFee+'元/月/生'):''}}</span>
                    </el-form-item>
                    <el-form-item label="托管费：" prop="trusteeshipFee">
                      <el-input type="number" v-show="isEdit" v-model.number="formdata.trusteeshipFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.trusteeshipFee?(formdata.trusteeshipFee+'元/月/生'):''}}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                    <el-form-item label="寄宿制保教费：" prop="boardingFee">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.boardingFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.boardingFee?(formdata.boardingFee+'元/月/生'):''}}</span>
                    </el-form-item>
                    <el-form-item label="伙食费：" prop="foodFee">
                      <el-input type="number" v-show="isEdit"  v-model.number="formdata.foodFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.foodFee?(formdata.foodFee+'元/月/生'):''}}</span>
                    </el-form-item>
                    <el-form-item label="校车费："  prop="schoolbusFee">
                      <el-input type="number"  v-show="isEdit" v-model.number="formdata.schoolbusFee">
                        <template slot="append">元/月/生</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.schoolbusFee?(formdata.schoolbusFee+'元/月/生'):''}}</span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 简介内容 -->
            <div class="form-item-con">
              <div class="item-title">
                <span>|</span>
                <span>简介内容</span>
              </div>
              <!-- 简介内容 -->
              <el-row>
                <el-col :span="9">
                  <div class="item-content left-item">
                    <el-form-item label="幼儿园简介：" prop="workerType">
                      <el-input v-show="isEdit"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入幼儿园简介,最多2000字"
                        v-model="formdata.krtenIntroduction">
                      </el-input>
                      <span v-show="!isEdit">{{formdata.krtenIntroduction}}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="item-content">
                    <el-form-item label="园长简介：" prop="workerType">
                      <el-input v-show="isEdit"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入园长简介，最多2000字"
                        v-model="formdata.krtenManagerIntroduction">
                      </el-input>
                      <span v-show="!isEdit">{{formdata.krtenManagerIntroduction}}</span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
      </div>
      <el-dialog title="操作提示" :visible.sync="dialogAbolishVisible" width="500px">
        <p class="failInfo">如有内容修改，取消编辑后修改将不会被保存。</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm">确定取消</el-button>
          <el-button type="primary" @click="dialogAbolishVisible = false">继续编辑</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
  </div>
  </div>
</template>
<script src="./js/KindeInfo.js"></script>