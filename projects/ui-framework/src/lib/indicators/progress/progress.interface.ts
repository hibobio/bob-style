import { Icons } from '../../icons/icons.enum';
import { Color } from '../../types';
import {
  DonutSize,
  ProgressDirection,
  ProgressSize,
  ProgressType,
} from './progress.enum';

export interface ProgressData {
  value: number;
  color?: Color;
  trackColor?: Color;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
  iconHeaderRight?: Icons;
}

export interface ProgressConfig {
  disableAnimation?: boolean;
  animateOnEveryInView?:
    | 'setting this to true may affect performance'
    | boolean;
  hideValue?: boolean;
  clickable?: boolean;
  reverseTextLocation?: boolean;
}

export interface ProgressBarData extends ProgressData {}

export interface ProgressBarConfig extends ProgressConfig {}

export interface ProgressDonutData
  extends Omit<ProgressData, 'iconHeaderRight'> {}

export interface ProgressDonutConfig extends ProgressConfig {
  showValueInCenter?: boolean;
}

export interface MultiProgressBarData
  extends Omit<
    ProgressData,
    | 'trackColor'
    | 'headerTextPrimary'
    | 'headerTextSecondary'
    | 'iconHeaderRight'
  > {}

export interface MultiProgressBarConfig
  extends Omit<ProgressConfig, 'hideValue'> {
  trackColor?: Color;
  total?: number;
  direction?: ProgressDirection;
}

export interface ProgressBar {
  data: ProgressBarData;
  config?: ProgressBarConfig;
  type?: ProgressType;
  size?: ProgressSize;
}

export interface ProgressDonut {
  data: ProgressDonutData;
  config?: ProgressDonutConfig;
  type?: ProgressType;
  size?: ProgressSize;
  donutSize?: DonutSize;
  customSize?: number;
}
