<template>
<div class="content contentd">
  <div class="elcont from fromall">
  <div ref="qrcode"></div>
</div>
</div>
</template>
<script>
export default {
  mounted () {
    this.YS.YS_qrcode().then(() => {
      var d = new window.QRCode(this.$refs.qrcode, 'your content')
      console.log(d)
    })
  }
}
</script>

