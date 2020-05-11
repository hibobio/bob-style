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
  @Input() min = 3;
  @Input() max = 15;
  @Input() total: number;

  @Input() doShuffle = false;
  @Input() showMoreIcon = true;
  @Input() readonly = false;

  @HostBinding('attr.data-clickable')
  @Input()
  expandOnClick = true;

  @HostBinding('attr.data-inverse-stack')
  @Input()
  inverseStack = false;

  @HostBinding('attr.data-fade-out')
  @Input()
  fadeOut = false;

  @HostBinding('attr.data-zoom-on-hover')
  @Input()
  zoomOnHover = false;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public employeeListOptions: SelectGroupOption[];
  public showcaseViewModel: Avatar[] = [];
  public avatarsToShow: Avatar[] = [];

  public avatarsLeft = 0;
  public showThreeDotsButton = false;

  readonly panelClass = 'ee-showcase-panel';
  readonly dotsIcon = {
    icon: Icons.three_dots,
    color: IconColor.dark,
  };

  private totalAvatars = 0;
  private avatarsToFit = 0;
  private clientWidth = 0;
  private resizeEventSubscriber: Subscription;
  private intervalSubscriber: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      min: 3,
      max: 15,
      employees: [],
      avatarSize: AvatarSize.mini,
    });

    if (hasChanges(changes, ['employees'], true)) {
      this.setViewModels();
    }

    if (notFirstChanges(changes)) {
      this.initShowcase();
    }
  }

  ngOnInit(): void {
    this.initShowcase();

    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        this.initShowcase();
      });

    if (!this.employeeListOptions) {
      this.setViewModels();
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initShowcase();
      }, 1000);
    });
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

    const maxFit = Math.floor(
      (this.clientWidth - this.avatarSize) /
        (this.avatarSize - AvatarGap[this.avatarSize]) +
        1
    );

    this.avatarsToFit = Math.min(
      30,
      this.max,
      Math.max(this.min, maxFit),
      this.totalAvatars
    );

    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-count': this.avatarsToFit,
      '--avatar-gap': '-' + AvatarGap[this.avatarSize] + 'px',
    });

    this.showThreeDotsButton =
      this.showMoreIcon &&
      !this.fadeOut &&
      this.avatarSize < AvatarSize.medium &&
      this.avatarsToFit < this.totalAvatars;

    if (!this.employeeListOptions) {
      this.setViewModels();
    }

    this.setAvatarsToShow();

    this.avatarsLeft = Math.max(
      Math.max(this.total || 0, this.totalAvatars) - this.avatarsToShow.length,
      0
    );

    if (
      this.doShuffle &&
      this.avatarSize >= AvatarSize.medium &&
      this.avatarsToFit < this.totalAvatars
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

  private setViewModels(): void {
    this.employeeListOptions = this.showcaseSrvc.getEmployeeListOptions(
      this.employees,
      false
    );
    this.showcaseViewModel = this.showcaseSrvc.getShowcaseViewModel(
      this.employeeListOptions
    );
    this.totalAvatars = this.showcaseViewModel.length;
  }

  private setAvatarsToShow(): void {
    this.avatarsToShow = this.showcaseViewModel.slice(
      0,
      !this.showThreeDotsButton ? this.avatarsToFit : this.avatarsToFit - 1
    );
  }

  private shuffleAvatars(): void {
    this.showcaseSrvc.shuffleShowcaseViewModel(
      this.showcaseViewModel,
      this.avatarsToFit,
      () => {
        this.setAvatarsToShow();

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
