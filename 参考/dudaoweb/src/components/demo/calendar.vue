<template>
<div class="content contentd">
  <div class="elcont from fromall">
  <full-calendar :events="fcEvents" lang="zh"></full-calendar>
</div>
</div>
</template>
<script>
import fullCalendar from 'vue-fullcalendar'
const demoEvents = [
  {
    title: '日历',
    start: '2016-08-25',
    end: '2017-07-27'
  }
]
export default {
  data () {
    return {
      fcEvents: demoEvents
    }
  },
  components: {
    fullCalendar
  }
}
</script>

