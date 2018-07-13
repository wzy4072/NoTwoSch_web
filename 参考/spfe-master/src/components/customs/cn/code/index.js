import CodeSelect from './code-select';

var components = [
  CodeSelect
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
  ];
}

export default { install, routes };
