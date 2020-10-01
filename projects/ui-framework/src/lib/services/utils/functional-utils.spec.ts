import { hasChanges, isNumber, simpleChange } from './functional-utils';

describe('Functional Utils', () => {
  //
  describe('NgOnChanges Helpers', () => {
    //
    describe('hasChanges', () => {
      //
      it('should return true 1', () => {
        expect(
          hasChanges(
            simpleChange({
              a: 1,
              b: 2,
              c: 3,
            }),
            ['a']
          )
        ).toEqual(true);
      });
      it('should return true 2', () => {
        expect(
          hasChanges(
            simpleChange({
              c: 3,
              d: 4,
            }),
            ['a', 'b', 'c']
          )
        ).toEqual(true);
      });
      it('should return true 3', () => {
        expect(
          hasChanges(
            simpleChange({
              a: null,
              b: 2,
              c: 3,
            }),
            ['a', 'b'],
            true
          )
        ).toEqual(true);
      });
      it('should return true 4', () => {
        expect(
          hasChanges(
            simpleChange({
              a: null,
              b: 2,
              c: 3,
            }),
            ['a', 'b'],
            true
          )
        ).toEqual(true);
      });
      it('should return true 5', () => {
        expect(
          hasChanges(
            simpleChange({
              a: 1,
              b: 2,
              c: 3,
            }),
            ['a', 'b'],
            true,
            {
              truthyCheck: isNumber,
            }
          )
        ).toEqual(true);
      });
      it('should return true 6', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: [1, 2, 3],
                b: 2,
                c: 3,
              },
              false,
              {
                a: [3, 2, 1, 4],
                b: 2,
                c: 3,
              }
            ),
            ['a', 'b', 'c'],
            false,
            {
              checkEquality: true,
            }
          )
        ).toEqual(true);
      });
      it('should return true 7', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: { weird: 'shit' },
                b: 2,
                c: 3,
              },
              false,
              {
                a: { weird: 'shit', shit: 'weird' },
                b: 2,
                c: 3,
              }
            ),
            ['a', 'b', 'c'],
            false,
            {
              checkEquality: true,
            }
          )
        ).toEqual(true);
      });

      it('should return false 1', () => {
        expect(
          hasChanges(
            simpleChange({
              a: 1,
              b: 2,
              c: 3,
            }),
            ['d']
          )
        ).toEqual(false);
      });
      it('should return false 1', () => {
        expect(
          hasChanges(
            simpleChange({
              c: 3,
              d: 4,
            }),
            ['a', 'b']
          )
        ).toEqual(false);
      });
      it('should return false 2', () => {
        expect(
          hasChanges(
            simpleChange({
              a: null,
              b: 0,
              c: 3,
            }),
            ['a', 'b'],
            true
          )
        ).toEqual(false);
      });
      it('should return false 3', () => {
        expect(
          hasChanges(
            simpleChange({
              a: 'a',
              b: 'b',
              c: 'c',
            }),
            ['a', 'b'],
            true,
            {
              truthyCheck: isNumber,
            }
          )
        ).toEqual(false);
      });
      it('should return false 4', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: [1, 2, 3],
                b: 2,
                c: 3,
              },
              false,
              {
                a: [3, 2, 1],
                b: 2,
                c: 3,
              }
            ),
            ['a', 'b', 'c'],
            false,
            {
              checkEquality: true,
            }
          )
        ).toEqual(false);
      });
      it('should return false 5', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: { weird: 'shit', shit: undefined },
                b: 2,
                c: 3,
              },
              false,
              {
                a: { weird: 'shit' },
                b: 2,
                c: 3,
              }
            ),
            ['a', 'b', 'c'],
            false,
            {
              checkEquality: true,
            }
          )
        ).toEqual(false);
      });
    });

    describe('firstChanges', () => {
      //
      it('should return true', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: 1,
                b: 2,
                c: 3,
              },
              true
            ),
            ['a']
          )
        ).toEqual(true);
      });

      it('should return false', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: 1,
                b: 2,
                c: 3,
              },
              false
            ),
            ['a']
          )
        ).toEqual(true);
      });
    });

    describe('notFirstChanges', () => {
      //
      it('should return true', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: 1,
                b: 2,
                c: 3,
              },
              false
            ),
            ['a']
          )
        ).toEqual(true);
      });

      it('should return false', () => {
        expect(
          hasChanges(
            simpleChange(
              {
                a: 1,
                b: 2,
                c: 3,
              },
              true
            ),
            ['a']
          )
        ).toEqual(true);
      });
    });
  });
});
