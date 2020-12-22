import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CircleIconAndLabelComponent} from './circle-icon-and-label.component';
import {By} from '@angular/platform-browser';
import {CircleIconAndLabelParams} from './circle-icon-and-label.interface';
import {AvatarModule, ButtonType, Icons, IconsModule} from 'bob-style';
import {MockComponent} from 'ng-mocks';
import {TableActionsWrapperComponent} from '../table-actions-wrapper/table-actions-wrapper.component';

describe('CircleIconAndLabelComponent', () => {
  let component: CircleIconAndLabelComponent;
  let fixture: ComponentFixture<CircleIconAndLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CircleIconAndLabelComponent,
        MockComponent(TableActionsWrapperComponent),
      ],
      imports: [AvatarModule, IconsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CircleIconAndLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('Should display text without icon', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: null, label: 'label' },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    const circleIconElement = fixture.debugElement.query(
      By.css('b-avatar-image')
    );
    const labelElement = fixture.debugElement.query(
      By.css('.circle-icon-label')
    );
    expect(circleIconElement).toBeNull();
    expect(labelElement).not.toBeNull();
  });

  it('Should display icon with no text', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: Icons.person_reports },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    fixture.detectChanges();

    const circleIconElement = fixture.debugElement.query(
      By.css('b-avatar-image')
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
      By.css('b-avatar-image')
    );
    const labelElement = fixture.debugElement.query(
      By.css('.circle-icon-label')
    );
    expect(circleIconElement.componentInstance.icon).toBe(
      Icons.department_icon
    );
    expect(labelElement.nativeElement.textContent).toBe('label');
  });

  it('Should wrap component with table actions wrapper', () => {
    const circleIconAndLabelParams: CircleIconAndLabelParams = {
      value: { icon: Icons.department_icon, label: 'label', menuItems: [], buttonType: ButtonType.primary, },
    } as CircleIconAndLabelParams;
    component.agInit(circleIconAndLabelParams);
    fixture.detectChanges();
    const actionsWrapper = fixture.debugElement.query(By.css('b-table-actions-wrapper'));
    expect(actionsWrapper.componentInstance.menuItems).toEqual([]);
    expect(actionsWrapper.componentInstance.buttonType).toEqual(ButtonType.primary);
  });
});
