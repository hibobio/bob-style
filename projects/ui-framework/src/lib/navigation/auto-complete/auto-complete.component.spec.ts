import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteComponent } from './auto-complete.component';
import { IconService } from '../../icons/icon.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { AutoCompleteModule } from './auto-complete.module';

describe('QuickFilterComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AutoCompleteModule,
      ],
      providers: [
        { provide: IconService, useValue: spyIconService },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AutoCompleteComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
