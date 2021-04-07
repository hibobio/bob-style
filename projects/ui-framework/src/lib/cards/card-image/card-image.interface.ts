

import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface ImageCard {
  imgSrc: string;
  title: string;
  action?: (...args: any[]) => void;

  imageClass?: string | string[] | NgClass;
  imageStyle?: GenericObject<string>;

  titleClass?: string | string[] | NgClass;
  titleStyle?: GenericObject<string>;
}
