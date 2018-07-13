import ClickEditInput from './click-edit-input/click-edit-input';

var components = [
  ClickEditInput
];
/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [];
}

export default { install, routes };
