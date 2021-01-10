import { Injectable } from '@angular/core';
import { AvatarShowcase, ShowcaseInputItem } from './avatar-showcase.interface';
import { SelectGroupOption } from '../../lists/list.interface';
import {
  simpleUID,
  isSelectGroupOptions,
  objectRemoveKeys,
  isNotEmptyArray,
} from '../../services/utils/functional-utils';
import { Avatar } from '../avatar/avatar.interface';
import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

@Injectable()
export class AvatarShowcaseService {
  constructor() {}

  public employeeListMapper: OperatorFunction<
    ShowcaseInputItem[],
    SelectGroupOption[]
  > = map((employees: ShowcaseInputItem[]) => {
    return this.isSelectGroupOptions(employees)
      ? employees
      : this.isAvatarShowcase(employees)
      ? this.mapAvatarShowcaseToSelectGroupOptions(employees)
      : [];
  });

  public avatarsMapper: OperatorFunction<ShowcaseInputItem[], Avatar[]> = map(
    (employees: ShowcaseInputItem[]) => {
      return this.isAvatars(employees)
        ? employees
        : this.isSelectGroupOptions(employees)
        ? this.mapSelectGroupOptionsToAvatars(employees)
        : this.isAvatarShowcase(employees)
        ? this.mapAvatarShowcaseToAvatars(employees)
        : [];
    }
  );

  private isSelectGroupOptions(
    options: ShowcaseInputItem[]
  ): options is SelectGroupOption[] {
    return isSelectGroupOptions(options);
  }

  private isAvatarShowcase(
    employees: ShowcaseInputItem[]
  ): employees is AvatarShowcase[] {
    return (
      isNotEmptyArray(employees) && employees[0].id && employees[0].displayName
    );
  }

  private isAvatars(avatars: ShowcaseInputItem[]): avatars is Avatar[] {
    return (
      isNotEmptyArray(avatars) && (avatars[0].imageSource || avatars[0].icon)
    );
  }

  private mapSelectGroupOptionsToAvatars(
    options: SelectGroupOption[]
  ): Avatar[] {
    return (
      options &&
      options[0]?.options?.map((option) => {
        const attributes = objectRemoveKeys(option.prefixComponent.attributes, [
          'disabled',
          'size',
        ]);

        return {
          ...attributes,
          imageSource: attributes.imageSource || null,
          icon: attributes.icon || null,
        };
      })
    );
  }

  private mapAvatarShowcaseToAvatars(employees: AvatarShowcase[]): Avatar[] {
    return employees?.map((employee) => ({
      imageSource: employee.imageSource || null,
      icon: employee.icon || null,
    }));
  }

  private mapAvatarShowcaseToSelectGroupOptions(
    employees: AvatarShowcase[]
  ): SelectGroupOption[] {
    const groupID = simpleUID();
    return (
      employees && [
        {
          groupName: groupID,
          key: groupID,
          options: employees.map((employee: AvatarShowcase, indx: number) => ({
            value: employee.displayName,
            id: employee.id || groupID + '_' + indx,
            selected: false,
            prefixComponent: {
              component: null,
              attributes: {
                imageSource: employee.imageSource || null,
                icon: employee.icon || null,
              },
            },
          })),
        },
      ]
    );
  }
}
