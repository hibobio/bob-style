export enum FormEvents {
  changed = 'changed',
  focused = 'focused',
  blurred = 'blurred',
  inputEvents = 'inputEvents',
  dateChange = 'dateChange',
  checkboxChange = 'checkboxChange',
  radioChange = 'radioChange',
  selectChange = 'selectChange',
  selectModified = 'selectModified',
  selectCancelled = 'selectCancelled',
  socialInputChange = 'socialInputChange',
  elementChange = 'elementChange',
}

export enum InputEventType {
  onFocus = 'onFocus',
  onBlur = 'onBlur',
  onChange = 'onChange',
  onWrite = 'onWrite',
  onKey = 'onKey',
  onPaste = 'onPaste',
}

export enum FormElementSize {
  regular = 'regular',
  smaller = 'smaller',
}
