export enum TableType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary'
}

export enum SortDirections {
  Asc = 'asc',
  Desc = 'desc'
}

export enum RowSelection {
  Multiple = 'multiple',
  Single = 'single',
}

export enum PinDirection {
  Left = 'left',
  Right = 'right',
}

export enum ColumnOrderStrategy {
  AppendNew = 'appendNew',
  Reorder = 'reorder',
}

export enum TableEventName {
  onGridReady = 'onGridReady',
  onGridColumnsChanged = 'onGridColumnsChanged',
  onDragStopped = 'onDragStopped',
}
