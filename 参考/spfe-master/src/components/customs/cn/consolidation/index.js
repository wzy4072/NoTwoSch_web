import ConsolidationList from './list';
import ConsolidationEdit from './edit';

var components = [
  ConsolidationList,
  ConsolidationEdit
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/customs/cn/consolidation', name: 'ConsolidationList', component: ConsolidationList },
    { path: '/customs/cn/consolidation/new', name: 'ConsolidationCreate', component: ConsolidationEdit },
    { path: '/customs/cn/consolidation/:id', name: 'ConsolidationEdit', component: ConsolidationEdit, props: true }
  ];
}

export default { install, routes };
