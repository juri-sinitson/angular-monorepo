import {
  readProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { strings } from '@angular-devkit/core';

import { EntityBackendMockGeneratorSchema } from './schema';

export async function entityBackendMockGenerator(
  tree: Tree,
  options: EntityBackendMockGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    entityInterfaceName: `${strings.classify(options.entityName)}Interface`,
    entityInUrlNamePlural: `${strings.dasherize(options.entityName)}s`,      
  });
  await formatFiles(tree);
}

export default entityBackendMockGenerator;
