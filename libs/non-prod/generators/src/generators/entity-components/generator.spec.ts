import { fail } from 'assert';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { entityComponentsGenerator } from './generator';
import { EntityComponentsGeneratorSchema } from './schema';

describe('entity-components generator', () => {
  let tree: Tree;
  const project = 'my-lib';
  const entityName = 'MyProduct';
  const fileNamePrefix = 'my-products';
  const root = `libs/${project}`;
  const fileRoot = `${root}/src/lib/components/my-products`;

  const presentationalComponentFile = `${fileRoot}/${fileNamePrefix}.component.ts`;
  const storyFile = `${fileRoot}/${fileNamePrefix}.component.stories.ts`;
  const smartComponentFile = `${fileRoot}/${fileNamePrefix}-smart.component.ts`;
  const crud = true;

  const options: EntityComponentsGeneratorSchema = {     
    entityName, 
    project,
    crud,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should match snapshot ON any BY any', async () => {
    
    addProjectConfiguration(tree, project, { root });
    await entityComponentsGenerator(tree, options);    

    const presentationalComponentFileContent = tree.read(presentationalComponentFile);
    if(presentationalComponentFileContent) {      
      expect(presentationalComponentFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Presentational component file not found in virtual tree!');
    }

    const storyFileFileContent = tree.read(storyFile);
    if(storyFileFileContent) {      
      expect(storyFileFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Component story file not found in virtual tree!');
    }

    const smartComponentFileContent = tree.read(smartComponentFile);
    if(smartComponentFileContent) {      
      expect(smartComponentFileContent.toString('utf-8')).toMatchSnapshot();
    } else {
      fail('Smart component file not found in virtual tree!');
    }
  });
});
