<template>
<div class="content contentd">
  <div class="elcont from fromall">
  	<div id="allmap" style="height:100%;width:100%"></div>
  </div>
</div>
</template>
<script>
export default {
  mounted () {
    this.YS.YS_map().then(() => {
        // 百度地图API功能
      var map = new window.BMap.Map('allmap')    // 创建Map实例
      map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11)  // 初始化地图,设置中心点坐标和地图级别
      map.addControl(new window.BMap.MapTypeControl({
        mapTypes: [
          window.BMAP_NORMAL_MAP,
          window.BMAP_HYBRID_MAP
        ]}))
      map.setCurrentCity('北京')          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
    })
  }
}
</script>

