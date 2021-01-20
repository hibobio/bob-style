#### Datepicker/DateRangePicker common properties
Name | Type | Description | Default
--- | --- | --- | ---
[type] | DatepickerType | date or month picker | date
[dateFormat] | string | string, representing date format (will also be used as default placeholder) | &nbsp;
[minDate] | Date / string (YYYY-MM-DD) | minimum date | &nbsp;
[maxDate] | Date / string (YYYY-MM-DD) | maximum date | &nbsp;
(dateChange) | EventEmitter<wbr>&lt;DatePickerChangeEvent / DateRangePickerChangeEvent&gt; |  Emited on date change | &nbsp;

#### Notes

- In `[type]="'month'"` mode, the output date will be 1st of month, and the end date `.to` (in case of DateRangePicker) will be the last day of month (28-31).
- the output event object also contains `.date` property that contains value as Date object (in case of DateRangePicker it contains  `.startDate` and `.endDate` as Date objects).