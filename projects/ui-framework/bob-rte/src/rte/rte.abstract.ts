import { merge } from 'lodash';

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  applyChanges,
  BaseFormElement,
  ButtonSize,
  ButtonType,
  chainCall,
  cloneArray,
  cloneDeepSimpleObject,
  cloneValue,
  DOMhelpers,
  firstChanges,
  Func,
  hasChanges,
  HtmlParserHelpers,
  IconColor,
  Icons,
  InputEventType,
  isEmptyArray,
  isNotEmptyArray,
  isNotEmptyObject,
  isNullOrUndefined,
  notFirstChanges,
  PanelDefaultPosVer,
  SanitizerService,
  SelectGroupOption,
  SingleSelectPanelComponent,
} from 'bob-style';

import { FroalaEditorInstance, FroalaOptions } from './froala.interface';
import { FroalaEditorDirective } from './froala/editor.directive';
import { PlaceholdersConverterService } from './placeholders.service';
import { RteUtilsService } from './rte-utils.service';
import {
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_MAXHEIGHT_DEF,
  RTE_MINHEIGHT_DEF,
  RTE_OPTIONS_DEF,
  RTE_TOOLBAR_HEIGHT,
} from './rte.const';
import { initDirectionControl } from './rte.direction';
import { BlotType, RTEMode, RTEType } from './rte.enum';
import { RteMentionsOption } from './rte.interface';
import { initMentionsControl } from './rte.mentions';
import { initPasteAsTextControl, initRemoveFormatControl } from './rte.misc-controls';
import { TributeInstance } from './tribute.interface';

