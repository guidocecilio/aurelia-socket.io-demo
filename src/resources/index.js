export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./attributes/blob-src'),
    PLATFORM.moduleName('./attributes/file-drop-target'),
    PLATFORM.moduleName('./attributes/submit-task'),

    PLATFORM.moduleName('./elements/file-picker'),
    PLATFORM.moduleName('./elements/group-list.html'),
    PLATFORM.moduleName('./elements/list-editor'),
    PLATFORM.moduleName('./elements/submit-button.html'),

    PLATFORM.moduleName('./value-converters/filter-by'),
    PLATFORM.moduleName('./value-converters/group-by'),
    PLATFORM.moduleName('./value-converters/order-by')
  ]);
}
