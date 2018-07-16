<template>
    <div :id="id"></div>
</template>
<script>
export default {
  data () {
    return {
      editor: null
    }
  },
  props: {
    id: {
      type: String,
      required: false,
      default: () => {
        return {}
      }
    },
    maindata: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  mounted () {

  },
  created () {
    let _that = this
    this.YS.YS_ueditor(() => {
      setTimeout(function () {
        _that.createUe()
      }, 800)
    })
  },
  methods: {
    createUe () {
      this.$nextTick(() => {
        this.editor = window.UE.getEditor(this.id, this.config)
        this.editor.addListener('ready', () => {
          this.editor.setContent(this.maindata.intdata)
        })
        this.editor.addListener('contentChange', () => {
          this.maindata.outdata = this.editor.getContent()
          this.maindata.outdataTxt = this.editor.getContentTxt()
        })
      })
    }
  },
  destroyed () {
    this.editor.destroy()
  }

}
</script>
<style scoped>

</style>
