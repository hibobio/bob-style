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
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import { UtilsService } from '../../services/utils/utils.service';
import {
  AvatarGap,
  SHUFFLE_EMPLOYEES_INTERVAL,
} from './employees-showcase.const';
import { Icons } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { interval, Subscription } from 'rxjs';
import { SelectGroupOption } from '../../lists/list.interface';
import { AvatarComponent } from '../avatar/avatar.component';
import { ListChange } from '../../lists/list-change/list-change';
import { outsideZone } from '../../services/utils/rxjs.operators';
import {
  applyChanges,
  notFirstChanges,
  cloneObject,
  randomNumber,
  simpleUID,
  hasChanges,
} from '../../services/utils/functional-utils';

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: ['./employees-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesShowcaseComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() employees: EmployeeShowcase[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Input() expandOnClick = true;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public panelListOptions: SelectGroupOption[];
  public avatarsToFit = 0;
  public avatarsToShow: EmployeeShowcase[] = [];
  public showThreeDotsButton = false;

  readonly icon = Icons;
  readonly panelClass = 'ee-showcase-panel';

  private clientWidth = 0;
  private resizeEventSubscriber: Subscription;
  private intervalSubscriber: Subscription;

  constructor(
    private utilsService: UtilsService,
    private host: ElementRef,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);

    applyChanges(this, changes, {
      employees: [],
    });

    if (hasChanges(changes, ['avatarSize'], true)) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--avatar-gap': '-' + AvatarGap[this.avatarSize] + 'px',
      });
    }

    if (hasChanges(changes, ['employees'], true)) {
      this.panelListOptions = this.getPanelListOptions();
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

    if (!this.panelListOptions) {
      this.panelListOptions = this.getPanelListOptions();
    }
  }

  ngAfterViewInit(): void {
    // this.zone.runOutsideAngular(() => {
    setTimeout(() => {
      console.log('ngAfterViewInit');
      this.initShowcase();
    }, 1000);
    // });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.resizeEventSubscriber) {
      this.resizeEventSubscriber.unsubscribe();
      this.resizeEventSubscriber = null;
    }
    if (this.intervalSubscriber) {
      this.intervalSubscriber.unsubscribe();
      this.intervalSubscriber = null;
    }
  }

  trackBy(index: number, item: EmployeeShowcase): string {
    return (
      (item.id !== undefined && item.id) ||
      item.displayName ||
      JSON.stringify(item)
    );
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
    });

    this.showThreeDotsButton =
      this.avatarSize < AvatarSize.medium &&
      this.avatarsToFit < this.employees.length;

    this.avatarsToShow = this.getAvatarsToShow();

    console.log(
      'initShowcase',
      this.clientWidth,
      this.avatarSize,
      AvatarGap[this.avatarSize],
      this.avatarsToFit
    );

    if (
      this.avatarSize >= AvatarSize.medium &&
      this.avatarsToFit < this.employees.length
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

  private getAvatarsToShow(): EmployeeShowcase[] {
    // console.log('getAvatarsToShow', this.avatarsToFit);
    return this.employees.slice(
      0,
      !this.showThreeDotsButton ? this.avatarsToFit : this.avatarsToFit - 1
    );
  }

  private getPanelListOptions(): SelectGroupOption[] {
    return [
      {
        groupName: simpleUID(),
        options: this.employees.map((employee: EmployeeShowcase) => ({
          value: employee.displayName,
          id: employee.id,
          selected: false,
          prefixComponent: {
            component: AvatarComponent,
            attributes: {
              imageSource: employee.imageSource,
            },
          },
        })),
      },
    ];
  }

  private shuffleAvatars(): void {
    const firstIndex = randomNumber(
      0,
      this.avatarsToFit > 1 ? this.avatarsToFit - 1 : 0
    );
    const secondIndex = randomNumber(
      this.avatarsToFit,
      this.employees.length > 1 ? this.employees.length - 1 : 0
    );

    if (firstIndex !== secondIndex) {
      const firstEmployee = cloneObject(this.employees[firstIndex]);
      this.employees[firstIndex] = this.employees[secondIndex];
      this.employees[secondIndex] = firstEmployee;
      this.avatarsToShow = this.getAvatarsToShow();
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
