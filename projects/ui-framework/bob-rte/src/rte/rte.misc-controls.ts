import FroalaEditor from 'froala-editor';
import { SelectGroupOption } from 'bob-style';
import { HtmlParserHelpers } from 'bob-style';
import { PlaceholdersConverterService } from './placeholders.service';

export const initPasteAsTextControl = (controlsState: {
  pasteAsText: boolean;
}) => {
  FroalaEditor.DefineIcon('pasteAsText');
  FroalaEditor.RegisterCommand('pasteAsText', {
    icon: 'pasteAsText',
    title: 'Paste as plain text',
    focus: true,
    undo: true,
    refreshAfterCallback: true,

    callback: function () {
      controlsState.pasteAsText = !controlsState.pasteAsText;
    },

    refresh: function (btns: HTMLElement[]) {
      try {
        if (controlsState.pasteAsText) {
          btns[0].classList.add('fr-active');
          btns[0].setAttribute('data-active', 'true');
          btns[0].children[0]?.setAttribute(
            'data-tooltip',
            btns[0].children[0]
              .getAttribute('data-tooltip')
              .split('(')[0]
              .trim() + '\n(enabled)'
          );
        } else {
          btns[0].classList.remove('fr-active');
          btns[0].setAttribute('data-active', 'false');
          btns[0].children[0]?.setAttribute(
            'data-tooltip',
            btns[0].children[0]
              .getAttribute('data-tooltip')
              .split('(')[0]
              .trim() + '\n(disabled)'
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
  });
};

export const initRemoveFormatControl = (config: {
  parserService: HtmlParserHelpers;
  placeholdersConverter: PlaceholdersConverterService;
  placeholderList: SelectGroupOption[];
  placeholdersEnabled: boolean;
}) => {
  const {
    parserService,
    placeholdersConverter,
    placeholderList,
    placeholdersEnabled,
  } = config;

  FroalaEditor.DefineIcon('removeFormat');
  FroalaEditor.RegisterCommand('removeFormat', {
    icon: 'removeFormat',
    title: 'Remove text formatting',
    focus: true,
    undo: true,
    refreshAfterCallback: false,

    callback: function () {
      try {
        const newHtml = parserService
          .getPlainText(
            placeholdersEnabled
              ? placeholdersConverter.fromRte(this.html.get())
              : this.html.get()
          )
          .replace(/(?:\r\n|\r|\n)/g, '<br>');

        this.html.set(
          placeholdersEnabled
            ? placeholdersConverter.toRte(newHtml, placeholderList)
            : newHtml
        );
      } catch (e) {
        console.error(e);
      }
    },
  });
};
