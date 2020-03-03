import { EventEmitter } from '@angular/core';
import { PanelDefaultPosVer } from '../../../popups/panel/panel.enum';
import { ConnectedPosition, OverlayRef } from '@angular/cdk/overlay';
import { TreeListValue } from '../tree-list.interface';

export interface TreeListPanelIO {
  panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  panelClass: string;
  hasArrow?: boolean;
  treeListValue: TreeListValue;
  overlayRef: OverlayRef;
  panelOpen: boolean;
  opened: EventEmitter<OverlayRef>;
  closed: EventEmitter<void>;
}
