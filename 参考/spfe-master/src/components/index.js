import Controls from './controls';
import Welcome from './welcome';
import Measurement from './measurement';
import Container from './container';
import Sku from './sku';
import Customs from './customs';
import Goods from './goods';
import Asn from './asn';
import Excel from './excel';
import Resource from './resource';

const components = [
  Controls,
  Welcome,
  Measurement,
  Container,
  Sku,
  Customs,
  Goods,
  Excel,
  Asn,
  Resource
]

// setup code, do not change!
const install = function (Vue, opts = {}) {
  components.map(component => Vue.use(component));
}

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []));
}

export default { install, routes };
