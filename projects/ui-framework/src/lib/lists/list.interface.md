#### interface: SelectGroupOption
Name | Type | Description
--- | --- | ---
groupName | string | group display name
key | string / number | grpup ID
options | SelectOption[] | array of options
description | string | text to be added to (i) tooltip on the right of the group
suffixComponent |  RenderedComponent | object, describing component to be rendered on the right of the group (see [Component Renderer](https://hibobio.github.io/bob-style/?path=/story/services--component-renderer))
 + | any | you can pass any additional properties in the SelectGroupOption object

#### interface: SelectOption
Name | Type | Description
--- | --- | ---
value | string | option display name
id | number / string | option ID - **Must be unique!**
selected | boolean | if option is selected
prefixComponent |  RenderedComponent | object, describing component to be rendered in the option (see [Component Renderer](https://hibobio.github.io/bob-style/?path=/story/services--component-renderer))
disabled | boolean | if option is disabled
exclusive | boolean | when selected, will unselect all other options in the list
description | string | text to be added to (i) tooltip on the right of the option
 + | any | you can pass any additional properties in the SelectOption object

#### interface: ListFooterActions
Name | Type | Description
--- | --- | ---
apply | boolean | enable Apply button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect
cancel | boolean | enable Cancel button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect
clear | boolean | enable Clear button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect.<br> **Note:** If `[optionsDefault]` is present, this sets automatically to <u>false</u>
reset | boolean | enable Reset button.<br> Defaults to <u>false</u>.<br> **Note:** If `[optionsDefault]` is present, this sets automatically to <u>true</u>

#### class: ListChange - methods
Name | Type | Description
--- | --- | ---
getSelectedIds | (): (number / string)[] | returns array of selected option **IDs**
getSelectGroupOptions | (): SelectGroupOption[] | returns all groups/options
getSelectedGroupOptions | (): SelectGroupOption[] | returns **selected** groups/options (with additional data per group: selectedCount, groupSelectedIDs, groupSelectedValues)
getDisplayValue | (): string | returns selected options' values, joined with ',' (same as displayed in select input field)