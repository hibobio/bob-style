import { MockComponent } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconComponent } from '../../icons/icon.component';
import { Icons } from '../../icons/icons.enum';
import { LinkColor, LinkTarget } from '../../indicators/link/link.enum';
import { LinkModule } from '../../indicators/link/link.module';
import { TypographyModule } from '../../typography/typography.module';
import { PanelModule } from '../panel/panel.module';
import { InfoTooltipComponent } from './info-tooltip.component';

describe('InfoTooltipComponent', () => {
  let component: InfoTooltipComponent;
  let fixture: ComponentFixture<InfoTooltipComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InfoTooltipComponent, MockComponent(IconComponent)],
        imports: [PanelModule, TypographyModule, LinkModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTooltipComponent);
    component = fixture.componentInstance;
    component.text = 'tooltip text';
    component.title = 'tooltip title';
    component.icon = Icons.baseline_info_icon;
    component.link = {
      text: 'click here',
      url: 'https://app.hibob.com',
      target: LinkTarget.blank,
      color: LinkColor.primary,
    };
    fixture.detectChanges();
  });

  it('b-panel should open on hover', () => {
    const bPanelElement = fixture.debugElement.query(By.css('b-panel'));
    expect(bPanelElement.componentInstance.openOnHover).toBeTruthy();
  });

  it('icon that trigger the panel should be baseline_info_icon', () => {
    const bIcon = fixture.debugElement.query(By.css('b-icon'));
    expect(bIcon.componentInstance.setProps.icon).toEqual(
      Icons.baseline_info_icon
    );
  });

  it('when link is empty do not show link on panel', () => {
    component.link = null;
    const bLink = fixture.debugElement.query(By.css('b-link'));
    expect(bLink).toBeNull();
  });
});
