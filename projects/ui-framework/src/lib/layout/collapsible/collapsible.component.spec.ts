/* tslint:disable:no-unused-variable */
import {
  ComponentFixture,
  async,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
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
    >
      <span suffix>suffix</span>
      <span class="test-content">content</span>
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
}

describe('CollapsibleComponent', () => {
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
      const panelContentElement = fixture.debugElement.query(
        By.css('.test-content')
      );
      expect(panelContentElement).toBeTruthy();
    });

    it(': clicking on panel title should expand the panel', () => {
      fixture.detectChanges();
      const collapsibleHeaderElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header')
      );
      expect(collapsibleHeaderElement.nativeElement.classList).not.toContain(
        'mat-expanded'
      );
      collapsibleHeaderElement.nativeElement.click();
      fixture.detectChanges();
      const panelContentElement = fixture.debugElement.query(
        By.css('.test-content')
      );
      expect(panelContentElement).toBeTruthy();
      expect(collapsibleHeaderElement.nativeElement.classList).toContain(
        'mat-expanded'
      );
    });

    it(': clicking on expanded panel title should collapse the panel', () => {
      component.expanded = true;
      fixture.detectChanges();
      const collapsibleHeaderElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header')
      );
      const panelContentElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-content')
      );
      expect(collapsibleHeaderElement.nativeElement.classList).toContain(
        'mat-expanded'
      );
      expect(panelContentElement.nativeElement.clientHeight).toBeGreaterThan(0);
      collapsibleHeaderElement.nativeElement.click();
      fixture.detectChanges();
      expect(collapsibleHeaderElement.nativeElement.classList).not.toContain(
        'mat-expanded'
      );
      expect(panelContentElement.nativeElement.clientHeight).toEqual(0);
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

    it(': type input should change class on host component', () => {
      component.type = CollapsibleType.big;
      fixture.detectChanges();
      const collapsibleHostElement = fixture.debugElement.query(
        By.css('b-collapsible')
      );
      // expect(fixture.nativeElement.classList).toContain('collapsible-big');
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

    it(': setting disabled input to true should disable the panel', () => {
      component.disabled = true;
      fixture.detectChanges();
      const panelHeaderElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header[aria-disabled="true"]')
      );
      const panelBodyElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-body')
      );

      expect(panelHeaderElement).toBeTruthy();
      expect(panelBodyElement.nativeElement.children.length).toEqual(0);
    });
  });
});
