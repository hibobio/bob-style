export interface ProgressDonutData {
  value: number;
  color?: string;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
}

export interface ProgressDonutConfig {
  disableAnimation?: boolean;
  hideValue?: boolean;
}
