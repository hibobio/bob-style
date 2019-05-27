import { Component, OnInit, ViewChild, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { chipOptionsMock } from '../../../ui-framework/src/lib/buttons-indicators/chips/chip-input/chipsOptionsMock';

import { RichTextEditorComponent } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rte.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {}

  @ViewChild('rteEditor') private rteEditor: RichTextEditorComponent;

  // Chips Input

  allChips = chipOptionsMock;

  myForm2 = new FormGroup({
    chipsControl: new FormControl([], {
      updateOn: 'blur'
    })
  });

  // RTE

  disabled = false;
  error = false;
  plchldrs = true;
  lines = 2;

  placeholderList = [
    {
      groupName: 'Basic Info - header',
      options: [
        {
          displayName: 'First name',
          id: '/root/firstName',
          value: 'First name'
        },
        {
          displayName: 'title',
          id: '/work/title',
          category: 'Work',
          value: 'title'
        }
      ]
    }
  ];

  myForm = new FormGroup({
    rteControl: new FormControl('', {
      updateOn: 'blur'
    }),
    inputControl: new FormControl('', {
      updateOn: 'blur'
    })
  });

  rteInitValue = `<div>Hello <a href="http://www.google.com">World</a> and suck dicks!</div>
  <div>Some <em>initial</em> <strong>bold</strong> text</div>
  {{/root/firstName}}`;

  togglePlaceholders() {
    this.plchldrs = !this.plchldrs;
  }

  onRTEevent(event, type) {
    console.log('*** RTE ' + type + ': "' + event + '"');
  }

  onRteFormSubmit() {
    console.log(this.myForm.value);
  }

  ngOnInit() {
    this.myForm.get('rteControl').valueChanges.subscribe(value => {
      console.log('!!!!!!! RTE valueChanges: "' + value + '"');
    });

    this.myForm.get('inputControl').valueChanges.subscribe(value => {
      console.log('!!!!!!! INP valueChanges', value);
      this.myForm.get('rteControl').setValue(value);
    });

    this.myForm.get('inputControl').setValue('i am input', {
      emitEvent: false
    });
    this.myForm.get('rteControl').setValue('i am rte', {
      emitEvent: false
    });

    setTimeout(() => {
      this.rteEditor.ngOnChanges({
        value: new SimpleChange(null, this.rteInitValue, false)
      });
      this.rteEditor.editor.root.dispatchEvent(new Event('blur'));
    }, 1000);

    // chips

    this.myForm2.get('chipsControl').valueChanges.subscribe(value => {
      console.log('>>> CHIPS valueChanges: "' + value + '"');
    });
    this.myForm2.get('chipsControl').setValue(['petting', 'rimming'], {
      emitEvent: false
    });
  }
}
