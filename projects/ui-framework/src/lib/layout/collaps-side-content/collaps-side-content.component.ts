import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ColorsMain, Icons, InsightsPanelType } from 'bob-style';

@Component({
  selector: 'b-collaps-side-content',
  templateUrl: './collaps-side-content.component.html',
  styleUrls: ['./collaps-side-content.component.scss'],
})

export class CollapsSideContentComponent implements OnInit, AfterViewInit {

  @Input('startCollapsed') startCollapsed = true;
  @Input('config') config = {
    trigger: {
      bgColor: ColorsMain.inform_600, icon: {
        collapsed: Icons.chevron_right, expand: Icons.chevron_left,
      },
    },
  };
  public collapsed: boolean;

  @HostBinding('attr.data-type') @Input() type: InsightsPanelType = InsightsPanelType.information;

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.collapsed = this.startCollapsed;
  }

  public onCollapsClick() {
    this.collapsed = !this.collapsed;
  }
}
