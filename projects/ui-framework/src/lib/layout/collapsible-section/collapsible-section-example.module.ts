import {
  Component,
  Input,
  NgModule,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CollapsibleSectionModule } from './collapsible-section.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { TypographyModule } from '../../typography/typography.module';
import {
  mockAvatar,
  mockName,
  mockJobs,
  mockText,
  mockDateRange,
} from '../../mock.const';
import {
  LabelValueType,
  IconPosition,
} from '../../typography/label-value/label-value.enum';
import { randomNumber, makeArray } from '../../services/utils/functional-utils';
import { ButtonsModule } from '../../buttons/buttons.module';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { LabelValueModule } from '../../typography/label-value/label-value.module';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { InputModule } from '../../form-elements/input/input.module';
import { ColorService } from '../../services/color-service/color.service';
import { MatTooltipModule } from '@angular/material';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'b-collapsible-section-example-1',
  template: `
    <b-collapsible-section
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      [divided]="divided"
      (openedFirst)="onOpenedFirst()"
      (opened)="onOpened()"
      (closed)="onClosed()"
    >
      <div header class="row row-spread">
        <div class="cell cell-valign">
          <b-avatar-image [imageSource]="avatar.imageSource"></b-avatar-image>
          <b-label-value
            [type]="labelValueType.three"
            [label]="avatar.label"
            [value]="avatar.value"
            [labelMaxLines]="1"
            [valueMaxLines]="1"
          ></b-label-value>
        </div>

        <div class="cell cell-valign">
          <b-label-value
            [type]="labelValueType.one"
            [label]="holiday.label"
            [value]="holiday.value"
            [icon]="holiday.icon"
            [iconPosition]="holiday.iconPosition"
            [labelMaxLines]="1"
            [valueMaxLines]="1"
          ></b-label-value>
        </div>

        <div class="cell cell-valign">
          <b-label-value
            [type]="labelValueType.one"
            [label]="days.label"
            [value]="days.value"
          ></b-label-value>
        </div>

        <div
          class="cell cell-valign buttons"
          (click)="$event.stopPropagation()"
        >
          <b-square-button
            [type]="cancelButton.type"
            [color]="cancelButton.color"
            [size]="cancelButton.size"
            [icon]="cancelButton.icon"
          ></b-square-button>
          <b-square-button
            [type]="confirmButton.type"
            [color]="confirmButton.color"
            [size]="confirmButton.size"
            [icon]="confirmButton.icon"
          ></b-square-button>
        </div>
      </div>

      <div class="panel">
        <div class="row">
          <div class="cell">
            <b-label-value
              [type]="labelValueType.four"
              [label]="curBalance.label"
              [value]="curBalance.value"
            ></b-label-value>
          </div>

          <div class="cell">
            <b-label-value
              [type]="labelValueType.two"
              [label]="docs.label"
              [value]="docs.value"
              [icon]="docs.icon"
              [iconPosition]="docs.iconPosition"
              [valueMaxLines]="1"
              (valueClicked)="$event.stopPropagation()"
            ></b-label-value>
          </div>

          <div class="cell">
            <b-label-value
              [type]="labelValueType.two"
              [label]="reason.label"
              [value]="reason.value"
              [valueMaxLines]="1"
            ></b-label-value>
          </div>
        </div>

        <h5 class="b-bold-body">
          Who's out
        </h5>

        <div class="row">
          <div class="cell">
            <b-label-value
              [type]="labelValueType.two"
              [label]="outHoliday.label"
            >
              <div class="row avatars">
                <b-avatar-image
                  *ngFor="let avatar of outHoliday.avatars"
                  [imageSource]="avatar.imageSource"
                  [matTooltip]="avatar.tooltip"
                  [matTooltipClass]="'pre-wrap'"
                ></b-avatar-image>
              </div>
            </b-label-value>
          </div>

          <div class="cell">
            <b-label-value [type]="labelValueType.two" [label]="outWork.label">
              <div class="row avatars">
                <b-avatar-image
                  *ngFor="let avatar of outWork.avatars"
                  [imageSource]="avatar.imageSource"
                  [matTooltip]="avatar.tooltip"
                  [matTooltipClass]="'pre-wrap'"
                ></b-avatar-image>
              </div>
            </b-label-value>
          </div>

          <div class="cell">
            <b-label-value
              [type]="labelValueType.two"
              [label]="outMilitary.label"
            >
              <div class="row avatars">
                <b-avatar-image
                  *ngFor="let avatar of outMilitary.avatars"
                  [imageSource]="avatar.imageSource"
                  [matTooltip]="avatar.tooltip"
                  [matTooltipClass]="'pre-wrap'"
                ></b-avatar-image>
              </div>
            </b-label-value>
          </div>
        </div>
      </div>
    </b-collapsible-section>
  `,
  styles: [
    ':host {display: block;}',
    ':host::ng-deep .row, :host::ng-deep .cell { display: flex; }',
    ':host::ng-deep .row-spread { justify-content: space-between; }',
    ':host::ng-deep .cell { margin-right: 16px; min-width: 0; }',
    ':host::ng-deep .cell-valign { align-items: center; }',
    ':host::ng-deep .cell:last-child { margin-right: 0; }',
    ':host::ng-deep .cell.buttons { flex-grow: 0; min-width: 72px; margin-right: -16px; }',
    ':host::ng-deep [header] .avatar { margin-right: 8px; }',
    ':host::ng-deep .panel h5 { margin-top: 32px; margin-bottom: 8px; }',
    ':host::ng-deep .panel .cell { margin-right: 48px; }',
    ':host::ng-deep .avatars { margin-top: 4px; }',
    ':host::ng-deep .avatars .avatar { margin-right: 16px; }',
    ':host::ng-deep .avatars .avatar:last-child { margin-right: 0; }',
    ':host::ng-deep .avatars .avatar:after {min-width: 200px; text-align: center; }',
  ],
})
export class CollapsibleSectionExample1Component implements OnChanges {
  constructor() {}

