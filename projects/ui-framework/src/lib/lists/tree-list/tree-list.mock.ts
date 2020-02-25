import { TreeListOption } from './tree-list.interface';
import {
  makeArray,
  randomNumber,
  simpleUID,
} from '../../services/utils/functional-utils';
import { mockText, mockAnimals } from '../../mock.const';

const groupProbability = 40;
const maxDepth = 5;
const groupItemsMinMax: [number, number] = [4, 8];

const genOption = () =>
  ({
    id: simpleUID('opt-', 7),
    name: mockText(randomNumber(1, 3)),
  } as TreeListOption);

const genGroup = (depthCounter = 0) =>
  ({
    id: simpleUID('grp-', 7),
    name: mockText(randomNumber(1, 3)),
    children: makeArray(randomNumber(...groupItemsMinMax)).map(() =>
      genGroupOrOption(depthCounter + 1)
    ) as TreeListOption[],
  } as TreeListOption);

const genGroupOrOption = (depthCounter = 0) => {
  const doGroup = randomNumber() > 100 - groupProbability;

  return doGroup && depthCounter <= maxDepth - 1
    ? genGroup(depthCounter)
    : genOption();
};

export const HListMock: TreeListOption[] = makeArray(5).map(() =>
  genGroupOrOption(1)
);
if (!HListMock.find(i => i.children)) {
  HListMock[0] = genGroup(1);
}

const mxRootOptns = 3;
const mxInsdOptns = 3;

export const HListMockSimple: TreeListOption[] = makeArray(mxRootOptns).map(
  (i, indx) => {
    if (indx === 1 || indx === Math.max(2, mxRootOptns - 2)) {
      return ({
        serverId: `option-${indx + 1}-group-${indx}`,
        value: `0${indx + 1} Group ${indx}`,
        canBeDeleted: true,
        children: [
          {
            serverId: `option-${indx + 1}-group-${indx}-option-1`,
            value: `0${indx + 1} G${indx} Option 1`,
            canBeDeleted: true,
          },
          {
            serverId: `option-${indx + 1}-group-${indx}-option-2-group-${indx +
              1}`,
            value: `O${indx + 1} G${indx} O2 Group ${indx + 1}`,
            canBeDeleted: true,
            children: makeArray(mxInsdOptns).map(
              (i, ndx) =>
                ({
                  serverId: `option-${indx +
                    1}-group-${indx}-option-2-group-${indx + 1}-option-${ndx +
                    1}`,
                  value: `O${indx + 1} G${indx} O2 G${indx + 1} Option ${ndx +
                    1}`,
                  canBeDeleted: true,
                } as TreeListOption)
            ),
          } as TreeListOption,
          ...makeArray(mxInsdOptns - 2).map(
            (i, ndx) =>
              ({
                serverId: `option-${indx + 1}-group-${indx}-option-${ndx + 3}`,
                value: `02 G${indx} Option ${ndx + 3}`,
                canBeDeleted: true,
              } as TreeListOption)
          ),
        ],
      } as any) as TreeListOption;
    }

    return {
      serverId: `option-${indx + 1}`,
      value: `Option ${indx + 1}`,
      canBeDeleted: true,
    } as TreeListOption;
  }
);
