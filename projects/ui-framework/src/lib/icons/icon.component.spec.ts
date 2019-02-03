import { IconService } from './icon.service';
import { IconComponent } from './icon.component';
import {
  ComponentFixture,
  async,
  TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Icons, IconColor, IconSize } from './icons.enum';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('IconElementComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService =
      createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      declarations: [IconComponent],
      providers: [
        { provide: IconService, useValue: spyIconService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.icon = Icons.toDos_link;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call iconElementService.initIcon with the correct icon', () => {
      component.ngOnInit();
      expect(spyIconService.initIcon).toHaveBeenCalledWith(Icons.toDos_link);
    });
  });

  describe('getClassNames', () => {
    it('Should return both type and size', () => {
      component.color = IconColor.primary;
      component.size = IconSize.medium;
      const result = component.getClassNames();
      expect(result).toEqual('medium primary');
    });
  });
});
