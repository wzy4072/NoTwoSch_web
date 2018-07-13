import Upload from './upload';

var components = [
  Upload
];

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(comp => Vue.component(comp.name, comp));
};

const routes = function () {
  return [
    { path: '/upload/:nextUrl', name: 'Upload', component: Upload, props: true }
  ]
}

export default { install, routes };
