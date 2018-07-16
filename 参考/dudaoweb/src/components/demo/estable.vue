<template>
<div class="content">
<div class="elcont">
 <div class="elcontitle">
    <span class="prolist">项目列表</span>
    <div class="right mar10">
        <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
         <el-button slot="append" icon="el-icon-search" size="mini" @click="search"></el-button>
        </el-input>
    </div>
  </div>
 <table  cellspacing="0" class="table" border="0" id="table">

 </table>
</div>
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.YS.YS_jquery().then($ => {
      console.log($(document).length)
    })
    this.fullscreenLoading = false
    this.$api
      .promise({
        method: 'POST',
        url: 'demo/demo'
      })
      .then(data => {
        this.fullscreenLoading = false
        if (data.data.code > 0) {
          var html = []
          data.data.list.forEach(function (o) {
            html.push('<tr>')
            Object.keys(o).forEach(function (d) {
              html.push('<td>' + o[d] + '</td>')
            })
            html.push('</tr>')
          })
          document.querySelector('#table').innerHTML = html.join('')
        } else {
          this.$message.error(data.data.desc)
        }
      })
  }
}
</script>
<style>
.table tr,
.table td {
  border: 1px solid #e6ebf5;
}
</style>

