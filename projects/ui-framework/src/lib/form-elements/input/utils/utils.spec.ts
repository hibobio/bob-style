import BUtils from './utils';

describe('Utils', () => {
  describe('Input Attributes', () => {
    it('Should add attributes to base input', () => {
      const inputTemplate = BUtils.addAttributesToBaseInput('[myCustomAttribute1]="1" [myCustomAttribute2]="2"');
      expect(inputTemplate).toContain('[myCustomAttribute1]="1" [myCustomAttribute2]="2">');
    });
  });
});
