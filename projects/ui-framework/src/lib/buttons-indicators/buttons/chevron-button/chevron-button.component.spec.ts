import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChevronButtonComponent } from './chevron-button.component';
import { By } from '@angular/platform-browser';

describe('ChevronButtonComponent', () => {
  let component: ChevronButtonComponent;
  let fixture: ComponentFixture<ChevronButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChevronButtonComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChevronButtonComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
        component.text = 'Click';
        fixture.detectChanges();
      });
  }));

  describe('Inputs', () => {
    it('should display text in the button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.innerText).toEqual('Click');
    });
    it('should display chevron-down icon by default', () => {
      const button = fixture.debugElement.query(By.css('button'));

      expect(button.nativeElement.classList).not.toContain('b-icon-chevron-up');
      expect(button.nativeElement.classList).toContain('b-icon-chevron-down');
    });
    it('should display chevron-up icon when active is true', () => {
      component.active = true;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('button'));

      expect(button.nativeElement.classList).not.toContain('b-icon-chevron-down');
      expect(button.nativeElement.classList).toContain('b-icon-chevron-up');
    });
  });

  describe('onClick', () => {
    it('should emit clicked', () => {
      const e = {
        id: 1,
        stopPropagation: () => true
      };
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });
  });
});
