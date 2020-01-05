import { EmployeeShowcase } from './employees-showcase.interface';
import { simpleUID, makeArray } from '../../services/utils/functional-utils';
import { mockNames, mockAvatar } from '../../mock.const';

export const EMPLOYEE_SHOWCASE_MOCK: EmployeeShowcase[] = makeArray(20).map(
  i => ({
    id: simpleUID(),
    displayName: mockNames(1),
    imageSource: mockAvatar(),
  })
);
