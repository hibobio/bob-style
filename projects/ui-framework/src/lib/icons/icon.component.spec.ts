import { IconComponent } from './icon.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconColor, Icons, IconSize } from './icons.enum';
import { By } from '@angular/platform-browser';

describe('IconElementComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;
  let componentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement;
    component.icon = Icons.toDos_link;
    component.color = IconColor.primary;
    component.size = IconSize.medium;
    component.toolTipSummary = 'tooltip text';
    fixture.detectChanges();
  });

  describe('getClassNames', () => {
    it('Should set correct icon class', () => {
      const iconElement = fixture.debugElement.query(
        By.css('.' + Icons.toDos_link)
      ).nativeElement;

      expect(iconElement.className).toEqual(
        'b-icon ' + Icons.toDos_link + ' b-icon-medium b-icon-primary'
      );
    });

    it('Should put tooltip text in attribute', () => {
      console.log(componentElement);
      expect(componentElement.dataset.tooltip).toEqual('tooltip text');
    });
  });
});
