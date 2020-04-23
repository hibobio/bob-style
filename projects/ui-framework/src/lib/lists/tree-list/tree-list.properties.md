#### Tree List/Panel/Select properties
Name | Type | Description | Default
--- | --- | --- | ---
[type] | SelectType | single or multi select | multi
[mode] | SelectMode | select mode. only 'classic' (only leafs can be selected) and 'tree' (groups can also be selected) supported, 'radioGroups' and 'checkGroups' are not valid | tree
[list] | TreeListOption[] | options list. <br>**Note:** if your list does not conform to TreeListOption interface, provide ```keyMap``` to convert it | &nbsp;
[keyMap] | TreeListKeyMap | keymap to convert [list] to  TreeListOption interface (for tree list options coming from the server, use BTL<sub>-</sub>KEYMAP<sub>-</sub>SERVER const) | BTL<sub>-</sub>KEYMAP<sub>-</sub>DEF
[value] | number / string / (number / string)[] | selected option's ID(s). | &nbsp;
[valueSeparatorChar] | string | string to separate value levels with (ex.: Tel Aviv<u> / </u>R&D) | ' / '
[maxHeightItems] | number | max number of items before scroll | 8
[startCollapsed] | boolean | if true, will start with groups closed | true
[listActions] | ListFooterActions | enable/disable footer action buttons (clear, apply, cancel).<br> **Note:** If you provide strings as truthy values, they will be used for button texts, instead of defaults. |  &nbsp;
(changed) | EventEmitter<wbr>&lt;TreeListValue&gt; | emits on select change | &nbsp;
(apply) | EventEmitter<wbr>&lt;void&gt; | emits on Apply action | &nbsp;
(cancel) | EventEmitter<wbr>&lt;void&gt; | emits on Cancel action | &nbsp;
&lt;elem footerAction&gt; | ng-content | element with attribute `footerAction` will be placed in the footer | &nbsp;

#### interface TreeListOption
Name | Type | Description
--- | --- | ---
id | string/number | unique option id
name | string | option display name
children | TreeListOption[] | children options

#### interface TreeListKeyMap
Name | Type | Description
--- | --- | ---
id | string | key in your list to be used for 'id' (ex. 'serverId')
name | string | key in your list to be used for 'name' (ex. 'value')
children | string |  key in your list to be used for 'children'

#### interface TreeListValue
Name | Type | Description
--- | --- | ---
selectedIDs | itemID[] | ID(s) of selected options
selectedValues | string[] | array of value display names ('Parent 1 / Parent 2 / Option 1')
