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
