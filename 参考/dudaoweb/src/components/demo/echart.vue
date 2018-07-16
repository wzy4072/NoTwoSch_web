<template>
<div class="content contentd">
  <div class="elcont from fromall">
 <div ref="main" style="width: 600px;height:400px;"></div>
</div>
</div>
</template>
<script>
export default {
  mounted () {
    this.YS.YS_echarts().then(echarts => {
      echarts.init(this.$refs.main).setOption({
        series: {
          type: 'pie',
          data: [
                    {name: 'A', value: 1212},
                    {name: 'B', value: 2323},
                    {name: 'C', value: 1919}
          ]
        }
      })
    })
  }
}
</script>


