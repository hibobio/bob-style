import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
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
} from 'bob-style';

import { RTEbaseElement } from './rte.abstract';
import { PlaceholdersConverterService } from './placeholders.service';
import { TranslateService } from '@ngx-translate/core';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent extends RTEbaseElement
  implements OnInit, OnDestroy {
  constructor(
    protected cd: ChangeDetectorRef,
    protected placeholdersConverter: PlaceholdersConverterService,
    protected parserService: HtmlParserHelpers,
    protected DOM: DOMhelpers,
    protected host: ElementRef,
    protected translate: TranslateService
  ) {
    super(cd, placeholdersConverter, parserService, DOM, host, translate);
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

        // cancel Ctrl+C events if selection is empty
        this.editor.events.on(
          'keydown',
          (event: KeyboardEvent) => {
            if (eventHasCntrlKey(event) && isKey(event.key, 'c')) {
              const selection = this.getNativeRange();
              if (selection.startOffset === selection.endOffset) {
                event.preventDefault();
                console.log('Copy prevented, because selection is empty');
                return false;
              }
            }
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

          this.editor.events.on(
            'keydown',
            (event: KeyboardEvent) => {
              if (
                isKey(event.key, Keys.enter) &&
                this.tribute &&
                this.tribute.isActive
              ) {
                return false;
              }

              if (isKey(event.key, Keys.escape)) {
                this.closeMentions(true);
              }
            },
            true
          );

          this.getEditorTextbox().addEventListener('tribute-replaced', () => {
            this.editor.events.trigger('contentChanged', [], true);
          });
        }

        // placeholders related
        this.editor.events.bindClick(
          this.editor.$(this.host.nativeElement),
          '.placeholder-panel-trigger',
          () => {
            this.editor.undo.saveStep();
            this.editor.events.disableBlur();
          }
        );

        // implementing baseFormElement input ref and focus method
        this.input = {
          nativeElement: {
            focus: this.editor.events.focus,
          },
        } as ElementRef;
      },

      contentChanged: () => {
        this.transmitValue(this.editor.html.get(), {
          eventType: [InputEventType.onChange],
          updateValue: true,
        });
      },

      focus: () => {
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
        this.closeMentions();

        const target = event.target as HTMLElement;

        // prevent mentions link clicks
        if (
          target.className.includes('mention') ||
          target.getAttributeNames().join(' ').includes('mention')
        ) {
          if (!eventHasMetaKey(event)) {
            event.preventDefault();
          }
          this.editor.selection.save();
          this.editor.toolbar.enable();
          this.editor.selection.restore();
        }
      },

      'window.copy': (event: ClipboardEvent) => {
        if (!this.inputFocused) {
          return;
        }
        event.preventDefault();
        this.editor.selection.save();

        const clipboardData: DataTransfer =
          event.clipboardData || event['originalEvent'].clipboardData;
        const content = this.parserService.removeElements(
          this.editor.html.getSelected(),
          '.fr-marker'
        );
        const html =
          chainCall(this.outputTransformers, content) +
          '<span data-bob-rte="true"></span>';

        clipboardData.setData('text/plain', html);
        clipboardData.setData('text/html', html);

        this.editor.selection.restore();
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

      'charCounter.update': () => {
        this.updateLength();
      },

      'commands.after': (cmd: string) => {
        if (cmd === 'linkInsert') {
          const link = this.editor.link.get() as HTMLElement;
          link.setAttribute('spellcheck', 'false');
          link.classList.add('fr-deletable');
        }
      },

      'commands.before': (cmd: string, param1: string, param2: string) => {
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
        const inputs = asArray(
          this.getEditorElement(
            '.fr-layer[class*="fr-link-insert"] input[type="text"]'
          )
        );
        inputs.forEach((inputEl: HTMLInputElement) => {
          inputEl.placeholder = inputEl.nextSibling.textContent;
          inputEl.autocomplete = 'off';
          inputEl.removeAttribute('id');
          inputEl.blur();
        });
        inputs[0].focus();
      },
    };
  }

  ngOnDestroy(): void {
    if (this.tribute) {
      this.tribute.detach(this.getEditorTextbox());
    }

    // remove event listeners
    this.getEditorTextbox().outerHTML = this.getEditorTextbox().outerHTML;
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
