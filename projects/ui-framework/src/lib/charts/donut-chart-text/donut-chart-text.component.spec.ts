import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DonutChartTextComponent} from './donut-chart-text.component';
import {PieChartComponent} from '../pie-chart/pie-chart.component';
import {TypographyModule} from '../../typography/typography.module';

describe('DonutChartTextComponent', () => {
  let component: DonutChartTextComponent;
  let fixture: ComponentFixture<DonutChartTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TypographyModule],
      declarations: [ PieChartComponent, DonutChartTextComponent ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(DonutChartTextComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
