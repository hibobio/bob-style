import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material';

describe('ButtonComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipComponent],
      imports: [MatChipsModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('components', () => {
    it('should have type class', () => {
      component.type = ChipType.info;
      fixture.detectChanges();
      const chipElement = fixture.debugElement;
      expect(chipElement.nativeElement.classList).toContain('chip-info');
    });
  });
});
