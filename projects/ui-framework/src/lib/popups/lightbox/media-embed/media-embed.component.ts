import {
  Component,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { URLutils } from '../../../services/url/url-utils.service';
import { VideoData } from '../../../services/url/url.interface';
import { LightboxData } from '../lightbox.interface';
import { LightboxService } from '../lightbox.service';
import { MediaType } from './media-embed.enum';
import {
  imageLinkTest,
  base64imageTest,
  filestackTest,
  allowedDomainsTest,
} from '../../../services/url/url.const';
import {
  stringify,
  hasChanges,
} from '../../../services/utils/functional-utils';
import { URLtype } from '../../../services/url/url.enum';

@Component({
  selector: 'b-media-embed',
  template: '',
  styleUrls: ['./media-embed.component.scss'],
})
export class MediaEmbedComponent implements OnChanges, OnDestroy {
  constructor(
    private URL: URLutils,
    private lightboxService: LightboxService,
    private host: ElementRef
  ) {}

  public videoData: VideoData;
  public lightbox: LightboxData;

  @Input() url: string;

  @HostBinding('attr.data-type') public mediaType: MediaType;

  @HostListener('click')
  onClick() {
    this.ngOnDestroy();
    this.lightbox = this.lightboxService.showLightbox({
      video:
        this.mediaType === MediaType.video &&
        this.videoData &&
        this.videoData.url,
      image: this.mediaType === MediaType.image && this.url,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (hasChanges(changes, ['url'], true)) {
      this.url = changes.url.currentValue;

      this.mediaType =
        imageLinkTest.test(this.url) || filestackTest.test(this.url)
          ? MediaType.image
          : MediaType.video;

      if (this.mediaType === MediaType.image) {
        this.setThumbImg(
          !base64imageTest.test(this.url)
            ? this.URL.reconstruct(this.url)
            : this.url
        );
      }

      if (this.mediaType === MediaType.video) {
        this.videoData = this.URL.parseVideoURL(this.url);

        if (!this.videoData) {
          console.error(
            `[MediaEmbedComponent]: URL (${
              this.url
            }) is not allowed. Allowed URLs are [${stringify(
              Object.keys(allowedDomainsTest)
            )}]`
          );
          return;
        }

        if (this.videoData.type === URLtype.vimeo) {
          (async () => {
            const response = await fetch(
              `http://vimeo.com/api/v2/video/${this.videoData.id}.json`
            );
            const videMeta = await response.json();

            const thumb =
              videMeta && videMeta[0]?.thumbnail_large?.split('_640')[0];
            this.videoData.thumb =
              (thumb && thumb + '_1280x720.jpg') || this.videoData.thumb;

            this.setThumbImg(this.videoData.thumb);
          })();

          return;
        }

        this.setThumbImg(this.videoData.thumb);

        if (
          this.videoData.type === URLtype.youtube &&
          this.videoData.thumbAlt &&
          this.videoData.thumbMinWidth
        ) {
          let testImg = new Image();

          testImg.onerror = () => {
            this.setThumbImg(this.videoData.thumbAlt);
            testImg = testImg.onload = testImg.onerror = null;
          };
          testImg.onload = () => {
            if (testImg.naturalWidth <= this.videoData.thumbMinWidth) {
              this.setThumbImg(this.videoData.thumbAlt);
            }
            testImg = testImg.onload = testImg.onerror = null;
          };

          testImg.src = this.videoData.thumb;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.close();
    }
  }

  private setThumbImg(imgUrl: string) {
    if (imgUrl) {
      this.host.nativeElement.style.backgroundImage = `url(${imgUrl})`;
    }
  }
}
