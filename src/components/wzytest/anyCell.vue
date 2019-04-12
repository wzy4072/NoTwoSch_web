<template>
  <div>
    <component
      :is="anyCell"
      :cellInfo="cellInfo"
      @change="valChange"
      @getForm="getForm"
      v-model="val"
    ></component>
    <!-- this.typeForCom[this.cellInfo.type]:{{this.typeForCom[this.cellInfo.type]}} -->
  </div>
</template>
<script>
import CellInput from "./cellInput.vue";
import CellMultiselect from "./cellMultiselect.vue";
import CellSelect from "./cellSelect.vue";
import CellText from "./cellText.vue";
import CellDate from "./cellDate.vue";

const typeForCom = {
  input: "CellInput",
  date: "CellDate",
  text: "CellText",
  select: "CellSelect",
  multiselect: "CellMultiselect"
};

function giVal(v) {
  const vType = Object.prototype.toString.call(v).slice(8, -1);
  if (vType === "Number" || vType === "String") {
    return v;
  }
  return JSON.parse(JSON.stringify(v));
}
export default {
  components: {
    CellInput,
    CellMultiselect,
    CellSelect,
    CellText,
    CellDate
  },
  props: {
    cellInfo: {
      type: Object,
      required: true
    },
    value: {
      type: [Object, Number, Array, String],
      // type: [Object, Number, Array, String, Date],
      required: true
    }
  },
  created() {
    this.val = giVal(this.value);
    // JSON.parse(JSON.stringify())
  },
  watch: {
    value(nv, ov) {
      this.val = giVal(nv);
    }
  },
  data() {
    return {
      anyCell: typeForCom[this.cellInfo.type],
      // this.typeForCom[this.cellInfo.type],
      val: null
    };
  },
  methods: {
    valChange(val) {
      this.$emit("input", val);
    },
    getForm(f) {
      this.$emit("getForm", f);
    }
  }
};
</script>

