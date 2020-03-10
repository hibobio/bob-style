import { TreeListOption } from './tree-list.interface';
import {
  makeArray,
  randomNumber,
  simpleUID,
} from '../../services/utils/functional-utils';
import { mockText, mockBadJobs } from '../../mock.const';
import { ArrayES } from '../../types';

export const makeRandomList = (
  rootItems = 5,
  groupProbability = 40,
  maxDepth = 5,
  groupItemsMinMax: [number, number] = [4, 8]
): TreeListOption[] => {
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
        // tslint:disable-next-line: no-use-before-declare
        genGroupOrOption(depthCounter + 1)
      ) as TreeListOption[],
    } as TreeListOption);

  const genGroupOrOption = (depthCounter = 0) => {
    const doGroup = randomNumber() > 100 - groupProbability;

    return doGroup && depthCounter <= maxDepth - 1
      ? genGroup(depthCounter)
      : genOption();
  };

  const list: TreeListOption[] = makeArray(rootItems).map(() =>
    genGroupOrOption(1)
  );

  if (!list.find(i => i.children)) {
    list[0] = genGroup(1);
  }

  return list;
};

export const HListMock: TreeListOption[] = makeRandomList(5);

export const HListMockValues = (HListMock.filter(
  option => option.children
) as ArrayES<TreeListOption>)
  .flatMap(group => group.children)
  .filter(option => option.children)
  .sort(() => 0.5 - Math.random())
  .slice(0, 5)
  .map(
    option => option.children[randomNumber(0, option.children.length - 1)].id
  );

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
              (_i, ndx) =>
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
            (_i, ndx) =>
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

export const HListMockSingleGroup: TreeListOption[] = [
  {
    id: simpleUID(),
    name: 'Bad jobs',
    children: makeArray(10).map(() => ({
      id: simpleUID(),
      name: mockBadJobs(1),
    })),
  },
];
