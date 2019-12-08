import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableListComponent } from './editable-list.component';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { Icons } from '../../icons/icons.enum';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import {
  ButtonsModule, CollapsibleSectionComponent,
  componentFromFixture,
  elementFromFixture,
  EventManagerPlugins,
  inputValue,
  MenuModule, simpleChange,
} from 'bob-style';
import { EditableListService } from './editable-list.service';
import { editableListMock } from './editable-list.mock';

fdescribe('EditableListComponent', () => {
  let fixture: ComponentFixture<EditableListComponent>;
  let component: EditableListComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditableListComponent],
      imports: [CommonModule,
        IconsModule,
        NgxSmoothDnDModule,
        MenuModule,
        ButtonsModule,
      ],
      providers: [EditableListService, EventManagerPlugins[0]],

    })
      .overrideComponent(EditableListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EditableListComponent);
        component = fixture.componentInstance;
        component.ngOnChanges(
          simpleChange({
            list: editableListMock,
          }),
        );
        //
        fixture.detectChanges();
        component.inputChanged.subscribe(() => {
        });
      });
  }));

  describe(' maxChars', () => {
    it('should accept 10 chars if max chars is 10', () => {
      component.maxChars = 10;
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
    });
  });
});

