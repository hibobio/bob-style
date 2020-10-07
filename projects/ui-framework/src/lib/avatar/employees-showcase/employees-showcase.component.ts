import {
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
  ViewChild,
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
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
import { SingleSelectPanelComponent } from '../../lists/single-select-panel/single-select-panel.component';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: ['./employees-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy {
  constructor(
    private showcaseSrvc: EmployeesShowcaseService,
    private mutationObservableService: MutationObservableService,
    private host: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.hostEl = this.host.nativeElement;
  }

  @ViewChild(SingleSelectPanelComponent)
  selectPanel: SingleSelectPanelComponent;

  @Input() employees: EmployeeShowcase[] | SelectGroupOption[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Input() min = 3;
  @Input() max = 10;

  @Input() doShuffle = false;
  @Input() showTotal = true;
  @Input() readonly = false;

  @HostBinding('attr.data-clickable')
  @Input()
  expandOnClick = true;

  @Input() inverseStack = false;

  @HostBinding('attr.data-stack-order') get stackOrder() {
    return this.inverseStack === true ? 'rtl' : 'ltr';
  }

  @HostBinding('attr.data-fade-out')
  @Input()
  fadeOut = false;

  @HostBinding('attr.data-zoom-on-hover')
  @Input()
  zoomOnHover = false;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  @Output() selectPanelOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectPanelClosed: EventEmitter<void> = new EventEmitter<void>();

  public employeeListOptions: SelectGroupOption[];
  public showcaseViewModel: Avatar[] = [];
  public avatarsToShow: Avatar[] = [];
  public totalAvatars = 0;
  public showTotalButton = false;

  readonly panelClass = 'ee-showcase-panel';
  readonly dotsIcon = {
    icon: Icons.three_dots,
    color: IconColor.dark,
  };

  private hostEl: HTMLElement;
  private avatarsToFit = 0;
  private clientWidth = 0;
  private intervalSubscriber: Subscription;
  private subs: Subscription[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      min: 3,
      max: 10,
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

    if (this.max > 0 && this.min !== this.max) {
      this.subs.push(
        this.mutationObservableService
          .getResizeObservervable(this.hostEl, {
            watch: 'width',
            threshold: 15,
          })
          .pipe(outsideZone(this.zone))
          .subscribe(() => {
            this.initShowcase();
          })
      );
    }

    if (!this.employeeListOptions) {
      this.setViewModels();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs.length = 0;
  }

  onSelectChange(listChange: ListChange): void {
    this.selectChange.emit(listChange);
  }

  public initShowcase(): void {
    if (this.max > 0 && this.min === this.max) {
      this.avatarsToFit = Math.min(this.max, this.totalAvatars);
    } else {
      this.clientWidth = this.DOM.getClosest(
        this.hostEl,
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
    }

    this.showTotalButton =
      this.showTotal !== false &&
      !this.fadeOut &&
      this.avatarSize < AvatarSize.medium &&
      this.totalAvatars > 1;
    // && this.avatarsToFit < this.totalAvatars;

    this.DOM.setCssProps(this.hostEl, {
      '--avatar-size': this.avatarSize + 'px',
      '--avatar-count': this.avatarsToFit,
      '--avatar-gap': '-' + AvatarGap[this.avatarSize] + 'px',
    });

    if (!this.employeeListOptions) {
      this.setViewModels();
    }

    this.setAvatarsToShow();

    if (
      this.doShuffle &&
      this.avatarSize >= AvatarSize.medium &&
      this.avatarsToFit < this.totalAvatars
    ) {
      if (!this.intervalSubscriber || this.intervalSubscriber.closed) {
        this.zone.runOutsideAngular(() => {
          this.subs.push(
            (this.intervalSubscriber = interval(
              SHUFFLE_EMPLOYEES_INTERVAL
            ).subscribe(() => this.shuffleAvatars()))
          );
        });
      }
    } else {
      this.intervalSubscriber?.unsubscribe();
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
      // !this.showTotalButton ? this.avatarsToFit : this.avatarsToFit - 1
      this.avatarsToFit
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
