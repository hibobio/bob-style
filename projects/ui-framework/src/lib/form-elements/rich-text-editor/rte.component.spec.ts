import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
  flush
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import {
  NO_ERRORS_SCHEMA,
  Component,
  SimpleChange,
  OnInit,
  OnDestroy
} from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  FormGroup
} from '@angular/forms';

import { RichTextEditorComponent } from './rte.component';
import { RteLinkEditorComponent } from './rte-link/rte-link-editor.component';
import { RteUtilsService } from './rte-core/rte-utils.service';
import { RTEType, BlotType, RTEchangeEvent } from './rte-core/rte.enum';
import Quill from 'quill';
import { PanelModule } from '../../popups/panel/panel.module';
import { SingleSelectModule } from '../lists/single-select/single-select.module';
import { InputModule } from '../input/input.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { PlaceholderRteConverterService } from './rte-placeholder/placeholder-rte-converter.service';
import { InputMessageModule } from '../input-message/input-message.module';

@Component({
  template: `
    <form class="form" [formGroup]="rteForm">
      <b-rich-text-editor
        [label]="'label text'"
        [placeholder]="'placeholder text'"
        formControlName="rteControl"
      ></b-rich-text-editor>
    </form>
  `,
  providers: []
})
class TestComponent implements OnInit, OnDestroy {
  constructor() {}
  rteForm: any;
  rtrValue: string;
  subscr;

  ngOnInit(): void {
    this.rteForm = new FormGroup({
      rteControl: new FormControl('', { updateOn: 'change' })
    });
    this.subscr = this.rteForm
      .get('rteControl')
      .valueChanges.subscribe(value => {
        this.rtrValue = value;
      });
  }
  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }
}

