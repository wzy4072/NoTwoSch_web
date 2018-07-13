import ClassificationList from './list';
import ClassificationEdit from './edit';
import IntelligentClassification from './intelligent-classification';

var components = [
  ClassificationList,
  ClassificationEdit,
  IntelligentClassification
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/customs/cn/classification', name: 'ClassificationList', component: ClassificationList },
    { path: '/customs/cn/classification/:id', name: 'ClassificationEdit', component: ClassificationEdit, props: true }
  ];
}

export default { install, routes };
