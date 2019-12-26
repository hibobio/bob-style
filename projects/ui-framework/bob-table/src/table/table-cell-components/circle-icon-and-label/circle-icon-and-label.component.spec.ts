import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleIconAndLabelComponent } from './circle-icon-and-label.component';
import { By } from '@angular/platform-browser';
import { CircleIconAndLabelParams } from './circle-icon-and-label.interface';
import { AvatarModule, Icons, IconsModule } from 'bob-style';

describe('CircleIconAndLabelComponent', () => {
  let component: CircleIconAndLabelComponent;
  let fixture: ComponentFixture<CircleIconAndLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CircleIconAndLabelComponent],
      imports: [AvatarModule, IconsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CircleIconAndLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('Should not display nothing', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: null },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    const circleIconElement = fixture.debugElement.query(
      By.css('.circle-icon-wrapper')
    );
    expect(circleIconElement).toBeNull();
  });

  it('Should display icon with no text', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: Icons.person_reports },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    fixture.detectChanges();
    const circleIconElement = fixture.debugElement.query(
      By.css('b-icon')
    );
    const labelElement = fixture.debugElement.query(
      By.css('.circle-icon-label')
    );
    expect(circleIconElement.componentInstance.icon).toBe(Icons.person_reports);
    expect(labelElement).toBeNull();
  });

  it('Should display icon with text', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: Icons.department_icon, label: 'label' },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    fixture.detectChanges();
    const circleIconElement = fixture.debugElement.query(
      By.css('b-icon')
    );
    const labelElement = fixture.debugElement.query(
      By.css('.circle-icon-label')
    );
    expect(circleIconElement.componentInstance.icon).toBe(Icons.department_icon);
    expect(labelElement.nativeElement.textContent).toBe('label');
  });
});
