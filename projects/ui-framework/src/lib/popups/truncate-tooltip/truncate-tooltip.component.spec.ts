import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  resetFakeAsyncZone,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { fakeAsyncFlush } from '../../services/utils/test-helpers';
import {
  DOMhelpersProvideMock,
  MutationObservableServiceProvideMock,
  overwriteObservable,
} from '../../tests/services.stub.spec';
import { TruncateTooltipComponent } from './truncate-tooltip.component';
import { TruncateTooltipDirective } from './truncate-tooltip.directive';
import { TruncateTooltipType } from './truncate-tooltip.enum';

@Component({
  template: `
    <div style="width: 400px; height: 500px; font-size: 10px; line-height: 1;">
      <b-truncate-tooltip class="test1" [maxLines]="maxLines">
        <div>
          <p><!-- HTML Comment --></p>
          <div style="font-size: 20px; line-height: 1.5;">
            <p>
              TEST{{ testNum }} {{ text1 }}
              <span>{{ text2 }}</span>
            </p>
          </div>
        </div>
      </b-truncate-tooltip>
    </div>
  `,
  providers: [],
})
class TestComponent {
  constructor() {}
  @Input() maxLines: number;

  @ViewChild(TruncateTooltipComponent, { static: true })
  ttc: TruncateTooltipComponent;

  testNum = 1;
  testNum2 = 1;

  text1 = `
    TEXTSTART If you’re trying to wear official headgear in a public setting, my
    advice is to take yourself as seriously as you expect others to
    take you. A photographer may not allow you to wear the colander if
    you’ve just pulled it out while giggling. But if you walk in
    wearing it – if it is clear that this headgear is truly a serious
    part of your traditional Pastafarian beliefs, as you are claiming
    – then they are less likely to make trouble.
    `;
  text2 = 'And this text too! TEXTEND1';
  text3 = 'And this text too! TEXTEND2';
}

describe('TruncateTooltipComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let bttComp1: TruncateTooltipComponent;
  let bttComp1textContainer: HTMLElement;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          TruncateTooltipComponent,
          TruncateTooltipDirective,
        ],
        imports: [CommonModule, BrowserAnimationsModule, MatTooltipModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          DOMhelpersProvideMock(),
          MutationObservableServiceProvideMock(),
          EventManagerPlugins[0],
        ],
      })
        .overrideModule(BrowserDynamicTestingModule, {
          set: {
            entryComponents: [TruncateTooltipComponent],
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TestComponent);
          testComponent = fixture.componentInstance;

          fixture.detectChanges();

          bttComp1 = fixture.debugElement.query(By.css('.test1'))
            .componentInstance;

          bttComp1.type = TruncateTooltipType.material;
          bttComp1.expectChanges = true;
          bttComp1.trustCssVars = false;
          bttComp1.delay = bttComp1.lazyness = 0;

          bttComp1['checker$'] = overwriteObservable(() => {
            bttComp1['checkTooltipNecessity']();
            bttComp1['cd']['detectChanges']();
          });
        });
    })
  );

  beforeEach(() => {
    bttComp1textContainer = fixture.debugElement.query(By.css('.test1 .btt'))
      .nativeElement;

    fixture.detectChanges();
  });

  describe('Text truncation (1 line)', () => {
    it('should display a single truncated line of text', fakeAsync(() => {
      const textContainerStyle = getComputedStyle(bttComp1textContainer);
      tick();
      fixture.detectChanges();
      expect(
        parseInt(textContainerStyle.height, 10) <= 20 * 1.5 * 1
      ).toBeTruthy();
      fakeAsyncFlush();
    }));
    it('should display tooltip with full text', () => {
      const tooltipElem = document.querySelector(
        '#cdk-describedby-message-container'
      ) as HTMLElement;
      expect(tooltipElem.innerText).toContain('TEST1');
      expect(tooltipElem.innerText).toContain('TEXTSTART');
      expect(tooltipElem.innerText).toContain('TEXTEND1');
    });
  });

  describe('Dynamic MaxLines & Text change; Text line-clamp (3 lines)', () => {
    it('should chnage from 1 line to 3 lines of text', () => {
      testComponent.maxLines = 3;
      fixture.detectChanges();
      const textContainerStyle = getComputedStyle(bttComp1textContainer);
      expect(
        parseInt(textContainerStyle.height, 10) <= 20 * 1.5 * 3
      ).toBeTruthy();
    });

    xit('should display tooltip with updated (changed) full text', fakeAsync(() => {
      testComponent.maxLines = 3;
      testComponent.testNum = 2;
      tick();
      fixture.detectChanges();
      const tooltipElem = document.querySelector(
        '#cdk-describedby-message-container'
      ) as HTMLElement;
      tick();
      expect(tooltipElem.innerText).toContain('TEST2');
      expect(tooltipElem.innerText).toContain('TEXTEND1');
      fakeAsyncFlush();
    }));
  });
});
