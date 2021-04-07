import { RenderedComponent } from '../../../../../../ui-framework/src/lib/services/component-renderer/component-renderer.interface';

export interface CellRenderersWrapperConfig {
  prefixComponentRenderer?: RenderedComponent;
  suffixComponentRenderer?: RenderedComponent;
}
