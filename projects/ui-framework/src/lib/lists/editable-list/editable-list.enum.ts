export enum ListSortType {
  UserDefined = 'UserDefined',
  Asc = 'Asc',
  Desc = 'Desc',
}

export type ListActionType =
  | 'add'
  | 'remove'
  | 'order'
  | 'edit'
  | 'moveToStart'
  | 'moveToEnd';
