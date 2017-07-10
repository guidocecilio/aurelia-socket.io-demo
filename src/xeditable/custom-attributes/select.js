import * as $ from 'jquery';
import { customAttribute, inject, bindable, TaskQueue }
  from 'aurelia-framework';

import { themes as THEMES } from '../themes';
import { editableDefaults } from '../constants';
import { icons as editableIcons } from '../icons';

import '../css/xeditable.css';

@customAttribute('editable-select')
@inject(Element, TaskQueue)
export class EditableSelectCustomAttribute {
  @bindable value;
  @bindable options;
  @bindable editableTheme;
  @bindable buttons;
  @bindable blur;

  @bindable onShow;
  @bindable onHide;

  // this.autosubmit = angular.noop;
  // this.onshow = angular.noop;
  // this.onhide = angular.noop;
  // this.oncancel = angular.noop;
  // this.onbeforesave = angular.noop;
  // this.onaftersave = angular.noop;

  inputEl = null;
  editorEl = null;
  // theme = editableThemes[]
  mouseupListener;
  focusListener;

  isShown = false;
  single = true;

  //to be overwritten by directive
  inputTpl = '<select></select>';

  theme = null;
  buttons = 'right';
  popover = false;

  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.$element = $(element);
    this.mouseupListener = (e) => this.handleMouseUp(e);
    this.focusListener = (e) => this.handleFocus(e);
    console.log(this);
  }

  bind(bindingContext) {
    console.log('bind invoked');
    this.themeName = this.editableTheme || editableDefaults.theme || 'default';
    this.theme =  THEMES[this.editableTheme] ||
      THEMES[editableDefaults.theme] || THEMES.default;
    let iconSetOption = editableDefaults.iconSet;
    this.iconSet = iconSetOption === 'default' ?
      editableIcons.default[this.themeName] :
        editableIcons.external[iconSetOption];

    // settings for single and non-single
    if (!this.single) {
      // hide buttons for non-single
      this.buttons = 'no';
    } else {
      this.buttons = this.buttons || editableDefaults.buttons;
    }
  }

  attached() {
    console.log('attached invoked');
    if (this.isInputElement()) {
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.focusListener);
    } else {
      this.element.addEventListener('click', this.mouseupListener);
    }
  }

  detached() {
    console.log('detached invoked');
    if (this.isInputElement) {
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.focusListener);
    } else {
      this.element.removeEventListner('click', this.mouseupListener);
    }
    document.removeEventListener('mouseup', this.mouseupListener);
  }

  isInputElement() {
    return this.element.nodeType === 1 &&
      this.element.tagName.toLowerCase() === 'input';
  }

  inElement(e) {
    let containerRect = this.element.getBoundingClientRect();
    let elementRect = this.element.getBoundingClientRect();
    let inContainerRect = e.clientX > containerRect.left &&
      e.clientX < containerRect.right && e.clientY > containerRect.top &&
        e.clientY < containerRect.bottom;
    let inElementRect = e.clientX > elementRect.left &&
      e.clientX < elementRect.right && e.clientY > elementRect.top &&
        e.clientY < elementRect.bottom;
    return inContainerRect && inElementRect;
  }

  // var container = $("YOUR CONTAINER SELECTOR");
  //   // if the target of the click isn't the container nor a descendant of the container
  //   if (!container.is(e.target) && container.has(e.target).length === 0) 
  //   {
  //       container.hide();
  //   }

  handleMouseUp(e) {
    console.log(e);
    if (!this.isInputElement() && !this.isShown) {
      this.show();
    } else if (this.isShown && !this.inElement(e)) {
      this.hide();
    }
  }

  handleFocus(e) {
    if (e.type === 'focus' && !this.isShown) {
      this.show();
    }
    if (e.type === 'blur') {
      if (this.isInputElement() && this.element.value !== this.value &&
        typeof this.value !== undefined) {
        this.element.value = this.value;
      }
    }
  }

  /*
    Called after show to attach listeners
    */
  addListeners() {
    // bind keyup for `escape`
    this.inputEl.bind('keyup', (e) => {
      if (!this.single) {
        return;
      }

      // todo: move this to editable-form!
      switch (e.keyCode) {
      // hide on `escape` press
      case 27:
        // this.scope.$apply(function() {
        //   this.scope.$form.$cancel();
        // });
        break;
      default:
      }
    });

    // autosubmit when `no buttons`
    if (this.single && this.buttons === 'no') {
      this.autosubmit();
    }
  }

  show() {
    /*
    Originally render() was inside init() method, but some directives polluting editorEl,
    so it is broken on second opening.
    Cloning is not a solution as jqLite can not clone with event handler's.
    */
    this.render();

    // insert into DOM
    this.$element.after(this.editorEl);

    // // compile (needed to attach ng-* events from markup)
    // newScope = $scope.$new();
    // $compile(this.editorEl)(newScope);

    // attach listeners (`escape`, autosubmit, etc)
    this.addListeners();

    // hide element
    this.$element.addClass('editable-hide');

    this.isShown = true;
    // onshow
    // return this.onshow();
  }

  hide() {
    // // destroy the scope to prevent memory leak
    // newScope.$destroy();

    this.controlsEl.remove();
    this.editorEl.remove();
    this.$element.removeClass('editable-hide');

    // if (this.popover) {
    //   $templateCache.remove('popover.html');
    // }

    this.isShown = false;
    // onhide
    // return this.onhide();
  }

  render() {
    let theme = this.theme;

    //build input
    this.inputEl = $(this.inputTpl);

    //build controls
    this.controlsEl = $(theme.controlsTpl);
    this.controlsEl.append(this.inputEl);

    //build buttons
    if (this.buttons !== 'no') {
      this.buttonsEl = $(theme.buttonsTpl);
      this.submitEl = $(theme.submitTpl);
      this.resetEl = $(theme.resetTpl);
      this.cancelEl = $(theme.cancelTpl);
      // this.submitEl.attr('title', editableDefaults.submitButtonTitle);
      // this.submitEl.attr('aria-label', editableDefaults.submitButtonAriaLabel);
      // this.cancelEl.attr('title', editableDefaults.cancelButtonTitle);
      // this.cancelEl.attr('aria-label', editableDefaults.cancelButtonAriaLabel);
      // this.resetEl.attr('title', editableDefaults.clearButtonTitle);
      // this.resetEl.attr('aria-label', editableDefaults.clearButtonAriaLabel);

      if (this.iconSet) {
        this.submitEl.find('span').addClass(this.iconSet.ok);
        this.cancelEl.find('span').addClass(this.iconSet.cancel);
        this.resetEl.find('span').addClass(this.iconSet.clear);
      }

      this.buttonsEl.append(this.submitEl).append(this.cancelEl);

      if (editableDefaults.displayClearButton) {
        this.buttonsEl.append(this.resetEl);
      }

      this.controlsEl.append(this.buttonsEl);
      this.inputEl.addClass('editable-has-buttons');
    }

    //build error
    this.errorEl = theme.errorTpl;
    this.controlsEl.append(this.errorEl);

    //build editor
    this.editorEl = $(this.single ? theme.formTpl : theme.noformTpl);
    this.editorEl.append(this.controlsEl);

    this.inputEl.addClass('editable-input');

    if (this.single) {
      this.editorEl.attr('editable-form', '$form');
      // transfer `blur` to form
      this.editorEl.attr('blur', this.blur || editableDefaults.blurElem);
    }

    // if (this.popover) {
    //   let wrapper = $('<div></div>');
    //   wrapper.append(this.editorEl);
    //   this.editorEl = wrapper;
    //   // $templateCache.put('popover.html', this.editorEl[0].outerHTML);
    // }

    //apply `postrender` method of theme
    // if (angular.isFunction(theme.postrender)) {
    //   theme.postrender.call(this);
    // }

    if (this.options) {
      const placeholder = $('<option value="' + this.options[0].value + '">' +
        this.options[0].text + '</option>');
      this.inputEl.append(placeholder);
    }
  }

  autosubmit() {

  }

  // createForm() {
  //   this.viewEngine.loadViewFactory('../templates/form.html').then(factory => {
  //     const childContainer = this.container.createChild();
  //     const view = factory.create(childContainer);

  //     view.bind(this);

  //     this.createElement(view)
  //     this.setPosition()

  //     if (this.isInputElement)
  //       document.addEventListener('mouseup', this.mouseupListener);

  //     this.show = true;
  //   })

  // }

}
