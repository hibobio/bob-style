import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditableListComponent } from './editable-list.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { ButtonsModule, EventManagerPlugins, inputValue, MenuModule, simpleChange } from 'bob-style';
import { EditableListService } from './editable-list.service';
import { editableListMock } from './editable-list.mock';
import { getTestScheduler } from 'jasmine-marbles';

  describe('EditableListComponent', () => {
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
      expect(input.attributes.maxLength).toEqual('10');
    });
    it('should get an error if the item on the list already', () => {
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      inputValue(input.nativeElement, component.list[0].value.toUpperCase())
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
      console.log(list.length);
      expect(list.length).toEqual(10);
 });
    it('check if an item list is deleted from the list', fakeAsync(() => {
      const del = fixture.debugElement.query(By.css('.bel-trash-button button'));
      del.nativeElement.click();
      fixture.detectChanges();
      const remove = fixture.debugElement.query(By.css('.bel-remove-button button'))
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
});
});
