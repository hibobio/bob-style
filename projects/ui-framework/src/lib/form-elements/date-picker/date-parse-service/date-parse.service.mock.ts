import { thisYear, thisMonth } from '../../../services/utils/functional-utils';

export const DateParseServiceTest = {
  'dd/MM/yyyy': {
    '02 03 2010': {
      result: '02/03/2010',
      resultStrict: '02/03/2010',
    },
    '2010 feb 10': {
      result: '10/02/2010',
      resultStrict: '10/02/2010',
    },
    'feb.10.2010': {
      result: '10/02/2010',
      resultStrict: '10/02/2010',
    },
    '10 feb 2010': {
      result: '10/02/2010',
      resultStrict: '10/02/2010',
    },
    '20 5 2010': {
      result: '20/05/2010',
      resultStrict: '20/05/2010',
    },
    '5-20-2010': {
      result: '20/05/2010',
      resultStrict: '20/05/2010',
    },
    '2010 5 20': {
      result: '20/05/2010',
      resultStrict: '20/05/2010',
    },
    '2010/5/3': {
      result: '05/03/2010',
      resultStrict: '05/03/2010',
    },
    '5 2010 3': {
      result: '05/03/2010',
      resultStrict: '05/03/2010',
    },
    '2010 05': { result: '01/05/2010', resultStrict: null },
    'may 2010': { result: '01/05/2010', resultStrict: null },
    '20 02': {
      result: '20/02/' + thisYear(),
      resultStrict: null,
    },
    '02 05': {
      result: '02/05/' + thisYear(),
      resultStrict: null,
    },
    '02': {
      result: '02/' + thisMonth() + '/' + thisYear(),
      resultStrict: null,
    },
    '2010': { result: '01/01/2010', resultStrict: null },
    '20': {
      result: '20/' + thisMonth() + '/' + thisYear(),
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: '02/03/2010',
      resultStrict: '02/03/' + thisYear(),
    },
    'mar 2010 2 20': {
      result: '20/03/2010',
      resultStrict: '02/03/2010',
    },
    '2 2010 20 5': {
      result: '20/02/2010',
      resultStrict: '20/02/2010',
    },
  },
  'dd/MMM/yyyy': {
    '02 03 2010': {
      result: '02/Mar/2010',
      resultStrict: '02/Mar/2010',
    },
    '2010 feb 10': {
      result: '10/Feb/2010',
      resultStrict: '10/Feb/2010',
    },
    'feb.10.2010': {
      result: '10/Feb/2010',
      resultStrict: '10/Feb/2010',
    },
    '10 feb 2010': {
      result: '10/Feb/2010',
      resultStrict: '10/Feb/2010',
    },
    '20 5 2010': {
      result: '20/May/2010',
      resultStrict: '20/May/2010',
    },
    '5-20-2010': {
      result: '20/May/2010',
      resultStrict: '20/May/2010',
    },
    '2010 5 20': {
      result: '20/May/2010',
      resultStrict: '20/May/2010',
    },
    '2010/5/3': {
      result: '05/Mar/2010',
      resultStrict: '05/Mar/2010',
    },
    '5 2010 3': {
      result: '05/Mar/2010',
      resultStrict: '05/Mar/2010',
    },
    '2010 05': { result: '01/May/2010', resultStrict: null },
    'may 2010': { result: '01/May/2010', resultStrict: null },
    '20 02': {
      result: '20/Feb/' + thisYear(),
      resultStrict: null,
    },
    '02 05': {
      result: '02/May/' + thisYear(),
      resultStrict: null,
    },
    '02': {
      result: '02/' + thisMonth(true, 0, true) + '/' + thisYear(),
      resultStrict: null,
    },
    '2010': { result: '01/Jan/2010', resultStrict: null },
    '20': {
      result: '20/' + thisMonth(true, 0, true) + '/' + thisYear(),
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: '02/Mar/2010',
      resultStrict: '02/Mar/' + thisYear(),
    },
    'mar 2010 2 20': {
      result: '20/Mar/2010',
      resultStrict: '02/Mar/2010',
    },
    '2 2010 20 5': {
      result: '20/Feb/2010',
      resultStrict: '20/Feb/2010',
    },
  },
  'MMM/dd/yyyy': {
    '02 03 2010': {
      result: 'Feb/03/2010',
      resultStrict: 'Feb/03/2010',
    },
    '2010 feb 10': {
      result: 'Feb/10/2010',
      resultStrict: 'Feb/10/2010',
    },
    'feb.10.2010': {
      result: 'Feb/10/2010',
      resultStrict: 'Feb/10/2010',
    },
    '10 feb 2010': {
      result: 'Feb/10/2010',
      resultStrict: 'Feb/10/2010',
    },
    '20 5 2010': {
      result: 'May/20/2010',
      resultStrict: 'May/20/2010',
    },
    '5-20-2010': {
      result: 'May/20/2010',
      resultStrict: 'May/20/2010',
    },
    '2010 5 20': {
      result: 'May/20/2010',
      resultStrict: 'May/20/2010',
    },
    '2010/5/3': {
      result: 'May/03/2010',
      resultStrict: 'May/03/2010',
    },
    '5 2010 3': {
      result: 'May/03/2010',
      resultStrict: 'May/03/2010',
    },
    '2010 05': { result: 'May/01/2010', resultStrict: null },
    'may 2010': { result: 'May/01/2010', resultStrict: null },
    '20 02': {
      result: 'Feb/20/' + thisYear(),
      resultStrict: null,
    },
    '02 05': {
      result: 'Feb/05/' + thisYear(),
      resultStrict: null,
    },
    '02': {
      result: 'Feb/01/' + thisYear(),
      resultStrict: null,
    },
    '2010': { result: 'Jan/01/2010', resultStrict: null },
    '20': {
      result: thisMonth(true, 0, true) + '/20/' + thisYear(),
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: 'Mar/02/2010',
      resultStrict: 'Mar/02/' + thisYear(),
    },
    'mar 2010 2 20': {
      result: 'Mar/20/2010',
      resultStrict: 'Mar/02/2010',
    },
    '2 2010 20 5': {
      result: 'Feb/20/2010',
      resultStrict: 'Feb/20/2010',
    },
  },
  'MMM/dd/yy': {
    'feb.10.2010': {
      result: 'Feb/10/10',
      resultStrict: 'Feb/10/10',
    },
    '2010 5 20': {
      result: 'May/20/10',
      resultStrict: 'May/20/10',
    },
    '20 02': {
      result: 'Feb/20/' + thisYear(true),
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: 'Mar/02/10',
      resultStrict: 'Mar/02/' + thisYear(true),
    },
  },
  'yyyy/MM/dd': {
    '02 03 2010': {
      result: '2010/02/03',
      resultStrict: '2010/02/03',
    },
    '2010 feb 10': {
      result: '2010/02/10',
      resultStrict: '2010/02/10',
    },
    'feb.10.2010': {
      result: '2010/02/10',
      resultStrict: '2010/02/10',
    },
    '10 feb 2010': {
      result: '2010/02/10',
      resultStrict: '2010/02/10',
    },
    '20 5 2010': {
      result: '2010/05/20',
      resultStrict: '2010/05/20',
    },
    '5-20-2010': {
      result: '2010/05/20',
      resultStrict: '2010/05/20',
    },
    '2010 5 20': {
      result: '2010/05/20',
      resultStrict: '2010/05/20',
    },
    '2010/5/3': {
      result: '2010/05/03',
      resultStrict: '2010/05/03',
    },
    '5 2010 3': {
      result: '2010/05/03',
      resultStrict: '2010/05/03',
    },
    '2010 05': { result: '2010/05/01', resultStrict: null },
    'may 2010': { result: '2010/05/01', resultStrict: null },
    '20 02': {
      result: thisYear() + '/02/20',
      resultStrict: null,
    },
    '02 05': {
      result: thisYear() + '/02/05',
      resultStrict: null,
    },
    '02': {
      result: thisYear() + '/02/01',
      resultStrict: null,
    },
    '2010': { result: '2010/01/01', resultStrict: null },
    '20': {
      result: thisYear() + '/' + thisMonth() + '/20',
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: '2010/03/02',
      resultStrict: thisYear() + '/03/02',
    },
    'mar 2010 2 20': {
      result: '2010/03/20',
      resultStrict: '2010/03/02',
    },
    '2 2010 20 5': {
      result: '2010/02/20',
      resultStrict: '2010/02/20',
    },
  },
  'yy/MM/dd': {
    '2010 feb 10': {
      result: '10/02/10',
      resultStrict: '10/02/10',
    },
    'feb.10.2010': {
      result: '10/02/10',
      resultStrict: '10/02/10',
    },
    '20 02': {
      result: thisYear(true) + '/02/20',
      resultStrict: null,
    },
    '02 05': {
      result: thisYear(true) + '/02/05',
      resultStrict: null,
    },
    '02': {
      result: thisYear(true) + '/02/01',
      resultStrict: null,
    },
    '2 2010 20 5': {
      result: '10/02/20',
      resultStrict: '10/02/20',
    },
  },
  'yy/dd/MM': {
    '02 03 2010': {
      result: '10/02/03',
      resultStrict: '10/02/03',
    },
    '2010 feb 10': {
      result: '10/10/02',
      resultStrict: '10/10/02',
    },
    'feb.10.2010': {
      result: '10/10/02',
      resultStrict: '10/10/02',
    },
    '10 feb 2010': {
      result: '10/10/02',
      resultStrict: '10/10/02',
    },
    '20 5 2010': {
      result: '10/20/05',
      resultStrict: '10/20/05',
    },
    '5-20-2010': {
      result: '10/20/05',
      resultStrict: '10/20/05',
    },
    '2010 5 20': {
      result: '10/20/05',
      resultStrict: '10/20/05',
    },
    '2010/5/3': {
      result: '10/05/03',
      resultStrict: '10/05/03',
    },
    '5 2010 3': {
      result: '10/05/03',
      resultStrict: '10/05/03',
    },
    '2010 05': { result: '10/01/05', resultStrict: null },
    'may 2010': { result: '10/01/05', resultStrict: null },
    '20 02': {
      result: thisYear(true) + '/20/02',
      resultStrict: null,
    },
    '02 05': {
      result: thisYear(true) + '/02/05',
      resultStrict: null,
    },
    '02': {
      result: thisYear(true) + '/02/' + thisMonth(),
      resultStrict: null,
    },
    '2010': { result: '10/01/01', resultStrict: null },
    '20': {
      result: thisYear(true) + '/20/' + thisMonth(),
      resultStrict: null,
    },
    '2 4 mar 2010': {
      result: '10/02/03',
      resultStrict: thisYear(true) + '/02/03',
    },
    'mar 2010 2 20': {
      result: '10/20/03',
      resultStrict: '10/02/03',
    },
    '2 2010 20 5': {
      result: '10/20/02',
      resultStrict: '10/20/02',
    },
  },
  'MMM-dd-yyyy': {
    'feb.10.2010': {
      result: 'Feb-10-2010',
      resultStrict: 'Feb-10-2010',
    },
    '2010 5 20': {
      result: 'May-20-2010',
      resultStrict: 'May-20-2010',
    },
    '20 02': {
      result: 'Feb-20-' + thisYear(),
      resultStrict: null,
    },
    '02': {
      result: 'Feb-01-' + thisYear(),
      resultStrict: null,
    },
    '20': {
      result: thisMonth(true, 0, true) + '-20-' + thisYear(),
      resultStrict: null,
    },
    'mar 2010 2 20': {
      result: 'Mar-20-2010',
      resultStrict: 'Mar-02-2010',
    },
  },
  'MM-dd-yyyy': {
    '02 03 2010': {
      result: '02-03-2010',
      resultStrict: '02-03-2010',
    },
    '2010 feb 10': {
      result: '02-10-2010',
      resultStrict: '02-10-2010',
    },
    'feb.10.2010': {
      result: '02-10-2010',
      resultStrict: '02-10-2010',
    },
    '10 feb 2010': {
      result: '02-10-2010',
      resultStrict: '02-10-2010',
    },
    '20 5 2010': {
      result: '05-20-2010',
      resultStrict: '05-20-2010',
    },
    '5-20-2010': {
      result: '05-20-2010',
      resultStrict: '05-20-2010',
    },
    '2010 5 20': {
      result: '05-20-2010',
      resultStrict: '05-20-2010',
    },
    '2010/5/3': {
      result: '05-03-2010',
      resultStrict: '05-03-2010',
    },
    '5 2010 3': {
      result: '05-03-2010',
      resultStrict: '05-03-2010',
    },
    '2010 05': { result: '05-01-2010', resultStrict: null },
    'may 2010': { result: '05-01-2010', resultStrict: null },
    '20 02': {
      result: '02-20-' + thisYear(),
      resultStrict: null,
    },
    '02 05': {
      result: '02-05-' + thisYear(),
      resultStrict: null,
    },
    '02': {
      result: '02-01-' + thisYear(),
      resultStrict: null,
    },
    '2010': { result: '01-01-2010', resultStrict: null },
    '20': {
      result: thisMonth() + '-20-' + thisYear(),
      resultStrict: null,
    },
    '2 3 mar 2010': {
      result: '03-02-2010',
      resultStrict: '03-02-' + thisYear(),
    },
    'mar 2010 2 20': {
      result: '03-20-2010',
      resultStrict: '03-02-2010',
    },
    '2 2010 20 5': {
      result: '02-20-2010',
      resultStrict: '02-20-2010',
    },
  },
  'dd-MMM-yyyy': {
    '5-20-2010': {
      result: '20-May-2010',
      resultStrict: '20-May-2010',
    },
    '2010 05': { result: '01-May-2010', resultStrict: null },
    '20 02': {
      result: '20-Feb-' + thisYear(),
      resultStrict: null,
    },
    '2010': { result: '01-Jan-2010', resultStrict: null },
    '20': {
      result: '20-' + thisMonth(true, 0, true) + '-' + thisYear(),
      resultStrict: null,
    },
    '03 2 mar 2010': {
      result: '03-Mar-2010',
      resultStrict: '03-Mar-' + thisYear(),
    },
  },
  'dd/mm': {
    '02 03 2010': { result: '02/03', resultStrict: '02/03' },
    'feb.10.2010': { result: '10/02', resultStrict: '10/02' },
    '10 feb 2010': { result: '10/02', resultStrict: '10/02' },
    '20 5 2010': { result: '20/05', resultStrict: '20/05' },
    '5-20-2010': { result: '20/05', resultStrict: '20/05' },
    '20 02': {
      result: '20/02',
      resultStrict: '20/02',
    },
    '02 05': {
      result: '02/05',
      resultStrict: '02/05',
    },
    '2010': { result: '01/01', resultStrict: null },
    '2 4 mar 2010': {
      result: '02/03',
      resultStrict: '02/04',
    },
    'mar 2010 2 20': {
      result: '20/03',
      resultStrict: '01/03',
    },
    '02': {
      result: '02/' + thisMonth(),
      resultStrict: null,
    },
    '20': {
      result: '20/' + thisMonth(),
      resultStrict: null,
    },
    '2010 feb 10': { result: '10/02', resultStrict: '01/02' },
    '2010 5 20': { result: '20/05', resultStrict: '01/05' },
    '2010/5/3': { result: '05/03', resultStrict: '01/05' },
    '5 2010 3': { result: '05/03', resultStrict: '01/05' },
    '2010 05': { result: '01/05', resultStrict: '01/05' },
    'may 2010': { result: '01/05', resultStrict: '01/05' },
    '2 2010 20 5': { result: '20/02', resultStrict: '01/02' },
  },
  yyyy: {
    '02 03 2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '10 feb 2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '20 5 2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '5-20-2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '20 02': {
      result: thisYear() + '',
      resultStrict: thisYear() + '',
    },
    '02 05': {
      result: thisYear() + '',
      resultStrict: thisYear() + '',
    },
    '2010': { result: '2010', resultStrict: '2010' },
    '2 4 mar 2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '02': {
      result: thisYear() + '',
      resultStrict: thisYear() + '',
    },
    '20': {
      result: thisYear() + '',
      resultStrict: thisYear() + '',
    },
    '2010 feb 10': { result: '2010', resultStrict: '2010' },
    '2010 5 20': { result: '2010', resultStrict: '2010' },
    '2010/5/3': { result: '2010', resultStrict: '2010' },
    '5 2010 3': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    '2010 05': { result: '2010', resultStrict: '2010' },
    '2 2010 20 5': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    'feb.10.2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    'mar 2010 2 20': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
    'may 2010': {
      result: '2010',
      resultStrict: thisYear() + '',
    },
  },
  'mm/yyyy': {
    '02 03 2010': {
      result: '02/2010',
      resultStrict: '02/' + thisYear(),
    },
    'feb.10.2010': {
      result: '02/2010',
      resultStrict: '02/' + thisYear(),
    },
    '10 feb 2010': {
      result: '02/2010',
      resultStrict: '02/' + thisYear(),
    },
    '20 5 2010': {
      result: '05/2010',
      resultStrict: '05/' + thisYear(),
    },
    '5-20-2010': {
      result: '05/2010',
      resultStrict: '05/' + thisYear(),
    },
    '20 02': {
      result: '02/' + thisYear(),
      resultStrict: '02/' + thisYear(),
    },
    '02 05': {
      result: '02/' + thisYear(),
      resultStrict: '02/' + thisYear(),
    },
    '2010': { result: '01/2010', resultStrict: null },
    '5 2 mar 2010': {
      result: '03/2010',
      resultStrict: '05/' + thisYear(),
    },
    'mar 2010 2 20': {
      result: '03/2010',
      resultStrict: '03/2010',
    },
    '04': {
      result: '04/' + thisYear(),
      resultStrict: null,
    },
    '20': {
      result: thisMonth() + '/' + thisYear(),
      resultStrict: null,
    },
    '2010 feb 10': {
      result: '02/2010',
      resultStrict: '02/2010',
    },
    '2010 5 20': {
      result: '05/2010',
      resultStrict: '05/2010',
    },
    '2010/5/3': {
      result: '05/2010',
      resultStrict: '05/2010',
    },
    '5 2010 3': {
      result: '05/2010',
      resultStrict: '05/2010',
    },
    '2010 05': { result: '05/2010', resultStrict: '05/2010' },
    'may 2010': {
      result: '05/2010',
      resultStrict: '05/2010',
    },
    '03 2010 20 5': {
      result: '03/2010',
      resultStrict: '03/2010',
    },
  },
  mm: {
    '04 02 2010': { result: '04', resultStrict: '04' },
    'feb.10.2010': { result: '02', resultStrict: '02' },
    '10 feb 2010': { result: '02', resultStrict: '10' },
    '20 5 2010': { result: '05', resultStrict: thisMonth() },
    '5-20-2010': { result: '05', resultStrict: '05' },
    '20 02': {
      result: '02',
      resultStrict: thisMonth(),
    },
    '02 05': {
      result: '02',
      resultStrict: '02',
    },
    '2 3 mar 2010': {
      result: '03',
      resultStrict: '02',
    },
    'mar 2010 2 20': { result: '03', resultStrict: '03' },
    '04': {
      result: '04',
      resultStrict: '04',
    },
    '20': {
      result: thisMonth(),
      resultStrict: thisMonth(),
    },
    '2010': {
      result: '01',
      resultStrict: '01',
    },
    '2010 feb 10': {
      result: '02',
      resultStrict: '01',
    },
    '2010 5 20': { result: '05', resultStrict: '01' },
    '2010/5/3': { result: '05', resultStrict: '01' },
    '5 2010 3': { result: '05', resultStrict: '05' },
    '2010 05': { result: '05', resultStrict: '01' },
    'may 2010': { result: '05', resultStrict: '05' },
    '2 2010 20 5': { result: '02', resultStrict: '02' },
  },
  'dd.MM.yyyy': {
    '999': {
      result: '01.01.' + thisYear(),
      resultStrict: null,
    },
    '31 02 2019': {
      result: '28.02.2019',
      resultStrict: '28.02.2019',
    },
    '02 04 9999': {
      result: '02.04.' + thisYear(),
      resultStrict: '02.04.' + thisYear(),
    },
    '2 3 81': {
      result: '02.03.1981',
      resultStrict: '02.03.1981',
    },
    '81 21': {
      result: '21.' + thisMonth() + '.1981',
      resultStrict: null,
    },
  },
};
