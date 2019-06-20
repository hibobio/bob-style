import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  HostListener
} from '@angular/core';
import { InputTypes } from '../../input/input.enum';
import { InputEventType } from '../../form-elements.enum';
import {
  ButtonSize,
  ButtonType
} from '../../../buttons-indicators/buttons/buttons.enum';
import { RteLink } from '../rte-core/rte.interface';
import { InputEvent } from '../../input/input.interface';
import { InputComponent } from '../../input/input.component';
import { checkUrl } from './link-blot';
import { Icons, IconColor, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-rte-link-editor',
  templateUrl: './rte-link-editor.component.html',
  styleUrls: ['./rte-link-editor.component.scss']
})
export class RteLinkEditorComponent {
  constructor() {}

  @ViewChild('textInput', { static: true }) private textInput: InputComponent;

  @Input() text: string;
  @Input() url: string;
  @Input() isEditing = false;

  @Output() linkUpdate: EventEmitter<any> = new EventEmitter<RteLink>();
  @Output() linkCancel: EventEmitter<any> = new EventEmitter<any>();

  readonly inputTypes = InputTypes;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  private updateOnEvent = InputEventType.onChange;

  @HostListener('keydown.enter', ['$event']) handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isEditing && this.url !== '') {
      this.onAdd();
    }
  }

  focusTextInput(): void {
    (this.textInput.input as any).nativeElement.focus();
  }

  onTextChange(e: InputEvent) {
    if (e.event === this.updateOnEvent) {
      this.text = e.value as string;
    }
  }

  onUrlChange(e: InputEvent) {
    if (e.event === this.updateOnEvent) {
      this.url = e.value as string;
    }
  }

  onAdd(): void {
    const url = this.url ? checkUrl(this.url) : null;

    this.linkUpdate.emit({
      text: this.text,
      url
    });

    this.resetValues();
  }

  onCancel(): void {
    this.linkCancel.emit();
    this.resetValues();
  }

  private resetValues(): void {
    this.url = null;
    this.text = null;
  }
}
