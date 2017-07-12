export class Contacts {

  configureRouter(config) {
    config.map([
      {
        route: '',
        name: 'contacts',
        moduleId: PLATFORM.moduleName('./components/list'),
        title: 'Contacts'
      },
      {
        route: 'new',
        name: 'contact-creation',
        moduleId: PLATFORM.moduleName('./components/creation'),
        title: 'New contact'
      },
      {
        route: ':id',
        name: 'contact-details',
        moduleId: PLATFORM.moduleName('./components/details')
      },
      {
        route: ':id/edit',
        name: 'contact-edition',
        moduleId: PLATFORM.moduleName('./components/edition')
      },
      {
        route: ':id/photo',
        name: 'contact-photo',
        moduleId: PLATFORM.moduleName('./components/photo')
      }
    ]);
  }
}
