import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import { StatsModule } from '../services/util-components/stats.module';
import { UtilsService } from '../services/utils/utils.service';
import 'zone.js/dist/zone-patch-rxjs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { tap } from 'rxjs/operators';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function initTranslations(
  translateService: TranslateService,
  httpClient: HttpClient
) {
  return () =>
    httpClient
      .get('https://i18n.hibob.com/bob-shared/en.json')
      .pipe(
        tap((data) => {
          translateService.setTranslation('en', data, true);
          translateService.setDefaultLang('en');
          translateService.use('en');
        })
      )
      .toPromise();
}

@NgModule({
  declarations: [StoryBookLayoutComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    TypographyModule,
    StatsModule,
  ],
  exports: [StoryBookLayoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslations,
      deps: [TranslateService, HttpClient],
      multi: true,
    },
    UtilsService,
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        showDelay: 300,
        position: 'above',
      },
    },
  ],
})
export class StoryBookLayoutModule {}
