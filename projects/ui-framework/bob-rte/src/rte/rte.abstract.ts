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
import { merge } from 'lodash';
import {
  applyChanges,
  BaseFormElement,
  ButtonSize,
  ButtonType,
  chainCall,
  cloneArray,
  cloneValue,
  DOMhelpers,
  hasChanges,
  HtmlParserHelpers,
  IconColor,
  Icons,
  InputEventType,
  isEmptyArray,
  isNotEmptyArray,
  isNotEmptyObject,
  isNullOrUndefined,
  joinArrays,
  notFirstChanges,
  PanelDefaultPosVer,
  SelectGroupOption,
  SingleSelectPanelComponent,
  stringyOrFail,
  SanitizerService,
  firstChanges,
  Func,
  cloneDeepSimpleObject,
} from 'bob-style';

import {
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_MAXHEIGHT_DEF,
  RTE_MENTIONS_OPTIONS_DEF,
  RTE_MINHEIGHT_DEF,
  RTE_OPTIONS_DEF,
  RTE_TOOLBAR_HEIGHT,
  RTE_HTML_CLEANUP_REPLACERS_OUTPUT,
  RTE_HTML_CLEANUP_REPLACERS_INPUT,
} from './rte.const';
import { BlotType, RTEType, RTEMode } from './rte.enum';
import { RteMentionsOption } from './rte.interface';
import { PlaceholdersConverterService } from './placeholders.service';
import { FroalaEditorInstance, FroalaOptions } from './froala.interface';
import Tribute from 'tributejs';
import { TributeInstance, TributeItem } from './tribute.interface';
import { initDirectionControl } from './rte.direction';
import { initMentionsControl } from './rte.mentions';
import { FroalaEditorDirective } from './froala/editor.directive';
import { TranslateService } from '@ngx-translate/core';
import { RteUtilsService } from './rte-utils.service';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class RTEbaseElement extends BaseFormElement
  implements OnChanges, OnInit {
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
    this.showCharCounter = false;
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

  @Input() public options: FroalaOptions = cloneDeepSimpleObject(
    RTE_OPTIONS_DEF
  );

  @Input() public mentionsList: RteMentionsOption[];
  @Input() public placeholderList: SelectGroupOption[];

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;
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
                    this.parserService.removeElements(
                      html,
                      'img:not([src]), img[src=""], a:not([href]), a[href=""]'
                    ),
                ]
              : []),

            ...this.inputTransformers,
          ],
          value
        );
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

    if (
      firstChanges(changes, ['type', 'mode']) &&
      this.mode === RTEMode.plainText
    ) {
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

    if (changes.maxChars) {
      this.updateEditorOptions({ charCounterMax: this.maxChars || -1 }, () => {
        this.editor.charCounter['_init']();
      });
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight', 'type'])) {
      this.minHeight = this.type !== RTEType.singleLine && this.minHeight;

      this.updateEditorOptions(
        {
          heightMin:
            this.minHeight && this.type !== RTEType.singleLine
              ? this.minHeight - RTE_TOOLBAR_HEIGHT
              : null,
          heightMax:
            this.maxHeight && this.type !== RTEType.singleLine
              ? this.maxHeight - RTE_TOOLBAR_HEIGHT
              : null,
        },
        () => {
          this.editor.size.refresh();
        }
      );
      this.DOM.setCssProps(this.host.nativeElement, {
        '--popup-max-height':
          this.type !== RTEType.singleLine
            ? Math.max(150, this.maxHeight || RTE_MAXHEIGHT_DEF) + 'px'
            : null,
      });
    }

    if (hasChanges(changes, ['controls', 'disableControls', 'type', 'mode'])) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }

    if (
      hasChanges(changes, ['placeholderList', 'mode']) ||
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
      hasChanges(changes, ['value', 'mode']) ||
      (changes.placeholderList && this.editorValue !== undefined)
    ) {
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

    if (!this.cntrlsInited) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }
    if (this.inputTransformers.length === 0) {
      this.initTransformers();
    }

    this.DOM.setCssProps(this.host.nativeElement, {
      '--translation-small': `'(${this.translate.instant(
        'bob-style.rte.font-size.small'
      )})'`,
      '--translation-normal': `'(${this.translate.instant(
        'bob-style.rte.font-size.normal'
      )})'`,
      '--translation-large': `'(${this.translate.instant(
        'bob-style.rte.font-size.large'
      )})'`,
      '--translation-huge': `'(${this.translate.instant(
        'bob-style.rte.font-size.huge'
      )})'`,
    });
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
    if (this.mode === RTEMode.plainText) {
      this.controls = [BlotType.placeholder];
      return;
    } else if (
      this.controls.length === 1 &&
      this.controls[0] === BlotType.placeholder
    ) {
      this.controls = Object.values(BlotType);
    }

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
    this.pasteTransformers =
      this.mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string): string =>
              this.parserService.cleanupHtml(
                value,
                RTE_HTML_CLEANUP_REPLACERS_INPUT
              ),

            (value: string) => this.sanitizer.filterXSS(value),

            (value: string): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  '*': {
                    '.*': null,
                  },
                  a: {
                    class: 'fr-deletable',
                    target: '_blank',
                    spellcheck: 'false',
                    rel: 'noopener noreferrer',
                    tabindex: '-1',
                    style: null,
                  },
                  '[href*="/employee-profile/"]': {
                    class: 'fr-deletable',
                    target: null,
                    spellcheck: 'false',
                    rel: null,
                    contenteditable: false,
                  },
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.linkify(
                value,
                'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'
              ),
          ];

    this.inputTransformers = [
      stringyOrFail,

      ...(this.mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  '*': {
                    '^on.*': null,
                    class: null,
                  },
                  br: {
                    '.*': null,
                  },
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.cleanupHtml(
                value,
                RTE_HTML_CLEANUP_REPLACERS_INPUT
              ),

            (value: string): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  a: {
                    class: 'fr-deletable',
                    target: '_blank',
                    spellcheck: 'false',
                    rel: 'noopener noreferrer',
                    tabindex: '-1',
                    style: null,
                  },
                  // '[mention-employee-id],[class*="mention"]'
                  '[href*="/employee-profile/"]': {
                    class: 'fr-deletable',
                    target: null,
                    spellcheck: 'false',
                    rel: null,
                    contenteditable: false,
                  },
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.linkify(
                value,
                'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'
              ),
          ]),
    ];

    this.outputTransformers =
      this.mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  'span,p,div,a': {
                    contenteditable: null,
                    tabindex: null,
                    spellcheck: null,
                    class: {
                      'fr-.*': false,
                    },
                  },

                  ...(this.mode === RTEMode.htmlInlineCSS
                    ? {
                        a: {
                          style:
                            'color: #fea54a; font-weight: 600; text-decoration: none;',
                        },
                      }
                    : {}),
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.cleanupHtml(
                value,
                RTE_HTML_CLEANUP_REPLACERS_OUTPUT
              ),
          ];

    if (this.placeholdersEnabled()) {
      this.inputTransformers.push((value: string): string =>
        this.placeholdersConverter.toRte(value, this.placeholderList)
      );

      this.pasteTransformers.push((value: string): string =>
        this.placeholdersConverter.toRte(value, this.placeholderList)
      );

      this.outputTransformers.unshift(this.placeholdersConverter.fromRte);
    }
  }

  private initMentions(): void {
    this.tribute = new Tribute({
      ...RTE_MENTIONS_OPTIONS_DEF,

      values: this.rteUtilsService.getSanitizeMentions(this.mentionsList),

      selectTemplate: (item: TributeItem) => {
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        let html = `<a href="${item.original.link}" class="fr-deletable" spellcheck="false" contenteditable="false" tabindex="-1">@${item.original.displayName}</a>`;

        if (isNotEmptyObject(item.original.attributes)) {
          html = this.parserService.enforceAttributes(
            html,
            {
              a: item.original.attributes,
            },
            false
          ) as string;
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
