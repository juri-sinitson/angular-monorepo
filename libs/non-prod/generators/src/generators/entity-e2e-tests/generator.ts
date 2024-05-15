import {
  readProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { strings } from '@angular-devkit/core';
import * as path from 'path';

import { EntityE2eTestsGeneratorSchema } from './schema';

export async function entityE2eTestsGenerator(
  tree: Tree,
  options: EntityE2eTestsGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;
  const entitySelectorName = `${strings.dasherize(options.entityName)}`;
  const entitySelectorNamePlural = `${entitySelectorName}s`;

  const className = `${strings.classify(options.entityName)}`;  

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    urlName: `${strings.camelize(options.entityName)}sUrl`,
    entitySelectorNamePlural,
    classNamePlural: `${className}s`,
  });
  await formatFiles(tree);
}

export default entityE2eTestsGenerator;
