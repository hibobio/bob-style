import { Component, Input, OnInit } from '@angular/core';
import { IconService } from './icon.service';
import { IconColor, Icons, IconSize } from './icons.enum';

@Component({
  selector: 'b-icon',
  template: `<mat-icon [svgIcon]="icon" [ngClass]="getClassNames()"></mat-icon>`,
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit{
  @Input() icon: Icons;
  @Input() size: IconSize = IconSize.medium;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;

  constructor(private iconService: IconService) {
  }

  ngOnInit(): void {
   this.iconService.initIcon(this.icon);
  }

  getClassNames() {
    return `${this.size} ${this.color}${this.hasHoverState ? ' has-hover-state' : ''}`;
  }
}
