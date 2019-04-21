import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
  HostBinding,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  Type
} from '@angular/core';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormControl,
  NgControl
} from '@angular/forms';

import quillLib, { Quill, QuillOptionsStatic, RangeStatic } from 'quill';
import { LinkBlot } from './formats/link-blot';
import { PanelComponent } from '../../overlay/panel/panel.component';
import {
  BlotType,
  RTEType,
  RTEControls,
  RTEFontSize,
  RTEchangeEvent
} from './rich-text-editor.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import {
  RteCurrentContent,
  RteLink,
  UpdateRteConfig
} from './rich-text-editor.interface';

import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { PanelDefaultPosVer, PanelSize } from '../../overlay/panel/panel.enum';

import { BaseFormElement } from '../../form-elements/base-form-element';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';

quillLib.register(Block, true);
quillLib.register(LinkBlot);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent extends BaseFormElement
  implements OnChanges, AfterViewInit {
  constructor(
    private rteUtilsService: RteUtilsService,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) {
    super();
  }

  @HostBinding('class') get classes() {
    return (
      (this.type === RTEType.secondary ? 'rte-secondary' : 'rte-primary') +
      (this.required ? ' required' : '') +
      (this.disabled ? ' disabled' : '') +
      (this.errorMessage ? ' error' : '')
    );
  }

  @Input() type?: RTEType = RTEType.primary;
  @Input() value: string;
  @Input() controls?: RTEControls[] = [
    RTEControls.size,
    RTEControls.bold,
    RTEControls.italic,
    RTEControls.underline,
    RTEControls.link,
    RTEControls.list,
    RTEControls.align,
    RTEControls.dir
  ];
  @Input() minHeight = 185;
  @Input() maxHeight = 295;
  @Input() sendChangeOn = RTEchangeEvent.blur;

  @ViewChild('quillEditor') private quillEditor: ElementRef;
  @ViewChild('toolbar') private toolbar: ElementRef;
  @ViewChild('suffix') private suffix: ElementRef;
  @ViewChild('linkPanel') private linkPanel: PanelComponent;

  @Output() blurred: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() focused: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() changed: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();

  editor: Quill;
  private selection: RangeStatic;
  selectedText: string;
  hasSuffix = true;
  hasSizeSet = false;
  private latestOutputValue: RteCurrentContent;
  private writingValue = false;
  private control: FormControl;

  buttonType = ButtonType;
  icons = Icons;
  panelSize = PanelSize;
  RTEControls = RTEControls;
  RTEFontSize = RTEFontSize;

  panelDefaultPosVer = PanelDefaultPosVer;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      if (this.editor) {
        this.editor.enable(!this.disabled);
      }
    }
    if (changes.label) {
      this.label = changes.label.currentValue;
      this.setEditorPlaceholder();
    }
    if (changes.required) {
      this.required = changes.required.currentValue;
      this.setEditorPlaceholder();
    }
    if (changes.value) {
      this.applyValue(changes.value.currentValue);
    }
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get<NgControl>(NgControl as Type<
      NgControl
    >);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
      this.sendChangeOn =
        this.control.updateOn === 'change'
          ? RTEchangeEvent.change
          : RTEchangeEvent.blur;
    }
    setTimeout(() => {
      this.initEditor();
      this.hasSuffix =
        this.suffix.nativeElement.children.length !== 0 ||
        this.suffix.nativeElement.childNodes.length !== 0
          ? true
          : false;
    }, 0);
  }

  private initEditor(): void {
    const editorOptions: QuillOptionsStatic = {
      theme: 'snow',
      placeholder: this.getEditorPlaceholder(),
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        },
        clipboard: {
          matchVisual: false
        }
      }
    };

    this.editor = new quillLib(this.quillEditor.nativeElement, editorOptions);

    this.editor.enable(!this.disabled);

    this.editor.on('text-change', () => {
      const newOutputValue = this.getCurrentText();
      if (
        !this.latestOutputValue ||
        this.latestOutputValue.body !== newOutputValue.body
      ) {
        this.latestOutputValue = newOutputValue;
        this.changed.emit(newOutputValue);
        if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.change) {
          this.propagateChange(newOutputValue);
        }
        this.writingValue = false;
      }
    });

    if (!!this.value) {
      this.applyValue(this.value);
    }

    this.editor.on('selection-change', range => {
      if (range) {
        const newSize = !!this.editor.getFormat().size;
        if (this.hasSizeSet !== newSize) {
          this.hasSizeSet = newSize;
          this.changeDetector.detectChanges();
        }
      }
    });

    this.editor.root.addEventListener('focus', () => {
      this.focused.emit(this.latestOutputValue);
    });

    this.editor.root.addEventListener('blur', () => {
      this.blurred.emit(this.latestOutputValue);
      if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.blur) {
        this.propagateChange(this.latestOutputValue);
        this.onTouched();
      }
      this.writingValue = false;
    });
  }

  private getEditorPlaceholder(): string {
    return this.label ? this.label + (this.required ? ' *' : '') : '';
  }

  private setEditorPlaceholder(): void {
    if (this.editor) {
      this.editor.root.dataset.placeholder = this.getEditorPlaceholder();
    }
  }

  private getCurrentText(): RteCurrentContent {
    return this.rteUtilsService.getHtmlContent(this.editor);
  }

  private applyValue(val: string): void {
    if (this.value !== val || !this.latestOutputValue) {
      this.value = val || '';
      if (this.editor) {
        this.editor.setContents(this.editor.clipboard.convert(this.value));
      }
    }
  }

  writeValue(val: string): void {
    this.writingValue = true;
    this.applyValue(val);
  }

  changeFontSize(size: RTEFontSize) {
    this.editor.format('size', size === RTEFontSize.normal ? false : size);
    this.hasSizeSet = size === RTEFontSize.normal ? false : true;
  }

  private onLinkPanelOpen(): void {
    this.selection = this.rteUtilsService.getCurrentSelection(this.editor);
    this.selectedText = this.rteUtilsService.getSelectionText(
      this.editor,
      this.selection
    );
    this.editor.blur();
  }

  onLinkUpdate(rteLink: RteLink): void {
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: rteLink.text,
      format: {
        type: BlotType.Link,
        value: rteLink.url
      }
    };
    this.rteUtilsService.updateEditor(this.editor, updateConfig, false);
    this.linkPanel.closePanel();
  }

  onLinkCancel(): void {
    this.linkPanel.closePanel();
  }
}
