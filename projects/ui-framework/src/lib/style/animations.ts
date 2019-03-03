import { animate, animation, keyframes, style } from '@angular/animations';

export const slideUpDown = animation([
  animate(
    '{{ timings }}',
    keyframes([
      style({ transform: 'translateY({{ from }})', offset: 0 }),
      style({ transform: 'translateY({{ to }})', offset: 1 }),
    ]),
  ),
]);
