import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TypographyModule } from '../../typography/typography.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { SectionContainerComponent } from './sectionContainer.component';

@Component({
  template: `
    <b-section-container [title]="'TitleHere'">
      <div section-action>
        <p>Hello</p>
      </div>
      <div section-content>
        <p>world</p>
      </div>
    </b-section-container>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
}

describe('SectionContainerComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let collapsibleComponent: SectionContainerComponent;
  let collapsibleNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SectionContainerComponent],
      imports: [MatExpansionModule, BrowserAnimationsModule, TypographyModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        collapsibleComponent = fixture.debugElement.query(
          By.css('b-section-container')
        ).componentInstance;
        collapsibleNativeElement = fixture.debugElement.query(
          By.css('b-section-container')
        ).nativeElement;
      });
  }));

  describe('Lazy content init', () => {
    it('should put transcluded element with attribute [section-action] in the header', () => {
      fixture.detectChanges();
      const sectionActionElement = fixture.debugElement.query(
        By.css('.title-container [section-action]')
      );
      expect(sectionActionElement).toBeTruthy();
      expect(sectionActionElement.nativeElement.innerHTML).toEqual(
        '<p>Hello</p>'
      );
    });
    it('should put transcluded element with attribute [section-content] in the content', () => {
      fixture.detectChanges();
      const sectionContentElement = fixture.debugElement.query(
        By.css('.content-container [section-content]')
      );
      expect(sectionContentElement).toBeTruthy();
      expect(sectionContentElement.nativeElement.innerHTML).toEqual(
        '<p>world</p>'
      );
    });
    it('should init title', () => {
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('b-display-3'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.innerHTML).toEqual('TitleHere');
    });
  });
});
