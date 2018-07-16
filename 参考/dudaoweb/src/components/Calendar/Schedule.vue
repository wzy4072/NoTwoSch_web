<style scoped>
  #calendar{
  margin:0 auto;
  height:720px;
  width:100%;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12);
  }
  .month {
  width: 100%;
  background: #409EFF;
  }
   
  .month ul {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  }

  .year-month {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  }
   
  .choose-year {
  padding-left: 20px;
  padding-right: 20px;
  }
   
  .choose-month {
  text-align: center;
  font-size: 1.5rem;
  }
   
  .arrow {
  padding: 30px;
  }
   
  .arrow:hover {
  background: rgba(100, 2, 12, 0.1);
  cursor: pointer;
  }
   
  .month ul li {
  color: white;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  }
   
  .weekdays {
  margin: 0;
  padding: 10px 0;
  background-color: #409EFF;
  display: flex;
  font-size:110%;
  flex-wrap: wrap;
  color: #FFFFFF;
  justify-content: space-around;
  }
   
  .weekdays li {
  display: inline-block;
  width: 13.6%;
  text-align: center;
  }
   
  .days {
  height: 95%;
  padding: 0;
  background: #FFFFFF;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  }
   
  .days li {
  list-style-type: none;
  display: inline-block;
  width: 14.2%;
  text-align: center;
  padding-bottom: 0px;
  padding-top: 0px;
  font-size: 1rem;
  color: #000;
  cursor: pointer;
  height: 80px;
  }
   
  .days li .other-month {
  padding: 10px;
  color: gainsboro;
  }
   
  .button_div { 
   margin-top:10px;
  }

  .Schedule_active {
  text-align: center;
  width: 41px;
  height: 33px;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 50%;
  background: #0095f6;
  color: #fff;
  }
  .Schedule_work {
   text-align: center;
   width: 41px;
   height: 33px;
   display: inline-block;
  padding: 6px 10px;
  border-radius: 50%;
  background:#f56c6c;
  color: #fff;
  }
@media screen and (max-width: 1280px) {
.days {
  height: 88%;
  padding: 0;
  background: #FFFFFF;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  }
}
@media screen and (max-width: 1024px) {
.days {
  height: 58%;
  padding: 0;
  background: #FFFFFF;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  }
}
 </style>
<template>
<div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
            <returnBtn :title="'校历管理'"></returnBtn>
        </div>
        <!-- tab页 -->
        <div class="ins-tab-label">
            <el-tabs  v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="学生校历" name="1"></el-tab-pane>
                <el-tab-pane label="教职工校历" name="2"></el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <div class="ins-page-con">
    <div class="ins-page-type type1">
        <div class="ins-page-btn">
            <div class="ins-opa-btn">
                <el-button type="danger" size="small" @click="Vacation()">{{activeName==1?'设为放假':'设为休息'}}</el-button>
                <el-button type="primary" size="small" @click="Course()" >{{activeName==1?'设为上课':'设为上班'}}</el-button>
            </div>
        </div>
        <div class="ins-page-main">
            <div class="ins-content">
                <!-- title -->
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>{{activeName==1?'学生校历':'教职工校历'}}</span>
                </div>
                <!-- content -->
                <div class="ins-content-con ins-s-p0">
<div id="calendar">
    <!-- 年份 月份 -->
    <div class="month">
        <ul>
            <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
            <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
            <li class="year-month">
                <span class="choose-year">{{ currentYear }}</span>
                <span class="choose-month">{{ currentMonth }}月</span>
            </li>
            <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
        </ul>
    </div>
    <!-- 星期 -->
    <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li style="color:#F56C6C">六</li>
        <li style="color:#F56C6C">日</li>
    </ul>
    <!-- 日期  -->
    <ul class="days">
        <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
        <li  v-for="(dayobject,key) in days" :key="key" @click="day_function($event,dayobject.day)">
            <!--如果不是本月  改变类名加灰色-->
            <span v-if="dayobject.day.getMonth()+1 != currentMonth"   class="other-month">
                <span v-if="dayobject.IS_WORK==1" class="Schedule_active" > {{ dayobject.day.getDate() }}</span> 
                <span  v-if="dayobject.IS_WORK==0" class="Schedule_work" >{{ dayobject.day.getDate()}}</span>
                <span v-if="dayobject.IS_WORK!=0&&dayobject.IS_WORK!=1" class="nois" >{{ dayobject.day.getDate() }}</span>
                <p style="padding-top:5px;color:#606266;padding-left:10px;">
                       <span>{{holidayTypeList[dayobject.HOLIDAY_TYPE]}}</span>
                       <span v-if="dayobject.IS_WORK==1&&activeName==1&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【课】</span>
                       <span v-if="dayobject.IS_WORK==0&&activeName==1&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【假】</span>
                       <span v-if="dayobject.IS_WORK==1&&activeName==2&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【班】</span>
                       <span v-if="dayobject.IS_WORK==0&&activeName==2&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【休】</span>
                   </p>
            </span>
            
            <!--如果是本月  还需要判断是不是这一天-->
            <span v-else>
          <!--今天  同年同月同日-->
                <span v-if="dayobject.IS_WORK==1" class="Schedule_active" >{{ dayobject.day.getDate()}} </span>
                   <span  v-if="dayobject.IS_WORK==0" class="Schedule_work" >{{ dayobject.day.getDate()}}</span>
                <span v-if="dayobject.IS_WORK!=0&&dayobject.IS_WORK!=1" class="nois">{{ dayobject.day.getDate() }}</span>
                <p style="padding-top:5px;color:#606266">
                       <span>{{holidayTypeList[dayobject.HOLIDAY_TYPE]}}</span>
                       <span v-if="dayobject.IS_WORK==1&&activeName==1&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【课】</span>
                       <span v-if="dayobject.IS_WORK==0&&activeName==1&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【假】</span>
                       <span v-if="dayobject.IS_WORK==1&&activeName==2&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【班】</span>
                       <span v-if="dayobject.IS_WORK==0&&activeName==2&&dayobject.HOLIDAY_TYPE!=1&&dayobject.HOLIDAY_TYPE!=2&&dayobject.HOLIDAY_TYPE!=3&&dayobject.HOLIDAY_TYPE!=4&&dayobject.HOLIDAY_TYPE!=5&&dayobject.HOLIDAY_TYPE!=6&&dayobject.HOLIDAY_TYPE!=7&&dayobject.HOLIDAY_TYPE!=8">【休】</span>
                   </p>
            </span>

        </li>
    </ul>
</div>
</div>
</div>
</div>
</div>
</div>

</div>

</div>
</template>
<script src="./js/Schedule.js"></script>