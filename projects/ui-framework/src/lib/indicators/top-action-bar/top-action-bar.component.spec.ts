import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconComponent, SingleSelectPanelComponent } from 'bob-style';
import { MockComponent } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TopActionBarComponent } from './top-action-bar.component';

describe('TopActionBarComponent', () => {
  let component: TopActionBarComponent;
  let fixture: ComponentFixture<TopActionBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TopActionBarComponent,
        MockComponent(SingleSelectPanelComponent),
        MockComponent(IconComponent),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopActionBarComponent);
    component = fixture.componentInstance;
  });

  it('apply action', () => {
    fixture.detectChanges();
    const actionSpy = spyOn(component.action, 'emit');
    component.applyAction(new MouseEvent('click'));
    expect(actionSpy).toHaveBeenCalled();
  });

  it('should display select panel if has options', () => {
    component.options = [{
      groupName: '',
      options: [
        {id: '1', value: 'item1'},
        {id: '2', value: 'item2'},
        {id: '3', value: 'item3'},
        {id: '4', value: 'item4'},
      ]
    }];
    fixture.detectChanges();

    const action = fixture.debugElement.query(By.css('.action')).componentInstance;
    expect(action instanceof SingleSelectPanelComponent).toBeTruthy();
  })

  it('should not display select panel if doesn\'t have options', () => {
    component.actionText = 'action';
    fixture.detectChanges();

    const action = fixture.debugElement.query(By.css('.action')).componentInstance;
    expect(action instanceof SingleSelectPanelComponent).toBeFalsy();
  })
});
