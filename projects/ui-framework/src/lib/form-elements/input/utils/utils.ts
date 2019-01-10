import {baseInputTemplate} from '../input.component';
import {inputAttributesPlaceholder} from '../../../consts';

export default class BUtils {
  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }
}
