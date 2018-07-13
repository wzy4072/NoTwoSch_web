import SkuSelect from './sku-select';
import SkuList from './list';
import SkuEdit from './edit';

var components = [
  SkuSelect,
  SkuList,
  SkuEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/sku', name: 'SkuList', component: SkuList },
    { path: '/sku/:id', name: 'SkuEdit', component: SkuEdit, props: true }
  ]
}

export default {install, routes};
