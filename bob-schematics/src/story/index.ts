import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  mergeWith,
  template,
  url,
  chain,
  move
} from '@angular-devkit/schematics';
// import * as ts from 'typescript';
import { Schema as FieldOptions } from './schema';

export default function(options: FieldOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    const templateSource = apply(url('./files'), [
      template({
        'if-flat': (o: any) => (options.flat ? '' : o),
        typescript: 'ts',
        ...strings,
        ...options
      }),
      move('/', options.path)
    ]);

    return chain([branchAndMerge(mergeWith(templateSource))])(host, context);
  };
}
