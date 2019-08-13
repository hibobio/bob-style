import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ui-components', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('ui-component', { name: 'ui-component', skipImport: true }, Tree.empty());
    console.log(tree.files);
    expect(tree.files.length).toEqual(7);
  });
});
