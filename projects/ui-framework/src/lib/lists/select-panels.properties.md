
#### Single/Multi SelectPanel common properties
Name | Type | Description | Default
--- | --- | --- | ---
[chevronButtonText] | string | text to be displayed in chevron-button | null - can use transclude instead
[disabled] | boolean | if panel is disabled | false
[readonly] | boolean | if true, will not emit events and not allow selection | false
**(selectChange)** | EventEmitter<wbr>&lt;ListChange&gt; | emits on select change (in case of MultiSelectPanel - after Apply) | &nbsp;
(opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | Emits panel Opened event | &nbsp;
(closed) | EventEmitter<wbr>&lt;void&gt; | Emits panel Closed event | &nbsp;