  @Input() collapsible = true;
  @Input() expanded = false;
  @Input() disabled = false;
  @Input() divided = true;
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() openedFirst: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  readonly labelValueType = LabelValueType;

  public daysNum = randomNumber(2, 10);
  public avatar = {
    imageSource: mockAvatar(),
    label: mockName(),
    value: mockJobs(1),
  };
  public holiday = {
    label: mockDateRange(this.daysNum),
    value: 'Holiday',
    icon: Icons.doc_icon,
    iconPosition: IconPosition.left,
  };
  public days = {
    label: this.daysNum,
    value: 'Days',
  };
  public cancelButton = {
    type: ButtonType.tertiary,
    color: IconColor.negative,
    size: ButtonSize.medium,
    icon: Icons.close,
  };
  public confirmButton = {
    type: ButtonType.tertiary,
    color: IconColor.positive,
    size: ButtonSize.medium,
    icon: Icons.tick,
  };
  public curBalance = {
    label: 'Current balance',
    value: randomNumber(2, 8) + '.' + randomNumber(10, 90),
  };
  public docs = {
    label: 'Docs',
    value: mockText(1) + '.pdf',
    icon: Icons.doc,
    iconPosition: IconPosition.value,
  };
  public reason = {
    label: 'Reason',
    value: '"I\'m planning a trip to celebrate my birthday."',
  };
  public outHolidayNum = 3;
  public outHoliday = {
    label: 'Holiday (' + this.outHolidayNum + ')',
    avatars: makeArray(this.outHolidayNum).map(i => ({
      imageSource: mockAvatar(),
      size: AvatarSize.mini,
      tooltip: mockName() + '\n' + mockDateRange() + '\n' + 'Approved',
    })),
  };
  public outWorkNum = 5;
  public outWork = {
    label: 'Work travel (' + this.outWorkNum + ')',
    avatars: makeArray(this.outWorkNum).map(i => ({
      imageSource: mockAvatar(),
      size: AvatarSize.mini,
      tooltip: mockName() + '\n' + mockDateRange() + '\n' + 'Approved',
    })),
  };
  public outMilitaryNum = 2;
  public outMilitary = {
    label: 'Military (' + this.outMilitaryNum + ')',
    avatars: makeArray(this.outMilitaryNum).map(i => ({
      imageSource: mockAvatar(),
      size: AvatarSize.mini,
      tooltip: mockName() + '\n' + mockDateRange() + '\n' + 'Approved',
    })),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collapsible && changes.collapsible.firstChange) {
      this.collapsible = true;
    }
  }

  onOpened(): void {
    this.opened.emit();
  }

  onClosed(): void {
    this.closed.emit();
  }

  onOpenedFirst(): void {
    this.openedFirst.emit();
  }
}

