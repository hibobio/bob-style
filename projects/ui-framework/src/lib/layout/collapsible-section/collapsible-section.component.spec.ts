import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA,
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { CollapsibleSectionComponent } from './collapsible-section.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { UtilsService } from '../../services/utils/utils.service';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {
  elementFromFixture,
  emitNativeEvent,
  simpleChange
} from '../../services/utils/test-helpers';

@Component({
  template: `
    <b-collapsible-section>
      <div header>suffix</div>
      <div class="test-content" style="height: 300px;">content</div>
    </b-collapsible-section>
  `,
  providers: []
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

  let utilsServiceStub: jasmine.SpyObj<UtilsService>;

  beforeEach(async(() => {
    utilsServiceStub = createSpyObj('UtilsService', ['getResizeEvent']);
    utilsServiceStub.getResizeEvent.and.returnValue(of());

    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestComponent, CollapsibleSectionComponent],
      providers: [
        DOMhelpers,
        { provide: UtilsService, useValue: utilsServiceStub },
        EventManagerPlugins[0]
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(CollapsibleSectionComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        collapsibleComponent = fixture.debugElement.query(
          By.css('b-collapsible-section')
        ).componentInstance;

        collapsibleSection = elementFromFixture(fixture, '.bcp-section');
        collapsibleHeader = elementFromFixture(fixture, '.bcp-header');
        collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');
      });
  }));

  describe('Basic Section', () => {
    let titleElement: HTMLElement;
    let descElement: HTMLElement;

    beforeEach(() => {
      collapsibleComponent.title = 'Title';
      collapsibleComponent.description = 'Description';
      fixture.detectChanges();

      titleElement = elementFromFixture(fixture, '.bcp-title');
      descElement = elementFromFixture(fixture, '.bcp-description');
    });

    it('should default to non-collapsible section', () => {
      expect(collapsibleSection.classList).not.toContain(
        'bcp-section-collapsible'
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

    it('should start with panel collapsed', () => {
      expect(collapsibleSection.classList).toContain('bcp-section-collapsible');
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
          expanded: true
        })
      );
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');

      expect(collapsiblePanel).toBeTruthy();
      expect(collapsibleSection.classList).toContain('bcp-section-expanded');
      expect(collapsiblePanel.classList).toContain('bcp-panel-expanded');
      expect(collapsibleComponent.opened.emit).toHaveBeenCalled();
    });

    it('should expand panel on header click and emit Opened event', () => {
      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();
      collapsiblePanel = elementFromFixture(fixture, '.bcp-panel');

      expect(collapsiblePanel).toBeTruthy();
      expect(collapsibleSection.classList).toContain('bcp-section-expanded');
      expect(collapsiblePanel.classList).toContain('bcp-panel-expanded');
      expect(collapsibleComponent.opened.emit).toHaveBeenCalled();
    });

    it('should collapse panel on header click and emit Closed event', () => {
      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleSection.classList).toContain('bcp-section-expanded');

      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleSection.classList).not.toContain(
        'bcp-section-expanded'
      );
      expect(collapsibleHeader.classList).not.toContain('no-shadow');
      expect(collapsiblePanel.classList).not.toContain('no-top-border');
      expect(collapsibleComponent.closed.emit).toHaveBeenCalled();
    });

    it('should not show divider when divided = false', () => {
      expect(collapsibleSection.classList).not.toContain(
        'bcp-section-not-divided'
      );
      collapsibleComponent.divided = false;
      fixture.detectChanges();
      expect(collapsibleSection.classList).toContain('bcp-section-not-divided');
    });

    it('should put CSS variable with content height on component host element', () => {
      emitNativeEvent(collapsibleHeader, 'click');
      fixture.detectChanges();

      expect(collapsibleHost.getAttribute('style')).toContain(
        '--panel-height:300px;'
      );
    });

    it('should disable the component with disabled property', () => {
      expect(collapsibleSection.getAttribute('aria-disabled')).toBeFalsy();
      collapsibleComponent.disabled = true;
      collapsibleComponent.ngOnChanges(
        simpleChange({
          disabled: true
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
            headerTranscludeStopPropagation: true
          }
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
  });
});
