import {
  Component,
  Input,
  HostListener,
  OnDestroy,
  ElementRef,
  HostBinding,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { URLutils } from '../../../services/url/url-utils.service';
import { MediaData, VideoData } from '../../../services/url/url.interface';
import { LightboxData } from '../lightbox.interface';
import { LightboxService } from '../lightbox.service';
import { MediaType } from './media-embed.enum';

import { Observable } from 'rxjs';
import { InputObservable } from '../../../services/utils/decorators';
import {
  distinctUntilChanged,
  filter,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

@Component({
  selector: 'b-media-embed',
  template: `<ng-container *ngLet="(mediaData$ | async) || {} as md">
    <iframe
      *ngIf="inline === true && md.mediaType === mt.video && md.safeUrl"
      class="embed-video"
      [src]="md.safeUrl"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
  </ng-container>`,
  styleUrls: ['./media-embed.component.scss'],
})
export class MediaEmbedComponent implements OnInit, OnDestroy {
  constructor(
    private URL: URLutils,
    private DOM: DOMhelpers,
    private lightboxService: LightboxService,
    private host: ElementRef
  ) {}

  @InputObservable(null, [filter(Boolean)])
  @Input('url')
  url$: Observable<string>;

  @Output() clicked: EventEmitter<VideoData> = new EventEmitter<VideoData>();

  @HostBinding('attr.data-inline-embed') @Input() inline = false;

  public videoData: VideoData;
  public lightbox: LightboxData;
  readonly mt = MediaType;
  public mediaData$: Observable<MediaData>;

  @HostListener('click')
  onClick() {
    this.clicked.observers.length && this.clicked.emit(this.videoData);
    if (this.clicked.observers.length || this.inline) {
      return;
    }

    this.lightbox?.close();

    this.mediaData$.pipe(take(1)).subscribe((md) => {
      md.safeUrl &&
        (this.lightbox = this.lightboxService.showLightbox({
          [md.mediaType]: md.safeUrl,
        }));
    });
  }

  ngOnInit() {
    this.mediaData$ = this.url$.pipe(
      distinctUntilChanged(),
      switchMap((url) => this.URL.getMediaData$(url, this.inline !== true)),
      tap((md) => {
        md.safeUrl && this.setAttrs(md.thumb || md.url, md.mediaType);
      }),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    this.lightbox?.close();
  }

  private setAttrs(imgUrl: string, mediaType: MediaType) {
    imgUrl &&
      this.DOM.setCssProps(this.host.nativeElement, {
        'background-image': `url(${imgUrl})`,
      });

    mediaType &&
      this.DOM.setAttributes(this.host.nativeElement, {
        'data-type': mediaType,
      });
  }
}
