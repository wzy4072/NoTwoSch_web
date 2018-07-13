<template>
    <ul>
      <li
        v-for="(item, index) in properties" :key="index"
        :class="{ blueColor: isColorBlue }">
        <span>{{item.key}}</span> : <span>{{item.value}}</span>
      </li>
    </ul>
</template>

<script>
export default {
  name: "properties-show",
  props: {
    value: {
      type: Object
    },
    isColorBlue: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      properties: this.convertToSingleItems(this.value)
    }
  },
  methods: {
    convertToSingleItems(map) {
      var arr = [];
      for (var key in map) {
        for (var i = 0; i < map[key].length; i++) {
          arr.push({
            key: key,
            value: map[key][i]
          });
        }
      }
      return arr;
    }
  },
  watch: {
    value() {
      this.properties = this.convertToSingleItems(this.value);
    }
  }

}
</script>

<style scoped>
.blueColor {
  color: #409EFF
}
</style>
