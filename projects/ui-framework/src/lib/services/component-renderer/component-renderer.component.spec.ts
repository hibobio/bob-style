import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentRendererComponent } from './component-renderer.component';
import { MockComponentModule } from '../util-components/mock-component.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { MockComponent } from '../util-components/mock.component';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { emptyImg, emptyImgTestString } from '../utils/test-helpers';

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
          imageSource: emptyImg,
          size: AvatarSize.mini,
          isClickable: true,
        },
        handlers: {
          clicked: () => {
            testVar = 'bye';
          },
        },
      },
      'Hello',
    ],
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentRendererComponent],
      imports: [BrowserAnimationsModule, MockComponentModule, AvatarModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarComponent, MockComponent],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComponentRendererComponent);
        component = fixture.componentInstance;

        component.render = renderData;
        component.ngOnChanges({
          render: new SimpleChange(null, renderData, true),
        });
        fixture.detectChanges();

        mockNativeElement = fixture.debugElement.query(By.css('b-mock'))
          .nativeElement;
        avatarComponent = fixture.debugElement.query(By.css('.slot-1 b-avatar'))
          .componentInstance;
        avatarNativeElement = fixture.debugElement.query(
          By.css('b-avatar .avatar')
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
      expect(avatarComponent.imageSource).toContain(emptyImgTestString);
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
