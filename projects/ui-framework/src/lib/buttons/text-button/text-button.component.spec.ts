import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextButtonComponent } from './text-button.component';
import { IconComponent } from '../../icons/icon.component';
import { MockComponent } from 'ng-mocks';
import { TypographyModule } from '../../typography/typography.module';
import { By } from '@angular/platform-browser';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { simpleChange } from '../../services/utils/test-helpers';

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
    expect(component.buttonClass).not.toContain('b-icon');
    expect(element.children[0].className).not.toContain('b-icon');
  });

  it('should display icon if is input', () => {
    component.ngOnChanges(
      simpleChange({
        icon: Icons.home,
      })
    );

    const expectedClass =
      Icons.home + ' b-icon-' + IconSize.medium + ' b-icon-' + IconColor.dark;

    expect(component.buttonClass).toContain(expectedClass);
    expect(element.children[0].className).toContain(expectedClass);
  });

  it('should set color to orange for component and icon', () => {
    component.ngOnChanges(
      simpleChange({
        icon: Icons.home,
        color: LinkColor.primary,
      })
    );

    expect(component.buttonClass).toContain('color-primary');
    expect(component.buttonClass).toContain('b-icon-' + IconColor.primary);
    expect(element.children[0].className).toContain('color-primary');
    expect(element.children[0].className).toContain(
      'b-icon-' + IconColor.primary
    );
  });

  it('should emit clicked when clicking the component', () => {
    fixture.detectChanges();
    const host = fixture.debugElement;
    host.triggerEventHandler('click', null);
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should add disabled class', () => {
    component.ngOnChanges(
      simpleChange({
        disabled: true,
      })
    );

    expect(component.buttonClass).toContain('disabled');
    expect(element.children[0].className).toContain('disabled');
  });
});
