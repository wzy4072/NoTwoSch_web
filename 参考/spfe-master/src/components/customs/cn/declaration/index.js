import GoodsDeclarationEdit from './goods-declaration-edit';

var components = [
  GoodsDeclarationEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [];
}

export default { install, routes };
