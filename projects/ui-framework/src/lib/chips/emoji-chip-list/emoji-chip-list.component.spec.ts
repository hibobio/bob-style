import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiChipListComponent } from './emoji-chip-list.component';
import { MockPipe } from 'ng-mocks';
import { EmojiFromCodePipe } from './emoji-from-code.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('EmojiChipListComponent', () => {
  let component: EmojiChipListComponent;
  let fixture: ComponentFixture<EmojiChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule],
      declarations: [
        EmojiChipListComponent,
        MockPipe(EmojiFromCodePipe, val => `${val}`),
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
    component.valueFormatter = val => {
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
});
