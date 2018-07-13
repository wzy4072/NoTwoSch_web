import RegistryList from './list';
import RegistryEdit from './edit';
import RegistryItemSelect from './registry-item-select';

var components = [
  RegistryList,
  RegistryEdit,
  RegistryItemSelect
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/customs/cn/registry', name: 'RegistryList', component: RegistryList },
    { path: '/customs/cn/registry/new', name: 'RegistryCreate', component: RegistryEdit },
    { path: '/customs/cn/registry/:id', name: 'RegistryEdit', component: RegistryEdit, props: true }
  ];
}

export default { install, routes };
