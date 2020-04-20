import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiChipListComponent } from './emoji-chip-list.component';
import { MockPipe } from 'ng-mocks';
import { EmojiFromCodePipe } from './emoji-from-code.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

describe('EmojiChipListComponent', () => {
  let component: EmojiChipListComponent;
  let fixture: ComponentFixture<EmojiChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule],
      declarations: [
        EmojiChipListComponent,
        MockPipe(EmojiFromCodePipe, (val) => `${val}`),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call formatterFunction if exists and return value if it doesnt', () => {
    expect(component.valueFormatterFn(42)).toEqual(42);
    component.valueFormatter = (val) => {
      return val * 2;
    };
    expect(component.valueFormatterFn(42)).toEqual(84);
  });
  it('should call chipClick emitter when function chipClick called', () => {
    const chipClickedSpy = spyOn(component.chipClicked, 'emit');
    component.chipClick({ emoji: '1F45F', number: 245 });
    expect(chipClickedSpy).toHaveBeenCalledWith({
      emoji: '1F45F',
      number: 245,
    });
  });
  it('should add selected class to a chip when selected is true', () => {
    const chipsData = [
      {
        emoji: '1F600',
        tooltip: 'happy',
        number: 355,
        selected: true,
      },
      {
        emoji: '1F45F',
        tooltip: 'shoe',
        number: 280,
      },
    ];
    component.chips = chipsData;
    fixture.detectChanges();
    const chips = fixture.debugElement.queryAll(By.css('.emoji-chip-item'));
    expect(chips.length).toEqual(2);
    expect(chips[0].nativeElement.classList).toContain('selected');
    expect(chips[1].nativeElement.classList).not.toContain('selected');
  });
});
