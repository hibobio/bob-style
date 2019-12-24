

  #### interface: SelectGroupOption
  Name | Type | Description
  --- | --- | ---
  groupName | string | group display name
  key | string / number | grpup ID
  options | SelectOption[] | array of options

  #### interface: SelectOption
  Name | Type | Description
  --- | --- | ---
  value | string | option display name
  id | number / string | option ID - **Must be unique!**
  selected | boolean | if option is selected
  prefixComponent |  RenderedComponent | object, describing component to be rendered in the option (see Component Renderer)
  disabled | boolean | if option is disabled
  hidden | boolean | if options is hidden, it will not be displayed in the list

  #### class: ListChange - methods
  Name | Type | Description
  --- | --- | ---
  getSelectGroupOptions | (): SelectGroupOption[] | returns all options
  getSelectedGroupOptions | (): SelectGroupOption[] | returns **selected** options
  getSelectedIds | (): (number / string)[] | returns array of selected option **IDs**