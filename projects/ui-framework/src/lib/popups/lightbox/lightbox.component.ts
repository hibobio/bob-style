import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  HostBinding,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { LightboxConfig } from './lightbox.interface';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Keys } from '../../enums';
import { isKey } from '../../services/utils/functional-utils';
import { WindowRef } from '../../services/utils/window-ref.service';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
})
export class LightboxComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private utilsService: UtilsService,
    private windowRef: WindowRef,
    private cd: ChangeDetectorRef // needed for tests
  ) {}

  @Input() config: LightboxConfig;

  public closeLightboxCallback: Function;
  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly buttons = ButtonType;
  public windowKeydownSubscriber: Subscription;

  @HostListener('window:popstate', ['$event'])
  closeLightboxOnHistoryBack() {
    this.closeLightboxCallback();
  }

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
    this.windowRef.nativeWindow.history.pushState(
      {
        lightbox: true,
        desc: 'lightbox is open',
      },
      null
    );

    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent()
      .pipe(filter((event: KeyboardEvent) => isKey(event.key, Keys.escape)))
      .subscribe(() => {
        this.closeLightboxCallback();
      });
  }

  ngOnDestroy(): void {
    if (this.windowRef.nativeWindow.history.state.lightbox) {
      this.windowRef.nativeWindow.history.back();
    }
    this.windowKeydownSubscriber?.unsubscribe();
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
