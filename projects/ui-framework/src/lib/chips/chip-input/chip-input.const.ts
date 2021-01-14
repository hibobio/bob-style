export enum ChipInputValidation {
  email = 'email',
}

export const CHIP_INPUT_VALIDATION = {
  [ChipInputValidation.email]: /^\s*[\w.\-\+]+@[\w.\-]+\.[\w]{2,6}\s*$/,
};
