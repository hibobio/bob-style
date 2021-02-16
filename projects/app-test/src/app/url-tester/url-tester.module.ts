import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { URLutils } from '../../../../ui-framework/src/lib/services/url/url-utils.service';

@Component({
  selector: 'url-tester',
  template: `
    <div
      style="width: 100%;justify-content: flex-end;display: flex;margin-bottom: 50px;"
    >
      <label style="display:block;text-align:right;">URL tester</label>
      <input #input type="text" />
      <button (click)="testUrl(input.value)" type="button">test</button>
    </div>
  `,
  providers: [URLutils],
})
export class UrlTesterComponent {
  constructor(private url: URLutils) {}

  testUrl(url: string) {
    console.log(url, this.url.getData(url));
    console.log(this.url.validateVideoUrl(url));
  }
}

@NgModule({
  declarations: [UrlTesterComponent],
  imports: [CommonModule],
  exports: [UrlTesterComponent],
  providers: [],
  entryComponents: [],
})
export class UrlTesterModule {}
