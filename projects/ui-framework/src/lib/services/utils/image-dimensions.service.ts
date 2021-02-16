import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

export interface ImageDims {
  url: string;
  width: number;
  height: number;
  error?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ImageDimensionsService {
  //
  private createImageDimensions$(imgUrl: string): Observable<ImageDims> {
    return new Observable((observer) => {
      let img = new Image();

      const unsubscribe = () => {
        img?.removeEventListener('load', onLoad);
        img?.removeEventListener('error', onError);
        img = null;
      };

      const onLoad = () => {
        observer.next({
          url: imgUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        unsubscribe();
      };

      const onError = () => {
        observer.next({
          url: imgUrl,
          width: null,
          height: null,
          error: true,
        });
        unsubscribe();
      };

      img.addEventListener('load', onLoad, {
        passive: true,
        once: true,
      });

      img.addEventListener('error', onError, {
        passive: true,
        once: true,
      });

      img.src = imgUrl;

      return unsubscribe;
    });
  }

  getImageDimensions$(imgUrl: string): Observable<ImageDims> {
    return this.createImageDimensions$(imgUrl).pipe(take(1));
  }

  onImageLoad$(
    imgUrl: string
  ): Observable<{ url: string; error: boolean; success: boolean }> {
    return this.createImageDimensions$(imgUrl).pipe(
      map((res) => ({
        url: imgUrl,
        error: Boolean(res.error),
        success: Boolean(!res.error),
      })),
      take(1)
    );
  }
}
