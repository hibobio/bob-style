import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PieChartComponent} from './pie-chart.component';

import {ChangeDetectorRef, NgZone} from '@angular/core';
import {ChartCore} from '../chart/chart-core';
import * as Highcharts from 'highcharts';
import {LINE_CHART_DATA_MOCK, TOOLTIP_FORMATTER_MOCK_RESULT} from '../chart.mock';

export class MockNgZone extends NgZone {
  run(fn: Function): any {
    return fn();
  }
}

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let updateChartOptionsSpy, applyOnChangeSpy, highchartRefSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PieChartComponent],
      providers: [{ provide: [NgZone, ChangeDetectorRef] }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PieChartComponent);
        component = fixture.componentInstance;
        highchartRefSpy = spyOn(Highcharts, 'chart');
        component.data = LINE_CHART_DATA_MOCK as any;
        component.name = 'fruits';
        fixture.detectChanges();
      });
  }));

  describe('chartCore', () => {
    it('should initialize', () => {
      expect(component).toBeTruthy();
    });
    it('should call ngOnChanges', () => {
      updateChartOptionsSpy = spyOn(
        component,
        'updateChartOptions'
      ).and.callThrough();
      component.ngOnChanges({});
      expect(updateChartOptionsSpy).toHaveBeenCalled();
    });
  });

  describe('chartPie', () => {
    beforeEach(() => {
      spyOn(ChartCore.prototype, 'ngAfterViewInit').and.callThrough();
    });

    it('should call ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(ChartCore.prototype.ngAfterViewInit).toHaveBeenCalled();
    });
    it('should call updateChartOptions', () => {
      updateChartOptionsSpy = spyOn(
        component,
        'updateChartOptions'
      ).and.callThrough();
      component.ngOnChanges.call(component);
      expect(updateChartOptionsSpy).toHaveBeenCalled();
    });
    it('should format value, apply color, add pre and post values', () => {
      updateChartOptionsSpy = spyOn(
        component,
        'updateChartOptions'
      ).and.callThrough();
      component.ngOnChanges.call(component);
      component.preTooltipValue = 'ILS ';
      component.postTooltipValue = ' end';
      component.tooltipValueFormatter = val => `formatted ${val / 1000}`;
      expect(
        component.tooltipFormatter(
          {
            color: 'red',
            y: 48000,
            key: 'balloons'
          },
          component
        )
      ).toEqual(TOOLTIP_FORMATTER_MOCK_RESULT);
    });
    describe('ngOnChanges', () => {
      beforeEach(() => {
        updateChartOptionsSpy = spyOn(component, 'updateChartOptions');
        applyOnChangeSpy = spyOn(ChartCore.prototype, 'applyOnChange');
        component.ngOnChanges.call(component);
        fixture.detectChanges();
      });
      it('should call updateChartOptions and applyOnChangeSpy', () => {
        expect(updateChartOptionsSpy).toHaveBeenCalled();
        expect(applyOnChangeSpy).toHaveBeenCalled();
      });
      it('should highchart update with options', () => {
        expect(highchartRefSpy).toHaveBeenCalledWith(
          component.containerId,
          component.options
        );
      });
      it('should inputs be same as highchart options properties', () => {
        expect(component.options.series[0].name).toEqual('fruits');
        expect((component.options.series[0] as any).data).toEqual(
          LINE_CHART_DATA_MOCK
        );
        expect(component.options.chart.type).toEqual('pie');
        expect(component.type).toEqual('pie');
        expect(component.legend).toEqual(
          component.options.plotOptions[component.type].showInLegend
        );
      });
    });
  });
});
