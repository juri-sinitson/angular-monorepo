import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { entityE2eTestsGenerator } from './generator';
import { EntityE2eTestsGeneratorSchema } from './schema';

describe('entity-e2e-tests generator', () => {
  let tree: Tree;
  const project = 'my-app-e2e';
  const entityName = 'MyProduct';
  const root = `apps/${project}`;
  const fileRoot = `${root}/src/e2e`;
  const file = `${fileRoot}/main-page.cy.ts`;

  const options: EntityE2eTestsGeneratorSchema = { 
    entityName, 
    project,
   };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should match snapshot ON any BY any', async () => {
    
    addProjectConfiguration(tree, project, { root });
    await entityE2eTestsGenerator(tree, options);
    
    const fileContent = tree.read(file);
    
    if(fileContent) {      
      expect(fileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Service file not found in virtual tree!');
    }    
  });
});
