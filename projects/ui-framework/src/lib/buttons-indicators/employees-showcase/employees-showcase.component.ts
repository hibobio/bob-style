import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import floor from 'lodash/floor';
import { UtilsService } from '../../services/utils/utils.service';
import { AvatarGap } from './employees-showcase.const';
import { Icons } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { interval, Subscription } from 'rxjs';
import invoke from 'lodash/invoke';
import map from 'lodash/map';
import random from 'lodash/random';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { AvatarComponent } from '../avatar/avatar.component';
import { ListChange } from '../../form-elements/lists/list-change/list-change';

const SHUFFLE_EMPLOYEES_INTERVAL = 3000;

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: ['./employees-showcase.component.scss'],
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() employees: EmployeeShowcase[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();

  private avatarGap: number = AvatarGap[AvatarSize.mini];
  private clientWidth = 0;
  private resizeEventSubscriber: Subscription;
  private intervalSubscriber: Subscription;
  public showMore = false;
  public avatarsToFit = 0;
  public icon: Icons = Icons.three_dots;
  public showMoreOptions: SelectGroupOption[];

  constructor(
    private utilsService: UtilsService,
    private host: ElementRef,
    private DOM: DOMhelpers
  ) {
  }

  ngOnInit(): void {
    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.clientWidth = this.getClientWidth();
        this.calcAvatarsToFit();
        this.subscribeToShuffleEmployees();
      });
    this.buildShowMoreOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarSize) {
      this.calcAvatars();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.calcAvatars());
  }

  private calcAvatars() {
      this.clientWidth = this.getClientWidth();
      this.setAvatarGap();
      this.setAvatarGapCss();
      this.calcAvatarsToFit();
      this.subscribeToShuffleEmployees();
  }

  ngOnDestroy(): void {
    invoke(this.resizeEventSubscriber, 'unsubscribe');
    invoke(this.intervalSubscriber, 'unsubscribe');
  }

  private buildShowMoreOptions() {
    this.showMoreOptions = [
      {
        groupName: '',
        options: map(this.employees, employee => ({
          value: employee.displayName,
          id: employee.id,
          selected: false,
          prefixComponent: {
            component: AvatarComponent,
            attributes: {
              imageSource: employee.imageSource,
            }
          }
        }))
      }
    ];
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

  onSelectChange(event) {
    this.selectChange.emit(event);
  }

  private subscribeToShuffleEmployees() {
    invoke(this.intervalSubscriber, 'unsubscribe');
    if (!this.showMore && (this.avatarsToFit < this.employees.length)) {
      this.intervalSubscriber = interval(SHUFFLE_EMPLOYEES_INTERVAL)
        .subscribe(() => this.shuffleEmployees());
    }
  }

  private shuffleEmployees() {
    const firstIndex = random(0, this.avatarsToFit > 1 ? this.avatarsToFit - 1 : 0);
    const secondIndex = random(this.avatarsToFit, this.employees.length > 1 ? this.employees.length - 1 : 0);
    this.switchEmployeesImage(firstIndex, secondIndex);
  }

  private switchEmployeesImage(firstIndex, secondIndex) {
    const firstEmployeeImage = this.employees[firstIndex].imageSource;
    this.employees[firstIndex].imageSource = this.employees[secondIndex].imageSource;
    this.employees[secondIndex].imageSource = firstEmployeeImage;
  }
}
