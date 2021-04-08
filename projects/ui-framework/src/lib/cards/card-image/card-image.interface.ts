import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface ImageCard {
  imageUrl: string;
  imageClass?: string | string[] | NgClass;
  imageStyle?: GenericObject<string>;
  imageRatio?: number;

  title: string;
  titleClass?: string | string[] | NgClass;
  titleStyle?: GenericObject<string>;

  action?: (...args: any[]) => void;
}
