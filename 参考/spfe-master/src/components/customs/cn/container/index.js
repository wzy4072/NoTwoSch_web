import ContainerList from './list';

var components = [
  ContainerList
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/customs/cn/container', name: 'CustomsCnContainerList', component: ContainerList }
  ];
}

export default { install, routes };