// import { HtmlParserHelpers } from '../../../../ui-framework/src/lib/services/html/html-parser.service';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class RTEbaseElement extends BaseFormElement implements OnChanges, OnInit {
  constructor(
    protected cd: ChangeDetectorRef,
    protected placeholdersConverter: PlaceholdersConverterService,
    protected parserService: HtmlParserHelpers,
    protected DOM: DOMhelpers,
    protected host: ElementRef,
    protected translate: TranslateService,
    protected rteUtilsService: RteUtilsService,
    protected sanitizer: SanitizerService
  ) {
    super(cd);
    this.baseValue = '';
    this.wrapEvent = false;
    this.showCharCounter = true;
    this.options.scrollableContainer = '.bfe-wrap#' + this.id;
  }

  public tribute: TributeInstance;
  public editor: FroalaEditorInstance;
  protected toolbarButtons: HTMLElement[];
  protected pasteTransformers: Func[] = [];

  public length = 0;
  public editorValue: string;
  public plchldrPnlTrgrFocused = false;

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly iconColor = IconColor;
  readonly plchldrPanelPosition = PanelDefaultPosVer.belowRight;

  private cntrlsInited = false;
  protected miscControlsState: { pasteAsText: boolean } = {
    pasteAsText: false,
  };

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  protected editorDirective: FroalaEditorDirective;
  @ViewChild('placeholderPanel')
  protected placeholderPanel: SingleSelectPanelComponent;
  public input: ElementRef<HTMLInputElement>;

  @Input() public value: string;
  @Input() public minChars = 0;
  @Input() public maxChars = 0;
  @Input() public controls: BlotType[] = cloneArray(RTE_CONTROLS_DEF);
  @Input() public disableControls: BlotType[] = cloneArray(RTE_DISABLE_CONTROLS_DEF);

  @Input() public minHeight = RTE_MINHEIGHT_DEF;
  @Input() public maxHeight = RTE_MAXHEIGHT_DEF;

  @Input() public options: FroalaOptions = cloneDeepSimpleObject(RTE_OPTIONS_DEF);

  @Input() public mentionsList: RteMentionsOption[];
  @Input() public placeholderList: SelectGroupOption[];

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType = RTEType.primary;
  @HostBinding('attr.data-mode') @Input() public mode: RTEMode = RTEMode.html;

  public writeValue(value: any, onChanges = false, force = false): void {
    if (value !== undefined && (force || value !== this.editorValue)) {
      try {
        this.editorValue = chainCall(
          [
            (html: string) => this.sanitizer.filterXSS(html),

            ...(this.mode !== RTEMode.plainText
              ? [
                  (html: string) =>
                    this.parserService.removeElements(html, 'img:not([src]), img[src=""], a:not([href]), a[href=""]'),
                ]
              : []),

            ...this.inputTransformers,
          ],
          value || ''
        );
      } catch (error) {
        console.error(`${this.getElementIDdata()} threw an error:\n`, error);
        return;
      }
    }

    if ((value === undefined || isNullOrUndefined(this.editorValue)) && this.baseValue !== undefined) {
      this.editorValue = cloneValue(this.baseValue);
    }

    setTimeout(() => {
      this.updateLength();

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        minHeight: RTE_MINHEIGHT_DEF,
        maxHeight: RTE_MAXHEIGHT_DEF,
        controls: RTE_CONTROLS_DEF,
        disableControls: RTE_DISABLE_CONTROLS_DEF,
      },
      ['options', 'value'],
      true
    );

    if (this.type === RTEType.singleLine) {
      this.mode = RTEMode.plainText;
    }

    if (hasChanges(changes, ['options'], true)) {
      this.updateEditorOptions(merge(RTE_OPTIONS_DEF, this.options));
    }

    if (firstChanges(changes, ['type', 'mode']) && this.mode === RTEMode.plainText) {
      this.updateEditorOptions({
        shortcutsEnabled: [],
        pluginsEnabled: [],
      });
    }

    if (
      changes.placeholder ||
      (changes.label && this.hideLabelOnFocus) ||
      changes.hideLabelOnFocus ||
      (changes.required && this.hideLabelOnFocus)
    ) {
      this.updateEditorOptions(
        {
          placeholderText:
            this.hideLabelOnFocus && this.label
              ? !this.required
                ? this.label
                : this.label + '*'
              : this.placeholder || ' ',
        },
        () => {
          this.editor.placeholder.refresh();
        }
      );
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight', 'type'])) {
      this.minHeight = this.type !== RTEType.singleLine && this.minHeight;

      this.updateEditorOptions(
        {
          heightMin: this.minHeight && this.type !== RTEType.singleLine ? this.minHeight - RTE_TOOLBAR_HEIGHT : null,
          heightMax: this.maxHeight && this.type !== RTEType.singleLine ? this.maxHeight - RTE_TOOLBAR_HEIGHT : null,
        },
        () => {
          this.editor.size.refresh();
        }
      );
      this.DOM.setCssProps(this.host.nativeElement, {
        '--popup-max-height':
          this.type !== RTEType.singleLine ? Math.max(150, this.maxHeight || RTE_MAXHEIGHT_DEF) + 'px' : null,
      });
    }

    if (hasChanges(changes, ['controls', 'disableControls', 'type', 'mode'])) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }

    if (
      hasChanges(changes, ['placeholderList', 'mode', 'type']) ||
      (this.inputTransformers.length === 0 && !notFirstChanges(changes))
    ) {
      this.initTransformers();
    }

    if (changes.mentionsList && this.mentionsEnabled()) {
      if (!this.tribute) {
        this.initMentions();

        if (this.getEditorTextbox()) {
          this.tribute.attach(this.getEditorTextbox());
        }
      } else {
        this.tribute.hideMenu();
        this.tribute.collection[0].values = this.mentionsList;
      }
    }

    if (hasChanges(changes, ['value', 'mode']) || (changes.placeholderList && this.editorValue !== undefined)) {
      this.writeValue(this.value, true, true);

      this.transmitValue(this.editorValue, {
        eventType: [InputEventType.onWrite],
        updateValue: true,
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public ngOnInit(): void {
    initDirectionControl();
    initMentionsControl();
    initPasteAsTextControl(this.miscControlsState);
    initRemoveFormatControl({
      parserService: this.parserService,
      placeholdersConverter: this.placeholdersConverter,
      placeholderList: this.placeholderList,
      placeholdersEnabled: this.placeholdersEnabled(),
    });

    if (!this.cntrlsInited) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }
    if (this.inputTransformers.length === 0) {
      this.initTransformers();
    }

    this.DOM.setCssProps(this.host.nativeElement, {
      '--translation-small': `'${this.translate.instant('bob-style.rte.font-size.small')}'`,
      '--translation-normal': `'${this.translate.instant('bob-style.rte.font-size.normal')}'`,
      '--translation-large': `'${this.translate.instant('bob-style.rte.font-size.large')}'`,
      '--translation-huge': `'${this.translate.instant('bob-style.rte.font-size.huge')}'`,
      '--translation-insert': `'${this.translate.instant('bob-style.rte.link.insert')}'`,
      '--translation-update': `'${this.translate.instant('bob-style.rte.link.update')}'`,
      '--translation-url': `'${this.translate.instant('bob-style.rte.link.url')}'`,
      '--translation-text': `'${this.translate.instant('bob-style.rte.link.text')}'`,

      '--link-label-wch':
        Math.max(
          this.translate.instant('bob-style.rte.link.url').length,
          this.translate.instant('bob-style.rte.link.text').length
        ) + 1,
    });
  }

  public placeholdersEnabled(): boolean {
    return isNotEmptyArray(this.placeholderList) && this.controls.includes(BlotType.placeholder);
  }

  public mentionsEnabled(): boolean {
    return isNotEmptyArray(this.mentionsList) && this.controls.includes(BlotType.mentions);
  }

  private initControls(): void {
    Object.assign(this, this.rteUtilsService.getControls(this.mode, this.controls, this.disableControls));
  }

  private initTransformers(): void {
    Object.assign(
      this,
      this.rteUtilsService.getTransformers(this.mode, this.placeholdersEnabled(), this.placeholderList)
    );
  }

  private initMentions(): void {
    this.tribute = this.rteUtilsService.getTributeInstance(this.mentionsList);
  }

  public getEditor(): FroalaEditorInstance {
    return this.editorDirective['_editor'] as FroalaEditorInstance;
  }

  public getEditorElement(selector = null): HTMLElement | HTMLElement[] {
    if (!selector) {
      return this.editorDirective['_element'] as HTMLElement;
    }

    const requestedElements = Array.from(
      (this.host.nativeElement as HTMLElement).querySelectorAll(selector) as NodeListOf<HTMLElement>
    );

    return requestedElements.length < 2 ? requestedElements[0] : requestedElements;
  }

  protected getEditorTextbox(): HTMLElement {
    return this.getEditor() && (this.getEditor().el as HTMLElement);
  }

  protected updateToolbar(): void {
    if (this.toolbarButtons) {
      if (isEmptyArray(this.controls) || this.mode === RTEMode.plainText) {
        this.editor.toolbar.hide();
      } else {
        this.toolbarButtons.forEach((b) => {
          const cmd = b.getAttribute('data-cmd') as BlotType;
          if (!this.controls.includes(cmd)) {
            b.setAttribute('hidden', 'true');
          } else {
            b.removeAttribute('hidden');
          }
        });
        this.editor.toolbar.show();
      }
    }
  }

  protected updateEditorOptions(options: Partial<FroalaOptions>, callback: Function = null): void {
    if (isNotEmptyObject(options)) {
      Object.assign(this.options, options);

      if (this.getEditor()) {
        Object.assign(this.getEditor().opts, options);

        if (callback) {
          callback();
        }
      }
    }
  }

  protected updateLength(): number {
    const editorBox = this.getEditorTextbox();

    if (editorBox) {
      const newLength = this.getEditorTextbox().innerText.trim().length;

      if (newLength !== this.length && !this.cd['destroyed']) {
        this.length = newLength;
        this.cd.detectChanges();
      }
    }

    return this.length;
  }

  protected getNativeRange(): Range {
    const selection = document.getSelection();
    return selection == null || selection.rangeCount <= 0 ? null : selection.getRangeAt(0);
  }
}
