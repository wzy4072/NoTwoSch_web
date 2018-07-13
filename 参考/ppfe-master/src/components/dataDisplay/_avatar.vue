<template>
    <div class="ava-temp">
        <div class="ava" :style="myStyle">
            <!-- <img :src="src"  > -->
        </div>
    </div>
</template>

<script>
import appResource from '@/api/resource.js';
export default {
    // props: { id: String, avatstyle: Object},
    props: ['gotid', 'id', 'avatstyle', 'isCom'],
    data() {
        return {
            src: ' ',
            myStyle: {
                width: '150px',
                height: '150px',
                backgroundColor: '#fff',
                borderRadius: '100%',
                backgroundImage: null,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                backgroundPosition:'center center'
            },
        }
    },
    watch: {
        gotid(val) {
            if(this.id){
                this.getSourceImg();
            }else{
                 this.getDefaultImg();
            }
        },
        id(val){
             if(val){
                this.getSourceImg();
            }
        }
    },
    //图片请求逻辑 1请求完成前是否有id。2请求完成后再根据是否有id给与默认值。
    created() {
        this.meregeStyle();
        if (this.id != null) {
            this.getSourceImg();
        } else {
            if (this.gotid) { this.getDefaultImg();}
        }
    },
    methods: {
        meregeStyle() {
            for (let key in this.avatstyle) {
                this.myStyle[key] = this.avatstyle[key]
            };
        },
        getSourceImg(){
             appResource.imgData(this.id).then(data => {
                    this.myStyle.backgroundImage = 'url(' + data + ')'
                    this.$emit('spin', false);
            });
        },
        getDefaultImg(){
            if (this.gotid) {
                this.myStyle.backgroundImage = this.isCom ? 'url(/static/images/home/ybglogo.png)' : 'url(/static/images/home/headdefault.png)';
                this.$emit('spin', false);
           }
        }
    }
}
</script>

<style scoped>
.ava-temp {
  display: inline-block;
}
.ava-temp .ava {
  overflow: hidden;
}
/* .ava-temp .ava img{
    display: block;
    width:100%;
} */
</style>

