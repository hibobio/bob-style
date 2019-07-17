import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { elementsFromFixture } from '../../services/utils/test-helpers';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { MultiListAndChipsComponent } from './multi-list-and-chips.component';
import { ChipListModule } from '../chip-list/chip-list.module';
import { MultiListModule } from '../../form-elements/lists/multi-list/multi-list.module';

xdescribe('MultiListAndChipsComponent', () => {
  let component: MultiListAndChipsComponent;
  let fixture: ComponentFixture<MultiListAndChipsComponent>;

  let listElement: HTMLElement;

  let chipsElements: HTMLElement[];
  // let chipsComponents: ChipComponent[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiListAndChipsComponent],
      imports: [ChipListModule, MultiListModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(MultiListAndChipsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListAndChipsComponent);
        component = fixture.componentInstance;

        component.listLabel = 'listLabel';
        component.chipsLabel = 'chipsLabel';

        // component.options;

        spyOn(component.selectChange, 'emit');
        fixture.detectChanges();

        listElement = fixture.debugElement.nativeElement;
        chipsElements = elementsFromFixture(fixture, 'b-chip');
        // chipsComponents = component.list.toArray();
      });
  }));

  describe('Component', () => {});
});
