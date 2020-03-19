#### Single/Multi Select common properties
Name | Type | Description | Default
--- | --- | --- | ---
[tooltipType] | TruncateTooltipType | you can use CSS or Material tooltip for truncated value text | CSS
[hasPrefix] | boolean | if you are providing `input-prefix` ng-content, set this to true | false
&nbsp; | &nbsp; | &nbsp; | &nbsp;
**(selectChange)** | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange (in case of MultiSelect - after Apply). <br>**Note:** See below for ListChange methods  | &nbsp;
**<u>(changed</u>)** | EventEmitter<wbr>&lt;string/number&gt; | emits selected option ID(s) (in case of MultiSelect - after Apply).<br>**Note:** If you need <u>just the options' IDs</u>, bind to this output | &nbsp;
(opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | emits OverlayRef on panel open | &nbsp;
(closed) | EventEmitter<wbr>&lt;void&gt; | emits on panel close | &nbsp;
&nbsp; | &nbsp; | &nbsp; | &nbsp;
&lt;elem input-prefix&gt; | ng-content | element with attribute `input-prefix` will be placed on the left of the 'input' box, before the value | &nbsp;
&lt;elem footerAction&gt; | ng-content | element with attribute `footerAction` will be placed in the footer of the panel | &nbsp;
&lt;elem footerActionRight&gt; | ng-content | element with attribute `footerActionRight` will be placed in the footer and aligned to the right | &nbsp;
.dirty | boolean | public property, is true if value has been changed | false
.touched | boolean | public property, is true if select was opened and closed (blurred) | false

#### Single/Multi Select common methods
Name | Description
--- | ---
openPanel() | will open select panel
closePanel() | will close (destroy) select panel