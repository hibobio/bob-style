import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';

let Quill: any = null;

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {

  @ViewChild('quillEditor') quillEditor: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;

  sizeOptions: SelectGroupOption[] = [
    {
      groupName: 'size options',
      options: [
        { id: 1, value: 'normal' },
        { id: 2, value: 'small' },
        { id: 3, value: 'big' },
        { id: 4, value: 'huge' },
      ],
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
    if (!Quill) {
      Quill = require('quill');
    }
    const editor = new Quill(this.quillEditor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement,
      },
      theme: 'snow'
    });
  }
}
