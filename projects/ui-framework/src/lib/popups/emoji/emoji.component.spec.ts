import { find } from 'lodash';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  resetFakeAsyncZone,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TypographyModule } from '../../typography/typography.module';
import { PanelModule } from '../panel/panel.module';
import { TruncateTooltipModule } from '../truncate-tooltip/truncate-tooltip.module';
import { EMOJI_DATA } from './emoji-data.consts';
import { EmojiComponent } from './emoji.component';

describe('EmojiComponent', () => {
  let component: EmojiComponent;
  let fixture: ComponentFixture<EmojiComponent>;
  let emojiSelect;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TypographyModule, TruncateTooltipModule, PanelModule],
        declarations: [EmojiComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EmojiComponent);
          component = fixture.componentInstance;
          emojiSelect = spyOn(component.emojiSelect, 'emit');
          fixture.detectChanges();
        });
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', function () {
    it('should render emojis', () => {
      component.panelElement.onTriggerClick();
      const catListObj = fixture.debugElement.query(By.css('.emojis'));
      expect(catListObj).toBeTruthy();
    });
  });
  describe('toggleMenu', function () {
    it(
      'should update menu state when using toggle menu,' +
        'and toggle menu function with force state',
      () => {
        expect(component.panelActive).toBeFalsy();
        component.toggleMenu();
        fixture.detectChanges();
        expect(component.panelActive).toBeTruthy();
        component.toggleMenu(true);
        fixture.detectChanges();
        expect(component.panelActive).toBeTruthy();
      }
    );
    it('should update menu state remain false when toggleWith force false', () => {
      component.toggleMenu(false);
      fixture.detectChanges();
      expect(component.panelActive).toBeFalsy();
    });
    describe('panel trigger', () => {
      let panelTrigger;
      beforeEach(() => {
        panelTrigger = fixture.debugElement.query(By.css('[panel-trigger]'));
      });
      it('should have panel trigger, overlayRef should be defined after click', () => {
        expect(panelTrigger).toBeTruthy();
      });
      it('should overlayRef be undefined before click on trigger', () => {
        expect(component.panelElement.overlayRef).toBeFalsy();
      });
      it(' overlayRef should be defined after click', () => {
        panelTrigger.nativeElement.click();
        expect(component.panelElement.overlayRef).toBeTruthy();
      });
    });
  });
  describe('selectEmoji', () => {
    it('should select emoji trigger output with input string / emoji', fakeAsync(() => {
      const selectedEmoji = find(
        EMOJI_DATA.find((cat) => cat.name === 'people').data,
        { shortname: 'grinning' }
      );
      component.selectEmoji(selectedEmoji);
      fixture.detectChanges();
      tick();
      expect(emojiSelect).toHaveBeenCalledWith(selectedEmoji);
    }));
  });
});
