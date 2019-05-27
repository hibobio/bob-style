import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import floor from 'lodash/floor';
import { UtilsService } from '../../services/utils/utils.service';
import { AvatarGap } from './employees-showcase.const';
import { Icons } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { Subscription } from 'rxjs';
import invoke from 'lodash/invoke';

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: ['./employees-showcase.component.scss']
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() employees: EmployeeShowcase[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;

  private avatarGap: number = AvatarGap[AvatarSize.mini];
  private clientWidth = 0;
  public showMore = false;
  public avatarsToFit = 0;
  public icon: Icons = Icons.three_dots;
  private resizeEventSubscriber: Subscription;

  constructor(
    private utilsService: UtilsService,
    private host: ElementRef,
    private DOM: DOMhelpers
  ) {}

  ngOnInit(): void {
    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.clientWidth = this.getClientWidth();
        this.calcAvatarsToFit();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarSize) {
      this.clientWidth = this.getClientWidth();
      this.setAvatarGap();
      this.setAvatarGapCss();
      this.calcAvatarsToFit();
    }
  }

  ngOnDestroy(): void {
    invoke(this.resizeEventSubscriber, 'unsubscribe');
  }

  private getClientWidth() {
    return this.DOM.getClosest(
      this.host.nativeElement,
      this.DOM.getInnerWidth,
      'result'
    );
  }

  /*
    Calculates the total number of avatars that can fit in a certain width.
    floor((width - size) / (size - gap) + 1)
   */
  private calcAvatarsToFit() {
    this.avatarsToFit = floor(
      (this.clientWidth - this.avatarSize) /
        (this.avatarSize - this.avatarGap) +
        1
    );
  }

  private setAvatarGap() {
    this.avatarGap = AvatarGap[this.avatarSize];
    this.showMore = this.avatarSize < AvatarSize.medium;
  }

  private setAvatarGapCss() {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-gap': '-' + this.avatarGap + 'px'
    });
  }
}
