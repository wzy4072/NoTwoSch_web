<template>
    <div id="home-calendar">
        <v-date-picker v-model="date1"
                       ref="dateInput"
                       :popupContainer="popupContainer"
                       clearable 
                       @change="change"></v-date-picker>
        <div class="calendar-decoration"></div>
    </div>
</template>

<script>
    // import 
    export default {
        data() {
            return {
                // date1: '2015-12-06',
                // rangeDate1: ['2015-12-06','2016-12-06']
            }
        },
        watch: {
            date1(val){
                console.log('watch:', val)
            },
            rangeDate1(val){
                console.log('watch:', val)
            }
        },
        computed: {
            date1: function () {
                var date = new Date();
                console.log(date.getMonth());
                var today = date.getFullYear() + '-' + (+date.getMonth()+1) + '-' + date.getDate();
                return today;
            },
            rangeDate1: function() {
                var date = new Date();
                var today = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                return [today, today]
            }
        },
        methods: {
            confirm() {
            },
            change(time) {
            },
            rangeChange(startTime, endTime) {
                
            },
            popupContainer() {
                return document.getElementById("home-calendar")
            },
        },
        mounted() {
            this.$refs.dateInput.click();
            this.$refs.dateInput.click();
        }
    }
</script>
<style>
    #home-calendar .ant-calendar-picker-container {
        display: block !important;
    }
    #home-calendar .ant-calendar-picker {
        visibility: hidden;
    }
    #home-calendar .ant-calendar {
        position: absolute;
    }
    #home-calendar .ant-calendar-date-panel {
        position: absolute;
        width: 400px;
        height: 254px;
        left: 30px;
        top: -20px;
    }
    #home-calendar .ant-calendar {
        box-shadow: 0 0 0;
    }
    #home-calendar .ant-calendar-prev-month-btn {
        position: relative;
        left: -5px;
    }
    #home-calendar .ant-calendar-prev-year-btn {
        position: relative;
        left: -15px;
    }
    #home-calendar .ant-calendar-next-month-btn {
        position: relative;
        right: -5px;
    }
    #home-calendar .ant-calendar-next-year-btn {
        position: relative;
        right: -15px;
    }
    #home-calendar .ant-calendar-column-header-inner {
        font-size: 14px;
        color: #00aee0;
    }
    #home-calendar .ant-calendar-selected-day .ant-calendar-date {
        color: #fff;
    }
    #home-calendar .ant-calendar-date {
        border-radius: 50%;
        font-size: 14px;
        color: #666;
    }
    #home-calendar .ant-calendar-next-month-btn-day .ant-calendar-date{
        color: #999;
    }
    #home-calendar .ant-calendar-picker-container {
        z-index: 1;
    }
</style>
<style scoped>
    #home-calendar {
        position: relative;
        width: 460px;
        height: 286px;
        float: right;
        background-color: #fff;
        border-left: 1px dashed #ddd;
    }
    .calendar-decoration {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    background-color: #cae5f6;
}
</style>