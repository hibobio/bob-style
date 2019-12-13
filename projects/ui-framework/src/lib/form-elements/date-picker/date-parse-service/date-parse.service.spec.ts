import { DateParseService } from './date-parse.service';
import { DateParseServiceTest } from './date-parse.service.mock';

describe('DateParseService', () => {
  const parser = new DateParseService();

  describe('parseDate', () => {
    it('Should parse correctly', () => {
      Object.keys(DateParseServiceTest).forEach(format => {
        Object.keys(DateParseServiceTest[format]).forEach(date => {
          const parsed = parser.parseDate(format as any, date);

          const parsedStrict = parser.parseDate(format as any, date, true);

          expect(parsed.value).toEqual(
            DateParseServiceTest[format][date].result
          );

          expect(parsedStrict.value).toEqual(
            DateParseServiceTest[format][date].resultStrict
          );
        });
      });
    });
  });
});
