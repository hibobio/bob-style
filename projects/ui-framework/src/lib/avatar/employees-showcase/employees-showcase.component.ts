import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import { UtilsService } from '../../services/utils/utils.service';
import {
  AvatarGap,
  SHUFFLE_EMPLOYEES_INTERVAL,
} from './employees-showcase.const';
import { Icons, IconColor } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { interval, Subscription } from 'rxjs';
import { SelectGroupOption } from '../../lists/list.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { outsideZone } from '../../services/utils/rxjs.operators';
import {
  applyChanges,
  notFirstChanges,
  hasChanges,
} from '../../services/utils/functional-utils';
import { EmployeesShowcaseService } from './employees-showcase.service';
import { Avatar } from '../avatar/avatar.interface';

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: ['./employees-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  constructor(
    private showcaseSrvc: EmployeesShowcaseService,
    private utilsService: UtilsService,
    private host: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @Input() employees: EmployeeShowcase[] | SelectGroupOption[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;

  @Input() doShuffle = true;

  @HostBinding('attr.data-clickable')
  @Input()
  expandOnClick = true;

  @HostBinding('attr.data-inverse-stack')
  @Input()
  inverseStack = false;

  @HostBinding('attr.data-fade-out')
  @Input()
  fadeOut = false;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public employeeListOptions: SelectGroupOption[];
  public showcaseViewModel: Avatar[] = [];

  public avatarsLeft = 0;
  public showThreeDotsButton = false;

  readonly panelClass = 'ee-showcase-panel';
  readonly dotsIcon = {
    icon: Icons.three_dots,
    color: IconColor.dark,
  };

  private avatarsToFit = 0;
  private clientWidth = 0;
  private resizeEventSubscriber: Subscription;
  private intervalSubscriber: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);

    applyChanges(this, changes, {
      employees: [],
      avatarSize: AvatarSize.mini,
    });

    if (hasChanges(changes, ['employees'], true)) {
      this.employeeListOptions = this.showcaseSrvc.getEmployeeListOptions(
        this.employees
      );
    }

    if (notFirstChanges(changes)) {
      this.initShowcase();
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.initShowcase();

    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        console.log('getResizeEvent');
        this.initShowcase();
      });

    if (!this.employeeListOptions) {
      this.employeeListOptions = this.showcaseSrvc.getEmployeeListOptions(
        this.employees
      );
    }
  }

  ngAfterViewInit(): void {
    // this.zone.runOutsideAngular(() => {
    // setTimeout(() => {
    //   console.log('ngAfterViewInit');
    //   this.initShowcase();
    // }, 1000);
    // });
  }

  ngOnDestroy(): void {
    if (this.resizeEventSubscriber) {
      this.resizeEventSubscriber.unsubscribe();
      this.resizeEventSubscriber = null;
    }
    if (this.intervalSubscriber) {
      this.intervalSubscriber.unsubscribe();
      this.intervalSubscriber = null;
    }
  }

  onSelectChange(listChange: ListChange): void {
    this.selectChange.emit(listChange);
  }

  public initShowcase(): void {
    this.clientWidth = this.DOM.getClosest(
      this.host.nativeElement,
      this.DOM.getInnerWidth,
      'result'
    );

    this.avatarsToFit = Math.floor(
      (this.clientWidth - this.avatarSize) /
        (this.avatarSize - AvatarGap[this.avatarSize]) +
        1
    );

    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-count': this.avatarsToFit,
      '--avatar-gap': '-' + AvatarGap[this.avatarSize] + 'px',
    });

    this.showThreeDotsButton =
      this.avatarSize < AvatarSize.medium &&
      this.avatarsToFit < this.employeeListOptions[0].options.length;

    this.showcaseViewModel = this.getShowcaseViewModel();

    this.avatarsLeft = Math.max(
      this.employeeListOptions[0].options.length -
        this.showcaseViewModel.length,
      0
    );

    console.log(
      'initShowcase',
      this.clientWidth,
      this.avatarSize,
      AvatarGap[this.avatarSize],
      this.avatarsToFit
    );

    if (
      this.doShuffle &&
      this.avatarSize >= AvatarSize.medium &&
      this.avatarsToFit < this.employeeListOptions[0].options.length
    ) {
      if (!this.intervalSubscriber) {
        this.zone.runOutsideAngular(() => {
          this.intervalSubscriber = interval(
            SHUFFLE_EMPLOYEES_INTERVAL
          ).subscribe(() => this.shuffleAvatars());
        });
      }
    } else {
      if (this.intervalSubscriber) {
        this.intervalSubscriber.unsubscribe();
        this.intervalSubscriber = null;
      }
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getShowcaseViewModel(): Avatar[] {
    return this.showcaseSrvc.getShowcaseViewModel(
      this.employeeListOptions,
      !this.showThreeDotsButton ? this.avatarsToFit : this.avatarsToFit - 1
    );
  }

  private shuffleAvatars(): void {
    this.showcaseSrvc.shuffleEmployeeListOptions(
      this.employeeListOptions,
      this.avatarsToFit,
      () => {
        this.showcaseViewModel = this.getShowcaseViewModel();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }
    );
  }

  public trackBy(index: number, item: EmployeeShowcase): string {
    return (
      (item.id !== undefined && item.id) ||
      item.displayName ||
      JSON.stringify(item)
    );
  }
}
