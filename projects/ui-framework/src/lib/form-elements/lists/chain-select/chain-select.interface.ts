import {
  RenderedComponent
} from '../../../services/component-renderer/component-renderer.interface';

export interface ChainLink {
  selectComponentConfig: RenderedComponent;
}

export interface SelectComponentConfig {
  outputKey: string;
  selectedIdKey?: string;
  selectedIds?: (string | number)[];
  filterFn?: (value: any) => boolean;
}
