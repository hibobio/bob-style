#### Tree List Panel/Select Properties
Name | Type | Description | Default
--- | --- | --- | ---
[panelClass] | string | class to be added to select panel | &nbsp;
[panelPosition] | PanelDefaultPosVer / ConnectedPosition[] | defines the location of the select's panel | &nbsp;
[tooltipType] | TruncateTooltipType | you can use CSS or Material tooltip for truncated value text | CSS
[disabled] | boolean | if panel is disabled | false
[readonly] | boolean | if true, will not emit events and not allow selection | false
(opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | emits OverlayRef on panel open | &nbsp;
(closed) | EventEmitter<wbr>&lt;void&gt; | emits on panel close | &nbsp;

#### Tree List Panel/Select Methods
Name | Description
--- | ---
openPanel() | will open select panel
closePanel() | will close (destroy) select panel