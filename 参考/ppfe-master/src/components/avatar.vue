<template>
    <div class="ava-temp">
        <extavatar v-if="src == null" :username="name" :size="size" :rounded="rounded" backgroundColor='#fff'></extavatar>
        <extavatar v-else :src="src" :username="name" :size="size"  :rounded="rounded"></extavatar>
    </div>
</template>

<script>
    import Avatar from 'vue-avatar/dist/vue-avatar.min.js';
    import appResource from '@/api/resource.js';

    export default {
        components: {
            extavatar: Avatar.Avatar,
        },
        props: {
            id: String,
            name: String,
            size: Number,
            rounded:Boolean,
        },
        data() {
            return {
                src: null,
                defaultSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDREFBN0FDQTI4QzExRTdBQjAzQzJGMTMyNzE4M0IxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDREFBN0FEQTI4QzExRTdBQjAzQzJGMTMyNzE4M0IxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNEQUE3QUFBMjhDMTFFN0FCMDNDMkYxMzI3MTgzQjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNEQUE3QUJBMjhDMTFFN0FCMDNDMkYxMzI3MTgzQjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N7O4BAAAPfklEQVR42rxZ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",
            }
        },
        watch: {
            id(val) {
                if (val != null) {
                    appResource.imgData(val).then(data => {
                        this.src = data;
                        this.$emit('spin',false);
                    });
                } else {
                    this.src =  null;
                    this.$emit('spin',false);
                }
            }
        },
        created() {
            if (this.id != null) {
                appResource.imgData(this.id).then(data => {
                    this.src = data;
                    this.$emit('spin',false);
                });
            } else {
                this.src =  null;
                //this.defaultSrc;
                this.$emit('spin',false);
            }
        }
    }
</script>

<style scoped>
.ava-temp{
    display: inline-block;
}

</style>

