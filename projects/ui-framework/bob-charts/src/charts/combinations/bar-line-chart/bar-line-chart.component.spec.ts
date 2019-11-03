import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarLineChartComponent } from './bar-line-chart.component';

describe('BarLineChartComponent', () => {
  let component: BarLineChartComponent;
  let fixture: ComponentFixture<BarLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
