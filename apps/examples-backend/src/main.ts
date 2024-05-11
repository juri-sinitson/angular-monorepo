import express from 'express';

// TODO: adjust project tags and as the case may be
// rearrange the libs.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const app = express();

// -- STEP 2: ADJUST THE MOCK DATA! --
// You can tell an AI-Solution (e.g. GitHub copilot)
// to do this for you by telling which entity interface
// should be used for this.
const entitiesListBackup: Readonly<ProductInterface[]> = Object.freeze([
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
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
    description: 'Product Description',
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
const otherProductsListBackup: Readonly<ProductInterface[]> = Object.freeze([
  {
    id: '1006',
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
    id: '1007',
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
    id: '1008',
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
    id: '1009',
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
    id: '1010',
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
    id: '1011',
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

const entitiesList: ProductInterface[] = [...entitiesListBackup];
const otherProductsList: ProductInterface[] = [...otherProductsListBackup];

function restoreData() {
  // Restore the entities list to the backup
  entitiesList.splice(0, entitiesList.length, ...entitiesListBackup);
  otherProductsList.splice(0, otherProductsList.length, ...otherProductsListBackup);
}

function generateNextId(): string {
  // Find the maximum id in the entitiesList
  const maxId = entitiesListBackup.reduce((max, entity) => {
    const entityId = Number(entity.id);
    return entityId > max ? entityId : max;
  }, 0);

  // Generate the next id by incrementing the maximum id by 1
  const nextId = (maxId + 1).toString();

  return nextId;
}

function generateRandomCode(): string {
  // Generate a random code using alphanumeric characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

app.use(express.json());

app.post('/api/seed', (req, res) => {
  restoreData();
  res.send({message: 'Data restored successfully'});
});

app.get('/api/examples/products', (req, res) => {
  res.send(entitiesList);
});


app.post('/api/examples/products', (req, res) => {

  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const newEntity: ProductInterface = req.body;
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

app.put('/api/examples/products/:id', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/
  
  const id = req.params.id;
  const updatedEntity: ProductInterface = req.body;

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
app.delete('/api/examples/products/:id', (req, res) => {
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

/**
 * Created on the fast track for E2E testing demo purposes.
 * One of the goals is to demonstrate E2E testing 
 * of a page with multiple API calls.
 */
app.get('/api/examples/other-products', (req, res) => {
  res.send(otherProductsListBackup);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
