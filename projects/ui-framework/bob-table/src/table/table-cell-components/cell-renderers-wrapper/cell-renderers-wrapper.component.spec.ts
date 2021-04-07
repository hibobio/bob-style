import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CellRenderersWrapperComponent } from './cell-renderers-wrapper.component';
import { ComponentRendererComponent } from '../../../../../../ui-framework/src/lib/services/component-renderer/component-renderer.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('CellRenderersWrapperComponent', () => {
  let component: CellRenderersWrapperComponent;
  let fixture: ComponentFixture<CellRenderersWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellRenderersWrapperComponent, MockComponent(ComponentRendererComponent)],
    }).compileComponents();
    fixture = TestBed.createComponent(CellRenderersWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should not display prefix-cell-component', () => {
    fixture.detectChanges();
    const prefixCellComponent = fixture.debugElement.query(By.css('.prefix-cell-component'));
    expect(prefixCellComponent).toBeFalsy();
  });
  it('should display just prefix-cell-component', () => {
    component.componentRendererConfig = {
      prefixComponentRenderer: { component: 'prefix' } as any,
    }
    fixture.detectChanges();
    const prefixCellComponent = fixture.debugElement.query(By.css('.prefix-cell-component'));
    const suffixCellComponent = fixture.debugElement.query(By.css('.suffix-cell-component'));
    expect(prefixCellComponent.componentInstance.render).toEqual({ component: 'prefix' });
    expect(suffixCellComponent).toBeFalsy();
  });
  it('should not display suffix-cell-component', () => {
    fixture.detectChanges();
    const suffixCellComponent = fixture.debugElement.query(By.css('.suffix-cell-component'));
    expect(suffixCellComponent).toBeFalsy();
  });
  it('should display just suffix-cell-component', () => {
    component.componentRendererConfig = {
      suffixComponentRenderer: { component: 'suffix' } as any,
    }
    fixture.detectChanges();
    const prefixCellComponent = fixture.debugElement.query(By.css('.prefix-cell-component'));
    const suffixCellComponent = fixture.debugElement.query(By.css('.suffix-cell-component'));
    expect(suffixCellComponent.componentInstance.render).toEqual({ component: 'suffix' });
    expect(prefixCellComponent).toBeFalsy();
  });
  it('should display both *-cell-component', () => {
    component.componentRendererConfig = {
      suffixComponentRenderer: { component: 'suffix' } as any,
      prefixComponentRenderer: { component: 'prefix' } as any,
    }
    fixture.detectChanges();
    const prefixCellComponent = fixture.debugElement.query(By.css('.prefix-cell-component'));
    const suffixCellComponent = fixture.debugElement.query(By.css('.suffix-cell-component'));
    expect(suffixCellComponent.componentInstance.render).toEqual({ component: 'suffix' });
    expect(prefixCellComponent.componentInstance.render).toEqual({ component: 'prefix' });
  });
});
