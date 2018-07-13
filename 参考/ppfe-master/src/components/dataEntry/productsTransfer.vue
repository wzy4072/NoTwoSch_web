<template>
    <v-transfer :data="dataSource" 
                :target-keys="targetKeys" 
                @change="handleChange2" 
                show-search
                :filter-option="filterOption"
                :label="render1"
                slot="leftFooter">
        <div :style="{float: 'right', margin: '5px'}" slot="leftFooter">
            未参与促销产品
        </div>
        <div :style="{float: 'right', margin: '5px'}" slot="rightFooter">
            已选择产品
        </div>
    </v-transfer>
</template>

<script>
    export default {
        /*
        * 
        * */
        props: ['addProductsEntry'],
        data() {
            return {
                dataSource: [],
                targetKeys: []
            }
        },
        created() {
            this.dataSource = this.addProductsEntry.data;
            this.targetKeys = this.addProductsEntry.target;
        },
        methods: {
            
            render1(item) {
                return item.title;
            },
            handleChange2(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
                this.$emit('productids', targetKeys);
            },
            filterOption(inputValue, option) {
                return option.description.indexOf(inputValue) > -1;
            }
        }
    }
</script>

<style>

</style>