describe('RichTextEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let RTEComponent: RichTextEditorComponent;
  let RTEnativeElement: HTMLElement;
  let RTEeditorNativeElement: HTMLElement;
  let platform: Platform;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let QuillEditor: Quill;
  let RTEqlEditorNativeElement: HTMLElement;
  let rteControl: FormControl;

  let rteUtils: RteUtilsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        RichTextEditorComponent,
        RteLinkEditorComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        PanelModule,
        SingleSelectModule,
        InputModule,
        ButtonsModule,
        IconsModule,
        MatFormFieldModule,
        InputMessageModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [RteUtilsService, DOMhelpers, PlaceholderRteConverterService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        rteUtils = TestBed.get(RteUtilsService);

        fixture.detectChanges();

        RTEComponent = fixture.debugElement.query(By.css('b-rich-text-editor'))
          .componentInstance;

        RTEnativeElement = fixture.debugElement.query(
          By.css('b-rich-text-editor')
        ).nativeElement;

        RTEeditorNativeElement = fixture.debugElement.query(
          By.css('.quill-editor')
        ).nativeElement;

        rteControl = testComponent.rteForm.get('rteControl');

        RTEComponent.ngOnChanges({
          controls: new SimpleChange(null, RTEComponent.controlsDef, true),
          disableControls: new SimpleChange(
            null,
            RTEComponent.disableControlsDef,
            true
          )
        });

        setTimeout(() => {
          QuillEditor = RTEComponent.editor;
          RTEqlEditorNativeElement = QuillEditor.root;
          fixture.detectChanges();
        }, 0);
      });

    inject(
      [OverlayContainer, Platform],
      (oc: OverlayContainer, p: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        platform = p;
      }
    )();
  }));

  describe('Init', () => {
    it('should create component', () => {
      expect(RTEComponent).toBeTruthy();
      expect(QuillEditor).toBeTruthy();
    });
  });

  describe('Simple inputs', () => {
    it('should toggle between primary & secondary designs', () => {
      expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
        '1px'
      );
      RTEComponent.type = RTEType.secondary;
      fixture.detectChanges();
      expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
        '0px'
      );
    });

    it('should insert hintMessage text', () => {
      RTEComponent.hintMessage = 'test hint';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(
        By.css('[b-input-message]')
      ).nativeElement;
      expect(messageElement.innerText).toEqual('test hint');
    });

    it('should insert warnMessage text over hintMessage text', () => {
      RTEComponent.hintMessage = 'test hint';
      RTEComponent.warnMessage = 'test warn';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(
        By.css('[b-input-message]')
      ).nativeElement;
      expect(messageElement.innerText).toEqual('test warn');
    });
  });

  describe('Label & placeholder', () => {
    it('should insert placeholder text', () => {
      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'placeholder text'
      );
    });

    it('should update placeholder text', () => {
      RTEComponent.ngOnChanges({
        placeholder: new SimpleChange(null, 'test placeholder', false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'test placeholder'
      );
    });

    it('should insert label text', () => {
      const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
        .nativeElement;
      expect(labelElem.innerText).toEqual('label text');
    });

    it('should insert label text into placeholder slot if no placeholder text provided', () => {
      RTEComponent.ngOnChanges({
        placeholder: new SimpleChange(null, undefined, false)
      });
      fixture.detectChanges();

      const labelElem = fixture.debugElement.query(By.css('.bfe-label'));

      expect(labelElem).toBeFalsy();
      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'label text'
      );
    });

    it('should add * to placeholder text, when required is true and no label provided', () => {
      RTEComponent.ngOnChanges({
        label: new SimpleChange(null, undefined, false),
        required: new SimpleChange(null, true, false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'placeholder text *'
      );
    });

    it('should add * to label text, and not placeholder, when required is true and both label and placeholder provided', () => {
      RTEComponent.ngOnChanges({
        required: new SimpleChange(null, true, false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'placeholder text'
      );
      const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
        .nativeElement;

      const labelBeforeStyle = window.getComputedStyle(labelElem, '::after');
      const labelBeforeText = labelBeforeStyle.getPropertyValue('content');

      expect(labelElem.innerText).toEqual('label text');
      expect(labelBeforeText).toContain('*');
    });
  });

  describe('Disabled & Error', () => {
    it('should disable the editor when disabled is true', () => {
      expect((QuillEditor as any).isEnabled()).toEqual(true);

      RTEComponent.ngOnChanges({
        disabled: new SimpleChange(null, true, false)
      });

      fixture.detectChanges();

      expect(RTEnativeElement.classList).toContain('disabled');
      expect((QuillEditor as any).isEnabled()).toEqual(false);
    });

    it('should set invalid style when errorMessage is present', () => {
      RTEComponent.errorMessage = 'test error';
      fixture.detectChanges();
      RTEeditorNativeElement.style.setProperty('--negative-600', 'red');

      const errorNativeElement = fixture.debugElement.query(By.css('.error'))
        .nativeElement;

      expect(RTEnativeElement.classList).toContain('error');
      expect(errorNativeElement.innerText).toContain('test error');
      expect(getComputedStyle(RTEeditorNativeElement).borderColor).toEqual(
        'rgb(255, 0, 0)'
      );
    });
  });

  describe('Min & Max height', () => {
    it('should set minimum and maximum editor height', () => {
      RTEComponent.minHeight = 300;
      RTEComponent.maxHeight = 600;
      fixture.detectChanges();

      const qlContainer = fixture.debugElement.query(By.css('.ql-container'))
        .nativeElement;
      const qlContainerStyle = qlContainer
        .getAttribute('style')
        .replace(/\s/g, '');

      expect(qlContainerStyle).toEqual(
        `min-height:${300 - 43}px;max-height:${600 - 43}px;`
      );
    });

    it('should disable min/max height when set to null', () => {
      RTEComponent.minHeight = null;
      RTEComponent.maxHeight = null;
      fixture.detectChanges();

      const qlContainer = fixture.debugElement.query(By.css('.ql-container'))
        .nativeElement;
      const qlContainerStyle = qlContainer.getAttribute('style');

      expect(qlContainerStyle).toBeFalsy();
    });
  });

  describe('Editor toolbar controls', () => {
    it('should display toolbar with controls present in controls array', () => {
      RTEComponent.controls = [BlotType.bold, BlotType.italic];
      fixture.detectChanges();
      const controlElems = fixture.debugElement.queryAll(
        By.css('.quill-toolbar > [class*="ql-"]:not([hidden])')
      );
      expect(controlElems.length).toEqual(2);
    });
  });

  describe('Size control', () => {
    it('should open Size Panel on toolbar Size button click', () => {
      const sizeButtonElement = fixture.debugElement.query(
        By.css('b-panel button.rte-size')
      ).nativeElement;
      sizeButtonElement.click();

      const sizePanelElement = overlayContainerElement.querySelector(
        '.b-panel.rte-size-controls'
      ) as HTMLElement;

      expect(sizePanelElement).toBeTruthy();
    });

    it('should change font-size with Size Panel controls', fakeAsync(() => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test', false)
      });
      const sizeButtonElement = fixture.debugElement.query(
        By.css('b-panel button.rte-size')
      ).nativeElement;
      sizeButtonElement.click();

      const hugeButtonElement = overlayContainerElement.querySelector(
        '.rte-button.rte-size-huge'
      ) as HTMLElement;
      QuillEditor.setSelection(0, 4);
      hugeButtonElement.click();

      tick(50);
      expect(testComponent.rtrValue).toContain('font-size: 32px;');
      flush();
    }));
  });

  describe('Link control', () => {
    it('should open Link Editor panel on toolbar Link button click', () => {
      const linkButtonElement = fixture.debugElement.query(
        By.css('b-panel button.ql-link')
      ).nativeElement;
      linkButtonElement.click();

      const linkPanelElement = overlayContainerElement.querySelector(
        '.b-panel.rte-link-editor-panel'
      ) as HTMLElement;

      expect(linkPanelElement).toBeTruthy();
    });

    it('should insert link into Editor', fakeAsync(() => {
      const linkButtonElement = fixture.debugElement.query(
        By.css('b-panel button.ql-link')
      ).nativeElement;
      linkButtonElement.click();

      const textInputElement = <HTMLInputElement>(
        overlayContainerElement.querySelector('.bfe-input[type="text"]')
      );
      const urlInputElement = <HTMLInputElement>(
        overlayContainerElement.querySelector('.bfe-input[type="url"]')
      );
      const addButtonElement = overlayContainerElement.querySelector(
        'b-rte-link-editor .mat-button.primary'
      ) as HTMLElement;

      textInputElement.value = 'test1';
      textInputElement.dispatchEvent(new Event('input'));
      urlInputElement.value = 'test2';
      urlInputElement.dispatchEvent(new Event('input'));
      addButtonElement.click();

      tick(50);
      expect(testComponent.rtrValue).toContain('a href="http://test2"');
      flush();
    }));
  });

  describe('Value input', () => {
    it('should set the editor text to value input', () => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text', false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.innerText.trim()).toEqual('test text');
    });
  });

  describe('FormControl setValue', () => {
    it('should let FormControl set value and then emit valueChanges', fakeAsync(() => {
      rteControl.setValue('test');
      tick(50);
      expect(testComponent.rtrValue).toEqual('test');
      flush();
    }));

    it('should not emit valueChanges when setting value with emitEvent false', fakeAsync(() => {
      rteControl.setValue('test2', {
        emitEvent: false
      });
      tick(50);
      expect(testComponent.rtrValue).not.toEqual('test2');
      flush();
    }));
  });

  describe('FormControl propagateChange', () => {
    it('should propagate value when text changes and sendChangeOn = change', fakeAsync(() => {
      RTEComponent.sendChangeOn = RTEchangeEvent.change;
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 1', false)
      });
      tick(50);
      expect(testComponent.rtrValue).toEqual('<div>test text 1 </div>');
      flush();
    }));

    it('should propagate value only on blur, if sendChangeOn = blur', fakeAsync(() => {
      RTEComponent.sendChangeOn = RTEchangeEvent.blur;

      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 2', false)
      });
      tick(50);
      expect(testComponent.rtrValue).not.toEqual('<div>test text 2 </div>');
      flush();

      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 3', false)
      });
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      tick(50);
      expect(testComponent.rtrValue).toEqual('<div>test text 3 </div>');
      flush();
    }));
  });

  describe('Events', () => {
    it('should output changed event when text changes and sendChangeOn = change', () => {
      RTEComponent.sendChangeOn = RTEchangeEvent.change;
      spyOn(RTEComponent.changed, 'emit');
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 8', false)
      });
      expect(RTEComponent.changed.emit).toHaveBeenCalledWith(
        '<div>test text 8 </div>'
      );
    });

    it('should output changed event only on blur, if sendChangeOn = blur', () => {
      RTEComponent.sendChangeOn = RTEchangeEvent.blur;
      spyOn(RTEComponent.changed, 'emit');

      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 9', false)
      });

      expect(RTEComponent.changed.emit).not.toHaveBeenCalled();
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      expect(RTEComponent.changed.emit).toHaveBeenCalledWith(
        '<div>test text 9 </div>'
      );
    });

    it('should output focused event when editor is focused', () => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 10', false)
      });
      spyOn(RTEComponent.focused, 'emit');
      RTEqlEditorNativeElement.dispatchEvent(new Event('focus'));
      expect(RTEComponent.focused.emit).toHaveBeenCalledWith(
        '<div>test text 10 </div>'
      );
    });
    it('should output blurred event when editor is blurred', () => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 11', false)
      });
      spyOn(RTEComponent.blurred, 'emit');
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      expect(RTEComponent.blurred.emit).toHaveBeenCalledWith(
        '<div>test text 11 </div>'
      );
    });
  });

  describe('PlaceholderRteConverter', () => {
    it('Should convert HTML to RTE', () => {
      const placeholderList = [
        {
          groupName: 'Basic Info - header',
          options: [
            {
              id: '/work/title',
              selected: false,
              displayName: 'work | title'
            },
            {
              id: '/root/firstName',
              selected: false,
              displayName: 'First name'
            }
          ]
        }
      ];
      RTEComponent.placeholderList = placeholderList;
      RTEComponent.ngOnChanges({
        value: new SimpleChange(
          null,
          '<div>Hi, <strong>My</strong> name is {{/root/firstName}} my job title</div>',
          false
        ),
        controls: new SimpleChange(null, [BlotType.placeholder], null),
        disableControls: new SimpleChange(null, [], null)
      });

      fixture.detectChanges();

      expect(rteUtils.getHtmlContent(QuillEditor)).toContain(
        'name is <span data-placeholder-id="/root/firstName'
      );
    });
  });

  describe('Chars counter', () => {
    it('Should display char counter', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text', false)
      });
      fixture.detectChanges();

      const counterElement = fixture.debugElement.query(
        By.css('.length-indicator')
      ).nativeElement;

      expect(counterElement.textContent).toContain('10/30');
      expect(RTEnativeElement.classList).not.toContain('length-warning');
    });
    it('Should not display char counter if maxChars prop is undefined', () => {
      const counterElement = fixture.debugElement.query(
        By.css('.length-indicator')
      );
      expect(counterElement).toBeFalsy();
    });
    it('Should display a warning when approaching maxChars', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 12345', false)
      });
      fixture.detectChanges();
      expect(RTEnativeElement.classList).toContain('length-warning');
    });
    it('Should not allow to enter more than maxChars characters', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges({
        value: new SimpleChange(
          null,
          'this_text_is_longer_than_20_characters',
          false
        )
      });
      fixture.detectChanges();
      expect(RTEComponent.value).toEqual('');
    });
  });
});
