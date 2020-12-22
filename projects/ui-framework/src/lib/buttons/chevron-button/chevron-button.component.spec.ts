import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChevronButtonComponent } from './chevron-button.component';
import { By } from '@angular/platform-browser';
import { simpleChange } from '../../services/utils/functional-utils';

describe('ChevronButtonComponent', () => {
  let component: ChevronButtonComponent;
  let fixture: ComponentFixture<ChevronButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChevronButtonComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChevronButtonComponent);
        component = fixture.componentInstance;
        component.clicked.subscribe(() => {});
        spyOn(component.clicked, 'emit');
        component.text = 'Click';
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    component.clicked.complete();
  });

  describe('Inputs', () => {
    let buttonElement: HTMLElement;
    beforeEach(() => {
      buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement;
    });

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
      const e = {
        id: 1,
        stopPropagation: () => true,
      } as any;
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });
  });
});
