export const PIE_CHART_DATA_MOCK = [
  ['Human Resources', 3],
  ['Client Services', 34002],
  ['Business Development', 1],
  ['Marketing', 9],
  ['Product', 6],
  ['unknown', 1],
  ['Development', 10],
  ['Sales', 6]];

const arrayOfEmployees = PIE_CHART_DATA_MOCK.map((department) => {
  return department[1];
});
export const NUMBER_OF_EMPLOYEES = (arrayOfEmployees as number[]).reduce((a, b) => a + b);

export const TOOLTIP_FORMATTER_MOCK_RESULT = `<div class="chart-tooltip">
      <div class="value" style="color:red;">
          ILS formatted 48 end
      </div>
      <div class="key">balloons</div>
    </div>`
