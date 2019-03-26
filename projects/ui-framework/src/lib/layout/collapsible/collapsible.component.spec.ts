/* tslint:disable:no-unused-variable */
import {
  ComponentFixture,
  async,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA,
  Component,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { CollapsibleComponent } from './collapsible.component';
import { CollapsibleType } from './collapsible.enum';

import { TypographyModule } from '../../typography/typography.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'test',
  template: `
    <b-collapsible
      [@.disabled]="true"
      [type]="type"
      [expanded]="expanded"
      [disabled]="disabled"
      [title]="title"
      [description]="description"
      (closed)="onPanelClosed($event)"
      (opened)="onPanelOpened($event)"
    >
      <span suffix>suffix</span>
      <span class="test-content" style="height: 300px;">content</span>
    </b-collapsible>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
  @Input() type: CollapsibleType = CollapsibleType.small;
  @Input() expanded = false;
  @Input() disabled = false;
  @Input() title: string;
  @Input() description?: string;
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  onPanelOpened($event) {
    this.opened.emit($event);
  }
  onPanelClosed($event) {
    this.closed.emit($event);
  }
}

fdescribe('CollapsibleComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CollapsibleComponent],
      imports: [MatExpansionModule, BrowserAnimationsModule, TypographyModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        spyOn(component.opened, 'emit');
        spyOn(component.closed, 'emit');
      });
  }));

  describe('component', () => {
    it(': should start with no content (content lazy loaded on first panel open)', () => {
      fixture.detectChanges();
      const panelBodyElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-body')
      );
      expect(panelBodyElement.nativeElement.children.length).toEqual(0);
    });

    it(': if the panel is expanded, we should see content (this tests both the expanded input and the lazy content init mechanism)', () => {
      component.expanded = true;
      fixture.detectChanges();
      const contentElement = fixture.debugElement.query(
        By.css('.test-content')
      );
      expect(contentElement).toBeTruthy();
    });

    it(': clicking on panel title should expand the panel', () => {
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header')
      );
      expect(headerElement.nativeElement.classList).not.toContain(
        'mat-expanded'
      );
      headerElement.nativeElement.click();
      fixture.detectChanges();
      const contentElement = fixture.debugElement.query(
        By.css('.test-content')
      );
      expect(contentElement).toBeTruthy();
      expect(headerElement.nativeElement.classList).toContain('mat-expanded');
    });

    it(': clicking on expanded panel title should collapse the panel', () => {
      component.expanded = true;
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header')
      );
      const contentElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-content')
      );
      expect(headerElement.nativeElement.classList).toContain('mat-expanded');
      expect(contentElement.nativeElement.clientHeight).toBeGreaterThan(0);
      headerElement.nativeElement.click();
      fixture.detectChanges();
      expect(headerElement.nativeElement.classList).not.toContain(
        'mat-expanded'
      );
      expect(contentElement.nativeElement.clientHeight).toEqual(0);
    });

    it(': element with attribute [suffix] should be transcluded in the header', () => {
      fixture.detectChanges();
      const suffixElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-header .collapsible-suffix [suffix]')
      );
      expect(suffixElement).toBeTruthy();
    });

    it(': type=small input should display title input in b-subheading element', () => {
      component.title = 'hello';
      component.type = CollapsibleType.small;
      fixture.detectChanges();
      const bSubheadingElement = fixture.debugElement.query(
        By.css('b-subheading')
      );
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bDisplay3Element).toBeFalsy();
      expect(
        bSubheadingElement.nativeElement.innerText.toLowerCase().trim()
      ).toEqual('hello');
    });

    it(': type=big input should display title input in b-display-3 element', () => {
      component.title = 'hello';
      component.type = CollapsibleType.big;
      fixture.detectChanges();
      const bSubheadingElement = fixture.debugElement.query(
        By.css('b-subheading')
      );
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bSubheadingElement).toBeFalsy();
      expect(
        bDisplay3Element.nativeElement.innerText.toLowerCase().trim()
      ).toEqual('hello');
    });

    it(': type input should change class on host component and default to collapsible-small', () => {
      fixture.detectChanges();
      const collapsibleHostElement = fixture.debugElement.query(
        By.css('b-collapsible')
      );
      expect(collapsibleHostElement.nativeElement.classList).toContain(
        'collapsible-small'
      );
      expect(collapsibleHostElement.nativeElement.classList).not.toContain(
        'collapsible-big'
      );
      component.type = CollapsibleType.big;
      fixture.detectChanges();
      expect(collapsibleHostElement.nativeElement.classList).not.toContain(
        'collapsible-small'
      );
      expect(collapsibleHostElement.nativeElement.classList).toContain(
        'collapsible-big'
      );
    });

    it(': description input should be displayed in .collapsible-description element', () => {
      component.description = 'hello';
      fixture.detectChanges();
      const descriptionElement = fixture.debugElement.query(
        By.css('.collapsible-description')
      );
      expect(descriptionElement.nativeElement.innerText.trim()).toEqual(
        'hello'
      );
    });

    it(': when pannel is collapsed, description and suffix should only be displayed on header hover', () => {
      component.description = 'hello';
      fixture.detectChanges();
      const descriptionElement = fixture.debugElement.query(
        By.css('.collapsible-description')
      );
      const suffixElement = fixture.debugElement.query(
        By.css('.collapsible-suffix')
      );
      expect(
        getComputedStyle(descriptionElement.nativeElement).display
      ).toEqual('none');
      expect(getComputedStyle(suffixElement.nativeElement).display).toEqual(
        'none'
      );
    });

    it(': when pannel is expanded, description and suffix should always show', () => {
      component.expanded = true;
      component.description = 'hello';
      fixture.detectChanges();
      const descriptionElement = fixture.debugElement.query(
        By.css('.collapsible-description')
      );
      const suffixElement = fixture.debugElement.query(
        By.css('.collapsible-suffix')
      );
      expect(
        getComputedStyle(descriptionElement.nativeElement).display
      ).not.toEqual('none');
      expect(getComputedStyle(suffixElement.nativeElement).display).not.toEqual(
        'none'
      );
    });

    it(': setting disabled input to true should disable the panel', () => {
      component.disabled = true;
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header[aria-disabled="true"]')
      );
      const panelBodyElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-body')
      );
      expect(headerElement).toBeTruthy();
      expect(panelBodyElement.nativeElement.children.length).toEqual(0);
    });

    it('should emit opened event, when panel is expanded', () => {
      component.expanded = true;
      fixture.detectChanges();
      expect(component.opened.emit).toHaveBeenCalled();
    });

    fit('should emit closed event, when panel is collapsed', () => {
      component.expanded = true;
      fixture.detectChanges();
      
      expect(component.closed.emit).toHaveBeenCalled();
    });

  });
});
