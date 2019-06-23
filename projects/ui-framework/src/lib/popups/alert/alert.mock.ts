import {AlertConfig} from './alert.interface';
import {AlertType} from './alert.enum';

export const ALERT_CONFIG_MOCK: AlertConfig = {
  alertType: AlertType.success,
  text: 'text',
  title: 'title'
};

export const OVERLAY_CONFIG_MOCK = {
  disposeOnNavigation: true,
  hasBackdrop: false,
  panelClass: 'b-alert-panel',
  positionStrategy: 'strategy',
}
