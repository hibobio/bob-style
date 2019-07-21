// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { InputComponent } from './timepicker.component';
// import { InputEventType } from '../form-elements.enum';
// import { CommonModule } from '@angular/common';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { InputMessageModule } from '../input-message/input-message.module';
// import { DOMhelpers } from '../../services/utils/dom-helpers.service';
// import { InputTypes } from './timepicker.enum';

// describe('InputComponent', () => {
//   let component: InputComponent;
//   let fixture: ComponentFixture<InputComponent>;
//   let inputElement: any;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [InputComponent],
//       imports: [NoopAnimationsModule, CommonModule, InputMessageModule],
//       providers: [DOMhelpers]
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(InputComponent);
//         component = fixture.componentInstance;
//         spyOn(component.changed, 'emit');
//         spyOn(component, 'propagateChange');
//       });
//   }));

//   describe('emitInputEvent', () => {
//     beforeEach(() => {
//       fixture.detectChanges();
//       inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
//     });

//     it('should emitInputEvent on input focus with input value', () => {
//       component.value = 'input value';
//       inputElement.dispatchEvent(new Event('focus'));
//       expect(component.changed.emit).toHaveBeenCalledWith({
//         event: InputEventType.onFocus,
//         value: 'input value'
//       });
//     });
//     it('should emitInputEvent on input blur with input value', () => {
//       component.value = 'input value';
//       inputElement.dispatchEvent(new Event('blur'));
//       expect(component.changed.emit).toHaveBeenCalledWith({
//         event: InputEventType.onBlur,
//         value: 'input value'
//       });
//     });
//     it('should emitInputEvent on model change with input value', () => {
//       inputElement.value = 'change input value';
//       inputElement.dispatchEvent(new Event('input'));
//       expect(component.changed.emit).toHaveBeenCalledWith({
//         event: InputEventType.onChange,
//         value: 'change input value'
//       });
//       expect(component.propagateChange).toHaveBeenCalledWith(
//         'change input value'
//       );
//     });
//   });
// });