@Component({
  selector: 'b-collapsible-section-example-2',
  template: `
    <b-collapsible-section
      [title]="title"
      [description]="description"
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      [divided]="divided"
      (openedFirst)="onOpenedFirst()"
      (opened)="onOpened()"
      (closed)="onClosed()"
      [options]="options"
    >
      <b-icon header size="x-large" icon="b-icon-infinite"></b-icon>

      <div class="row row-spread row-wrap">
        <div class="cell" *ngFor="let cell of formCells">
          <b-input
            [label]="cell.label"
            [placeholder]="cell.placeholder"
            [hintMessage]="cell.hint"
          ></b-input>
        </div>
      </div>

      <div footer class="row justify-right">
        <b-button [type]="'secondary'" [text]="buttonText1"></b-button>
        <b-button [text]="buttonText2"></b-button>
      </div>
    </b-collapsible-section>
  `,
  styles: [
    ':host {display: block;}',
    '.row { display: flex; }',
    '.row-spread { justify-content: space-between; }',
    '.row-wrap { flex-wrap: wrap; }',
    '.justify-right { justify-content: flex-end; }',
    '.cell { width: 48%; margin-bottom: 16px; }',
    '.cell:nth-last-child(1), .cell:nth-last-child(2) { margin-bottom: 0; }',
    'b-button {margin-right: 8px;}',
    'b-button:last-child {margin-right: 0;}',
    ':host ::ng-deep .bcp-header { border-left: 16px solid var(--bcp-color); }',
    ':host ::ng-deep .bcp-panel { border-left: 16px solid rgba(var(--bcp-color-rgb), 0.2); }',
  ],
})
export class CollapsibleSectionExample2Component implements OnChanges {
  constructor() {}

  @Input() collapsible = true;
  @Input() expanded = false;
  @Input() disabled = false;
  @Input() divided = true;

  @Input() title = mockText(randomNumber(2, 5));
  @Input() description = mockText(randomNumber(3, 6));

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() openedFirst: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  readonly labelValueType = LabelValueType;

  public buttonText1 = mockText(1);
  public buttonText2 = mockText(1);
  public options = {
    headerContentClickable: false,
    indicatorColor: ColorService.prototype.randomColor(),
  };

  public formCells = makeArray(6).map(i => ({
    label: mockText(randomNumber(1, 2)),
    placeholder: mockText(randomNumber(2, 4)),
    hint: mockText(randomNumber(3, 6)),
  }));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collapsible && changes.collapsible.firstChange) {
      this.collapsible = false;
    }
  }

  onOpened(): void {
    this.opened.emit();
  }

  onClosed(): void {
    this.closed.emit();
  }

  onOpenedFirst(): void {
    this.openedFirst.emit();
  }
}
@NgModule({
  declarations: [
    CollapsibleSectionExample1Component,
    CollapsibleSectionExample2Component,
  ],
  imports: [
    BrowserModule,
    CollapsibleSectionModule,
    LabelValueModule,
    AvatarModule,
    TypographyModule,
    ButtonsModule,
    InputModule,
    MatTooltipModule,
    IconsModule,
  ],
  exports: [
    CollapsibleSectionExample1Component,
    CollapsibleSectionExample2Component,
  ],
})
export class CollapsibleSectionExampleModule {}
