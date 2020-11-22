import {
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
import { ShowcaseInputItem } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import { AvatarGap } from './employees-showcase.const';
import { Icons, IconColor } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SelectGroupOption } from '../../lists/list.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { insideZone } from '../../services/utils/rxjs.operators';
import {
  applyChanges,
  hasChanges,
} from '../../services/utils/functional-utils';
import { EmployeesShowcaseService } from './employees-showcase.service';
import { Avatar } from '../avatar/avatar.interface';
import { SingleSelectPanelComponent } from '../../lists/single-select-panel/single-select-panel.component';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { InputObservable } from '../../services/utils/decorators';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormElementSize } from '../../form-elements/form-elements.enum';

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
    private zone: NgZone
  ) {
    this.hostEl = this.host.nativeElement;
  }

  @ViewChild(SingleSelectPanelComponent)
  selectPanel: SingleSelectPanelComponent;

  @Input() employees: ShowcaseInputItem[] = [];

  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Input() min = 3;
  @Input() max = 10;

  @Input() showTotal = true;
  @Input() showTotalLabel = false;
  @Input() readonly = false;

  @Input() inverseStack = false;
  @Input() formElementSize: FormElementSize = FormElementSize.regular;

  @HostBinding('attr.data-clickable')
  @Input()
  expandOnClick = true;

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

  @InputObservable([])
  @Input('employees')
  employees$: Observable<ShowcaseInputItem[]>;

  public totalAvatars = 0;
  public showTotalButton = true;

  readonly panelClass = 'ee-showcase-panel';
  readonly dotsIcon = {
    icon: Icons.three_dots,
    color: IconColor.dark,
  };

  private avatarsToFit = 1;
  private hostEl: HTMLElement;
  private resizeObserverSub$: Subscription;

  public employeeList$: Observable<SelectGroupOption[]>;
  public avatars$: Observable<Avatar[]>;
  public avatarsSlice$: Observable<number>;
  private avatarsSliceUpdate$: BehaviorSubject<number> = new BehaviorSubject(1);

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        min: 3,
        max: 10,
        avatarSize: AvatarSize.mini,
      },
      [],
      true
    );

    if (
      hasChanges(changes, ['avatarSize'], true, {
        checkEquality: true,
      })
    ) {
      this.zone.runOutsideAngular(() => {
        this.DOM.mutate(() => {
          this.DOM.setCssProps(this.hostEl, {
            '--avatar-size': this.avatarSize + 'px',
            '--avatar-gap': '-' + AvatarGap[this.avatarSize] + 'px',
          });
        });
      });
    }

    if (
      hasChanges(changes, ['avatarSize', 'showTotal', 'fadeOut'], false, {
        checkEquality: true,
      })
    ) {
      this.showTotalButton =
        this.showTotal !== false &&
        !this.fadeOut &&
        this.avatarSize < AvatarSize.medium;
    }

    if (
      hasChanges(changes, ['min', 'max', 'avatarSize'], true, {
        checkEquality: true,
      })
    ) {
      if (this.max > 0 && this.min === this.max) {
        this.resizeObserverSub$?.unsubscribe();
        this.resizeObserverSub$ = undefined;

        this.avatarsSliceUpdate$.next(
          Math.min(this.min, this.totalAvatars || this.max)
        );
      }

      if (this.max > 0 && this.min !== this.max) {
        if (!this.resizeObserverSub$) {
          this.zone.runOutsideAngular(() => {
            this.resizeObserverSub$ = this.mutationObservableService
              .getResizeObservervable(this.hostEl, {
                watch: 'width',
                threshold: 15,
              })
              .pipe(
                debounceTime(200),
                map(() => this.calcAvatarsToFit()),
                distinctUntilChanged(),
                insideZone()
              )
              .subscribe(this.avatarsSliceUpdate$);
          });
        } else {
          this.avatarsSliceUpdate$.next(this.calcAvatarsToFit());
        }
      }
    }
  }

  ngOnInit(): void {
    //
    this.avatarsSlice$ = this.avatarsSliceUpdate$.pipe(
      distinctUntilChanged(),
      tap((avatarsToFit) => {
        this.avatarsToFit = avatarsToFit;

        this.zone.runOutsideAngular(() => {
          this.DOM.mutate(() => {
            this.DOM.setCssProps(this.hostEl, {
              '--avatar-count': this.avatarsToFit,
            });
          });
        });
      })
    );

    this.employeeList$ = this.employees$.pipe(
      this.showcaseSrvc.employeeListMapper
    );

    this.avatars$ = this.employees$.pipe(
      this.showcaseSrvc.avatarsMapper,

      tap((avatars) => {
        this.totalAvatars = avatars.length;

        if (this.totalAvatars < this.avatarsToFit) {
          this.avatarsSliceUpdate$.next(this.totalAvatars);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.resizeObserverSub$?.unsubscribe();
    this.avatarsSliceUpdate$.complete();
  }

  public avatarsTrackBy(index: number, item: Avatar): string {
    return (
      (item.id !== undefined && item.id) ||
      item.imageSource ||
      item.displayName ||
      item.title ||
      JSON.stringify(item)
    );
  }

  private calcAvatarsToFit(
    min: number = this.min,
    max: number = this.max,
    avatarSize: AvatarSize = this.avatarSize,
    totalAvatars: number = this.totalAvatars
  ): number {
    const clientWidth = this.DOM.getClosest(
      this.hostEl,
      this.DOM.getInnerWidth,
      'result'
    );

    const maxFit = Math.floor(
      (clientWidth - avatarSize) / (avatarSize - AvatarGap[avatarSize]) + 1
    );

    return Math.min(15, max, Math.max(min, maxFit), totalAvatars || 10);
  }
}
