import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonsModule } from '../../buttons/buttons.module';
import { Icons } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmptyStateComponent],
        imports: [IconsModule, ButtonsModule],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EmptyStateComponent);
          component = fixture.componentInstance;
          component.config = {
            icon: Icons.feedback_icon,
            text: 'empty state text',
            buttonLabel: 'button text',
          };
        });
    })
  );

  it('should show empty state', () => {
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('b-icon'));
    const text = fixture.debugElement.query(By.css('.empty-state-text'));
    expect(iconElement.componentInstance.icon).toEqual(Icons.feedback_icon);
    expect(text.nativeElement.innerHTML).toEqual('empty state text');
  });

  it('should hide button if its empty', () => {
    component.config.buttonLabel = '';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('b-button'));
    expect(buttonElement).toBeNull();
  });
});
