import { AlertType } from './alert.enum';

export interface AlertConfig {
  alertType: AlertType;
  text: string;
  title: string;
  isAutoClose?: boolean;
}
