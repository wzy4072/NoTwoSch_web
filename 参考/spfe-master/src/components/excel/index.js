import ImportPreview from './import';
import BindField from './bind-field';
import ExcelPreview from './preview/preview';
import CheckView from './checkview';

var components = [
  ImportPreview,
  BindField,
  ExcelPreview,
  CheckView
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/excel/preview/:schema/:id', name: "ImportPreview", component: ImportPreview, props: true },
    { path: '/excel/checkview/:schema/:id', name: "CheckView", component: CheckView, props: true }
  ]
}

export default { install, routes };
