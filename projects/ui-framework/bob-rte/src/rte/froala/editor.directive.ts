import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Directive, ElementRef, EventEmitter, Input, NgZone, Optional, Output, forwardRef, Renderer2 } from '@angular/core';

import FroalaEditor from 'froala-editor';

@Directive({
  selector: '[froalaEditor]',
  exportAs: 'froalaEditor',
  providers: [{
    provide: NG_VALUE_ACCESSOR, useExisting:
      forwardRef(() => FroalaEditorDirective),
    multi: true
  }]
})
export class FroalaEditorDirective implements ControlValueAccessor {

  // editor options
  private _opts: any = {
    immediateAngularModelUpdate: false,
    angularIgnoreAttrs: null
  };

  private _element: any;

  private SPECIAL_TAGS: string[] = ['img', 'button', 'input', 'a'];
  private INNER_HTML_ATTR: string = 'innerHTML';
  private _hasSpecialTag: boolean = false;

  // editor element
  private _editor: any;

  // initial editor content
  private _model: string;

  private _editorInitialized: boolean = false;

  private _oldModel: string = null;

  constructor(el: ElementRef, private zone: NgZone) {

    let element: any = el.nativeElement;

    // check if the element is a special tag
    if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) != -1) {
      this._hasSpecialTag = true;
    }
    this._element = element;

    this.zone = zone;
  }

  // Begin ControlValueAccesor methods.
  onChange = (_) => { };
  onTouched = () => { };

  // Form model content changed.
  writeValue(content: any): void {
    this.updateEditor(content);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // End ControlValueAccesor methods.

  // froalaEditor directive as input: store the editor options
  @Input() set froalaEditor(opts: any) {
    this._opts = opts || this._opts;
  }

  // froalaModel directive as input: store initial editor content
  @Input() set froalaModel(content: any) {
    this.updateEditor(content);
  }

  // Update editor with model contents.
  private updateEditor(content: any) {
    if (JSON.stringify(this._oldModel) == JSON.stringify(content)) {
      return;
    }

    if (!this._hasSpecialTag) {
      this._oldModel = content;
    }
    else {
      this._model = content;
    }

    if (this._editorInitialized) {
      if (!this._hasSpecialTag) {
        this._editor.html.set(content);
      }
      else {
        this.setContent();
      }
    }
    else {
      if (!this._hasSpecialTag) {
        this._element.innerHTML = content || '';
      }
      else {
        this.setContent();
      }
    }
  }

  // froalaModel directive as output: update model if editor contentChanged
  @Output() froalaModelChange: EventEmitter<any> = new EventEmitter<any>();

  // froalaInit directive as output: send manual editor initialization
  @Output() froalaInit: EventEmitter<Object> = new EventEmitter<Object>();

  // update model if editor contentChanged
  private updateModel() {
    this.zone.run(() => {

      let modelContent: any = null;

      if (this._hasSpecialTag) {

        let attributeNodes = this._element.attributes;
        let attrs = {};

        for (let i = 0; i < attributeNodes.length; i++) {

          let attrName = attributeNodes[i].name;
          if (this._opts.angularIgnoreAttrs && this._opts.angularIgnoreAttrs.indexOf(attrName) != -1) {
            continue;
          }

          attrs[attrName] = attributeNodes[i].value;
        }

        if (this._element.innerHTML) {
          attrs[this.INNER_HTML_ATTR] = this._element.innerHTML;
        }

        modelContent = attrs;
      } else {

        let returnedHtml: any = this._editor.html.get();
        if (typeof returnedHtml === 'string') {
          modelContent = returnedHtml;
        }
      }
      if (this._oldModel !== modelContent) {
        this._oldModel = modelContent;

        // Update froalaModel.
        this.froalaModelChange.emit(modelContent);

        // Update form model.
        this.onChange(modelContent);
      }

    })
  }

  private registerEvent(eventName, callback) {

    if (!eventName || !callback) {
      return;
    }

    if (!this._opts.events) {
      this._opts.events = {};
    }

    this._opts.events[eventName] = callback;
  }

  private initListeners() {
    let self = this;
    // Check if we have events on the editor.
    if (this._editor.events) {
      // bind contentChange and keyup event to froalaModel
      this._editor.events.on('contentChanged', function () {
        setTimeout(function () {
          self.updateModel();
        }, 0);
      });
      this._editor.events.on('mousedown', function () {
        setTimeout(function () {
          self.onTouched();
        }, 0);
      });

      if (this._opts.immediateAngularModelUpdate) {
        this._editor.events.on('keyup', function () {
          setTimeout(function () {
            self.updateModel();
          }, 0);
        });
      }
    }

    this._editorInitialized = true;
  }

  private createEditor() {
    if (this._editorInitialized) {
      return;
    }

    this.setContent(true);

    // init editor
    this.zone.runOutsideAngular(() => {
      // Add listeners on initialized event.
      if (!this._opts.events) this._opts.events = {}

      // Register initialized event.
      this.registerEvent('initialized', this._opts.events && this._opts.events.initialized);
      const existingInitCallback = this._opts.events.initialized;
      // Default initialized event.
      if (!this._opts.events.initialized || !this._opts.events.initialized.overridden) {
        this._opts.events.initialized = () => {
          this.initListeners();
          existingInitCallback && existingInitCallback.call(this._editor, this);
        };
        this._opts.events.initialized.overridden = true;
      }

      // Initialize the Froala Editor.
      this._editor = new FroalaEditor(
        this._element,
        this._opts
      );
    });
  }

  private setHtml() {
    this._editor.html.set(this._model || "");

    // This will reset the undo stack everytime the model changes externally. Can we fix this?
    this._editor.undo.reset();
    this._editor.undo.saveStep();
  }

  private setContent(firstTime = false) {
    let self = this;

    // Set initial content
    if (this._model || this._model == '') {
      this._oldModel = this._model;
      if (this._hasSpecialTag) {

        let tags: Object = this._model;

        // add tags on element
        if (tags) {

          for (let attr in tags) {
            if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
              this._element.setAttribute(attr, tags[attr]);
            }
          }

          if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
            this._element.innerHTML = tags[this.INNER_HTML_ATTR];
          }
        }
      } else {
        if (firstTime) {
          this.registerEvent('initialized', function () {
            self.setHtml();
          });
        } else {
          self.setHtml();
        }
      }
    }
  }

  private destroyEditor() {
    if (this._editorInitialized) {
      this._editor.destroy();
      this._editorInitialized = false;
    }
  }

  private getEditor() {
    if (this._element) {
      return this._editor;
    }

    return null;
  }

  // send manual editor initialization
  private generateManualController() {
    let controls = {
      initialize: this.createEditor.bind(this),
      destroy: this.destroyEditor.bind(this),
      getEditor: this.getEditor.bind(this),
    };
    this.froalaInit.emit(controls);
  }

  // TODO not sure if ngOnInit is executed after @inputs
  ngAfterViewInit() {
    // check if output froalaInit is present. Maybe observers is private and should not be used?? TODO how to better test that an output directive is present.
    if (!this.froalaInit.observers.length) {
      this.createEditor();
    } else {
      this.generateManualController();
    }
  }

  ngOnDestroy() {
    this.destroyEditor();
  }
}
