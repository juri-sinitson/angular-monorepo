import express from 'express';

// TODO: adjust project tags and as the case may be
// rearrange the libs.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface as EntityInterface } from '@angular-monorepo/shared-business/examples';
import { generateRandomCode, nextId } from './lib';

const router = express.Router();

const startingId = 1000;

const entitiesListBackup: Readonly<EntityInterface[]> = Object.freeze([
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Entity Description',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
  {
    id: '1001',
    code: 'nvklal433',
    name: 'Black Watch',
    description: 'Entity Description',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4,
  },
  {
    id: '1002',
    code: 'zz21cz3c1',
    name: 'Blue Band',
    description: 'Product Description',
    price: 79,
    category: 'Fitness',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 3,
  },
  {
    id: '1003',
    code: '244wgerg2',
    name: 'Blue T-Shirt',
    description: 'Product Description',
    price: 29,
    category: 'Clothing',
    quantity: 25,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
  {
    id: '1004',
    code: 'h456wer53',
    name: 'Bracelet',
    description: 'Product Description',
    price: 15,
    category: 'Accessories',
    quantity: 73,
    inventoryStatus: 'INSTOCK',
    rating: 4,
  },
  {
    id: '1005',
    code: 'av2231fwg',
    name: 'Brown Purse',
    description: 'Product Description',
    price: 120,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4,
  },
]);
const otherProductsListBackup: Readonly<EntityInterface[]> = Object.freeze([
  {
    id: '1000',
    code: 'bib36pfvm',
    name: 'Chakra Bracelet',
    description: 'Product Description',
    price: 32,
    category: 'Accessories',
    quantity: 5,
    inventoryStatus: 'LOWSTOCK',
    rating: 3,
  },
  {
    id: '1001',
    code: 'mbvjkgip5',
    name: 'Galaxy Earrings',
    description: 'Product Description',
    price: 34,
    category: 'Accessories',
    quantity: 23,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
  {
    id: '1002',
    code: 'vbb124btr',
    name: 'Game Controller',
    description: 'Product Description',
    price: 99,
    category: 'Electronics',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 4,
  },
  {
    id: '1003',
    code: 'cm230f032',
    name: 'Gaming Set',
    description: 'Product Description',
    price: 299,
    category: 'Electronics',
    quantity: 63,
    inventoryStatus: 'INSTOCK',
    rating: 3,
  },
  {
    id: '1004',
    code: 'plb34234v',
    name: 'Gold Phone Case',
    description: 'Product Description',
    price: 24,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4,
  },
  {
    id: '1005',
    code: '4920nnc2d',
    name: 'Green Earbuds',
    description: 'Product Description',
    price: 89,
    category: 'Electronics',
    quantity: 23,
    inventoryStatus: 'INSTOCK',
    rating: 4,
  },
]);

const entitiesList: EntityInterface[] = [...entitiesListBackup];
const otherProductsList: EntityInterface[] = [...otherProductsListBackup];

function restoreData() {
  // Restore the entities list to the backup
  entitiesList.splice(0, entitiesList.length, ...entitiesListBackup);
  otherProductsList.splice(0, otherProductsList.length, ...otherProductsListBackup);
}

function generateNextId(): string {
  return nextId(startingId, entitiesList);  
}

router.post('/api/shared-business/seed', (req, res) => {
  restoreData();
  res.send({message: 'Data restored successfully'});
});

router.get('/api/examples/products', (req, res) => {
  res.send(entitiesList);
});


router.post('/api/examples/products', (req, res) => {

  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const newEntity: EntityInterface = req.body;
  // Generate the next id and random code for the new entity
  const nextId = generateNextId();
  const randomCode = generateRandomCode();

  // Add the new id and code to the new entity
  newEntity.id = nextId;
  newEntity.code = randomCode;

  setTimeout(() => {
    // Add the new product to the products list
    entitiesList.push(newEntity);
    res.send(newEntity);
  }, 0);

});

router.put('/api/examples/products/:id', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/
  
  const id = req.params.id;
  const updatedEntity: EntityInterface = req.body;

  // Find the product and update it
  const entityIndex = entitiesList.findIndex((entity) => entity.id === id);
  if (entityIndex !== -1) {
    // Add a delay of 1 second before updating the product
    setTimeout(() => {
      entitiesList[entityIndex] = updatedEntity;
      res.send(updatedEntity);
    }, 0);
  } else {
    res.sendStatus(404);
  }
});

// handle delete request
router.delete('/api/examples/products/:id', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const id = req.params.id;

  setTimeout(() => {
    // Find the product and delete it
    const entityIndex = entitiesList.findIndex((entity) => entity.id === id);
    if (entityIndex !== -1) {
      entitiesList.splice(entityIndex, 1);
      res.send({message: 'Deleted successfully'});
    }
  }, 0);
  
});

router.get('/api/examples/other-products', (req, res) => {
  res.send(otherProductsListBackup);
});

export default router;
