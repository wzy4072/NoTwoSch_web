import AsnList from './list';
import AsnEdit from './edit';

var components = [
  AsnList,
  AsnEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/asn', name: 'AsnList', component: AsnList },
    { path: '/asn/new', name: 'AsnCreate', component: AsnEdit },
    { path: '/asn/new/:goodsids', name: 'AsnCreateWithGoods', component: AsnEdit, props: true },
    { path: '/asn/:id', name: 'AsnEdit', component: AsnEdit, props: true }
  ]
}

export default {install, routes};
