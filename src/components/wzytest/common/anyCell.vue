<template>
  <div>
    <component
      :is="anyCell"
      :cellInfo="cellInfo"
      @change="valChange"
      @getForm="getForm"
      :size="'mini'"
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
import CellNumber from "./cellNumber.vue";
// import CellEmpty from "./cellEmpty.vue";
const typeForCom = {
  input: "CellInput",
  number: "CellNumber",
  date: "CellDate",
  // text: "CellText",
  text: "CellInput",
  select: "CellSelect",
  multiselect: "CellMultiselect"
};

function giVal(v) {
  const vType = Object.prototype.toString.call(v).slice(8, -1);
  if (vType === "Object") {
    return JSON.parse(JSON.stringify(v));
  } else {
    if (v === undefined) {
      return "";
    }
    return v;
  }
}
export default {
  components: {
    CellInput,
    CellMultiselect,
    CellSelect,
    CellText,
    CellDate,
    CellNumber
  },
  props: {
    cellInfo: {
      type: Object,
      required: true
    },
    value: {
      // type: [Object, Number, Array, String, undefined],
      // type: [Object, Number, Array, String, Date],
      // required: true
    }
  },
  created() {
    if (this.value == undefined) {
      console.log(this.cellInfo);
    }
    this.val = giVal(this.value);
    if (!this.cellInfo.fieldType) {
      console.error("[error]: cell type is", this.cellInfo.fieldType);
    }
  },
  watch: {
    value(nv, ov) {
      this.val = giVal(nv);
    }
  },
  data() {
    return {
      anyCell: typeForCom[this.cellInfo.fieldType],
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

