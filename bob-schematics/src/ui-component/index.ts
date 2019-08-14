import {apply, branchAndMerge, chain, externalSchematic, mergeWith, Rule, schematic, SchematicContext, SchematicsException, source, Tree} from '@angular-devkit/schematics';
import {Schema as ComponentOptions} from '@schematics/angular/component/schema';
// import { InsertChange } from '@schematics/angular/utility/change';
// import * as ts from 'typescript';
// import { getProject } from '../utils/projects';


// function addExportsToPublicApi(options: any): Rule {
//   return (host) => {
//     const project = getProject();
//     if (!project) {return host; }
//
//     // TODO: find better solution to get the api.
//     const componentPath = project.root + 'projects/ui-components/src/lib/public-api.ts';
//     const text = host.read(componentPath);
//
//     if (text === null) {
//       throw new SchematicsException(`Public api file does not exist, please create file in ${componentPath} .`);
//     }
//
//     const sourceText = text.toString('utf-8');
//     const tsFile = ts.createSourceFile(componentPath, sourceText, ts.ScriptTarget.Latest, true);
//     const declarationRecorder = host.beginUpdate(componentPath);
//     const end = tsFile.getEnd();
//     const change = new InsertChange(componentPath, end, `\nexport * from './${strings.dasherize(options.name)}';`);
//
//     declarationRecorder.insertLeft(change.pos, change.toAdd);
//     host.commitUpdate(declarationRecorder);
//
//     return host;
//   }
// }


export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {

    if (!options.name) {
      throw new SchematicsException('please specify name with --name');
    }

    // const templateSource = apply(
    //     url('./files'),
    //     [
    //       template({
    //         'if-flat': (o: any) => options.flat ? '' : o,
    //         typescript: 'ts',
    //         ...strings,
    //         ...options,
    //       }),
    //       move('/', options.path)
    //     ]
    // );

    const module = apply(source(host),
        [
          // branchAndMerge(mergeWith(templateSource)),
          externalSchematic('@schematics/angular', 'module', options as ComponentOptions),
          schematic('story', options)
        ]
    );

    return chain([
      branchAndMerge(chain([mergeWith(module)])),
      // addExportsToPublicApi(options),
      externalSchematic('@schematics/angular',
        'component', {...options, styleext: 'scss', export: true} as ComponentOptions)
    ])(host, context);
  };
}
