<style scoped lang="less">
  .qrcode-item {
    display: inline-block;
    img{
      width:125px;
      height:125px;
    }
  }
</style>
<template>
    <div class="ins-container">
      <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
          <returnBtn :title="'幼儿保健二维码管理'"></returnBtn>
        </div>
      </div>
      <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-search">
          <div class="ins-search-con">
            筛选条件：
            <el-select v-model="value" placeholder="请选择" size="medium">
              <el-option v-for="(item,key) in options" :key="key" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="ins-opa-btn">
            <el-button @click="addRecord()" type="primary" size="small">添加检查记录</el-button>
            <!-- <el-button @click="exportExcel()" type="success" size="medium" >导出excel</el-button> -->
          </div>
        </div>
        <div class="ins-page-main">
          <div class="ins-content">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>学生二维码表</span>
            </div>
            <div class="ins-content-con">
              <div class="qrcode-item">
                <p><img src="../../assets/images/qrcode_for258.jpg"></p>
                <p class="ins-s-tc">学生姓名</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/qrcodeManage.js"></script>
