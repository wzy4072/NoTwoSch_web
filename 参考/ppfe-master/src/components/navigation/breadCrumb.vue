<template>
    <div>
        <v-breadcrumb>
            <v-breadcrumb-item v-for="(item, index) in crumbItems" :key="index">
                <a :href="item.link">{{item.name}}</a>
            </v-breadcrumb-item>
        </v-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: "bread-crumb",
        data(){
            return {
                crumbItems: [
                    {
                        name: "Home",
                        link: "#"
                    },
                    {
                        name: "A",
                        link: "#"
                    },
                    {
                        name: "B",
                        link: "#"
                    }
                ],
            }
        },
        computed: {
            key() {
                
            }
        }
    }
</script>

<style scoped>

</style>