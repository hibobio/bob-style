import { Injectable } from '@angular/core';
import { chain, get, isEmpty, trim } from 'lodash';
import { RteCurrentContent, UpdateRteConfig, BlotData } from '../rte.interface';
import { Quill, RangeStatic } from 'quill';
import Parchment from 'parchment';
import { Blot } from 'parchment/src/blot/abstract/blot';
import { TextBlot } from 'quill/blots/text';
import { keysFromArrayOrObject } from '../../../services/utils/functional-utils';
import { PlaceholderRteConverterService } from '../placeholder-rte-converter/placeholder-rte-converter.service';
import {RTEControls} from '../rte.enum';

@Injectable()
export class RteUtilsService {
  constructor(private placeholderRteConverterService: PlaceholderRteConverterService) {}

  getHtmlContent(editor: Quill, controls: RTEControls[]): RteCurrentContent {
    const editorHtml = isEmpty(trim(editor.getText()))
      ? ''
      : chain(editor.root.innerHTML)
      // empty lines in the end
        .replace(
          /(<p([^\n\r\/<>]+)?><br><\/p>|<div([^\n\r\/<>]+)?><br><\/div>)+$/gi,
          ''
        )
        // empty tags
        .replace(/<([^>/][^>]+)([^\n\r\/<>]+)?>(\s+)?<\/\1>/gi, '')
        .replace(/(<em)/gi, '<i')
        .replace(/(<\/em>)/gi, '</i>')
        .value();
    const htmlBody = controls.includes(RTEControls.placeholders)
      ? this.placeholderRteConverterService.fromRte(editorHtml)
      : editorHtml;
    return {
      body: htmlBody,
      plainText: trim(editor.getText())
    };
  }

  getCurrentSelection(editor: Quill): RangeStatic {
    return editor.getSelection() || { index: 0, length: 0 };
  }

  getSelectionText(editor: Quill, selection: RangeStatic): string {
    return selection.length > 0
      ? editor.getText(selection.index, selection.length)
      : '';
  }

  getNativeRange(): Range {
    const selection = document.getSelection();
    return selection == null || selection.rangeCount <= 0
      ? null
      : selection.getRangeAt(0);
  }

  getCurrentBlot(): Blot {
    const nativeRange = this.getNativeRange();
    const node = nativeRange && nativeRange.endContainer;
    return node && Parchment.find(node);
  }

  getBlotIndex(blot: Blot, editor: Quill): number {
    return blot && blot.offset(editor.scroll);
  }

  getCurrentBlotData(editor: Quill): BlotData {
    const blot = this.getCurrentBlot();
    if (!blot) {
      return null;
    }
    const index = this.getBlotIndex(blot, editor);
    const text = (blot as TextBlot).text || '';
    const format = editor.getFormat(index + 1);

    return {
      index,
      length: text.length,
      text,
      format: Object.keys(format).length > 0 && format,
      link: format && format['Link']
    };
  }

  commonFormats(f1: string[] | {}, f2: string[] | {}): string[] {
    const f1keys = keysFromArrayOrObject(f1);
    const f2keys = keysFromArrayOrObject(f2);
    const common = f1keys.filter(x => f2keys.includes(x));
    return common.length > 0 && common;
  }

  selectBlot(blot: BlotData, editor: Quill): RangeStatic {
    if (!blot.format) {
      return null;
    }
    editor.setSelection(blot.index, blot.length);
    return { index: blot.index, length: blot.length };
  }

  updateEditor(editor: Quill, updateConfig: UpdateRteConfig): void {
    const originalFormat = editor.getFormat(updateConfig.startIndex + 1);

    editor.deleteText(updateConfig.startIndex, updateConfig.replaceStr.length);
    editor.insertText(updateConfig.startIndex, updateConfig.insertText);

    const newFormat = {
      ...originalFormat,
      [updateConfig.format.type]: updateConfig.format.value
    };
    if (updateConfig.unformat) {
      updateConfig.unformat.forEach(format => {
        delete newFormat[format];
      });
    }

    editor.formatText(
      updateConfig.startIndex,
      updateConfig.insertText.length,
      newFormat
    );

    const editorSelectionEnd = editor.getLength() - 1;
    const insertedTextEnd =
      updateConfig.startIndex + updateConfig.insertText.length;
    if (editorSelectionEnd === insertedTextEnd) {
      editor.insertText(editorSelectionEnd + 1, '');
    }

    editor.setSelection(insertedTextEnd, 0);
  }

  getEditorPlaceholder(label: string, required: boolean): string {
    return label ? label + (required ? ' *' : '') : '';
  }

  setEditorPlaceholder(editor: Quill, label: string, required: boolean): void {
    if (editor) {
      editor.root.dataset.placeholder = this.getEditorPlaceholder(
        label,
        required
      );
    }
  }
}
