import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditableListComponent } from './editable-list.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import {
  ButtonsModule,
  EventManagerPlugins,
  inputValue,
  MenuModule, randomNumber,
  SelectOption,
  simpleChange,
  simpleUID,
} from 'bob-style';
import { EditableListService } from './editable-list.service';
import { editableListMock } from './editable-list.mock';
import { getTestScheduler } from 'jasmine-marbles';

  describe('EditableListComponent', () => {
  let fixture: ComponentFixture<EditableListComponent>;
  let component: EditableListComponent;
  let selectOptionsMock: SelectOption[];

  beforeEach(async(() => {
    selectOptionsMock = [
      {
        id: 1,
        value: 'Martial arts',
        selected: false,
      },
      {
        id: 2,
        value: 'Climbing',
        selected: false,
      },
      {
        id: 3,
        value: 'Football',
        selected: true,
      },
    ];

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
            // list: editableListMock,
            list: selectOptionsMock,
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
        expect(input.attributes.maxLength).toEqual('10');
      });
      it('should get an error if the item on the list already', () => {
        const input = fixture.debugElement.query(By.css('.bel-item-input'));
        inputValue(input.nativeElement, component.list[0].value.toUpperCase());
        fixture.detectChanges();
        const done = fixture.debugElement.query(By.css('.bel-done-button'));
        done.componentInstance.clicked.emit(null);
        done.nativeElement.click();
        fixture.detectChanges();
        const error = fixture.debugElement.query(By.css('.b-input-message.error'));
        expect(error.nativeElement.innerText).toContain(`"${editableListMock[0].value}" already exists`);
      });
      it('check if has 10 items on the list', () => {
        const list = fixture.debugElement.queryAll(By.css('.bel-item.b-icon-drag-alt'));
        expect(list.length).toEqual(10);
      });
      it('check if an item list is deleted from the list', fakeAsync(() => {
        const del = fixture.debugElement.query(By.css('.bel-trash-button button'));
        del.nativeElement.click();
        fixture.detectChanges();
        const remove = fixture.debugElement.query(By.css('.bel-remove-button button'));
        remove.nativeElement.click();
        tick(300);
        fixture.detectChanges();
        const list3 = fixture.debugElement.queryAll(By.css('.bel-item.b-icon-drag-alt'));
        expect(list3.length).toEqual(9);
      }));
      it('check if an item list is added to the list', () => {
        const input = fixture.debugElement.query(By.css('.bel-item-input'));
        inputValue(input.nativeElement, 'aa');
        fixture.detectChanges();
        const done = fixture.debugElement.query(By.css('.bel-done-button button'));
        done.nativeElement.click();
        fixture.detectChanges();
        const list3 = fixture.debugElement.queryAll(By.css('.bel-item'));
        expect(list3.length).toEqual(12);
      });
      it('check if an item is deleted from the onListUpdate', fakeAsync(() => {
        spyOn(component.changed, 'emit');
        const del = fixture.debugElement.queryAll(By.css('.bel-trash-button button'));
        del[2].nativeElement.click();
        fixture.detectChanges();
        const remove = fixture.debugElement.queryAll(By.css('.bel-remove-button button'));
        remove[2].nativeElement.click();
        tick(300);
        fixture.detectChanges();
        const expectedParam = {
          'delete': [
            'Football'
          ],
          'create': [],
          'order': [
            'Martial arts',
            'Climbing'
          ],
          'sortType': 'UserDefined',
          'list': [
            {
              'id': 1,
              'value': 'Martial arts',
              'selected': false
            },
            {
              'id': 2,
              'value': 'Climbing',
              'selected': false
            }
          ]
        };
        expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
      }));
      it('check if an item is added to the onListUpdate', (done) => {
          const input = fixture.debugElement.query(By.css('.bel-item-input'));
          const doneButton = fixture.debugElement.query(By.css('.bel-done-button button'));
          component.changed.subscribe((data) => {
          expect(data.create[0]).toEqual('abc');
          expect(data.order[0]).toEqual('abc');
          done();
        });
          inputValue(input.nativeElement, 'abc');
          fixture.detectChanges();
          doneButton.nativeElement.click();
          fixture.detectChanges();
      });
      it('check the ASC button ', () => {
        spyOn(component.changed, 'emit');
        const sort = fixture.debugElement.query(By.css('.bel-sort-button button'));
        sort.nativeElement.click();
        fixture.detectChanges();
        const expectedParam = {
          'delete': [],
          'create': [],
          'order': [
            'Climbing',
            'Football',
            'Martial arts',
          ],
          'sortType': 'Asc',
          'list': [
            {
              'id': 2,
              'value': 'Climbing',
              'selected': false
            },
            {
              'id': 3,
              'value': 'Football',
              'selected': true
            },
            {
              'id': 1,
              'value': 'Martial arts',
              'selected': false
            },
          ]
        };
        expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
      });
      it('check the DSC button ', () => {
        spyOn(component.changed, 'emit');
        const sort = fixture.debugElement.query(By.css('.bel-sort-button button'));
        sort.nativeElement.click();
        sort.nativeElement.click();
        fixture.detectChanges();
        const expectedParam = {
          'delete': [],
          'create': [],
          'order': [
            'Martial arts',
            'Football',
            'Climbing',
          ],
          'sortType': 'Desc',
          'list': [
            {
              'id': 1,
              'value': 'Martial arts',
              'selected': false
            },
            {
              'id': 3,
              'value': 'Football',
              'selected': true
            },
            {
              'id': 2,
              'value': 'Climbing',
              'selected': false
            },
          ]
        };
        expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
      });
  });
});



