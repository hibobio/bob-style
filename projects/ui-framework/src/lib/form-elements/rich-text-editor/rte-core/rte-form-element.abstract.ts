import {
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import quillLib, {
  Quill,
  QuillOptionsStatic,
  RangeStatic,
  DeltaOperation,
  DeltaStatic
} from 'quill';
import { RTEchangeEvent, BlotType, RTEFontSize } from './rte.enum';
import { RteUtilsService } from './rte-utils.service';
import { BlotData, SpecialBlots, StoreCurrentResult } from './rte.interface';
import { BaseFormElement } from '../../base-form-element';
import { PanelComponent } from '../../../popups/panel/panel.component';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';
quillLib.register(Block, true);

export abstract class RTEformElement extends BaseFormElement
  implements OnChanges, AfterViewInit {
  protected constructor(
    public host: ElementRef,
    public rteUtils: RteUtilsService,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) {
    super(host);
  }

  @Input() public value: string;
  @Input() public minChars = 0;
  @Input() public maxChars: number;
  @Input() public controls: BlotType[] = Object.values(BlotType);
  @Input() public disableControls: BlotType[] = [];
  @Input() public sendChangeOn: RTEchangeEvent = RTEchangeEvent.blur;
  @Input() private formControlName: any;
  @Input() private formControl: any;

  @ViewChild('quillEditor') protected quillEditor: ElementRef;
  @ViewChild('sizePanel') protected sizePanel: PanelComponent;

  @Output() blurred: EventEmitter<any> = new EventEmitter<any>();
  @Output() focused: EventEmitter<any> = new EventEmitter<any>();
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public editor: Quill;
  public hasSizeSet = false;
  public selection: RangeStatic;
  public selectedText: string;
  public currentBlot: BlotData;
  public lastSelection: RangeStatic;
  public lastCurrentBlot: BlotData;
  private latestOutputValue: string;
  public length: number;
  protected writingValue = false;
  private control: FormControl;
  protected specialBlots: SpecialBlots = {
    treatAsWholeDefs: [],
    deleteAsWholeDefs: [],
    noLinebreakAfterDefs: []
  };

  public storeLastChange = false;
  public lastChange: DeltaOperation;

  public editorOptions: QuillOptionsStatic = {
    theme: 'snow',
    modules: {
      clipboard: {
        matchVisual: false
      }
    }
  };

  public inputTransformers: Function[] = [];
  public outputTransformers: Function[] = [];
  protected outputFormatTransformer: Function = (val: string): any => val;

  protected onNgChanges(changes: SimpleChanges): void {}
  protected onNgAfterViewInit(): void {}

  protected applyValue(newInputValue: string): void {
    this.value = newInputValue = newInputValue ? newInputValue.trim() : '';

    if (!!newInputValue && this.editor) {
      newInputValue = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        newInputValue
      );
      this.editor.setContents(
        this.editor.clipboard.convert(newInputValue).insert(' \n')
      );
      this.length = this.rteUtils.getTextLength(this.editor);
    } else if (this.editor) {
      this.editor.setText('\n');
    } else {
      this.writingValue = false;
    }
  }

  protected transmitValue(doPropagate: boolean): void {
    if (!this.writingValue) {
      let newOutputValue = this.rteUtils.getHtmlContent(this.editor).trim();

      newOutputValue =
        (!!newOutputValue &&
          this.outputTransformers.reduce(
            (previousResult, fn) => fn(previousResult),
            newOutputValue
          )) ||
        '';

      this.value = this.outputFormatTransformer(newOutputValue);

      if (doPropagate && this.latestOutputValue !== newOutputValue) {
        this.latestOutputValue = newOutputValue;
        this.changed.emit(this.value);
        this.propagateChange(this.value);
      }
    }
    this.writingValue = false;
  }

  protected updateSpecialBlots(): void {
    this.specialBlots.treatAsWhole = this.specialBlots.treatAsWholeDefs.filter(
      (blot: BlotType) => this.controls.includes(blot)
    );
    this.specialBlots.treatAsWhole =
      this.specialBlots.treatAsWhole.length > 0
        ? this.specialBlots.treatAsWhole
        : null;

    this.specialBlots.deleteAsWhole = this.specialBlots.deleteAsWholeDefs.filter(
      (blot: BlotType) => this.controls.includes(blot)
    );
    this.specialBlots.deleteAsWhole =
      this.specialBlots.deleteAsWhole.length > 0
        ? this.specialBlots.deleteAsWhole
        : null;

    this.specialBlots.noLinebreakAfter = this.specialBlots.noLinebreakAfterDefs.filter(
      (blot: BlotType) => this.controls.includes(blot)
    );
    this.specialBlots.noLinebreakAfter =
      this.specialBlots.noLinebreakAfter.length > 0
        ? this.specialBlots.noLinebreakAfter
        : null;
  }

  private onControlChanges(changes: SimpleChanges) {
    if (changes.controls) {
      this.controls = changes.controls.currentValue;
    }
    if (changes.disableControls) {
      this.disableControls = changes.disableControls.currentValue;
      if (changes.disableControls.previousValue) {
        this.controls = this.controls.concat(
          changes.disableControls.previousValue
        );
      }
    }
    if (changes.controls || changes.disableControls) {
      this.controls = this.controls.filter(
        (cntrl: BlotType) => !this.disableControls.includes(cntrl)
      );
      if (this.editor) {
        (this.editor as any).options.formats = Object.values(this.controls);
      }
      this.updateSpecialBlots();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      if (this.editor) {
        this.editor.enable(!this.disabled);
      }
    }
    if (changes.label) {
      this.label = changes.label.currentValue;
      this.rteUtils.setEditorPlaceholder(
        this.editor,
        this.label,
        this.required
      );
    }
    if (changes.required) {
      this.required = changes.required.currentValue;
      this.rteUtils.setEditorPlaceholder(
        this.editor,
        this.label,
        this.required
      );
    }
    this.onControlChanges(changes);

    this.onNgChanges(changes);

    if (changes.value) {
      this.applyValue(changes.value.currentValue);
    }
  }

  public ngAfterViewInit(): void {
    if (this.formControl || this.formControlName) {
      const ngControl: NgControl = this.injector.get<NgControl>(
        NgControl as Type<NgControl>
      );

      if (ngControl) {
        this.control = ngControl.control as FormControl;
        this.sendChangeOn =
          this.control.updateOn === 'change'
            ? RTEchangeEvent.change
            : RTEchangeEvent.blur;
      }
    }
    this.onNgAfterViewInit();
  }

  private onEditorTextChange(
    delta: DeltaStatic,
    oldDelta: DeltaStatic,
    source: string
  ): void {
    if (this.storeLastChange) {
      this.lastChange = oldDelta.diff(this.editor.getContents()).ops[1];
      if (this.lastChange && this.lastChange.delete) {
        this.lastChange = {
          delete: this.editor.getContents().diff(oldDelta).ops[1].insert
        };
      }
    }
    this.length = this.rteUtils.getTextLength(this.editor);
    this.transmitValue(this.sendChangeOn === RTEchangeEvent.change);
  }

  private onEditorSelectionChange(
    range: RangeStatic,
    oldRange: RangeStatic
  ): void {
    if (range) {
      const newSize = !!this.editor.getFormat(range).size;
      if (this.hasSizeSet !== newSize) {
        this.hasSizeSet = newSize;
        this.changeDetector.detectChanges();
      }
    }
  }

  private onEditorFocus(): void {
    this.focused.emit(this.value);
  }

  private onEditorBlur(): void {
    this.transmitValue(this.sendChangeOn === RTEchangeEvent.blur);

    if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.blur) {
      this.onTouched();
    }

    this.blurred.emit(this.value);
  }

  public storeSelection(): void {
    this.selection = this.rteUtils.getCurrentSelection(this.editor);
  }

  public restoreSelection(): void {
    this.editor.focus();
    if (this.selection) {
      this.editor.setSelection(this.selection);
    }
  }

  public storeCurrent(
    selection: RangeStatic | boolean = true,
    blot: Partial<BlotData> | boolean = true,
    text: string | boolean = false
  ): StoreCurrentResult {
    const currentSelection = selection
      ? (selection as RangeStatic).index
        ? (selection as RangeStatic)
        : this.rteUtils.getCurrentSelection(this.editor)
      : this.selection;
    let currentBlot: BlotData;

    if (blot && (blot as BlotData).element) {
      currentBlot = this.rteUtils.getBlotDataFromElement(
        (blot as BlotData).element,
        this.editor
      );
    } else if (blot) {
      currentBlot = this.rteUtils.getCurrentBlotData(
        this.editor,
        false,
        (blot as BlotData).index ||
          ((blot as BlotData).offset &&
            currentSelection.index + (blot as BlotData).offset)
      );
    }
    const selectedText =
      text && typeof text === 'string'
        ? text
        : this.rteUtils.getSelectionText(this.editor, currentSelection);

    const result: StoreCurrentResult = {};

    if (selection) {
      result.selection = this.selection = currentSelection;
    }
    if (blot) {
      result.currentBlot = this.currentBlot = currentBlot;
    }
    if (text) {
      result.text = this.selectedText = selectedText;
    }

    return result;
  }

  public changeFontSize(size: RTEFontSize) {
    this.editor.format('size', size === RTEFontSize.normal ? false : size);
    this.hasSizeSet = size !== RTEFontSize.normal;
    this.sizePanel.closePanel();
  }

  // this is part of ControlValueAccessor interface
  public writeValue(value: string): void {
    if (value !== undefined) {
      this.writingValue = true;
      this.applyValue(value);
    }
  }

  protected initEditor(options: QuillOptionsStatic): void {
    this.editor = new quillLib(this.quillEditor.nativeElement, options);

    this.editor.enable(!this.disabled);

    if (!!this.value) {
      this.applyValue(this.value);
    }

    // attaching events

    this.editor.on('editor-change', (eventName: string, ...args: any[]) => {
      if (eventName === 'text-change') {
        this.onEditorTextChange(
          args[0] as DeltaStatic, // current Delta
          args[1] as DeltaStatic, // previous Delta
          args[3] as string // user, api or silent
        );
      } else if (eventName === 'selection-change') {
        this.onEditorSelectionChange(
          args[0] as RangeStatic, // current range
          args[1] as RangeStatic // previous range
        );
      }
    });

    this.editor.root.addEventListener('focus', () => {
      this.onEditorFocus();
    });

    this.editor.root.addEventListener('blur', () => {
      this.onEditorBlur();
    });
  }
}
