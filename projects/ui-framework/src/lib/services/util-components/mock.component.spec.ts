import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from './mock.component';
import { DOMhelpers } from '../html/dom-helpers.service';

@Component({
  template: `
    <b-mock>
      !!!
      <span slot1>hello</span>
      <span slot2>world</span>
    </b-mock>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
}

describe('MockComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let mockComponent: MockComponent;
  let mockComponentElement: HTMLElement;
  let mockSlot1: HTMLElement;
  let mockSlot2: HTMLElement;
  let mockSlot3: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MockComponent],
      imports: [BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        mockComponent = fixture.debugElement.query(By.css('b-mock'))
          .componentInstance;
      });
  }));

  describe('Component', () => {
    it('should insert content in 2 slots', () => {
      fixture.detectChanges();
      mockSlot1 = fixture.debugElement.query(By.css('[slot1]')).nativeElement;
      mockSlot2 = fixture.debugElement.query(By.css('[slot2]')).nativeElement;
      mockSlot3 = fixture.debugElement.query(By.css('[slot-3]'));
      expect(mockSlot1.innerHTML).toEqual('hello');
      expect(mockSlot2.innerHTML).toEqual('world');
      expect(mockSlot3).toBeFalsy();
    });

    it('should be able to attach styles to itself and slots', () => {
      mockComponent.hostcss = {
        backgroundColor: 'rgb(5, 10, 15)'
      };
      mockComponent.slot1css = {
        backgroundColor: 'rgb(15, 10, 5)'
      };

      fixture.detectChanges();
      mockComponentElement = fixture.debugElement.query(
        By.css('.mock-component')
      ).nativeElement;
      expect(getComputedStyle(mockComponentElement).backgroundColor).toEqual(
        'rgb(5, 10, 15)'
      );
      mockSlot1 = fixture.debugElement.query(By.css('.slot-1')).nativeElement;
      expect(getComputedStyle(mockSlot1).backgroundColor).toEqual(
        'rgb(15, 10, 5)'
      );
    });
  });
});
