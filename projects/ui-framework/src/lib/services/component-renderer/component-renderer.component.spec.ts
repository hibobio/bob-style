import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentRendererComponent } from './component-renderer.component';

import { MockModule } from '../mock-component/mock.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { MockComponent } from '../mock-component/mock.component';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ComponentRendererComponent', () => {
  let fixture: ComponentFixture<ComponentRendererComponent>;
  let component: ComponentRendererComponent;
  let mockNativeElement: HTMLElement;
  let avatarComponent: AvatarComponent;
  let avatarNativeElement: HTMLElement;
  let textElement: HTMLElement;

  let testVar = 'hello';

  const renderData = {
    component: MockComponent,
    content: [
      {
        component: AvatarComponent,
        attributes: {
          imageSource: 'hello.jpg',
          size: 'mini',
          isClickable: true
        },
        handlers: {
          clicked: () => {
            testVar = 'bye';
          }
        }
      },
      'Hello'
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentRendererComponent],
      imports: [
        BrowserAnimationsModule,
        MockModule,
        AvatarModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarComponent, MockComponent]
        }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComponentRendererComponent);
        component = fixture.componentInstance;

        component.render = renderData;
        fixture.detectChanges();

        mockNativeElement = fixture.debugElement.query(By.css('b-mock'))
          .nativeElement;
        avatarComponent = fixture.debugElement.query(
          By.css('.slot-1 .b-avatar')
        ).componentInstance;
        avatarNativeElement = fixture.debugElement.query(
          By.css('.b-avatar.clickable')
        ).nativeElement;
        textElement = fixture.debugElement.query(By.css('.slot-2'))
          .nativeElement;
      });
  }));

  describe('Component injection', () => {
    it('should insert MockComponent', () => {
      expect(mockNativeElement).toBeTruthy();
    });

    it('should insert AvatarComponent inside MockComponent', () => {
      expect(avatarNativeElement).toBeTruthy();
    });
  });

  describe('Component attributes', () => {
    it('should pass attributes to MockComponent', () => {
      expect(avatarComponent.imageSource).toEqual('hello.jpg');
    });
  });

  describe('Component content', () => {
    it('should pass text to MockComponent as content', () => {
      expect(textElement.innerText).toEqual('Hello');
    });
  });

  describe('Event handlers', () => {
    it('should attach a click handler to AvatarComponent', () => {
      avatarNativeElement.click();
      expect(testVar).toEqual('bye');
    });
  });
});
