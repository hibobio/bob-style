import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
  InputEventType,
  FormEvents,
  HtmlParserHelpers,
  isKey,
  Keys,
  ListChange,
  cloneArray,
  chainCall,
  eventHasMetaKey,
  eventHasCntrlKey,
  DOMhelpers,
  EMOJI_DATA,
  asArray,
  SanitizerService,
  keyEventIsCharacter,
  BaseFormElement,
} from 'bob-style';

import { RTEbaseElement } from './rte.abstract';
import { PlaceholdersConverterService } from './placeholders.service';
import { TranslateService } from '@ngx-translate/core';
import { RteUtilsService } from './rte-utils.service';
import { RTEMode } from './rte.enum';

// import { HtmlParserHelpers } from '../../../../ui-framework/src/lib/services/html/html-parser.service';

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: RichTextEditorComponent },
    RteUtilsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent extends RTEbaseElement
  implements OnInit, AfterViewInit, OnDestroy {
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
    super(
      cd,
      placeholdersConverter,
      parserService,
      DOM,
      host,
      translate,
      rteUtilsService,
      sanitizer
    );
  }

  @HostListener('click.outside-zone', ['$event'])
  onHostClick(event: MouseEvent) {
    this.clicksHandler(event);
  }

  @HostListener('focusin.outside-zone', ['$event'])
  onHostFocus(event: FocusEvent) {
    this.focusHandler(event);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.options.events = {
      //
      initialized: () => {
        this.toolbarButtons = this.getEditorElement(
          'button[title]'
        ) as HTMLElement[];

        this.editor = this.getEditor();

        if (this.options.tooltips === false && this.toolbarButtons) {
          this.toolbarButtons.forEach((b) => {
            b.setAttribute('aria-label', b.getAttribute('title'));
            b.removeAttribute('title');
          });
        }

        this.updateToolbar();

        this.editor.events.on(
          'keydown',
          (event: KeyboardEvent) => {
            return this.keydownHandler(event);
          },
          true
        );

        // init emojis

        if (this.editor.opts.emoticonsSet[6]['id'] === 'symbols') {
          this.editor.opts.emoticonsSet.forEach((set, index) => {
            set.code = EMOJI_DATA[index].code;
          });
          this.editor.opts.emoticonsSet.splice(6, 1);
        }

        // init mentions
        if (this.mentionsEnabled()) {
          if (this.tribute) {
            this.tribute.attach(this.getEditorTextbox());
          }

          this.getEditorTextbox().addEventListener('tribute-replaced', () => {
            this.editor.events.trigger('contentChanged', [], true);
          });
        }

        // init pasteAsText && removeFormat
        if (this.toolbarButtons) {
          const buttons = this.toolbarButtons.filter((b) => {
            const title = b.getAttribute('aria-label').toLowerCase();
            return title.startsWith('paste') || title.startsWith('remove');
          });

          buttons.forEach((b) => {
            const title = b.getAttribute('aria-label');
            const span = b.children[0];
            if (!title || !span) {
              return;
            }

            span.setAttribute(
              'data-tooltip',
              title.toLowerCase().startsWith('paste')
                ? title + '\n(disabled)'
                : title
            );
            span.setAttribute('data-tooltip-wrap', 'pre');
            span.setAttribute('data-tooltip-align', 'center');
          });
        }

        // implementing baseFormElement input ref and focus method
        this.input = {
          nativeElement: {
            focus: this.editor.events.focus,
          },
        } as ElementRef;

        this.updateLength();

        if (this.focusOnInit) {
          this.focus();
        }
      },

      contentChanged: () => {
        this.updateLength();

        !this.ignoreEvents.includes(InputEventType.onChange) &&
          this.transmitValue(this.editor.html.get(), {
            eventType: [InputEventType.onChange],
            updateValue: true,
          });
      },

      focus: (event: FocusEvent) => {
        event?.preventDefault();

        !this.ignoreEvents.includes(InputEventType.onFocus) &&
          this.transmitValue(this.editor.html.get(), {
            eventType: [InputEventType.onFocus],
            emitterName: FormEvents.focused,
            updateValue: true,
            doPropagate: false,
          });
        this.inputFocused = true;

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

        this.editor.placeholder.hide();
      },

      blur: () => {
        this.closeMentions(true);

        !this.ignoreEvents.includes(InputEventType.onBlur) &&
          this.transmitValue(this.editor.html.get(), {
            eventType: [InputEventType.onBlur],
            emitterName: FormEvents.blurred,
            updateValue: true,
          });
        this.inputFocused = false;

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

        if (this.length === 0) {
          this.editor.placeholder.show();
        }
      },

      click: (event: MouseEvent) => {
        event?.stopPropagation();
        this.clicksHandler(event);
      },

      'window.copy': (event: ClipboardEvent) => {
        if (!this.inputFocused) {
          return;
        }
        event.preventDefault();
        this.editor.selection.save();

        const clipboardData: DataTransfer =
          event.clipboardData || event['originalEvent'].clipboardData;

        const content = this.editor.html.getSelected();

        const html =
          chainCall(
            this.outputTransformers,
            this.parserService.removeElements(content, '.fr-marker')
          ) + '<span data-bob-rte="true"></span>';

        const plainText = this.parserService.getPlainText(html);

        clipboardData.setData('text/html', html);
        clipboardData.setData('text/plain', plainText);

        this.editor.selection.restore();
      },

      'paste.before': (event: ClipboardEvent) => {
        const clipboardData: DataTransfer =
          event.clipboardData || event['originalEvent'].clipboardData;

        let html =
          clipboardData.getData('text/html') ||
          clipboardData.getData('text/plain');
        const isFromRte = html.indexOf('data-bob-rte') > -1;

        event.preventDefault();

        html = chainCall(
          [
            (value: string) =>
              this.parserService.removeElements(
                value,
                '[data-bob-rte], head, meta, title, style, xml, link'
              ),

            (value: string) =>
              this.miscControlsState.pasteAsText
                ? this.parserService
                    .getPlainText(value)
                    .replace(/(?:\r\n|\r|\n)/g, '<br>')
                : value,

            ...(!isFromRte && !this.miscControlsState.pasteAsText
              ? this.pasteTransformers
              : [
                  (value: string): string =>
                    this.placeholdersConverter.toRte(
                      value,
                      this.placeholderList
                    ),
                ]),
          ],
          html
        );

        try {
          this.editor.html.insert(html, true);
        } catch (error) {
          return;
        }
        this.editor.undo.saveStep();

        return false;
      },

      'paste.afterCleanup': (html: string): string => {
        if (html.includes('data-bob-rte')) {
          return chainCall(
            this.inputTransformers,
            this.parserService.removeElements(html, '[data-bob-rte]')
          );
        }

        return chainCall(this.inputTransformers, html).replace(
          /style="[^"]+"/gi,
          ''
        );
      },

      'commands.after': (cmd: string) => {
        if (cmd === 'linkInsert') {
          const link = this.editor.link.get() as HTMLElement;
          link.setAttribute('spellcheck', 'false');
          link.classList.add('fr-deletable');
        }
      },

      'commands.before': (cmd: string, param1: string, param2: string) => {
        if (
          this.mode === RTEMode.plainText &&
          cmd !== 'undo' &&
          cmd !== 'redo'
        ) {
          return false;
        }

        //
        // mentions toolbar button
        if (cmd === 'mentions') {
          if (this.tribute) {
            const curSelection: Selection = this.editor.selection.get();
            const curText = curSelection.focusNode.textContent;

            this.editor.undo.saveStep();

            if (!/\s/.test(curText[curSelection.focusOffset - 1])) {
              this.editor.html.insert(' ');
            }

            this.tribute.showMenuForCollection(this.getEditorTextbox());
          }
        }

        // emoji toolbar button
        if ((cmd = 'emoticonInsert') && param1 && param2) {
          const curSelection: Selection = this.editor.selection.get();
          const curText = curSelection.focusNode.textContent;

          this.editor.undo.saveStep();
          this.editor.html.insert(
            (/\s/.test(curText[curSelection.focusOffset - 1]) ? '' : ' ') +
              param2 +
              (/\s/.test(curText[curSelection.focusOffset]) ? '' : ' ')
          );
          this.editor.undo.saveStep();
          this.editor.popups.hideAll();

          return false;
        }
      },

      // link popup mods
      'popups.show.link.insert': () => {
        const linkPopupSubmit = this.getEditorElement(
          '.fr-layer[class*="fr-link-insert"] .fr-command.fr-submit'
        ) as HTMLElement;

        if (linkPopupSubmit) {
          linkPopupSubmit.dataset.cmdText = linkPopupSubmit.innerHTML
            .toLowerCase()
            .trim();
        }

        const inputs = asArray(
          this.getEditorElement(
            '.fr-layer[class*="fr-link-insert"] input[type="text"]'
          )
        ) as HTMLInputElement[];

        inputs.forEach((inputEl: HTMLInputElement) => {
          // inputEl.placeholder = inputEl.nextSibling.textContent;
          inputEl.autocomplete = 'off';
          inputEl.removeAttribute('id');
          inputEl.blur();
        });
        // inputs[0]?.focus();
        inputs[1]?.focus();
      },
    };
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.tribute) {
      this.tribute.detach(this.getEditorTextbox());
    }

    // remove event listeners
    this.getEditorTextbox().outerHTML = this.getEditorTextbox().outerHTML;
  }

  private focusHandler(event: FocusEvent): void {
    const target = event?.target as HTMLElement;

    if (!target) {
      return;
    }

    // select all text in link edit popup inputs
    if (
      target.matches('.fr-link-insert-layer input.fr-link-attr.fr-not-empty')
    ) {
      event.stopPropagation();
      (target as HTMLInputElement).select();
    }
  }

  private clicksHandler(event: MouseEvent): void {
    const target = event?.target as HTMLElement;

    this.closeMentions();

    if (!target) {
      return;
    }

    // placeholders related
    if (target.className.includes('placeholder-panel-trigger')) {
      this.editor.undo.saveStep();
      this.editor.events.disableBlur();
    }

    // prevent mentions link clicks
    if (
      target.className.includes('mention') ||
      target.getAttributeNames().join(' ').includes('mention')
    ) {
      event.stopPropagation();
      if (!eventHasMetaKey(event)) {
        event.preventDefault();
      }
      this.editor.selection.save();
      this.editor.toolbar.enable();
      this.editor.selection.restore();
    }
  }

  private keydownHandler(event: KeyboardEvent): any {
    if (!event) {
      return;
    }

    // cancel Ctrl+C events if selection is empty
    if (eventHasCntrlKey(event) && isKey(event.key, 'c')) {
      const selection = this.getNativeRange();
      if (selection.startOffset === selection.endOffset) {
        event.preventDefault();
        console.warn('Copy prevented, because selection is empty');
        return false;
      }
    }

    // mentions related
    if (this.mentionsEnabled()) {
      if (
        isKey(event.key, Keys.enter) &&
        this.tribute &&
        this.tribute.isActive
      ) {
        return false;
      }

      if (isKey(event.key, Keys.escape)) {
        this.closeMentions(true);
        return true;
      }
    }

    // max length
    if (
      this.maxChars &&
      this.length >= this.maxChars &&
      keyEventIsCharacter(event)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    return true;
  }

  // mentions methods

  private closeMentions(undo = false) {
    if (this.tribute && this.tribute.isActive) {
      this.tribute.hideMenu();

      if (undo) {
        this.editor.commands.undo();
      }
    }
  }

  // placeholder methods

  public onPlaceholderPanelOpen() {
    this.inputFocused = true;
    this.plchldrPnlTrgrFocused = true;
    this.editor.selection.save();
  }

  public onPlaceholderPanelClose() {
    this.plchldrPnlTrgrFocused = false;
    this.editor.selection.restore();
    this.editor.events.enableBlur();
  }

  public addPlaceholder(event: ListChange) {
    const placeholder = this.placeholdersConverter.getPlaceholderHtml(
      this.placeholderList,
      event.getSelectedIds()[0] as string
    );

    this.editor.selection.restore();
    this.editor.html.insert(placeholder);
    this.editor.undo.saveStep();

    this.placeholderList = cloneArray(this.placeholderList);
  }
}
