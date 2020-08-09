import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageDimensionsService {
  //
  private createImageDimensions$(
    imgUrl: string
  ): Observable<{
    url: string;
    width: number;
    height: number;
    error?: boolean;
  }> {
    //
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

  getImageDimensions$(
    imgUrl: string
  ): Observable<{ width: number; height: number }> {
    return this.createImageDimensions$(imgUrl).pipe(take(1));
  }
}
