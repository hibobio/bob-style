import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '../../../navigation/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { IconsModule } from '../../../icons';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputModule } from '../../input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';

describe('SingleSelectComponent', () => {
  let component: SingleListComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<SingleListComponent>;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleListComponent,
      ],
      providers: [
        ListModelService,
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        MatTooltipModule,
        FlexLayoutModule,
        ScrollingModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleListComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = 2;
        spyOn(component.selectChange, 'emit');
        fixture.autoDetectChanges();
      });
  }));

  describe('ngOnInit', () => {
    it('should create headerModel based on options', () => {
      expect(component.listHeaders).toEqual([
        {
          groupName: 'Basic Info',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null
        },
        {
          groupName: 'Personal',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
        }
      ]);
    });
    it('should create optionsModel based on options', () => {
      expect(component.listOptions).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: null,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: null,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: null,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: null,
        },
      ]);
    });
    it('should render 2 headers', () => {
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(headers.length).toEqual(2);
    });
    it('should render 4 options', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(4);
    });
    it('should not set selected option (id=1) with class selected', () => {
      const option = fixture.debugElement.queryAll(By.css('.option'))[0];
      expect(option.nativeElement.classList).not.toContain('selected');
    });
    it('should set the selected option (id=2) with class selected', () => {
      const option = fixture.debugElement.queryAll(By.css('.option'))[1];
      expect(option.nativeElement.classList).toContain('selected');
    });
  });
  describe('header collapse', () => {
    it('should render 2 options if 1 group is collapsed', () => {
      const header = fixture.debugElement.queryAll(By.css('.header'))[0];
      header.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not render options if 2 group are collapsed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      headers[0].triggerEventHandler('click', null);
      headers[1].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(0);
    });
  });
  describe('option click', () => {
    it('should update value when option is clicked with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.value).toBe(12);
    });
    it('should emit event when selecting an option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.selectChange.emit).toHaveBeenCalledWith(12);
    });
  });
});
