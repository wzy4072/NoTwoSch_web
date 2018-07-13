import GoodsList from './list';
import GoodsEdit from './edit';
import Manifest from "./manifest";
import PackingList from './packing-list';
import GoodsSelect from './select';

var components = [
  GoodsList,
  GoodsEdit,
  Manifest,
  PackingList,
  GoodsSelect
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/goods', name: 'GoodsList', component: GoodsList },
    { path: '/goods/new', name: 'GoodsCreate', component: GoodsEdit },
    { path: '/goods/:id', name: 'GoodsEdit', component: GoodsEdit, props: true }
  ]
}

export default { install, routes };
