import { PLATFORM } from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      {
        route: '', redirect: findDefaultRoute(router)
      }
    ]);
    config.mapUnknownRoutes('not-found');
    // config.map([
    //   { route: ['', 'welcome'], name: 'welcome',      moduleId: PLATFORM.moduleName('./welcome'),      nav: true, title: 'Welcome' },
    //   { route: 'users',         name: 'users',        moduleId: PLATFORM.moduleName('./users'),        nav: true, title: 'Github Users' },
    //   { route: 'child-router',  name: 'child-router', moduleId: PLATFORM.moduleName('./child-router'), nav: true, title: 'Child Router' }
    // ]);

    this.router = router;
  }
}

function findDefaultRoute(router) {
  return router.navigation[0].relativeHref;
}

// export class App {

//   configureRouter(config, router) {
//     this.router = router;
//     config.title = 'Learning Aurelia';
//     config.map([
//       { route: '', redirect: findDefaultRoute(router) },
//     ]);
//     config.mapUnknownRoutes('not-found');
//   }
// }
