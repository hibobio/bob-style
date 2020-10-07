import { boolean, text } from '@storybook/addon-knobs';
import { mockText } from '../mock.const';

export const FormElementsCommonProps = (
  label = 'Form element label',
  placeholder = '',
  description = mockText(15),
  tab = undefined,
  hint = 'Usefull hint'
) => ({
  label: text('label', label, tab),
  placeholder: text('placeholder', placeholder, tab),
  description: text('description', description, tab),
  hideLabelOnFocus: boolean('hideLabelOnFocus', false, tab),
  disabled: boolean('disabled', false, tab),
  required: boolean('required', false, tab),
  readonly: boolean('readonly', false, tab),
  hintMessage: text('hintMessage', hint, tab),
  warnMessage: text('warnMessage', '', tab),
  errorMessage: text('errorMessage', '', tab),
  focusOnInit: boolean('focusOnInit', false, tab),
});
