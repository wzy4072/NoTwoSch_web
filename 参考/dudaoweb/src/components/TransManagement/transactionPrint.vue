<style scoped>
  .bgColor{
    background: #F2F2F2;
    width:25%;
  }
  .autoSpan{
    word-break:normal; 
    width:auto; 
    display:block; 
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
  }
  .text_one{
    margin-top: 25px;
    letter-spacing: 20PX;
  }
  .text_two{
    margin-top: 25px;
    letter-spacing:20PX;
  }
  .mytable{border-collapse:collapse;width:100%;}
  .mytable th,.mytable td{
    border: 1px solid #5E5E5E;
    height: 30px;
    text-align: center;
    padding: 10px 0;
    width: 25%;
  }
  .mytable td.bottomContent{padding: 40px 0;height:100px;}
</style>

<template>
  <div class='ins-container pd3'>
    <div>
      <div class="ins-page-search">
        <div class="ins-search-con">
          <el-button type="warning" plain size="mini" icon="el-icon-download" @click="htmlExport">导出</el-button>
          <el-button type="primary" plain size="mini" icon="el-icon-tickets" @click="htmlPrint">打印</el-button>
          <!-- <tableBar type='printer' tableId='mytable' ></tableBar> -->

        </div>
      </div>
    </div>
    <div class='ins-page-main' style="overflow:auto;">
      <div style="margin:0 auto;width:70%;height:100%;">
        <div class='WordSection1' id="printHtml">
          <div id="bothInsert"></div>
          <div v-for="v in printData" style="border: 1px solid #ddd;margin-top:30px;">
            <div style="text-align: center;margin:25px;"><h1>学生<span v-text="status"></span>确认单</h1></div>
            <table class="mytable" style="border-collapse:collapse;width: 92%;margin: 0 4% 0px 4%;">
              <!-- <caption style="margin: 30px 0;"><h1>学生<span v-text="status"></span>确认单</h1></caption> -->
              <!-- <thead style="margin: 30px 0;"><h1>学生<span v-text="status"></span>确认单</h1></thead> -->
              <tbody>
                <tr>
                  <td class="bgColor" style="background: #F2F2F2;width:25%;">姓名</td>
                  <td v-text="v.studentName">张三</td>
                  <td class="bgColor">性别</td>
                  <td v-text="v.studentGenderName">男</td>
                </tr>
                <tr v-if="status === '转班' || status === '复学'">
                  <td class="bgColor">原年级</td>
                  <td v-text="v.oldGradeName">张三</td>
                  <td class="bgColor">现年级</td>
                  <td v-text="v.newGradeName">男</td>
                </tr>
                <tr v-if="status === '转班' || status === '复学'">
                  <td class="bgColor">原年级代码</td>
                  <td v-text="v.oldGradeCode">张三</td>
                  <td class="bgColor">现年级代码</td>
                  <td v-text="v.newGradeCode">男</td>
                </tr>
                <tr v-if="status === '转班' || status === '复学'">
                  <td class="bgColor">原入学代码</td>
                  <td v-text="v.oldEntranceCode">张三</td>
                  <td class="bgColor">现入学代码</td>
                  <td v-text="v.entranceCode">男</td>
                </tr>
                <tr v-if="status === '转班' || status === '复学'">
                  <td class="bgColor">原班级</td>
                  <td v-text="v.oldClassName">张三</td>
                  <td class="bgColor">现班级</td>
                  <td v-text="v.newClassName">男</td>
                </tr>
                
                <tr v-if="status === '转入'">
                  <td class="bgColor">转入年级</td>
                  <td v-text="v.newGradeName">张三</td>
                  <td class="bgColor">转入年级代码</td>
                  <td v-text="v.newGradeCode">男</td>
                </tr>
                <tr v-if="status === '转入'">
                  <td class="bgColor">转入班级</td>
                  <td v-text="v.newClassName">张三</td>
                  <td class="bgColor">入学代码</td>
                  <td v-text="v.entranceCode">男</td>
                </tr>
                <tr v-if="status === '转出' || status === '休学' || status === '退学'">
                  <td class="bgColor">原年级</td>
                  <td v-text="v.oldGradeName">张三</td>
                  <td class="bgColor">原年级代码</td>
                  <td v-text="v.oldGradeCode">男</td>
                </tr>
                <tr v-if="status === '转出' || status === '休学' || status === '退学'">
                  <td class="bgColor">原班级</td>
                  <td v-text="v.oldClassName">张三</td>
                  <td class="bgColor">原入学代码</td>
                  <td v-text="v.oldEntranceCode">男</td>
                </tr>
                <tr v-if="status === '转出'">
                  <td class="bgColor">拟读学校名称</td>
                  <td v-text="v.transactionSchoolName">张三</td>
                  <td class="bgColor">拟读年级</td>
                  <td v-text="v.newGradeName">男</td>
                </tr>
                <tr v-if="status === '休学'">
                  <td class="bgColor">休学日期</td>
                  <td v-text="v.transactionDate">张三</td>
                  <td class="bgColor">复学日期</td>
                  <td v-text="v.returnDate">男</td>
                </tr>
                <tr v-if="status === '复学' || status === '转入' || status === '退学' || status === '转出'">
                  <td v-if="status === '复学'" class="bgColor">复学日期</td>
                  <td v-if="status === '转入'" class="bgColor">转入日期</td>
                  <td v-if="status === '退学'" class="bgColor">退学日期</td>
                  <td v-if="status === '转出'" class="bgColor">转出日期</td>
                  <td colspan="3" v-text="v.transactionDate">张三</td>
                </tr>
                <tr style="height:50px;">
                  <td class="bgColor bottomContent" >申请理由</td>
                  <td colspan="3">
                    <span class="autoSpan" style="text-align:left;padding-left:10px;" v-text="v.applyReason">
                      图日哦哦噢噢噢噢噢噢噢噢噢噢噢噢图日哦哦噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢图日哦哦噢噢噢噢噢噢噢噢噢噢噢
                    </span>
                  </td>
                </tr>
                <tr v-if="status === '转班' || status === '复学'">
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                      <div>原班主任签字:</div>
                      <div class="text_one">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                    </div>
                  </td>
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                      <div>新班主任签字:</div>
                      <div class="text_two">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                    </div>
                  </td>
                </tr>
                <tr v-if="status === '转入'">
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                     
                    </div>
                  </td>
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                      <div>转入班  班主任签字:</div>
                      <div class="text_two">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                    </div>
                  </td>
                </tr>
                <tr v-if="status === '退学' || status === '转出' || status === '休学'">
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                     
                    </div>
                  </td>
                  <td colspan="2" style="border:0;">
                    <div style="text-align:left;margin-top: 50px;">
                      <div>原班主任签字:</div>
                      <div class="text_two">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="status === '转入' || status === '复学'" style="margin:10px;text-align:center;border-top:1px dashed #ddd;height:50px;padding:20px;">
              <span style="margin-right:50px;">学生账号: <span v-text="v.loginName">Y20180001</span></span>
              <span>学生密码: <span v-text="v.md5Pwd">123456</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/transactionPrint.js"></script>


