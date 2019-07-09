import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TruncateTooltipComponent } from './truncate-tooltip.component';

import { DOMhelpers } from '../utils/dom-helpers.service';
import { UtilsService } from '../utils/utils.service';
import { UtilsModule } from '../utils/utils.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipModule } from './truncate-tooltip.module';
import { TruncateTooltiptype } from './truncate-tooltip.enum';

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
      <div
        class="test2"
        *bTruncateTooltip="maxLines"
        style="font-size: 20px; line-height: 1.5;"
      >
        TEST{{ testNum2 }} {{ text1 }}
        <span>{{ text3 }}</span>
      </div>
    </div>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
  @Input() maxLines: number;

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
  let bttComp2: TruncateTooltipComponent;
  let bttComp1textContainer: HTMLElement;
  let bttComp2textContainer: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        UtilsModule,
        MatTooltipModule,
        TruncateTooltipModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DOMhelpers, UtilsService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        fixture.detectChanges();

        bttComp1 = fixture.debugElement.query(By.css('.test1'))
          .componentInstance;

        bttComp2 = fixture.debugElement.query(
          By.css('b-truncate-tooltip:not(.test1)')
        ).componentInstance;

        bttComp1.type = TruncateTooltiptype.material;
        bttComp1.expectChanges = true;
        bttComp1.trustCssVars = false;
        bttComp1.delay = 0;
        bttComp1.lazyness = 0;
        bttComp2.type = TruncateTooltiptype.material;
        bttComp2.expectChanges = true;
        bttComp2.trustCssVars = false;
        bttComp2.delay = 0;
        bttComp2.lazyness = 0;

        setTimeout(() => {
          bttComp1textContainer = fixture.debugElement.query(
            By.css('.test1 .btt')
          ).nativeElement;
          bttComp2textContainer = fixture.debugElement.query(
            By.css('b-truncate-tooltip:not(.test1) .btt')
          ).nativeElement;
          fixture.detectChanges();
        }, 0);
      });
  }));

  describe('Text truncation (1 line)', () => {
    it('should display a single truncated line of text', () => {
      const textContainerStyle = getComputedStyle(bttComp1textContainer);
      expect(
        parseInt(textContainerStyle.height, 10) <= 20 * 1.5 * 1
      ).toBeTruthy();
    });
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

    it('should display tooltip with updated (changed) full text', () => {
      testComponent.maxLines = 3;
      testComponent.testNum = 2;
      fixture.autoDetectChanges();
      const tooltipElem = document.querySelector(
        '#cdk-describedby-message-container'
      ) as HTMLElement;
      expect(tooltipElem.innerText).toContain('TEST2');
      expect(tooltipElem.innerText).toContain('TEXTEND1');
    });
  });

  describe('Structural directive', () => {
    it('should wrap element in b-truncate-tooltip component and display a single truncated line of text', () => {
      const textContainerStyle = getComputedStyle(bttComp2textContainer);
      const testElement = bttComp2textContainer.querySelector('.test2');
      expect(testElement).toBeTruthy();
      expect(
        parseInt(textContainerStyle.height, 10) <= 20 * 1.5 * 1
      ).toBeTruthy();
    });

    it('should also update on maxLines or text changes', () => {
      testComponent.maxLines = 3;
      testComponent.testNum2 = 4;
      fixture.autoDetectChanges();

      const textContainerStyle = getComputedStyle(bttComp2textContainer);
      const tooltipElem = document.querySelector(
        '#cdk-describedby-message-container'
      ) as HTMLElement;
      expect(
        parseInt(textContainerStyle.height, 10) <= 20 * 1.5 * 3
      ).toBeTruthy();
      expect(tooltipElem.innerText).toContain('TEST4');
      expect(tooltipElem.innerText).toContain('TEXTEND2');
    });
  });
});
