import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {
  InputEventType,
  FormEvents,
  HtmlParserHelpers,
  isKey,
  Keys,
  ListChange,
  cloneArray
} from 'bob-style';

import { RTEbaseElement } from './rte.abstract';
import { PlaceholdersConverterService } from './placeholders.service';

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextEditorComponent extends RTEbaseElement implements OnInit {
  constructor(
    public cd: ChangeDetectorRef,
    public placeholdersConverter: PlaceholdersConverterService,
    public parserService: HtmlParserHelpers,
    private host: ElementRef
  ) {
    super(cd, placeholdersConverter, parserService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.options.events = {
      //
      initialized: () => {
        this.toolbarButtons = this.getEditorElement(
          'button[title]'
        ) as HTMLElement[];

        this.editor = this.getEditor();

        if (this.options.tooltips === false) {
          this.toolbarButtons.forEach(b => {
            b.setAttribute('aria-label', b.getAttribute('title'));
            b.removeAttribute('title');
          });
        }

        this.updateToolbar();

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
      },

      contentChanged: () => {
        this.transmitValue(this.editor.html.get(), {
          eventType: [InputEventType.onChange],
          updateValue: true
        });
      },

      focus: () => {
        this.transmitValue(this.editor.html.get(), {
          eventType: [InputEventType.onFocus],
          eventName: FormEvents.focused,
          updateValue: true,
          doPropagate: false
        });
        this.inputFocused = true;

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      },

      blur: () => {
        this.closeMentions(true);

        this.transmitValue(this.editor.html.get(), {
          eventType: [InputEventType.onBlur],
          eventName: FormEvents.blurred,
          updateValue: true
        });
        this.inputFocused = false;

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      },

      click: (event: MouseEvent) => {
        this.closeMentions();

        // prevent mentions link clicks
        if (
          !event.metaKey &&
          (event.target as HTMLElement).className.includes('mention')
        ) {
          this.editor.selection.save();
          event.preventDefault();
          this.editor.toolbar.enable();
          this.editor.selection.restore();
        }
      },

      'paste.afterCleanup': (html: string): string =>
        this.inputTransformers.reduce(
          (previousResult, fn) => fn(previousResult),
          html
        ),

      'charCounter.update': () => {
        this.length = this.getEditor().charCounter.count();

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
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
            const curSelection = this.editor.selection.get();
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
          const curSelection = this.editor.selection.get();
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
      }
    };
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
