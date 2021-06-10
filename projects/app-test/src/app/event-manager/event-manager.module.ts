import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  NgModule,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonsModule } from '../../../../ui-framework/src/lib/buttons/buttons.module';
// tslint:disable-next-line: max-line-length
import { ComponentRendererModule } from '../../../../ui-framework/src/lib/services/component-renderer/component-renderer.module';
import { EventManagerPlugins } from '../../../../ui-framework/src/lib/services/utils/eventManager.plugins';
import {
  simpleUID,
  stringify,
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mock-button',
  template: `
    <button
      *ngIf="outside && !ignoreMove"
      type="button"
      (click.outside-zone,keydown.outside-zone,focus.outside-zone,blur.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone,mousemove.outside-zone)="
        emit($event)
      "
    >
      click
    </button>

    <button
      *ngIf="!outside && !ignoreMove"
      type="button"
      (click,keydown,focus,blur,mouseenter,mouseleave,mousemove)="emit($event)"
    >
      click
    </button>

    <button
      *ngIf="outside && ignoreMove"
      class="outside-ignoreMove"
      type="button"
      (click.outside-zone,keydown.outside-zone,focus.outside-zone,blur.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone)="
        emit($event)
      "
    >
      click
    </button>

    <button
      *ngIf="!outside && ignoreMove"
      class="not-outside-ignoreMove"
      type="button"
      (click,keydown,focus,blur,mouseenter,mouseleave)="emit($event)"
    >
      click
    </button>

    <label
      ><input type="checkbox" [(ngModel)]="outside" /> bind events outside
      zone</label
    >
    <label
      ><input type="checkbox" [(ngModel)]="emitInside" /> emit inside
      zone</label
    >
    <label
      ><input type="checkbox" [(ngModel)]="ignoreMove" /> ignore
      mousemove</label
    >
    <label><input type="checkbox" [(ngModel)]="detect" /> detect changes</label>
    <label><input type="checkbox" [(ngModel)]="mark" /> mark for check</label>
    <span>{{ randID }}</span>
  `,
  styles: [
    'button {display: block; width: 100px; height: 50px; text-transform: uppercase; margin: 0 auto 15px;}',
    'label, span {display:block;}',
  ],
})
export class MockButtonComponent {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}
  outside = true;
  ignoreMove = true;
  detect = false;
  emitInside = false;
  mark = false;
  randID = simpleUID();

  @Output() clicked: EventEmitter<void> = new EventEmitter();
  @Output() keyed: EventEmitter<void> = new EventEmitter();
  @Output() focused: EventEmitter<void> = new EventEmitter();
  @Output() blurred: EventEmitter<void> = new EventEmitter();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter();

  emit($event) {
    let emitEvent = '';
    switch ($event.type) {
      case 'click':
        emitEvent = 'clicked';
        break;
      case 'keydown':
        emitEvent = 'keyed';
        break;
      case 'focus':
        emitEvent = 'focused';
        break;
      case 'blur':
        emitEvent = 'blurred';
        break;
      case 'mouseenter':
        emitEvent = 'mouseIn';
        break;
      case 'mouseleave':
        emitEvent = 'mouseOut';
        break;
      case 'mousemove':
        emitEvent = 'mouseMove';
        break;
      default:
        return false;
    }
    if (this.mark) {
      this.cd.markForCheck();
    }
    if (this.emitInside) {
      this.zone.run(() => {
        this[emitEvent].emit({
          type: $event.type,
          key: $event.key,
          clientX: $event.clientX,
        });
      });
    } else {
      this[emitEvent].emit($event);
    }

    this.randID = simpleUID();
    if (this.detect) {
      this.cd.detectChanges();
    }
    if (this.mark) {
      this.cd.markForCheck();
    }
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'click-forwarder-1',
  template: `
    <mock-button
      (clicked)="onClick($event)"
      (keyed)="onKeyDown($event)"
      (focused)="onFocus($event)"
      (blurred)="onBlur($event)"
      (mouseIn)="onMouseEnter($event)"
      (mouseOut)="onMouseLeave($event)"
      (mouseMove)="onMouseMove($event)"
      >click</mock-button
    >
  `,
  styles: [':host {display: block; margin: 20px auto;}'],
})
// tslint:disable-next-line: component-class-suffix
export class ClickForwarerComponent1 {
  @Output() clicked: EventEmitter<void> = new EventEmitter();
  @Output() keyed: EventEmitter<void> = new EventEmitter();
  @Output() focused: EventEmitter<void> = new EventEmitter();
  @Output() blurred: EventEmitter<void> = new EventEmitter();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter();

  onClick($event) {
    this.clicked.emit($event);
  }
  onKeyDown($event) {
    this.keyed.emit($event);
  }
  onFocus($event) {
    this.focused.emit($event);
  }
  onBlur($event) {
    this.blurred.emit($event);
  }
  onMouseEnter($event) {
    this.mouseIn.emit($event);
  }
  onMouseLeave($event) {
    this.mouseOut.emit($event);
  }
  onMouseMove($event) {
    this.mouseMove.emit($event);
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'click-forwarder-2',
  template: `
    <!-- <b-component-renderer [render]="renderButton"></b-component-renderer> -->

    <click-forwarder-1
      (clicked)="onClick($event)"
      (keyed)="onKeyDown($event)"
      (focused)="onFocus($event)"
      (blurred)="onBlur($event)"
      (mouseIn)="onMouseEnter($event)"
      (mouseOut)="onMouseLeave($event)"
      (mouseMove)="onMouseMove($event)"
    >
    </click-forwarder-1>
  `,
  styles: [':host {display: block; margin: 20px auto;}'],
})
// tslint:disable-next-line: component-class-suffix
export class ClickForwarerComponent2 {
  @Output() clicked: EventEmitter<void> = new EventEmitter();
  @Output() keyed: EventEmitter<void> = new EventEmitter();
  @Output() focused: EventEmitter<void> = new EventEmitter();
  @Output() blurred: EventEmitter<void> = new EventEmitter();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter();

