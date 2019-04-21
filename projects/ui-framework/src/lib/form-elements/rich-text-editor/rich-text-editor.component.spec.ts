import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

import { RichTextEditorComponent } from './rich-text-editor.component';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RTEType } from './rich-text-editor.enum';

@Component({
  template: `
    <b-rich-text-editor [formControl]="rteControl"> </b-rich-text-editor>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
  rteControl = new FormControl();
}

xdescribe('RichTextEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let RTEComponent: RichTextEditorComponent;
  let RTEnativeElement: HTMLElement;
  let RTEeditorNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, RichTextEditorComponent],
      imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
      });
  }));

  describe('OnInit', () => {
    it('should create component', () => {
      expect(RTEComponent).toBeTruthy();
    });
  });

  describe('Inputs', () => {
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
      RTEComponent.label = 'test label';
      fixture.detectChanges();

      // const RTEqlEditorNativeElement = fixture.debugElement.query(
      //   By.css('.ql-editor')
      // ).nativeElement;

      // expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
      //   'test label'
      // );
    });
  });
});
