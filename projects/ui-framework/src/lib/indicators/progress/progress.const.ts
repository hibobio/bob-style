import { DonutSize, ProgressSize } from './progress.enum';

export const PROGRESS_DONUT_DIAMETER = {
  [ProgressSize.small]: 32,
  [ProgressSize.medium]: 46,
  [ProgressSize.large]: 100,
};

export const PROGRESS_DONUT_STROKE = {
  [ProgressSize.small]: 7,
  [ProgressSize.medium]: 8,
  [ProgressSize.large]: 12,
};

// width, inner-width
export const DONUT_SIZES = {
  [DonutSize.small]: [24, 14],
  [DonutSize.medium]: [40, 28],
  [DonutSize.large]: [145, 105],
  [DonutSize.xlarge]: [310, 188],
};

export const DONUT_DIAMETERS = {
  [DonutSize.small]: 24,
  [DonutSize.medium]: 40,
  [DonutSize.large]: 145,
  [DonutSize.xlarge]: 310,
};
