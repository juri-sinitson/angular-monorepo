import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { entityBackendMockGenerator } from './generator';
import { EntityBackendMockGeneratorSchema } from './schema';

describe('entity-backend-mock generator', () => {
  let tree: Tree;
  const project = 'my-app';
  const entityName = 'MyProduct';
  const root = `apps/${project}`;
  const mainFileName = `${root}/src/main.ts`;

  const options: EntityBackendMockGeneratorSchema = { 
    entityName, 
    project,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should match snapshot ON any BY any', async () => {
    addProjectConfiguration(tree, project, { root });
    await entityBackendMockGenerator(tree, options);

    const mainFileContent = tree.read(mainFileName);
    if(mainFileContent) {      
      expect(mainFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Service file not found in virtual tree!');
    }
  });
});
