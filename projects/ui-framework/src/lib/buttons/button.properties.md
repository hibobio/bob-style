#### Buttons common properties
Name | Type | Description | Default
--- | --- | --- | ---
[button] | Button | all inputs/props can also be provided as single object | &nbsp;
[text] | string | button text (alternative to passing text inside b-button element) | &nbsp;
[disabled] | boolean | disabled | false
[swallow] | boolean | if true, will preventDefault and stopPropagation on the click event
[throttle] | number | time (in ms) to throttle click emits (set to 1000-3000 to prevent double-clicks)
(clicked) | EventEmitter<wbr>&lt;MouseEvent&gt; | emits on button click | &nbsp;