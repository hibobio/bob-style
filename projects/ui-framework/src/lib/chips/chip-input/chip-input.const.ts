import { EMAIL_VALIDATION_REGEX } from '../../consts';

export enum ChipInputValidation {
  email = 'email',
}

export const CHIP_INPUT_VALIDATION = {
  [ChipInputValidation.email]: EMAIL_VALIDATION_REGEX,
};
