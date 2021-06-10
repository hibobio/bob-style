import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { INSIGHTS_PANEL_CONFIG_DEF } from './insights-panel.const';
import { InsightsPanelType } from './insights-panel.enum';
import {
  InsightsPanelConfig,
  InsightsPanelData,
} from './insights-panel.interface';

@Component({
  selector: 'b-insights-panel',
  templateUrl: 'insights-panel.component.html',
  styleUrls: ['insights-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightsPanelComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.config = {
      ...INSIGHTS_PANEL_CONFIG_DEF,
      showMoreText: this.translate.instant('common.view-more'),
      showLessText: this.translate.instant('common.view-less'),
      readMoreLinkText: this.translate.instant('common.read_more'),
    };
  }

  readonly iconSizes = IconSize;
  readonly iconTypes = Icons;

  @Input() data: InsightsPanelData[];
  @Input('expanded') isExpanded = true;

  @Input('config') set setConfig(config: InsightsPanelConfig) {
    this.config = { ...this.config, ...config };
  }
  public config: InsightsPanelConfig;

  @HostBinding('attr.data-type') @Input() type: InsightsPanelType =
    InsightsPanelType.information;

  @HostBinding('attr.data-expanded') get panelIsExpanded() {
    return (
      this.config.showMoreAfterItem > 0 ||
      this.config.collapsible === false ||
      this.isExpanded
    );
  }

  @Output() expanded: EventEmitter<boolean> = new EventEmitter();

  readonly expandButtonConf: Button = {
    type: ButtonType.tertiary,
    size: ButtonSize.small,
    color: IconColor.inherit,
  };

  public onExpandClick(): void {
    this.expanded.emit((this.isExpanded = !this.isExpanded));
    this.cdr.detectChanges();
  }
}
