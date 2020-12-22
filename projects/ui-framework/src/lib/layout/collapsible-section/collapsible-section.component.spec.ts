import { ComponentFixture, TestBed, fakeAsync, tick, flush, resetFakeAsyncZone, waitForAsync } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CollapsibleSectionComponent } from './collapsible-section.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { UtilsService } from '../../services/utils/utils.service';
import {
  elementFromFixture,
  emitNativeEvent,
} from '../../services/utils/test-helpers';
import { ColorService } from '../../services/color-service/color.service';
import { utilsServiceStub } from '../../tests/services.stub.spec';
import { simpleChange } from '../../services/utils/functional-utils';

@Component({
  template: `
    <b-collapsible-section>
      <div header>suffix</div>
      <div class="test-content" style="height: 300px;">content</div>
    </b-collapsible-section>
  `,
  providers: [],
})
class TestComponent {
  constructor() {}
}

describe('CollapsibleSectionComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let collapsibleComponent: CollapsibleSectionComponent;
  let collapsibleSection: HTMLElement;
  let collapsibleHeader: HTMLElement;
  let collapsiblePanel: HTMLElement;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestComponent, CollapsibleSectionComponent],
      providers: [
        ColorService,
        DOMhelpers,
        { provide: UtilsService, useValue: utilsServiceStub },
        EventManagerPlugins[0],
      ],
    })
      .overrideComponent(CollapsibleSectionComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        collapsibleComponent = fixture.debugElement.query(
          By.css('b-collapsible-section')
        ).componentInstance;

        collapsibleComponent.title = 'Section title';
        fixture.detectChanges();

        collapsibleSection = elementFromFixture(fixture, '.bcp-section');
        collapsibleHeader = elementFromFixture(fixture, '.bcp-header');
        collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');
      });
  }));

  describe('Basic Section', () => {
    let titleElement: HTMLElement;
    let descElement: HTMLElement;

    beforeEach(() => {
      collapsibleComponent.description = 'Description';
      fixture.detectChanges();

      titleElement = elementFromFixture(fixture, '.bcp-title');
      descElement = elementFromFixture(fixture, '.bcp-description');
    });

    it('should default to non-collapsible section', () => {
      expect(collapsibleSection.getAttribute('data-collapsible')).toEqual(
        'false'
      );
      expect(collapsiblePanel).toBeTruthy();
    });

    it('should display title & description', () => {
      expect(titleElement).toBeTruthy();
      expect(descElement).toBeTruthy();
    });
  });

  describe('Basic Transclusion', () => {
    let headerContentElement: HTMLElement;
    let panelContentElement: HTMLElement;

    beforeEach(() => {
      headerContentElement = elementFromFixture(
        fixture,
        '.bcp-header-content [header]'
      );
      panelContentElement = elementFromFixture(
        fixture,
        '.bcp-panel-content-wrap .test-content'
      );
    });

    it('should put content marked with [header] in the header', () => {
      expect(headerContentElement).toBeTruthy();
      expect(headerContentElement.innerHTML).toContain('suffix');
    });

    it('should put other transcluded content inside the panel', () => {
      expect(panelContentElement).toBeTruthy();
      expect(panelContentElement.innerHTML).toContain('content');
    });
  });

  describe('Collapsible Section', () => {
    let collapsibleHost: HTMLElement;

    beforeEach(() => {
      collapsibleComponent.collapsible = true;
      spyOn(collapsibleComponent.opened, 'emit');
      spyOn(collapsibleComponent.closed, 'emit');
      collapsibleComponent.opened.subscribe(() => {});
      collapsibleComponent.closed.subscribe(() => {});
      collapsibleHost = elementFromFixture(fixture, 'b-collapsible-section');
      fixture.detectChanges();
    });

    afterEach(() => {
      collapsibleComponent.opened.complete();
      collapsibleComponent.closed.complete();
    });

    it('should start with panel collapsed', () => {
      expect(collapsibleSection.getAttribute('data-collapsible')).toEqual(
        'true'
      );
      expect(collapsibleSection.classList).not.toContain(
        'bcp-section-expanded'
      );
    });

    it('should not put panel in the DOM at init', () => {
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');
      expect(collapsiblePanel).toBeFalsy();
    });

    it('should expand panel with expand property and emit Opened event', () => {
      collapsibleComponent.expanded = true;
      collapsibleComponent.ngOnChanges(
        simpleChange({
          expanded: true,
        })
      );
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');

      expect(collapsiblePanel).toBeTruthy();
      expect(collapsibleSection.getAttribute('data-expanded')).toEqual('true');
      expect(collapsiblePanel.getAttribute('data-expanded')).toEqual('true');
      expect(collapsibleComponent.opened.emit).toHaveBeenCalled();
    });

    it('should expand panel on header click and emit Opened event', fakeAsync(() => {
      emitNativeEvent(collapsibleHeader, 'click');
      tick(500);
      fixture.detectChanges();
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');

      expect(collapsiblePanel).toBeTruthy();
      expect(collapsibleSection.getAttribute('data-expanded')).toEqual('true');
      expect(collapsiblePanel.getAttribute('data-expanded')).toEqual('true');
      expect(collapsibleComponent.opened.emit).toHaveBeenCalled();

      flush();
    }));

    it('should collapse panel on header click and emit Closed event', () => {
      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleSection.getAttribute('data-expanded')).toEqual('true');

      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleSection.getAttribute('data-expanded')).toEqual('false');
      expect(collapsibleHeader.classList).not.toContain('no-shadow');
      expect(collapsiblePanel.classList).not.toContain('no-top-border');
      expect(collapsibleComponent.closed.emit).toHaveBeenCalled();
    });

    it('should not show divider when divided = false', () => {
      expect(collapsibleSection.getAttribute('data-divided')).toEqual('true');
      collapsibleComponent.divided = false;
      fixture.detectChanges();
      expect(collapsibleSection.getAttribute('data-divided')).toEqual('false');
    });

    it('should put CSS variable with content height on component host element', () => {
      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleHost.getAttribute('style')).toContain(
        '--panel-height:3'
      );
    });

    it('should disable the component with disabled property', () => {
      expect(collapsibleSection.getAttribute('aria-disabled')).toBeFalsy();
      collapsibleComponent.disabled = true;
      collapsibleComponent.ngOnChanges(
        simpleChange({
          disabled: true,
        })
      );

      expect(collapsibleSection.getAttribute('aria-disabled')).toEqual('true');
    });
  });

  describe('Options', () => {
    let headerContentElement: HTMLElement;

    beforeEach(() => {
      collapsibleComponent.collapsible = true;
      collapsibleComponent.ngOnChanges(
        simpleChange({
          options: {
            headerTranscludeStopPropagation: true,
            indicatorColor: '#cc2748',
          },
        })
      );

      headerContentElement = elementFromFixture(fixture, '.bcp-header-content');
    });

    it('should disable click event propagation with headerTranscludeStopPropagation option', () => {
      expect(headerContentElement.classList).not.toContain(
        'bcp-header-content-clickable'
      );

      emitNativeEvent(headerContentElement, 'click');
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');
      expect(collapsiblePanel).toBeFalsy();

      emitNativeEvent(collapsibleHeader, 'click');
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');
      expect(collapsiblePanel).toBeTruthy();
    });

    it('should set css color variables, if indicatorColor prop is passed', () => {
      const panel = elementFromFixture(fixture, 'b-collapsible-section');

      expect(getComputedStyle(panel).getPropertyValue('--bcp-color')).toEqual(
        '#cc2748'
      );
      expect(
        getComputedStyle(panel).getPropertyValue('--bcp-color-rgb')
      ).toEqual('204, 39, 72');
    });
  });
});
