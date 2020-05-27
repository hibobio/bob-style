import { FormatNumberPipe } from './formatNumber.pipe';

describe('FormatNumberPipe', () => {
  const pipe = new FormatNumberPipe();

  it('should format number and limit decimal points to 2', () => {
    expect(pipe.transform(123456.789)).toEqual('123,456.79');
  });

  it('should format string that looks like number', () => {
    expect(pipe.transform('123456.789')).toEqual('123,456.79');
  });

  it('should format NaN as 0', () => {
    expect(pipe.transform('something')).toEqual('0');
  });
});
