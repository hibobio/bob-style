import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InputEventType, InputTypes } from '../../../form-elements/input/input.enum';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { RteLink } from '../rich-text-editor.interface';
import { InputEvent } from '../../../form-elements/input/input.interface';
import has from 'lodash/has';

@Component({
  selector: 'b-rte-link-editor',
  templateUrl: './rte-link-editor.component.html',
  styleUrls: ['./rte-link-editor.component.scss'],
})
export class RteLinkEditorComponent implements OnChanges {

  @Input() displayText;
  @Output() linkUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() linkCancel: EventEmitter<any> = new EventEmitter<any>();

  inputTypes = InputTypes;
  buttonSize = ButtonSize;
  buttonType = ButtonType;

  urlText;

  rteLink: RteLink = {
    text: null,
    url: null,
  };

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'displayText')) {
      this.rteLink.text = changes.displayText.currentValue;
    }
  }

  onDisplayTextChange(e: InputEvent) {
    if (e.event === InputEventType.onChange) {
      this.rteLink.text = e.value as string;
    }
  }

  onUrlTextChange(e: InputEvent) {
    if (e.event === InputEventType.onChange) {
      this.rteLink.url = e.value as string;
    }
  }

  onAdd(): void {
    this.linkUpdate.emit(this.rteLink);
    this.resetValues();
  }

  onCancel(): void {
    this.linkCancel.emit();
    this.resetValues();
  }

  private resetValues(): void {
    this.urlText = null;
    this.displayText = null;
  }
}
