import Code from './code';
import Container from './container';
import Entity from './entity';
import Classification from './classification';
import Registry from './registry';
import Product from './product';
import Consolidation from './consolidation';
import Declaration from './declaration';

var components = [
  Code,
  Container,
  Entity,
  Product,
  Classification,
  Registry,
  Consolidation,
  Declaration
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(component => Vue.use(component));
};

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []));
}

export default { install, routes };
