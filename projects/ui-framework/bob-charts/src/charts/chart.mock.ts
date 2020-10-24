export const LINE_CHART_DATA_MOCK = [
  ['Human Resources', 3],
  ['Client Services', 8],
  ['Business Development', 1],
  ['Marketing', 9],
  ['Product', 6],
  ['unknown', 1],
  ['Development', 10],
  ['Sales', 6],
];

export const MULTI_BAR_CHART_DATA_MOCK = [
  {
    name: 'John',
    data: [5, 3, 4, 7, 2],
  },
  {
    name: 'Jane',
    data: [2, 2, 3, 2, 1],
  },
  {
    name: 'Joe',
    data: [3, 4, 4, 2, 5],
  },
];

export const COMBINED_STACKED_BAR_CHART_DATA_MOCK = [
  {
    type: 'column',
    name: 'Jane',
    data: [3, 2, 1, 3, 4],
  },
  {
    type: 'spline',
    name: 'Average',
    data: [null, null, 3, 6.33, 3.33],
    marker: {
      lineWidth: 2,
      lineColor: 'blue',
      fillColor: 'white',
    },
  },
];
export const COMBINED_BAR_CHART_DATA_MOCK = [
  {
    type: 'column',
    name: 'Jane',
    data: [3, 2, 1, 3, 4],
  },
  {
    type: 'column',
    name: 'John',
    data: [2, 3, 5, 7, 6],
  },
  {
    type: 'column',
    name: 'Joe',
    data: [4, 3, 3, 9, 0],
  },
  {
    type: 'spline',
    name: 'Average',
    data: [null, null, 3, 6.33, 3.33],
    marker: {
      lineWidth: 2,
      lineColor: 'blue',
      fillColor: 'white',
    },
  },
];

export const MULTI_BAR_CHART_CATEGORIES = [
  'column 1',
  'column 2',
  'column 3',
  'column 4',
  'column 5',
];

const arrayOfEmployees = LINE_CHART_DATA_MOCK.map((department) => {
  return department[1];
});
export const NUMBER_OF_EMPLOYEES = (arrayOfEmployees as number[]).reduce(
  (a, b) => a + b
);
