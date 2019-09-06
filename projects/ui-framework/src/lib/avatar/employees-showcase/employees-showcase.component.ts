import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges,
  OnDestroy, OnInit, Output, SimpleChanges, NgZone, ChangeDetectorRef, ViewContainerRef,
} from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import { UtilsService } from '../../services/utils/utils.service';
import { AvatarGap } from './employees-showcase.const';
import { Icons } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { interval, Subscription } from 'rxjs';
import { invoke, random, assign, cloneDeep, floor } from 'lodash';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { AvatarComponent } from '../avatar/avatar.component';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../../form-elements/lists/select-panel-element.abstract';

const SHUFFLE_EMPLOYEES_INTERVAL = 3000;

@Component({
  selector: 'b-employees-showcase',
  templateUrl: './employees-showcase.component.html',
  styleUrls: [
    './employees-showcase.component.scss',
    '../../form-elements/lists/list-panel.scss',
  ],
})
export class EmployeesShowcaseComponent extends BaseSelectPanelElement
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() employees: EmployeeShowcase[] = [];
  @Input() avatarSize: AvatarSize = AvatarSize.mini;
  @Input() expandOnClick = true;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

  panelListOptions: SelectGroupOption[];
  avatarsToFit = 0;
  showThreeDotsButton = false;
  panelClassList: string[] = ['b-select-panel-with-arrow'];

  readonly icon = Icons;

  private shuffleEmployeesMode: boolean;
  private avatarGap: number = AvatarGap[AvatarSize.mini];
  private clientWidth = 0;
  private resizeEventSubscriber: Subscription;
  private intervalSubscriber: Subscription;
  private openPanelRef = this.openPanel;

  constructor(
    private utilsService: UtilsService,
    private host: ElementRef,
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
  ) {
    super(overlay, viewContainerRef, panelPositionService, DOM, zone, cd);
  }

  ngOnInit(): void {
    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        this.initShowcase();
        this.cd.detectChanges();
      });

    this.panelListOptions = this.getPanelListOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarSize) {
      this.avatarSize = changes.avatarSize.currentValue;
      this.initShowcase();
    }
    /*
    overrides the open panel method to disable default open list on click option
    */
    this.openPanel = this.expandOnClick
      ? this.openPanelRef
      : () => null;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initShowcase());
  }

  ngOnDestroy(): void {
    invoke(this.resizeEventSubscriber, 'unsubscribe');
    invoke(this.intervalSubscriber, 'unsubscribe');
    this.destroyPanel();
  }

  onSelectChange(listChange: ListChange): void {
    this.selectChange.emit(listChange);
    this.destroyPanel();
  }

  onAvatarClick(id: string) {
    this.clicked.emit(id);
  }

  private initShowcase() {
    this.clientWidth = this.getClientWidth();
    this.avatarGap = this.getAvatarGap();
    this.setAvatarGapCss();
    this.avatarsToFit = this.getAvatarsToFit(this.clientWidth, this.avatarGap);
    this.shuffleEmployeesMode = this.avatarSize > AvatarSize.medium;
    this.showThreeDotsButton = this.shouldShowThreeDotsButton();
    this.subscribeToShuffleEmployees();
  }

  private shouldShowThreeDotsButton(): boolean {
    return !this.shuffleEmployeesMode && this.avatarsToFit < this.employees.length;
  }

  private getPanelListOptions(): SelectGroupOption[] {
    return [
      {
        groupName: '',
        options: this.employees.map(employee => ({
          value: employee.displayName,
          id: employee.id,
          selected: false,
          prefixComponent: {
            component: AvatarComponent,
            attributes: {
              imageSource: employee.imageSource
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
  private getAvatarsToFit(clientWidth: number, avatarGap: number): number {
    return floor(
      (clientWidth - this.avatarSize) /
      (this.avatarSize - avatarGap) +
      1
    );
  }

  private getAvatarGap(): number {
    return AvatarGap[this.avatarSize];
  }

  private setAvatarGapCss() {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-gap': '-' + this.avatarGap + 'px'
    });
  }

  private subscribeToShuffleEmployees() {
    invoke(this.intervalSubscriber, 'unsubscribe');
    if (this.shuffleEmployeesMode && this.avatarsToFit < this.employees.length) {
      this.intervalSubscriber = interval(SHUFFLE_EMPLOYEES_INTERVAL)
        .subscribe(() => this.shuffleEmployees());
    }
  }

  private shuffleEmployees() {
    const firstIndex = random(
      0,
      this.avatarsToFit > 1 ? this.avatarsToFit - 1 : 0
    );
    const secondIndex = random(
      this.avatarsToFit,
      this.employees.length > 1 ? this.employees.length - 1 : 0
    );
    this.switchEmployeesImage(firstIndex, secondIndex);
    this.cd.detectChanges();
  }

  private switchEmployeesImage(firstIndex, secondIndex) {
    const firstEmployee = cloneDeep(this.employees[firstIndex]);
    assign(this.employees[firstIndex], this.employees[secondIndex]);
    this.employees[secondIndex] = firstEmployee;
  }
}
