import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextButtonComponent } from './text-button.component';
import { IconComponent } from '../../icons/icon.component';
import { MockComponent } from 'ng-mocks';
import { TypographyModule } from '../../typography/typography.module';
import { By } from '@angular/platform-browser';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';

describe('TextButtonComponent', () => {
  let component: TextButtonComponent;
  let fixture: ComponentFixture<TextButtonComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(IconComponent), TextButtonComponent],
      imports: [TypographyModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TextButtonComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
        component.clicked.subscribe(() => {});
        spyOn(component.clicked, 'emit');
      });
  }));

  afterEach(() => {
    component.clicked.complete();
  });

  it('should display input text', () => {
    component.text = 'Button text';
    fixture.detectChanges();
    expect(element.innerText).toEqual('Button text');
  });

  it('should not display icon if no input is passed', () => {
    fixture.detectChanges();
    expect(element.children.length).toEqual(0);
  });

  it('should display icon if is input', () => {
    component.icon = Icons.home;
    fixture.detectChanges();
    expect(element.children.length).toEqual(1);
    expect(element.children[0].className).toContain(Icons.home);
    expect(element.children[0].className).toContain('b-icon-' + IconColor.dark);
    expect(element.children[0].className).toContain('b-icon-' + IconSize.medium);
  });

  it('should set color to orange for component and icon', () => {
    component.icon = Icons.home;
    component.color = LinkColor.primary;
    fixture.detectChanges();
    expect(element.classList).toContain('color-primary');
    expect(element.children[0].className).toContain('b-icon-' + IconColor.primary);
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
