import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  HostBinding,
  OnInit,
  OnDestroy
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LightboxConfig } from './lightbox.interface';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Keys } from '../../enums';
import { isKey } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private utilsService: UtilsService) {}

  @Input() config: LightboxConfig;

  public closeLightboxCallback: Function;
  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly buttons = ButtonType;
  public windowKeydownSubscriber: Subscription;

  @HostBinding('class')
  get getClass(): string {
    return (
      this.config &&
      (this.config.component && !this.config.image && !this.config.video
        ? 'type-component'
        : this.config.video && !this.config.image
        ? 'type-video'
        : 'type-image') +
        (this.config.fillScreen ? ' fill-cover' : ' fill-contain')
    );
  }

  ngOnInit(): void {
    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent()
      .pipe(filter((event: KeyboardEvent) => isKey(event.key, Keys.escape)))
      .subscribe(() => {
        this.closeLightboxCallback();
      });
  }

  ngOnDestroy(): void {
    if (this.windowKeydownSubscriber) {
      this.windowKeydownSubscriber.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      this.config = changes.config.currentValue;
    }
  }

  public closeLightbox(): void {
    this.closeLightboxCallback();
  }
}
