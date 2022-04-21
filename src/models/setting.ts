import { Replacement } from './replacement';

export interface Setting {
  path: string;
  replacements: Replacement[];
}
