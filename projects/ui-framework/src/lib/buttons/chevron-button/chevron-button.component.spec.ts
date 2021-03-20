import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { simpleChange } from '../../services/utils/functional-utils';
import { ChevronButtonComponent } from './chevron-button.component';

describe('ChevronButtonComponent', () => {
  let component: ChevronButtonComponent;
  let fixture: ComponentFixture<ChevronButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChevronButtonComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ChevronButtonComponent);
          component = fixture.componentInstance;
          spyOn(component.clicked, 'emit');
          component.text = 'Click';
          fixture.detectChanges();
          buttonElement = component.button.nativeElement;
        });
    })
  );

  describe('Inputs', () => {
    it('should display text in the button', () => {
      expect(buttonElement.innerText).toEqual('Click');
    });

    it('should display chevron-down icon by default', () => {
      expect(buttonElement.dataset.iconAfter).toEqual('chevron-down');
    });

    it('should display chevron-up icon when active is true', () => {
      component.ngOnChanges(
        simpleChange({
          active: true,
        })
      );

      expect(buttonElement.dataset.iconAfter).toEqual('chevron-up');
    });
  });

  describe('onClick', () => {
    it('should emit clicked', () => {
      buttonElement.click();
      expect(component.clicked.emit).toHaveBeenCalledTimes(1);
    });
  });
});
