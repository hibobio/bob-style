import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SingleSelectComponent } from './single-select.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let fixture: ComponentFixture<SingleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SingleSelectComponent,
      ],
      imports: [
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        spyOn(component.selectChange, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onSelectChange', () => {
    it('should call selectChange.emit with of selectedId', () => {
      component.onSelectChange([1]);
      expect(component.selectChange.emit).toHaveBeenCalledWith(1);
    });
  });
});
