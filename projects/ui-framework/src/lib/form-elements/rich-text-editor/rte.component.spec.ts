import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import {
  NO_ERRORS_SCHEMA,
  Component,
  SimpleChange,
  OnInit
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

@Component({
  template: `
    <form class="form" [formGroup]="rteForm">
      <b-rich-text-editor formControlName="rteControl"></b-rich-text-editor>
    </form>
  `,
  providers: []
})
class TestComponent implements OnInit {
  constructor() {}
  rteForm: any;

  ngOnInit(): void {
    this.rteForm = new FormGroup({
      rteControl: new FormControl('', { updateOn: 'change' })
    });
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
        MatFormFieldModule
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

        RTEComponent.ngOnChanges({
          controls: new SimpleChange(null, RTEComponent.controls, true),
          disableControls: new SimpleChange(
            null,
            RTEComponent.disableControls,
            true
          )
        });

        setTimeout(() => {
          QuillEditor = RTEComponent.editor;
          RTEqlEditorNativeElement = QuillEditor.root;
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

    it('should insert label placeholder text', () => {
      RTEComponent.ngOnChanges({
        label: new SimpleChange(null, 'test label', false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'test label'
      );
    });

    it('should add * to placeholder text, when required is true', () => {
      RTEComponent.ngOnChanges({
        label: new SimpleChange(null, 'test label', false),
        required: new SimpleChange(null, true, false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
        'test label *'
      );
    });

    it('should insert hintMessage text', () => {
      RTEComponent.hintMessage = 'test hint';
      fixture.detectChanges();

      const hintNativeElement = fixture.debugElement.query(
        By.css('.hint-message')
      ).nativeElement;
      expect(hintNativeElement.innerText).toEqual('test hint');
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
      RTEeditorNativeElement.style.setProperty('--negative-500', 'red');

      const errorNativeElement = fixture.debugElement.query(
        By.css('.error-message')
      ).nativeElement;

      expect(RTEnativeElement.classList).toContain('error');
      expect(errorNativeElement.innerText).toEqual('test error');
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

      const toolbarElement = fixture.debugElement.query(
        By.css('.quill-toolbar')
      ).nativeElement;

      expect(toolbarElement.children.length).toEqual(3);
      expect(toolbarElement.children[0].className).toContain('ql-bold');
      expect(toolbarElement.children[1].className).toContain('ql-italic');
      expect(toolbarElement.children[2].nodeName).toEqual('SPAN');
    });
  });

  describe('Value input', () => {
    it('should set the editor text to value input', () => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text', false)
      });
      fixture.detectChanges();

      expect(RTEqlEditorNativeElement.textContent.trim()).toEqual('test text');
    });
  });

  describe('Events', () => {
    it('should propagate value when text changes and sendChangeOn = change', done => {
      const subscr = RTEComponent.changed.subscribe(val => {
        expect(val).toEqual('<div>test text </div>');
        subscr.unsubscribe();
        done();
      });
      RTEComponent.sendChangeOn = RTEchangeEvent.change;
      fixture.detectChanges();

      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text', false)
      });
    });

    it('should propagate value only on blur, if sendChangeOn = blur', done => {
      let testVar = 1;
      const subscr = RTEComponent.changed.subscribe(val => {
        expect(val).toEqual('<div>test text 2 </div>');
        expect(testVar).toEqual(2);
        subscr.unsubscribe();
        done();
      });
      RTEComponent.sendChangeOn = RTEchangeEvent.blur;
      fixture.detectChanges();

      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text 2', false)
      });

      testVar = 2;
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
    });

    it('should output focused event when editor is focused', () => {
      spyOn(RTEComponent.focused, 'emit');
      RTEqlEditorNativeElement.dispatchEvent(new Event('focus'));
      expect(RTEComponent.focused.emit).toHaveBeenCalled();
    });
    it('should output blurred event when editor is blurred', () => {
      spyOn(RTEComponent.blurred, 'emit');
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      expect(RTEComponent.blurred.emit).toHaveBeenCalled();
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

    it('should change font-size with Size Panel controls', done => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test', false)
      });
      const sizeButtonElement = fixture.debugElement.query(
        By.css('b-panel button.rte-size')
      ).nativeElement;
      sizeButtonElement.click();

      const subscr = RTEComponent.changed.subscribe(val => {
        expect(val).toContain('ql-size-huge');
        subscr.unsubscribe();
        done();
      });

      fixture.detectChanges();

      const hugeButtonElement = overlayContainerElement.querySelector(
        '.rte-button.rte-size-huge'
      ) as HTMLElement;
      QuillEditor.setSelection(0, 4);
      hugeButtonElement.click();
    });
  });

  describe('Link control', () => {
    it('should open Link Editor panel on toolbar Link button click', () => {
      const linkButtonElement = fixture.debugElement.query(
        By.css('b-panel button.ql-link')
      ).nativeElement;
      linkButtonElement.click();

      const linkPanelElement = overlayContainerElement.querySelector(
        '.b-panel.rte-link-editor'
      ) as HTMLElement;

      expect(linkPanelElement).toBeTruthy();
    });

    it('should insert link into Editor', done => {
      const linkButtonElement = fixture.debugElement.query(
        By.css('b-panel button.ql-link')
      ).nativeElement;
      linkButtonElement.click();

      const textInputElement = <HTMLInputElement>(
        overlayContainerElement.querySelector(
          'input.mat-input-element[type="text"]'
        )
      );
      const urlInputElement = <HTMLInputElement>(
        overlayContainerElement.querySelector(
          'input.mat-input-element[type="url"]'
        )
      );
      const addButtonElement = overlayContainerElement.querySelector(
        'b-rte-link-editor .mat-button.primary'
      ) as HTMLElement;

      textInputElement.value = 'test1';
      textInputElement.dispatchEvent(new Event('input'));
      urlInputElement.value = 'test2';
      urlInputElement.dispatchEvent(new Event('input'));

      const subscr = RTEComponent.blurred.subscribe(val => {
        expect(val).toContain('a href="http://test2"');
        subscr.unsubscribe();
        done();
      });

      addButtonElement.click();
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
    });
  });

  describe('FormControl setValue', () => {
    it('should let FormControl set value and then emit valueChanges', fakeAsync(() => {
      const rteControl = testComponent.rteForm.get('rteControl');
      let testVar = 'some value';

      const subscr = rteControl.valueChanges.subscribe(value => {
        testVar = value;
      });

      rteControl.setValue('test');

      tick();
      subscr.unsubscribe();
      expect(testVar).toEqual('test');
    }));

    it('should not emit valueChanges when setting value with emitEvent false', fakeAsync(() => {
      const rteControl = testComponent.rteForm.get('rteControl');
      let testVar = 'some value';

      const subscr = rteControl.valueChanges.subscribe(value => {
        testVar = value;
      });

      rteControl.setValue('test2', {
        emitEvent: false
      });

      tick();
      subscr.unsubscribe();
      expect(testVar).not.toEqual('test2');
    }));
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
});
