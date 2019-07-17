import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { CollapsibleComponent } from './collapsible.component';
import { CollapsibleType } from './collapsible.enum';

import { TypographyModule } from '../../typography/typography.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { OutsideZonePlugin } from '../../services/utils/eventManager.plugins';

@Component({
  template: `
    <b-collapsible [@.disabled]="true">
      <span suffix>suffix</span>
      <span class="test-content" style="height: 300px;">content</span>
    </b-collapsible>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
}

describe('CollapsibleComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let collapsibleComponent: CollapsibleComponent;
  let collapsibleNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CollapsibleComponent],
      imports: [MatExpansionModule, BrowserAnimationsModule, TypographyModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DOMhelpers,
        {
          multi: true,
          provide: EVENT_MANAGER_PLUGINS,
          useClass: OutsideZonePlugin
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        collapsibleComponent = fixture.debugElement.query(
          By.css('b-collapsible')
        ).componentInstance;
        collapsibleNativeElement = fixture.debugElement.query(
          By.css('b-collapsible')
        ).nativeElement;

        spyOn(collapsibleComponent.opened, 'emit');
        spyOn(collapsibleComponent.closed, 'emit');
      });
  }));

  describe('Lazy content init', () => {
    it('should start with no content (content lazy loaded on first panel open)', () => {
      const panelBodyElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-body')
      );
      expect(panelBodyElement.nativeElement.children.length).toEqual(0);
    });

    it('should add content when panel is expanded the first time', () => {
      collapsibleComponent.expanded = true;
      fixture.detectChanges();
      const contentElement = fixture.debugElement.query(
        By.css('.test-content')
      );
      expect(contentElement).toBeTruthy();
    });
  });

  describe('Expand / Collapse', () => {
    it('should expand panel when title is clicked', () => {
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

    it('should collapse panel when title is clicked', () => {
      collapsibleComponent.expanded = true;
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
  });

  describe('Type', () => {
    it('should display title text in b-subheading element when type=small', () => {
      collapsibleComponent.title = 'hello';
      collapsibleComponent.type = CollapsibleType.small;
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

    it('should display title text in b-display-3 element when type=big', () => {
      collapsibleComponent.title = 'hello';
      collapsibleComponent.type = CollapsibleType.big;
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

    it('should change class on component host according to type input and default to .collapsible-small', () => {
      expect(collapsibleNativeElement.classList).toContain('collapsible-small');
      expect(collapsibleNativeElement.classList).not.toContain(
        'collapsible-big'
      );
      collapsibleComponent.type = CollapsibleType.big;
      fixture.detectChanges();
      expect(collapsibleNativeElement.classList).not.toContain(
        'collapsible-small'
      );
      expect(collapsibleNativeElement.classList).toContain('collapsible-big');
    });
  });

  describe('Description and Suffix in header', () => {
    it('should put transcluded element with attribute [suffix] in the header', () => {
      const suffixElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-header .collapsible-suffix [suffix]')
      );
      expect(suffixElement).toBeTruthy();
    });

    it('should display description text in .collapsible-description element', () => {
      collapsibleComponent.description = 'hello';
      fixture.detectChanges();
      const descriptionElement = fixture.debugElement.query(
        By.css('.collapsible-description')
      );
      expect(descriptionElement.nativeElement.innerText.trim()).toEqual(
        'hello'
      );
    });

    it('should display description and suffix only on header hover if panel is collapsed', () => {
      collapsibleComponent.description = 'hello';
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

    it('should always display description and suffix if pannel is expanded', () => {
      collapsibleComponent.expanded = true;
      collapsibleComponent.description = 'hello';
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

    it('should not trigger panel expansion on clicks originating from suffix', () => {
      const suffixElement = fixture.debugElement.query(
        By.css('.collapsible-suffix')
      ).nativeElement;
      suffixElement.click();
      fixture.detectChanges();
      expect(collapsibleComponent.opened.emit).not.toHaveBeenCalled();
    });
  });

  describe('Disabled input', () => {
    it('should disable the panel and collapse the panel if disabled=true (but not to remove content that was already initialised)', () => {
      collapsibleComponent.expanded = true;
      fixture.detectChanges();
      collapsibleComponent.disabled = true;
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(
        By.css('mat-expansion-panel-header[aria-disabled="true"]')
      );
      const panelBodyElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-body')
      );
      const contentElement = fixture.debugElement.query(
        By.css('.mat-expansion-panel-content')
      );
      expect(headerElement).toBeTruthy();
      expect(panelBodyElement.nativeElement.children.length).toEqual(1);
      expect(contentElement.nativeElement.clientHeight).toEqual(0);
    });
  });

  describe('Opend & Closed events', () => {
    it('should emit opened event when panel is expanded', () => {
      collapsibleComponent.expanded = true;
      fixture.detectChanges();
      expect(collapsibleComponent.opened.emit).toHaveBeenCalled();
    });

    it('should emit closed event when panel is collapsed', () => {
      collapsibleComponent.expanded = true;
      fixture.detectChanges();
      collapsibleComponent.expanded = false;
      fixture.detectChanges();
      expect(collapsibleComponent.closed.emit).toHaveBeenCalled();
    });
  });
});
