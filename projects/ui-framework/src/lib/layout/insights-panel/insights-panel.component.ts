import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Button, ButtonSize, ButtonType, IconColor, Icons, IconSize } from 'bob-style';
import { ContainerState, InsightsPanelTypeEnums } from './insights-panel.enums';
import { InsightsData } from './insight-panel.interfaces';

@Component({
  selector: 'b-insights-panel',
  templateUrl: 'insights-panel.component.html',
  styleUrls: ['insights-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InsightsPanelComponent implements OnInit {
  public readonly iconSizes = IconSize;
  public readonly iconTypes = Icons;
  public readonly containerStates = ContainerState;

  @Input() contractButtonConf: Button = {
    type: ButtonType.tertiary,
    size: ButtonSize.small,
    color: IconColor.dark,
    text: 'INSIGHTS',
  };
  @HostBinding('attr.data-type') @Input() type: InsightsPanelTypeEnums = InsightsPanelTypeEnums.information;
  @HostBinding('attr.container-state') @Input() containerState: ContainerState = ContainerState.expanded;
  @Output() expandContractBtnicon: Icons.contract | Icons.expand = Icons.contract;
  @Output() containerStateEmiiter: EventEmitter<ContainerState> = new EventEmitter<ContainerState>();

  @Input() iconType?: Icons = Icons.graph_timeline;
  @Input() data: InsightsData[];
  @Input() maxLines?: number = 3;
  @Input() isContracteble?: boolean = true;
  @Input() iconColor?: IconColor = IconColor.dark;
  @Input() iconSize?: IconSize = IconSize.medium;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  public onContractClick(): void {
    this.containerState = this.containerState === ContainerState.contracted
      ? ContainerState.expanded : ContainerState.contracted;
    this.expandContractBtnicon = this.expandContractBtnicon === Icons.expand
      ? Icons.contract : Icons.expand;
    this.containerStateEmiiter.emit(this.containerState === ContainerState.contracted
      ? ContainerState.contracted : ContainerState.expanded);
    this.cdr.detectChanges();
  }
}
