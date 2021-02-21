export interface ScrollEvent extends Partial<Window> {
  scrollY: number;
  scrollX: number;
}

export interface WinResizeEvent extends Partial<Window> {
  innerWidth: number;
  innerHeight: number;
  outerHeight: number;
  outerWidth: number;
}

export interface WindowMessageData<T = any> {
  id?: string;
  type?: string;
  payload?: T;
}
