import ProductSelect from './product-select';
import ElementValueEdit from './element-value-edit';

var components = [
  ProductSelect,
  ElementValueEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [];
}

export default { install, routes };
