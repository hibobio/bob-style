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
import { ShowcaseInputItem } from './avatar-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import {
  AvatarGap,
  AVATAR_SHOWCASE_SHUFFLE_INTERVAL,
} from './avatar-showcase.const';
import { Icons, IconColor } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { SelectGroupOption } from '../../lists/list.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { insideZone, timedSlice } from '../../services/utils/rxjs.operators';
import {
  applyChanges,
  hasChanges,
} from '../../services/utils/functional-utils';
import { AvatarShowcaseService } from './avatar-showcase.service';
import { Avatar } from '../avatar/avatar.interface';
import { SingleSelectPanelComponent } from '../../lists/single-select-panel/single-select-panel.component';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { InputObservable } from '../../services/utils/decorators';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { FormElementSize } from '../../form-elements/form-elements.enum';

@Component({
  selector: 'b-employees-showcase, b-avatar-showcase',
  templateUrl: './avatar-showcase.component.html',
  styleUrls: ['./avatar-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AvatarShowcaseService],
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy {
  constructor(
    private showcaseSrvc: AvatarShowcaseService,
    private mutationObservableService: MutationObservableService,
    private host: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone
  ) {
    this.hostEl = this.host.nativeElement;
  }

  @ViewChild(SingleSelectPanelComponent)
  selectPanel: SingleSelectPanelComponent;

  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Input() min = 3;
  @Input() max = 10;

  @Input() showTotal = true;
  @Input() showTotalLabel = false;
  @Input() readonly = false;
  @Input() hasBackdrop: boolean;
  @Input() doShuffle = false;

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

  public get avatarsToFit(): number {
    return this.avatarsSlice$?.getValue() || 1;
  }

  readonly panelClass = 'ee-showcase-panel';
  readonly dotsIcon = {
    icon: Icons.three_dots,
    color: IconColor.dark,
  };

  private hostEl: HTMLElement;
  private resizeObserverSub$: Subscription;

  public employeeList$: Observable<SelectGroupOption[]>;
  public avatars$: Observable<Avatar[]>;
  private avatarsSlice$: BehaviorSubject<number> = new BehaviorSubject(1);

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

        this.avatarsSlice$.next(
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
              .subscribe(this.avatarsSlice$);
          });
        } else {
          this.avatarsSlice$.next(this.calcAvatarsToFit());
        }
      }
    }

    if (
      hasChanges(changes, ['doShuffle'], true, {
        truthyCheck: (v) => v !== undefined,
        checkEquality: true,
      })
    ) {
      const currentSlice = this.avatarsSlice$.getValue();
      this.avatarsSlice$.next(1);
      this.avatarsSlice$.next(currentSlice);
    }
  }

  ngOnInit(): void {
    //
    this.employeeList$ = this.employees$.pipe(
      this.showcaseSrvc.employeeListMapper
    );

    const avatarsSlice$ = this.avatarsSlice$.pipe(
      distinctUntilChanged(),
      debounceTime(10),
      tap((avatarsToFit) => {
        this.zone.runOutsideAngular(() => {
          this.DOM.mutate(() => {
            this.DOM.setCssProps(this.hostEl, {
              '--avatar-count': avatarsToFit || 1,
            });
          });
        });
      })
    );

    const avatars$ = this.employees$.pipe(
      this.showcaseSrvc.avatarsMapper,
      tap((avatars) => {
        this.totalAvatars = avatars.length;
        if (this.totalAvatars < this.avatarsToFit) {
          this.avatarsSlice$.next(this.totalAvatars);
        }
      })
    );

    this.avatars$ = combineLatest([avatars$, avatarsSlice$]).pipe(
      switchMap(([avatars, avatarsSlice]) => {
        return of(avatars).pipe(
          timedSlice({
            slice: avatarsSlice,
            shuffle: 'auto',
            ...(avatars.length > avatarsSlice &&
              this.doShuffle && {
                time: AVATAR_SHOWCASE_SHUFFLE_INTERVAL,
                loop: true,
              }),
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.resizeObserverSub$?.unsubscribe();
    this.avatarsSlice$.complete();
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
