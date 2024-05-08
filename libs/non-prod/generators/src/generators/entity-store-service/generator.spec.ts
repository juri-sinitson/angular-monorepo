import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { entityStoreServiceGenerator } from './generator';
import { EntityStoreServiceGeneratorSchema } from './schema';

describe('entity-store-service generator', () => {
  let tree: Tree;
  const project = 'my-lib';
  const entityName = 'MyProduct';
  const root = `libs/${project}`;

  const options: EntityStoreServiceGeneratorSchema = { 
    entityName, 
    project,
   };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should match snapshot ON any BY any', async () => {
    
    addProjectConfiguration(tree, project, { root });
    await entityStoreServiceGenerator(tree, options);
    
    const serviceFileContent = tree.read(`${root}/src/lib/stores/my-product-entity-store.service.ts`);    
    if(serviceFileContent) {      
      expect(serviceFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Service file not found in virtual tree!');
    }
    
    const specFileContent = tree.read(`${root}/src/lib/stores/my-product-entity-store.service.spec.ts`);
    if(specFileContent) {
      expect(specFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Spec file not found in the virtual tree!');
    }
  });
});
