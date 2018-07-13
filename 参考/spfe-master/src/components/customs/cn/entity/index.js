import EntityList from './list';
import EntityEdit from './edit';
import EntitySelect from './entity-select';

var components = [
  EntityList,
  EntityEdit,
  EntitySelect
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/customs/cn/entity', name: 'EntityList', component: EntityList },
    { path: '/customs/cn/entity/new', name: 'EntityCreate', component: EntityEdit },
    { path: '/customs/cn/entity/:id', name: 'EntityEdit', component: EntityEdit, props: true }
  ];
}

export default { install, routes };
