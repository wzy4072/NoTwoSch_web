import ContainerSelect from './container-select';
import ContainerList from './list';
import ContainerEdit from './edit';

var components = [
  ContainerSelect,
  ContainerList,
  ContainerEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/basic/container', name: 'ContainerList', component: ContainerList },
    { path: '/basic/container/:id', name: 'ContainerEdit', component: ContainerEdit, props: true }
  ];
}

export default { install, routes };