  renderButton = {
    component: ClickForwarerComponent1,

    handlers: {
      clicked: ($event) => {
        this.onClick($event);
      },
      keyed: ($event) => {
        this.onKeyDown($event);
      },
      focused: ($event) => {
        this.onFocus($event);
      },
      blurred: ($event) => {
        this.onBlur($event);
      },
      mouseIn: ($event) => {
        this.onMouseEnter($event);
      },
      mouseOut: ($event) => {
        this.onMouseLeave($event);
      },
      mouseMove: ($event) => {
        this.onMouseMove($event);
      },
    },
  };

  onClick($event) {
    this.clicked.emit($event);
  }
  onKeyDown($event) {
    this.keyed.emit($event);
  }
  onFocus($event) {
    this.focused.emit($event);
  }
  onBlur($event) {
    this.blurred.emit($event);
  }
  onMouseEnter($event) {
    this.mouseIn.emit($event);
  }
  onMouseLeave($event) {
    this.mouseOut.emit($event);
  }
  onMouseMove($event) {
    this.mouseMove.emit($event);
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'event-manager-tester',
  template: `
    <div
      style="width:400px; display: flex; flex-direction: column;
       align-items: center; margin: 40px auto 0; text-align: center;"
    >
      <click-forwarder-2
        *ngIf="show"
        (clicked)="onClick($event)"
        (keyed)="onKeyDown($event)"
        (focused)="onFocus($event)"
        (blurred)="onBlur($event)"
        (mouseIn)="onMouseEnter($event)"
        (mouseOut)="onMouseLeave($event)"
        (mouseMove)="onMouseMove($event)"
      >
      </click-forwarder-2>

      <div
        #logger
        style="text-align:left; width: 200px; border: 1px solid black; padding: 15px;"
      >
        <span style="white-space:pre;">{{ loggerOutput }}</span>
      </div>
      <span>{{ randID }}</span>
      <label><input type="checkbox" [(ngModel)]="show" /> show component</label>
      <label
        ><input type="checkbox" [(ngModel)]="detect" /> detect changes</label
      >
      <label
        ><input type="checkbox" [(ngModel)]="listenInside" /> listen inside
        zone</label
      >
    </div>
  `,
  styles: [':host {display: block; margin: 20px auto;}'],
})
export class EventManagerTesterComponent {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}

  @ViewChild('logger') private loggerDiv: ElementRef;

  show = true;
  randID = simpleUID();
  detect = false;
  listenInside = false;

  counter = {
    click: 0,
    keydown: 0,
    focus: 0,
    blur: 0,
    mouseenter: 0,
    mouseleave: 0,
    mousemove: 0,
  };

  loggerOutput = '';

  @HostListener(
    'click.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone',
    ['$event']
  )
  onHostEvent($event) {
    this.log($event.type, 'host');
  }
  @HostListener('window:keydown.outside-zone,window:click.outside-zone', [
    '$event',
  ])
  onWindowEvent($event) {
    this.log($event.type, 'window', $event.key || $event.clientX);
  }

  onClick($event) {
    this.log($event.type, 'button');
  }
  onKeyDown($event) {
    this.log($event.type, 'button', $event.key);
  }
  onFocus($event) {
    this.log($event.type, 'button');
  }
  onBlur($event) {
    this.log($event.type, 'button');
  }
  onMouseEnter($event) {
    this.log($event.type, 'button');
  }
  onMouseLeave($event) {
    this.log($event.type, 'button');
  }
  onMouseMove($event) {
    this.log($event.type, 'button');
  }
  log(...event) {
    ++this.counter[event[0]];
    console.log(event.join(' '), this.counter[event[0]]);

    if (this.listenInside) {
      this.zone.run(() => {
        this.loggerOutput = stringify(this.counter)
          .replace(/"|{|}/g, '')
          .replace(/:/g, ': ')
          .replace(/,/g, '\n');

        this.randID = simpleUID();
      });
    } else {
      this.loggerOutput = stringify(this.counter)
        .replace(/"|{|}/g, '')
        .replace(/:/g, ': ')
        .replace(/,/g, '\n');

      this.randID = simpleUID();
    }

    if (this.detect) {
      this.cd.detectChanges();
    }
  }
}

@NgModule({
  declarations: [
    MockButtonComponent,
    ClickForwarerComponent1,
    ClickForwarerComponent2,
    EventManagerTesterComponent,
  ],
  exports: [
    MockButtonComponent,
    ClickForwarerComponent1,
    ClickForwarerComponent2,
    EventManagerTesterComponent,
  ],
  imports: [BrowserModule, ComponentRendererModule, ButtonsModule, FormsModule],
  providers: [...EventManagerPlugins],
  entryComponents: [MockButtonComponent, ClickForwarerComponent1],
})
export class EventManagerModule {}
