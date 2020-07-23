#### Single/Multi List and Select common properties
Name | Type | Description | Default
--- | --- | --- | ---
[options] | SelectGroupOption[] | model of selection group | &nbsp;
[optionsDefault] | SelectGroupOption[] | Default options. If present, the Clear button (if enabled) will be replaced with Reset button, that will set the options state to optionsDefault (not relevant for SingleSelect) | &nbsp;
[mode] | SelectMode | classic / checkGroups (only one checkbox in group can be checked) / radioGroups (options within group are radios) <br>(only relevant for MultiSelect) | classic
[showSingleGroupHeader] | boolean | display single group with group header (if false, as default, options will be displayed flat, without group) | <u>false</u>
[startWithGroupsCollapsed] | boolean | if true, will start with groups closed | true
[listActions] | ListFooterActions | enable/disable footer action buttons (clear, apply, reset).<br> **Note:** If you provide strings as truthy values, they will be used for button texts, instead of defaults.<br>See interface doc below. |  &nbsp;
[maxHeight] | number | component max height | 352<wbr>(8&nbsp;rows)
[min] | number | (relevant only for multi-select) minimum allowed selected items. <br> will not let user unselect an item if selected count is less then minumum. | &nbsp;
[max] | number | (relevant only for multi-select) maximum allowed selected items.<br> will not let user select more items than maximum. | &nbsp;
