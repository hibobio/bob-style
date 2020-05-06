import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const translationFilePrefix = 'https://i18n.hibob.com/bob-shared/';

// A utility module adding I18N support for Storybook stories
@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot()],
})
export class StorybookTranslateModule {
  constructor(
    translateService: TranslateService,
    private httpClient: HttpClient
  ) {
    console.log('Translations: ', translateService.translations);
    this.httpClient.get(`${translationFilePrefix}en.json`).subscribe((data) => {
      translateService.setTranslation('en', data, true);
      translateService.setDefaultLang('en');
      translateService.use('en');
    });
  }
}
