import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextButtonComponent } from './text-button.component';
import { IconComponent } from '../../../icons/icon.component';
import { MockComponent } from 'ng-mocks';
import { TypographyModule } from '../../../typography/typography.module';
import { By } from '@angular/platform-browser';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { LinkColor } from '../../link/link.enum';

describe('TextButtonComponent', () => {
  let component: TextButtonComponent;
  let fixture: ComponentFixture<TextButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(IconComponent),
        TextButtonComponent,
      ],
      imports: [
        TypographyModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TextButtonComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
      });
  }));

  it('should display input text', () => {
    component.text = 'Button text';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('b-bold-body'));
    expect(text.nativeElement.innerText).toEqual('Button text');
  });

  it('should not display icon if no input is passed', () => {
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('b-icon'));
    expect(icon).toBeNull();
  });

  it('should display icon if is input', () => {
    component.icon = Icons.home;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('b-icon'));
    expect(icon.componentInstance.icon).toEqual(Icons.home);
    expect(icon.componentInstance.color).toEqual(IconColor.dark);
    expect(icon.componentInstance.size).toEqual(IconSize.medium);
  });

  it('should set color to orange for component and icon', () => {
    component.icon = Icons.home;
    component.color = LinkColor.primary;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('color-primary');
    const icon = fixture.debugElement.query(By.css('b-icon'));
    expect(icon.componentInstance.color).toEqual(IconColor.primary);
  });

  it('should emit clicked when clicking the component', () => {
    fixture.detectChanges();
    const host = fixture.debugElement;
    host.triggerEventHandler('click', null);
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should add disabled class', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('disabled');
  });
});
