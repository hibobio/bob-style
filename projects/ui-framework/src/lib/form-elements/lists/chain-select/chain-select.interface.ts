import {
  RenderedComponent
} from '../../../services/component-renderer/component-renderer.interface';
import { Input } from '@angular/core';

export interface ChainLink {
  selectComponentConfig: RenderedComponent;
  active: boolean;
}

export interface SelectComponentConfig {
  outputKey: string;
  selectedIdKey?: string;
  selectedIds?: (string | number)[];
}
