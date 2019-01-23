import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectComponent } from './multi-select.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiSelectComponent,
      ],
      imports: [
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        spyOn(component.selectChange, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onSelectChange', () => {
    it('should call selectChange.emit with array of value', () => {
      component.onSelectChange([1, 2, 11]);
      expect(component.selectChange.emit).toHaveBeenCalledWith([1, 2, 11]);
    });
  });
});
