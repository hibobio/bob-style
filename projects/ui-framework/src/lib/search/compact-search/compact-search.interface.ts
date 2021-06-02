import { SearchConfig } from '../search/search.interface';

export interface CompactSearchConfig extends SearchConfig {
  openIfNotEmpty?: boolean;
}
