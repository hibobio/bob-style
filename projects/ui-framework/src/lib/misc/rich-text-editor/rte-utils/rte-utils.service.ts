import { Injectable } from '@angular/core';
import { chain, get, set, isEmpty, trim, isNull, has } from 'lodash';
import { RteCurrentContent, UpdateRteConfig } from '../rich-text-editor.interface';
import { FormatTypes } from '../rich-text-editor.enum';
import { Quill, RangeStatic } from 'quill';

@Injectable()
export class RteUtilsService {

  constructor() {
  }

  getHtmlContent(editor: Quill): RteCurrentContent {
    const editorHtml = isEmpty(trim(editor.getText()))
      ? ''
      : chain(editor.root.innerHTML)
        .replace(/(<p><br><\/p>|<p class="ql-direction-rtl"><br><\/p>)*$/ig, '')
        .replace(/(<em)/ig, '<i')
        .replace(/(<\/em>)/ig, '</i>')
        .value();

    return {
      body: editorHtml,
      plainText: editor.getText(),
    };
  }

  isSelectionHasFormat(editor: Quill, formatType: FormatTypes): boolean {
    return editor && !isNull(editor.getSelection()) && has(editor.getFormat(), formatType);
  }

  getCurrentSelection(editor: Quill): RangeStatic {
    return (editor.getSelection())
      ? editor.getSelection()
      : { index: 0, length: 0 };
  }

  getSelectionText(editor: Quill, selection: RangeStatic): string {
    return (get(selection, 'length') > 0)
      ? editor.getText(selection.index, selection.length)
      : '';
  }

  updateEditor(editor: Quill, updateConfig: UpdateRteConfig, insertSpaceAfterBlot = true): void {
    const charAfterBlot = insertSpaceAfterBlot ? ' ' : '';
    set(updateConfig, 'insertText', `${ updateConfig.insertText }${ charAfterBlot }`);
    editor.focus();
    editor.deleteText(updateConfig.startIndex, updateConfig.replaceStr.length);
    editor.insertText(updateConfig.startIndex, `${ updateConfig.insertText }`);
    editor.removeFormat(updateConfig.startIndex, updateConfig.insertText.length - charAfterBlot.length);
    editor.formatText(updateConfig.startIndex, updateConfig.insertText.length - charAfterBlot.length, {
      [updateConfig.format.type]: updateConfig.format.value,
    });
    editor.setSelection(updateConfig.startIndex + updateConfig.insertText.length, 0);
  }
}
