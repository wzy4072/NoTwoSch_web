import InputVolume from './input-volume';
import InputWeight from './input-weight';

var components = [
  InputVolume,
  InputWeight
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [];
}

export default { install, routes };
