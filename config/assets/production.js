'use strict';

module.exports = {
  // client: {
  //   lib: {
  //     css: [
  //       'public/lib/bootstrap/dist/css/bootstrap.min.css',
  //       'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
  //     ],
  //     js: [
  //       'public/lib/angular/angular.min.js',
  //       'public/lib/angular-resource/angular-resource.min.js',
  //       'public/lib/angular-animate/angular-animate.min.js',
  //       'public/lib/angular-ui-router/release/angular-ui-router.min.js',
  //       'public/lib/angular-ui-utils/ui-utils.min.js',
  //       'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
  //       'public/lib/angular-file-upload/angular-file-upload.min.js'
  //     ]
  //   },
  //   css: 'public/dist/application.min.css',
  //   js: 'public/dist/application.min.js'
  // }
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-plotly/src/angular-plotly.js',
        'modules/bars/directives/candleChart.js',
        'https://cdn.rawgit.com/etpinard/plotlyjs-finance/master/plotlyjs-finance.js',
        'https://cdn.plot.ly/plotly-latest.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
