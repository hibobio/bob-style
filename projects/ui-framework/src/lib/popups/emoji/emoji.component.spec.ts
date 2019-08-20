import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { EmojiComponent } from './emoji.component';
import { By } from '@angular/platform-browser';
import { TypographyModule } from '../../typography/typography.module';
import { EMOJI_DATA } from './emoji-data.consts';
import { find } from 'lodash';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';

describe('EmojiComponent', () => {
  let component: EmojiComponent;
  let fixture: ComponentFixture<EmojiComponent>;
  let emojiSelect;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TypographyModule, TruncateTooltipModule],
      declarations: [EmojiComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmojiComponent);
        component = fixture.componentInstance;
        emojiSelect = spyOn(component.emojiSelect, 'emit');
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', function() {
    it('should render emojis', () => {
      component.toggleMenu();
      const catListObj = fixture.debugElement.query(By.css('.emojis'));
      expect(catListObj).toBeTruthy();
    });
  });
  describe('toggleMenu', function() {
    it(
      'should update menu state when using toggle menu,' +
        'and toggle menu function with force state',
      () => {
        expect(component.emojiMenuState).toBeFalsy();
        component.toggleMenu();
        fixture.detectChanges();
        expect(component.emojiMenuState).toBeTruthy();
        component.toggleMenu(true);
        fixture.detectChanges();
        expect(component.emojiMenuState).toBeTruthy();
      }
    );
    it('should update menu state remain false when toggleWith force false', () => {
      component.toggleMenu(false);
      fixture.detectChanges();
      expect(component.emojiMenuState).toBeFalsy();
    });
  });
  describe('selectEmoji', () => {
    it('should select emoji trigger output with input string / emoji', fakeAsync(() => {
      const selectedEmoji = find(EMOJI_DATA.people, { shortname: 'grinning' });
      component.selectEmoji(selectedEmoji);
      fixture.detectChanges();
      tick();
      expect(emojiSelect).toHaveBeenCalledWith(selectedEmoji);
    }));
  });
});
