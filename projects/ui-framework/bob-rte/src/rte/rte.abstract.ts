import {
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnChanges,
  OnInit,
  ElementRef,
  Directive,
} from '@angular/core';
import { merge, cloneDeep } from 'lodash';

import {
  BaseFormElement,
  cloneArray,
  hasChanges,
  notFirstChanges,
  applyChanges,
  joinArrays,
  isNullOrUndefined,
  cloneValue,
  isNotEmptyArray,
  stringyOrFail,
  InputEventType,
  HtmlParserHelpers,
  SelectGroupOption,
  Icons,
  ButtonType,
  ButtonSize,
  SingleSelectPanelComponent,
  BELOW_END,
  ABOVE_END,
  IconColor,
  isNotEmptyObject,
  isEmptyArray,
  chainCall,
  cloneObject,
} from 'bob-style';

import {
  RTE_OPTIONS_DEF,
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_MINHEIGHT_DEF,
  RTE_MAXHEIGHT_DEF,
  RTE_TOOLBAR_HEIGHT,
  RTE_MENTIONS_OPTIONS_DEF,
  RTE_TRANSLATION_DEF,
} from './rte.const';
import { BlotType, RTEType } from './rte.enum';
import { RteMentionsOption, RteTranslation } from './rte.interface';
import { PlaceholdersConverterService } from './placeholders.service';
import { FroalaEditorInstance, FroalaOptions } from './froala.interface';
import Tribute from 'tributejs';
import { TributeInstance, TributeItem } from './tribute.interface';

