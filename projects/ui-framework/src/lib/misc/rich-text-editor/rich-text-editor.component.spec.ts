import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { RteUtilsService } from './rte-utils/rte-utils.service';

describe('TableComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ButtonComponent),
        MockComponent(RteLinkEditorComponent),
        RichTextEditorComponent,
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
      providers: [
        RteUtilsService,
      ],
    })
      .compileComponents()
      .then(
        () => {
          fixture = TestBed.createComponent(RichTextEditorComponent);
          component = fixture.componentInstance;
        }
      );
  }));

  describe('OnInit', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });
});
