export enum Keys {
  meta = 'Meta',
  alt = 'Alt',
  control = 'Control',
  shift = 'Shift',
  enter = 'Enter',
  escape = 'Escape',
  tab = 'Tab',
  arrowdown = 'ArrowDown',
  arrowleft = 'ArrowLeft',
  arrowright = 'ArrowRight',
  arrowup = 'ArrowUp',
  end = 'End',
  home = 'Home',
  pagedown = 'PageDown',
  pageup = 'PageUp',
  backspace = 'Backspace',
  delete = 'Delete',
  space = ' ',
  comma = ',',
  dollar = '$',
  at = '@',
}

export const metaKeys = [Keys.meta, Keys.alt, Keys.control, Keys.shift];

export const controlKeys = [
  Keys.meta,
  Keys.alt,
  Keys.control,
  Keys.shift,
  Keys.enter,
  Keys.escape,
  Keys.tab,
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.arrowup,
  Keys.end,
  Keys.home,
  Keys.pagedown,
  Keys.pageup,
  Keys.backspace,
  Keys.delete,
];

export const arrowKeys = [
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.arrowup,
];

export const clickKeys = [Keys.enter, Keys.space];

export const deleteKeys = [Keys.backspace, Keys.delete];

export enum NativeEvents {
  click = 'click',
  dblclick = 'dblclick',
  mousedown = 'mousedown',
  mouseup = 'mouseup',
  mouseover = 'mouseover',
  mousemove = 'mousemove',
  mouseenter = 'mouseenter',
  mouseleave = 'mouseleave',
  mouseout = 'mouseout',
  keydown = 'keydown',
  keypress = 'keypress',
  keyup = 'keyup',
  focus = 'focus',
  blur = 'blur',
  change = 'change',
  input = 'input',
  submit = 'submit',
  reset = 'reset',
  resize = 'resize',
  scroll = 'scroll',
  select = 'select',
  dragstart = 'dragstart',
  drag = 'drag',
  dragenter = 'dragenter',
  dragleave = 'dragleave',
  dragover = 'dragover',
  drop = 'drop',
  dragend = 'dragend',
  touchstart = 'touchstart',
  touchend = 'touchend',
  touchmove = 'touchmove',
  touchenter = 'touchenter',
  touchleave = 'touchleave',
  touchcancel = 'touchcancel',
  focusin = 'focusin',
  focusout = 'focusout',
}

export const NativeMouseEvents = [
  NativeEvents.click,
  NativeEvents.dblclick,
  NativeEvents.mousedown,
  NativeEvents.mouseup,
  NativeEvents.mouseover,
  NativeEvents.mousemove,
  NativeEvents.mouseenter,
  NativeEvents.mouseleave,
  NativeEvents.mouseout,
];

export const NativeKeyboardEvents = [
  NativeEvents.keydown,
  NativeEvents.keypress,
  NativeEvents.keyup,
];
