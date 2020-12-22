import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeDetectorRef, NgZone } from '@angular/core';
import * as Highcharts from 'highcharts';
import { PieChartComponent } from '../../../bob-charts/src/charts/pie-chart/pie-chart.component';
import { LINE_CHART_DATA_MOCK } from '../../../bob-charts/src/charts/chart.mock';
import { ChartCore } from '../../../bob-charts/src/charts/chart/chart-core';

export class MockNgZone extends NgZone {
  run(fn: Function): any {
    return fn();
  }
}

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let updateChartOptionsSpy, applyOnChangeSpy, highchartRefSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PieChartComponent],
      providers: [ChangeDetectorRef],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PieChartComponent);
        component = fixture.componentInstance;
        highchartRefSpy = spyOn(Highcharts, 'chart');
        component.data = LINE_CHART_DATA_MOCK as any;
        component.name = 'fruits';
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
      component.tooltipValueFormatter = (val: number) =>
        `formatted ${val / 1000}`;

      const formatted = component.tooltipFormatter(
        {
          color: 'red',
          y: 48000,
          key: 'balloons',
        },
        component
      );

      expect(formatted).toContain('ILS formatted 48 end');
      expect(formatted).toContain('style="color:red;"');
      expect(formatted).toContain('class="key">balloons');
    });
    describe('export chart', () => {
      it('should export chart call chart ref with type', () => {
        component.highChartRef = {
          exportChart: (exportObj) => {},
        } as any;
        const spyHighChartRefExport = spyOn(
          component.highChartRef as any,
          'exportChart'
        );

        component.exportChart('image/svg+xml');
        expect(spyHighChartRefExport).toHaveBeenCalledWith(
          {
            type: 'image/svg+xml',
          },
          undefined
        );
      });
    });
    describe('ngOnChanges', () => {
      beforeEach(() => {
        updateChartOptionsSpy = spyOn(
          component,
          'updateChartOptions'
        ).and.callThrough();
        applyOnChangeSpy = spyOn(
          ChartCore.prototype,
          'applyOnChange'
        ).and.callThrough();
        highchartRefSpy.and.callThrough();
        fixture.detectChanges();
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
        fixture.detectChanges();
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
