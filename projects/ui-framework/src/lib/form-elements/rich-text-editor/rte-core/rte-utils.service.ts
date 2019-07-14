import { Injectable } from '@angular/core';
import { UpdateRteConfig, BlotData } from './rte.interface';
import quillLib, {
  Quill,
  RangeStatic,
  DeltaStatic,
  Delta as DeltaType
} from 'quill';
const Delta: typeof DeltaType = quillLib.import('delta');
import { keysFromArrayOrObject } from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';
import { BlotType } from './rte.enum';

@Injectable()
export class RteUtilsService {
  constructor(private DOM: DOMhelpers) {}

  getHtmlContent(editor: Quill): string {
    return !editor.root.textContent.trim() ? '' : editor.root.innerHTML;
  }

  getTextLength(editor: Quill): number {
    return editor.getLength() - 1;
  }

  cleanupHtml(value: string): string {
    console.log('cleanup', value);
    return (
      value
        // empty lines in the end
        .replace(
          /(<p([^\n\r\/<>]+)?><br><\/p>|<div([^\n\r\/<>]+)?><br><\/div>)+$/gi,
          ''
        )
        // empty tags
        .replace(/<[^\/>][^>]+>(\s+)?<\/[^>]+>/gi, '')
    );
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

  getBlotDataFromElement(
    element: any,
    editor: Quill,
    skipformat = false
  ): BlotData {
    let node: any;
    if (this.DOM.isTextNode(element)) {
      node = element;
      element = node.parentElement;
    } else {
      node = element.childNodes[0];
    }
    const blot =
      element && element.__blot
        ? element.__blot.blot
        : node && node.__blot
        ? node.__blot.blot
        : null;

    if (!blot) {
      return;
    }

    const index = blot.offset(editor.scroll);
    const text = blot.text || (node && node.textContent) || element.innerText;
    const length = text ? text.length : 0;
    const format =
      (!skipformat && {
        [blot.statics.blotName as string]: blot.statics.formats
          ? blot.statics.formats(element)
          : true
      }) ||
      {};

    return {
      index,
      endIndex: index + length,
      length: length,
      text,
      format: (skipformat || Object.keys(format).length > 0) && format,
      node,
      blot,
      element,
      link: format[BlotType.link],
      formatIs: f => format && format.hasOwnProperty(f),
      select: () => this.selectBlot({ index, length, format }, editor),
      delete: () => this.deleteRange({ index, length }, editor)
    };
  }

  getCurrentBlotData(
    editor: Quill,
    skipformat = false,
    index: number = null
  ): BlotData {
    let node: Node;
    if (index && editor) {
      node = editor.getLeaf(index)[0] && editor.getLeaf(index)[0].domNode;
    } else {
      const nativeRange = this.getNativeRange();
      node = nativeRange && nativeRange.endContainer; // startContainer
    }
    if (!node) {
      return;
    }
    return this.getBlotDataFromElement(node, editor, skipformat);
  }

  commonFormats(f1: string[] | {}, f2: string[] | {}): string[] {
    if (!f1 || !f2) {
      return null;
    }
    const f1keys = keysFromArrayOrObject(f1);
    const f2keys = keysFromArrayOrObject(f2);
    const common = f1keys.filter(x => f2keys.includes(x));
    return common.length > 0 && common;
  }

  deleteRange(range: RangeStatic, editor: Quill): DeltaStatic {
    return editor.updateContents(
      new Delta().retain(range.index).delete(range.length)
    );
  }

  deleteBlot(blot: Partial<BlotData>, editor: Quill): DeltaStatic {
    return this.deleteRange(
      {
        index: blot.index,
        length: blot.length
      },
      editor
    );
  }

  insertAtIndex(
    editor: Quill,
    text: string,
    index: number,
    format = {}
  ): DeltaStatic {
    return editor.updateContents(
      new Delta().retain(index).insert(text, format)
    );
  }

  getCharAtIndex(index: number, editor: Quill, offsetMod = 0): string {
    const leaf = editor.getLeaf(index);
    const blot = leaf[0];
    if (!blot) {
      return null;
    }
    const offset = leaf[1] + offsetMod;
    const text = blot && blot.text;
    const char = blot && text && text.substr(offset, 1);

    // moving to next blot
    if (text && offset >= text.length) {
      return this.getCharAtIndex(index + 1, editor, -1);
    }

    return char;
  }

  charIsWhiteSpace(char: string): boolean {
    return !char || (char !== '\xa0' && /\s/.test(char));
  }

  spaceIfNeededAtIndex(index: number, editor: Quill): string {
    return !this.charIsWhiteSpace(this.getCharAtIndex(index, editor))
      ? ' '
      : '';
  }

  selectBlot(blot: Partial<BlotData>, editor: Quill, offset = 0): RangeStatic {
    if (!blot.format) {
      return null;
    }
    editor.setSelection(blot.index + offset, blot.length);
    return { index: blot.index, length: blot.length };
  }

  insertBlot(editor: Quill, config: UpdateRteConfig): RangeStatic {
    if (!config.insertText) {
      return null;
    }

    let originalFormat = editor.getFormat(config.startIndex + 1);
    if (Object.entries(originalFormat).length === 0) {
      originalFormat = editor.getFormat(config.startIndex);
    }

    const newFormat = {
      ...originalFormat,
      [config.format.type]: config.format.value
    };
    if (config.unformat) {
      config.unformat.forEach(format => {
        newFormat[format] = null;
      });
    }

    const spaceBefore = config.addSpaces
      ? this.spaceIfNeededAtIndex(config.startIndex - 1, editor)
      : '';

    const spaceAfter = config.addSpaces
      ? this.spaceIfNeededAtIndex(
          config.startIndex + config.replaceStr.length,
          editor
        )
      : '';

    const insertedTextLength =
      config.insertText.length + spaceBefore.length + spaceAfter.length;

    const originalEditorLength = editor.getLength();
    const retainLength =
      originalEditorLength -
      config.startIndex -
      config.replaceStr.length -
      insertedTextLength;

    const insertedTextEnd = config.startIndex + insertedTextLength;

    const futureEditorLength =
      originalEditorLength - config.replaceStr.length + insertedTextLength;

    const finalCharacter =
      insertedTextEnd + 1 === futureEditorLength
        ? !this.commonFormats(newFormat, config.noLinebreakAfter)
          ? '\n'
          : ' '
        : '';

    editor.updateContents(
      new Delta()
        .retain(config.startIndex)
        .delete(config.replaceStr.length)
        .insert(spaceBefore)
        .insert(config.insertText, newFormat)
        .insert(spaceAfter)
        .retain(retainLength)
        .insert(finalCharacter)
    );
    editor.setSelection(insertedTextEnd, 0);
    return { index: insertedTextEnd, length: 0 };
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
