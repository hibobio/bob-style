import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipInputComponent } from './chip-input.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { ColorService } from '../../../services/color-service/color.service';

// xdescribe('ChipComponent', () => {
//   let component: ChipInputComponent;
//   let fixture: ComponentFixture<ChipInputComponent>;
//   let chipElement: HTMLElement;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ChipInputComponent],
//       imports: [],
//       providers: [ColorService],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(ChipInputComponent);
//         component = fixture.componentInstance;
//         chipElement = fixture.debugElement.query(By.css('span')).nativeElement;
//       });
//   }));

//   describe('color & disabled', () => {
//     it('should not apply custom color if type is disabled', () => {});
//   });
// });
