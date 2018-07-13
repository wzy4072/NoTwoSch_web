import ChinaCustoms from './cn';

var components = [
  ChinaCustoms
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(component => Vue.use(component));
};

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []));
}

export default { install, routes };
