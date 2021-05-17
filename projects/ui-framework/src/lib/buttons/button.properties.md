#### Buttons common properties (interface Button)
Name | Type | Description | Default
--- | --- | --- | ---
[button] | <u>Button</u> | all inputs/props can also be provided as single object | &nbsp;
[id] | string | (optional) unique string that will be added as both id and class to the button element (usefull for tracking)
[text] | string | button text (alternative to passing text inside b-button element) | &nbsp;
[disabled] | boolean | disabled | false
[swallow] | boolean | if true, will preventDefault and stopPropagation on the click event
[throttle] | number | time (in ms) to throttle click emits (set to 1000-3000 to prevent double-clicks)
(clicked) | EventEmitter<wbr>&lt;MouseEvent&gt; | emits on button click | &nbsp;