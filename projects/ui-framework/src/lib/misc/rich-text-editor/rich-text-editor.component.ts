import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import quillLib, { Quill, QuillOptionsStatic, RangeStatic } from 'quill';
import { LinkBlot } from './formats/link-blot';
import { PanelComponent } from '../../overlay/panel/panel.component';
import { BlotType, FormatTypes } from './rich-text-editor.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RteCurrentContent, RteLink, UpdateRteConfig } from './rich-text-editor.interface';
import isEmpty from 'lodash/isEmpty';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';

quillLib.register(Block, true);
quillLib.register(LinkBlot);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {

  @Input() rteHtml: string;

  @ViewChild('quillEditor') quillEditor: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('linkPanel') linkPanel: PanelComponent;

  editor: Quill;
  selection: RangeStatic;
  selectedText: string;

  formatTypes = FormatTypes;
  buttonType = ButtonType;
  icons = Icons;
  iconColor = IconColor;

  constructor(
    private rteUtilsService: RteUtilsService,
  ) {
  }

  ngOnInit(): void {
    const editorOptions: QuillOptionsStatic = {
      modules: {
        toolbar: this.toolbar.nativeElement,
      },
      theme: 'snow'
    };

    this.editor = new quillLib(this.quillEditor.nativeElement, editorOptions);

    if (!isEmpty(this.rteHtml)) {
      this.editor.clipboard.dangerouslyPasteHTML(this.rteHtml);
    }
  }

  getCurrentText(): RteCurrentContent {
    return this.rteUtilsService.getHtmlContent(this.editor);
  }

  toggleFormat(formatType: FormatTypes) {
    this.editor.focus();
    this.editor.format(formatType, !this.rteUtilsService.isSelectionHasFormat(this.editor, formatType));
  }

  onLinkPanelOpen(): void {
    this.editor.focus();
    this.selection = this.rteUtilsService.getCurrentSelection(this.editor);
    this.selectedText = this.rteUtilsService.getSelectionText(this.editor, this.selection);
    this.editor.blur();
  }

  onLinkUpdate(rteLink: RteLink): void {
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: rteLink.text,
      format: {
        type: BlotType.Link,
        value: rteLink.url,
      },
    };
    this.rteUtilsService.updateEditor(this.editor, updateConfig, false);
    this.linkPanel.closePanel();
  }

  onLinkCancel(): void {
    this.linkPanel.closePanel();
  }
}
