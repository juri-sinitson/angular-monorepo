import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';

import { strings } from '@angular-devkit/core';

import * as path from 'path';
import { EntityComponentsGeneratorSchema } from './schema';

export async function entityComponentsGenerator(
  tree: Tree,
  options: EntityComponentsGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;

  const componentFolderName = `${strings.dasherize(options.entityName)}s`;
  const filesRoot = `${projectRoot}/src/lib/components/${componentFolderName}`;
  const entityName = strings.capitalize(options.entityName);
  generateFiles(tree, path.join(__dirname, 'files'), filesRoot, {
    className: `${strings.classify(options.entityName)}s`,
    fileName: `${strings.dasherize(options.entityName)}s`,
    fileNameSingular: `${strings.dasherize(options.entityName)}`,
    entityName,
    entityInterfaceName: `${entityName}Interface`,
    selectorName: `${strings.dasherize(options.entityName)}s`,
    entityServiceClassName: `${strings.classify(options.entityName)}EntityStoreService`,
    entityServiceName: `${strings.camelize(options.entityName)}Service`,
    originalName: options.entityName,
    crud: options.crud,
  });

  await formatFiles(tree);
}

export default entityComponentsGenerator;
