import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ViewChild,
  OnInit,
  NgZone,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { SocialTypes } from './social.const';
import { Social } from './social.enum';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { InputComponent } from '../input/input.component';
import { stringyOrFail } from '../../services/utils/transformers';
import { URLutils } from '../../services/url/url-utils.service';

@Component({
  selector: 'b-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SocialComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: SocialComponent },
  ],
})
export class SocialComponent extends BaseFormElement
  implements OnInit, AfterViewInit {
  constructor(
    protected cd: ChangeDetectorRef,
    private URL: URLutils,
    private zone: NgZone,
    private host: ElementRef
  ) {
    super(cd);

    this.inputTransformers = [
      stringyOrFail,
      (value: string): string => {
        if (!value) {
          return '';
        }
        if (SocialTypes[this.type].parseReplace) {
          SocialTypes[this.type].parseReplace.forEach((rplc) => {
            value = value.replace(rplc.a, rplc.b);
          });
        }
        return this.URL.path(value);
      },
    ];
    this.outputTransformers = [
      (value: string): string =>
        value ? `https://${SocialTypes[this.type].prefix}${value}` : '',
    ];
    this.baseValue = '';
    this.wrapEvent = false;
  }

  @ViewChild('bInput', { static: true }) bInput: InputComponent;
  public input: ElementRef<HTMLInputElement>;

  @Input() type: Social;
  @Input() placeholder = 'username';

  // tslint:disable-next-line: no-output-rename
  @Output('socialInputChange') changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public inputId: string | number;
  public narrowInput = false;

  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly socialTypes = SocialTypes;
  readonly socialLabelMap = {
    [Social.facebook]: 'Facebook',
    [Social.twitter]: 'Twitter',
    [Social.linkedin]: 'Linkedin',
  };

  ngOnInit(): void {
    this.inputId = this.bInput.id;
    this.narrowInput =
      (this.host.nativeElement as HTMLElement).offsetWidth < 300;
  }

  ngAfterViewInit(): void {
    this.input = this.bInput.input;
  }

  onInputEvents(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.writeValue(event.value);
    }

    if (event.event === InputEventType.onBlur) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.bInput.input.nativeElement.value = this.value || '';
        }, 0);
      });
    }

    this.transmitValue(this.value, { eventType: [event.event] });
  }
}
