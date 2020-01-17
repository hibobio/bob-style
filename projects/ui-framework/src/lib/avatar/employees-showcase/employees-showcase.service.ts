import { Injectable } from '@angular/core';
import { EmployeeShowcase } from './employees-showcase.interface';
import { SelectGroupOption } from '../../lists/list.interface';
import {
  isEmptyArray,
  simpleUID,
  stringify,
  asArray,
  isArray,
  randomNumber,
  hasProp,
} from '../../services/utils/functional-utils';
import { AvatarImageComponent } from '../avatar/avatar-image/avatar-image.component';
import { AvatarSize } from '../avatar/avatar.enum';
import cloneDeep from 'lodash/cloneDeep';
import { Avatar } from '../avatar/avatar.interface';

@Injectable()
export class EmployeesShowcaseService {
  constructor() {}

  public getEmployeeListOptions(
    employees: EmployeeShowcase[] | SelectGroupOption[],
    clone = false
  ): SelectGroupOption[] {
    if (!employees || isEmptyArray(employees)) {
      return [{ groupName: 'empty', options: [] }];
    }

    if (this.isCorrectGroupOptions(employees)) {
      return (clone ? cloneDeep(employees) : employees) as SelectGroupOption[];
    }

    if (this.isCorrectViewModel(employees)) {
      const groupID = simpleUID();
      return [
        {
          groupName: groupID,
          key: groupID,
          options: (employees as EmployeeShowcase[]).map(
            (employee: EmployeeShowcase, indx: number) => ({
              value: employee.displayName,
              id: employee.id || groupID + '_' + indx,
              selected: false,
              prefixComponent: {
                component: AvatarImageComponent,
                attributes: {
                  imageSource: employee.imageSource,
                  size: AvatarSize.mini,
                },
              },
            })
          ),
        },
      ];
    }

    throw new Error(
      `Provided [employees] (${stringify(
        this.isGroupOptions(employees)
          ? (employees as SelectGroupOption[])[0].options.slice(0, 3)
          : asArray(employees as EmployeeShowcase[]).slice(0, 3)
      )}...) is missing required data.`
    );
  }

  public getShowcaseViewModel(
    employeeListOptions: SelectGroupOption[]
  ): Avatar[] {
    if (!this.isCorrectGroupOptions(employeeListOptions)) {
      return [];
    }
    return employeeListOptions[0].options.map(
      option => option.prefixComponent.attributes
    );
  }

  public shuffleShowcaseViewModel(
    showcaseViewModel: Avatar[],
    avatarsToFit: number,
    doOnSuccess = () => {}
  ): Avatar[] {
    const firstIndex = randomNumber(0, avatarsToFit > 1 ? avatarsToFit - 1 : 0);
    const secondIndex = randomNumber(
      avatarsToFit,
      showcaseViewModel.length > 1 ? showcaseViewModel.length - 1 : 0
    );

    if (firstIndex !== secondIndex) {
      const firstEmployee = cloneDeep(showcaseViewModel[firstIndex]);
      showcaseViewModel[firstIndex] = showcaseViewModel[secondIndex];
      showcaseViewModel[secondIndex] = firstEmployee;

      doOnSuccess();
    }

    return showcaseViewModel;
  }

  private isGroupOptions(
    employees: EmployeeShowcase[] | SelectGroupOption[]
  ): boolean {
    return Boolean(
      isArray(employees) &&
        employees[0] &&
        isArray((employees as SelectGroupOption[])[0].options)
    );
  }

  private optionHasAvatarComponent(option: any): boolean {
    return Boolean(
      option.prefixComponent &&
        option.prefixComponent.attributes &&
        hasProp(option.prefixComponent.attributes, 'imageSource')
    );
  }

  private isCorrectGroupOptions(
    employees: EmployeeShowcase[] | SelectGroupOption[]
  ): boolean {
    return (
      this.isGroupOptions(employees) &&
      this.optionHasAvatarComponent(
        (employees as SelectGroupOption[])[0].options[0]
      )
    );
  }

  private isCorrectViewModel(
    employees: EmployeeShowcase[] | SelectGroupOption[]
  ): boolean {
    return Boolean(
      isArray(employees) &&
        hasProp((employees as EmployeeShowcase[])[0], 'imageSource')
    );
  }
}