import { initDirectionControl } from './rte.direction';
import { initMentionsControl } from './rte.mentions';
import { FroalaEditorDirective } from './froala/editor.directive';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class RTEbaseElement extends BaseFormElement
  implements OnChanges, OnInit {
  constructor(
    protected cd: ChangeDetectorRef,
    protected placeholdersConverter: PlaceholdersConverterService,
    protected parserService: HtmlParserHelpers
  ) {
    super(cd);
    this.baseValue = '';
    this.wrapEvent = false;
  }

  public tribute: TributeInstance;
  public editor: FroalaEditorInstance;
  protected toolbarButtons: HTMLElement[];

  public length = 0;
  public editorValue: string;
  public plchldrPnlTrgrFocused = false;

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly iconColor = IconColor;
  readonly plchldrPanelPosition = [BELOW_END, ABOVE_END];

  private cntrlsInited = false;

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  protected editorDirective: FroalaEditorDirective;
  @ViewChild('placeholderPanel')
  protected placeholderPanel: SingleSelectPanelComponent;
  public input: ElementRef<HTMLElement>;

  @Input() public value: string;
  @Input() public minChars = 0;
  @Input() public maxChars = -1;
  @Input() public controls: BlotType[] = cloneArray(RTE_CONTROLS_DEF);
  @Input() public disableControls: BlotType[] = cloneArray(
    RTE_DISABLE_CONTROLS_DEF
  );

  @Input() public minHeight = RTE_MINHEIGHT_DEF;
  @Input() public maxHeight = RTE_MAXHEIGHT_DEF;

  @Input() public options: FroalaOptions = cloneDeep(RTE_OPTIONS_DEF);

  @Input() public mentionsList: RteMentionsOption[];
  @Input() public placeholderList: SelectGroupOption[];

  @Input() translation: RteTranslation = cloneObject(RTE_TRANSLATION_DEF);

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;

  public writeValue(value: any, onChanges = false): void {
    if (value !== undefined) {
      try {
        this.editorValue = chainCall(this.inputTransformers, value);
      } catch (error) {
        console.error(`${this.getElementIDdata()} threw an error:\n`, error);
        return;
      }
    }
    if (
      (value === undefined || isNullOrUndefined(this.editorValue)) &&
      this.baseValue !== undefined
    ) {
      this.editorValue = cloneValue(this.baseValue);
    }

    if (!onChanges) {
      setTimeout(() => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    }
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
        translation: cloneObject(RTE_TRANSLATION_DEF),
      },
      ['options', 'value'],
      true
    );

    if (hasChanges(changes, ['options'], true)) {
      this.updateEditorOptions(
        merge(RTE_OPTIONS_DEF, this.options, changes.options.currentValue)
      );
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

    if (changes.maxChars) {
      this.updateEditorOptions({ charCounterMax: this.maxChars || -1 }, () => {
        this.editor.charCounter['_init']();
      });
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight'])) {
      this.updateEditorOptions(
        {
          heightMin: this.minHeight
            ? this.minHeight - RTE_TOOLBAR_HEIGHT
            : null,
          heightMax: this.maxHeight
            ? this.maxHeight - RTE_TOOLBAR_HEIGHT
            : null,
        },
        () => {
          this.editor.size.refresh();
        }
      );
    }

    if (hasChanges(changes, ['controls', 'disableControls'])) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }

    if (
      changes.placeholderList ||
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

    if (
      changes.value ||
      (changes.placeholderList && this.editorValue !== undefined)
    ) {
      this.writeValue(
        changes.value ? changes.value.currentValue : this.editorValue,
        true
      );

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

    if (!this.cntrlsInited) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }
    if (this.inputTransformers.length === 0) {
      this.initTransformers();
    }
  }

  public placeholdersEnabled(): boolean {
    return (
      isNotEmptyArray(this.placeholderList) &&
      this.controls.includes(BlotType.placeholder)
    );
  }

  public mentionsEnabled(): boolean {
    return (
      isNotEmptyArray(this.mentionsList) &&
      this.controls.includes(BlotType.mentions)
    );
  }

  private initControls(): void {
    if (this.controls.includes(BlotType.list)) {
      this.controls = joinArrays(this.controls, [BlotType.ul, BlotType.ol]);
    }
    if (this.controls.includes(BlotType.direction)) {
      this.controls = joinArrays(this.controls, [
        BlotType.rightToLeft,
        BlotType.leftToRight,
      ]);
    }
    if (this.disableControls.includes(BlotType.list)) {
      this.disableControls = joinArrays(this.disableControls, [
        BlotType.ul,
        BlotType.ol,
      ]);
    }
    if (this.disableControls.includes(BlotType.direction)) {
      this.disableControls = joinArrays(this.disableControls, [
        BlotType.rightToLeft,
        BlotType.leftToRight,
      ]);
    }

    this.controls = RTE_CONTROLS_DEF.filter(
      (cntrl: BlotType) =>
        (this.controls || RTE_CONTROLS_DEF).includes(cntrl) &&
        !(this.disableControls || RTE_DISABLE_CONTROLS_DEF).includes(cntrl)
    );
  }

  private initTransformers(): void {
    this.inputTransformers = [
      stringyOrFail,

      (value: string): string =>
        HtmlParserHelpers.prototype.enforceAttributes(value, {
          '*': {
            '^on.*': null,
          },
          br: {
            '.*': null,
          },
        }),

      (value: string): string =>
        HtmlParserHelpers.prototype.cleanupHtml(value, { removeNbsp: false }),

      (value: string): string =>
        this.parserService.enforceAttributes(value, {
          a: {
            class: 'fr-deletable',
            target: '_blank',
            spellcheck: 'false',
            rel: 'noopener noreferrer',
            tabindex: '-1',
          },
          '[mention-employee-id],[class*="mention"]': {
            class: 'fr-deletable',
            target: null,
            spellcheck: 'false',
            rel: 'noopener noreferrer',
            contenteditable: false,
          },
        }),

      (value: string): string =>
        this.parserService.linkify(
          value,
          'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'
        ),
    ];

    this.outputTransformers = [
      (value: string): string =>
        this.parserService.enforceAttributes(value, {
          'span,p,div,a': {
            contenteditable: null,
            tabindex: null,
            spellcheck: null,
            class: {
              'fr-.*': false,
            },
          },
        }),

      (value: string): string =>
        HtmlParserHelpers.prototype.cleanupHtml(value, {
          removeNbsp: true,
        }),
    ];

    if (this.placeholdersEnabled()) {
      this.inputTransformers.push((value: string): string =>
        this.placeholdersConverter.toRte(value, this.placeholderList)
      );

      this.outputTransformers.unshift(this.placeholdersConverter.fromRte);
    }
  }

  private initMentions(): void {
    this.tribute = new Tribute({
      ...RTE_MENTIONS_OPTIONS_DEF,

      values: this.mentionsList,

      selectTemplate: (item: TributeItem) => {
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        let html = `<a href="${item.original.link}" class="fr-deletable" spellcheck="false" rel="noopener noreferrer" contenteditable="false" tabindex="-1">@${item.original.displayName}</a>`;

        if (isNotEmptyObject(item.original.attributes)) {
          html = this.parserService.enforceAttributes(html, {
            a: item.original.attributes,
          });
        }

        return html;
      },
    }) as TributeInstance;
  }

  public getEditor(): FroalaEditorInstance {
    return this.editorDirective['_editor'] as FroalaEditorInstance;
  }

  public getEditorElement(selector = null): HTMLElement | HTMLElement[] {
    const editorHostElem = this.editorDirective['_element'] as HTMLElement;
    if (!selector) {
      return editorHostElem;
    }

    const requestedElements = editorHostElem.querySelectorAll(selector);
    return requestedElements.length < 2
      ? requestedElements[0]
      : Array.from(requestedElements);
  }

  protected getEditorTextbox(): HTMLElement {
    return this.getEditor() && (this.getEditor().el as HTMLElement);
  }

  protected updateToolbar(): void {
    if (this.toolbarButtons) {
      if (isEmptyArray(this.controls)) {
        this.editor.toolbar.hide();
      } else {
        this.toolbarButtons.forEach(b => {
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

  protected updateEditorOptions(
    options: Partial<FroalaOptions>,
    callback: Function = null
  ): void {
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
    return selection == null || selection.rangeCount <= 0
      ? null
      : selection.getRangeAt(0);
  }
}
