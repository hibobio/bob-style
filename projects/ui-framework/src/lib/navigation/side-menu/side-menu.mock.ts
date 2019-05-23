import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import { IconComponent } from '../../icons/icon.component';
import { IconColor, Icons } from '../../icons/icons.enum';

export const getSideMenuOptionsMock: () => SideMenuOption[] = () => [
  {
    id: 1,
    displayName: 'option 1',
    prefix: {
      component: IconComponent,
      attributes: {
        icon: Icons.folder,
        color: IconColor.light,
      },
    },
    actions: [
      {
        label: 'action 1',
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  },
  {
    id: 2,
    displayName: 'option 2',
    prefix: {
      component: IconComponent,
      attributes: {
        icon: Icons.folder,
        color: IconColor.light,
      },
    },
    actions: [
      {
        label: 'action 2',
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  },
  {
    id: 3,
    displayName: 'option 3',
    prefix: {
      component: IconComponent,
      attributes: {
        icon: Icons.folder,
        color: IconColor.light,
      },
    },
    actions: [
      {
        label: 'action 3',
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  },
  {
    id: 4,
    displayName: 'option 4',
    prefix: {
      component: IconComponent,
      attributes: {
        icon: Icons.folder,
        color: IconColor.light,
      },
    },
    actions: [
      {
        label: 'action 4',
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  },
  {
    id: 5,
    displayName: 'option 5',
    prefix: {
      component: IconComponent,
      attributes: {
        icon: Icons.folder,
        color: IconColor.light,
      },
    },
    actions: [
      {
        label: 'action 5',
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  },
];
