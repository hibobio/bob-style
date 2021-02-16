import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { URLutils } from '../../../../ui-framework/src/lib/services/url/url-utils.service';
import { FormsModule } from '@angular/forms';
import { mockText } from '../../../../ui-framework/src/lib/mock.const';
// tslint:disable-next-line: max-line-length
import { TruncateTooltipModule } from '../../../../ui-framework/src/lib/popups/truncate-tooltip/truncate-tooltip.module';
import { TypographyModule } from '../../../../ui-framework/src/lib/typography/typography.module';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'tooltip-tester',
  template: `
    <style>
      input::-webkit-inner-spin-button {
        -webkit-appearance: inner-spin-button;
        display: inline-block;
        cursor: default;
        align-self: center;
        opacity: 0;
        pointer-events: none;
        -webkit-user-modify: read-only !important;
        flex: 0 0 auto;
        opacity: 1;
        pointer-events: all;
      }
    </style>
    <div
      style="max-width: 400px; margin: 50px auto; font-size: 12px; line-height: 1.5;"
    >
      <b-truncate-tooltip
        style="width:117px"
        [maxLines]="1"
        class="employee-title"
      >
        Hardware engineer
      </b-truncate-tooltip>

      <br /><br />

      <b-truncate-tooltip
        style="width:99px"
        [maxLines]="2"
        class="employee-title"
      >
        UK Product Team Salary Change
      </b-truncate-tooltip>

      <br /><br />

      <b-truncate-tooltip [maxLines]="lines" [expectChanges]="true">
        {{ mockText(words) }}
      </b-truncate-tooltip>

      <br /><br />

      <b-display-4
        style="width: 138px; margin-top: 4px;"
        *bTruncateTooltip="lines"
        >Larry Murfiray</b-display-4
      >

      <br /><br />

      <b-truncate-tooltip [maxLines]="lines">
        <b-display-4 style="width: 138px; margin-top: 4px;">
          Larry Murfiray
        </b-display-4>
      </b-truncate-tooltip>

      <br /><br />

      <p
        style="display:flex; align-items:center; justify-content: space-between;max-width:300px;"
      >
        <span>Words:</span>
        <input
          type="number"
          style="width: 50px; height: 25px; padding: 0 5px; outline:0; font-size: 14px;"
          [(ngModel)]="words"
        />

        <span>MaxLines:</span>
        <input
          type="number"
          style="width: 50px; height: 25px; padding: 0 5px; outline:0; font-size: 14px;"
          [(ngModel)]="lines"
        />
      </p>
    </div>
  `,
  providers: [URLutils],
})
export class TooltipTesterComponent {
  constructor() {}

  mockText = mockText;
  lines = 1;
  words = 10;
}

@NgModule({
  declarations: [TooltipTesterComponent],
  imports: [CommonModule, TruncateTooltipModule, FormsModule, TypographyModule],
  exports: [TooltipTesterComponent],
  providers: [],
  entryComponents: [],
})
export class TooltipTesterModule {}
