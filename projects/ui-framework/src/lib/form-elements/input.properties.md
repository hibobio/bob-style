#### Input-type elements common properties
Name | Type | Description | Default
--- | --- | --- | ---
[value] | string/number | value of input field | &nbsp;
[minChars] | number | minimum length | &nbsp;
[maxChars] | number | maximum length.<br> *Note:* It might not make sense to provide minChars/maxChars for number-type inputs, but if you do, the input will be limited by number of digits.  | &nbsp;
[showCharCounter] | boolean | set to false to hide character counter | true
[enableBrowserAutoComplete] | InputAutoCompleteOptions | turn on/off browser autocomplete | off
(inputEvents) | EventEmitter<wbr>&lt;InputEvent&gt; | input events emitter | &nbsp;