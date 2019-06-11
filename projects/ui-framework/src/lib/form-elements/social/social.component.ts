import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { BaseInputElement } from '../base-input-element';
import { SocialType } from './social.interface';
import { SocialService } from './social.service';
import { SocialInputConfig, socialTypesConfig } from './social.const';

@Component({
  selector: 'b-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.scss'],
})
export class SocialComponent extends BaseInputElement implements OnInit {

  @Input() type: SocialType;
  @Input() placeholder: string;
  @Output() socialInputChange: EventEmitter<string> = new EventEmitter<string>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  public inputTypes  = InputTypes;
  public socialSelection: SocialInputConfig;

  constructor() {
    super();
  }

  ngOnInit() {
    this.socialSelection = socialTypesConfig[this.type];
    if (this.value) {
      this.value = SocialService.inputToSocialFormat(this.value);
    }
  }

  public onInputEvents(event: InputEvent): void {
    this.value = event.value as string;
    const socialOutput = SocialService
      .inputTransformOut(this.socialSelection.prefix, this.value);
    this.socialInputChange.emit(socialOutput);
  }
}
