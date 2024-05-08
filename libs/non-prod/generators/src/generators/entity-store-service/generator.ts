import {
  readProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { strings } from '@angular-devkit/core';
import * as path from 'path';

import { EntityStoreServiceGeneratorSchema } from './schema';

export async function entityStoreServiceGenerator(
  tree: Tree,
  options: EntityStoreServiceGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;
  
  const filesRoot = `${projectRoot}/src/lib/stores`;
  const className = `${strings.classify(options.entityName)}`;
  const classNamePlural = `${className}s`;
  const fileName = `${strings.dasherize(options.entityName)}`;

  generateFiles(tree, path.join(__dirname, 'files'), filesRoot, {
    className,
    fileName,    
    entityName: fileName,
    classNamePlural,
    getUrlName: `getAll${classNamePlural}Url`,
    interfaceName: `${strings.classify(options.entityName)}Interface`,    
  });
  await formatFiles(tree);
}

export default entityStoreServiceGenerator;
