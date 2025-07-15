
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: './',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/perros"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23524, hash: '0bf4cf741b1277a04aca6c9fb1975e757082176072aca704745fdd27923eb4c5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17143, hash: '2c744f0c266c48b6140fc732cfe616bddaa43fb4852d4172eb05c26bfed5e58f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 86641, hash: '3fdf2ac8d9e3a68d39765ab0176bd961096dc3ad5d4babc738ac2f60a64e67cf', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'perros/index.html': {size: 86641, hash: '3fdf2ac8d9e3a68d39765ab0176bd961096dc3ad5d4babc738ac2f60a64e67cf', text: () => import('./assets-chunks/perros_index_html.mjs').then(m => m.default)},
    'styles-Z5UYKNDX.css': {size: 6934, hash: 'VxIyzD7LHG8', text: () => import('./assets-chunks/styles-Z5UYKNDX_css.mjs').then(m => m.default)}
  },
};
