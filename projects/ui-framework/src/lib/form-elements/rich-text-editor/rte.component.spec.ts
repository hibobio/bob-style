import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Component, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

import { RichTextEditorComponent } from './rte.component';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RTEType, RTEControls } from './rte.enum';
import Quill from 'quill';
import { PanelModule } from '../../overlay/panel/panel.module';
import { SingleSelectModule } from '../lists/single-select/single-select.module';
import { InputModule } from '../input/input.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

@Component({
  template: `
    <div class="form">
      <b-rich-text-editor [formControl]="rteControl"> </b-rich-text-editor>
    </div>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
  rteControl = new FormControl();
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
      providers: [RteUtilsService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        fixture.detectChanges();

        RTEComponent = fixture.debugElement.query(By.css('b-rich-text-editor'))
          .componentInstance;

        RTEnativeElement = fixture.debugElement.query(
          By.css('b-rich-text-editor')
        ).nativeElement;

        RTEeditorNativeElement = fixture.debugElement.query(
          By.css('.quill-editor')
        ).nativeElement;

        setTimeout(() => {
          QuillEditor = RTEComponent.editor;
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

  describe('OnInit', () => {
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

      const RTEqlEditorNativeElement = QuillEditor.root;

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

      const RTEqlEditorNativeElement = QuillEditor.root;
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
      RTEComponent.controls = [RTEControls.bold, RTEControls.italic];
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

      const RTEqlEditorNativeElement = QuillEditor.root;
      expect(RTEqlEditorNativeElement.textContent).toEqual('test text');
    });
  });

  describe('Events', () => {
    it('should output RteCurrentContent object when text changes', done => {
      RTEComponent.changed.subscribe(val => {
        expect(val.body).toEqual('<div>test text</div>');
        expect(val.plainText).toEqual('test text');
        done();
      });
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test text', false)
      });
    });
    it('should output focused event when editor is focused', () => {
      spyOn(RTEComponent.focused, 'emit');
      const RTEqlEditorNativeElement = QuillEditor.root;
      RTEqlEditorNativeElement.dispatchEvent(new Event('focus'));
      expect(RTEComponent.focused.emit).toHaveBeenCalled();
    });
    it('should output blurred event when editor is blurred', () => {
      spyOn(RTEComponent.blurred, 'emit');
      const RTEqlEditorNativeElement = QuillEditor.root;
      RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      expect(RTEComponent.blurred.emit).toHaveBeenCalled();
    });
  });

  describe('Size control', () => {
    it('should open size select panel on toolbar button click', () => {
      const sizeButtonElement = fixture.debugElement.query(
        By.css('b-panel button.rte-size')
      ).nativeElement;
      sizeButtonElement.click();

      fixture.detectChanges();

      const sizePanelElement = overlayContainerElement.querySelector(
        '.b-panel.rte-size-controls'
      ) as HTMLElement;

      expect(sizePanelElement).toBeTruthy();
    });

    it('should change font-size with Size panel controls', done => {
      RTEComponent.ngOnChanges({
        value: new SimpleChange(null, 'test', false)
      });
      const sizeButtonElement = fixture.debugElement.query(
        By.css('b-panel button.rte-size')
      ).nativeElement;
      sizeButtonElement.click();

      RTEComponent.changed.subscribe(val => {
        expect(val.body).toContain('ql-size-huge');
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
});
