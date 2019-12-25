import {Input} from '@angular/core';
import {Constructor} from 'bob-style';
export interface TreeConfig {
  treeData: boolean;
  getDataPath: (data) => string[];
  groupDefaultExpanded?: number;
}

const noopGetTreePath = function (data) {
  return [];
};
export const defaultTreeConfig: TreeConfig = {
  treeData: false,
  getDataPath: noopGetTreePath,
  groupDefaultExpanded: -1
};

export function WithTree<C extends Constructor<{}>>(Base: C = (class {} as any)) {
  class TreeAble extends Base {

    _treeConfig: TreeConfig = defaultTreeConfig;

    @Input() set treeConfig(treeConfig: TreeConfig) {
      this._treeConfig = {...defaultTreeConfig, ...treeConfig};
    }

    get treeConfig() {
      return this._treeConfig;
    }
  }

  return TreeAble;
}

