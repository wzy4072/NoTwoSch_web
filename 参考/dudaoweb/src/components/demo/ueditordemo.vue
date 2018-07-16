<template>
<div class="content contentd">
  <div class="elcont from fromall">
			<div style="width:80%;max-width:1000px;margin:0px auto">
				<ue :maindata.sync="maindata" :config="config" ref ="Ue"></ue>
			</div>
		</div>
	</div>
</template>
<script>
import ue from '@/common/components/ueditor.vue'
export default {
  components: { ue },
  data () {
    return {
      maindata: {
        intdata: '<p>aaaaa</p>',
        outdata: ''
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      }
    }
  },
  mounted () {},
  methods: {
    getContents: function () {
      console.log(this.maindata.outdata)
    }
  }
}
</script>
<style scoped>

</style>
