export enum InputTypes {
  text = 'text',
  number = 'number',
  email = 'email',
  password = 'password',
  search = 'search',
  tel = 'tel',
  url = 'url',
  date = 'date',
}

export interface InputEvent {
  event: InputEventType;
  value: string | number;
}

export enum InputEventType {
  onFocus = 'onFocus',
  onBlur = 'onBlur',
  onChange = 'onChange',
}

export enum InputAutoCompleteOptions {
  on = 'on',
  off = 'off',
}
