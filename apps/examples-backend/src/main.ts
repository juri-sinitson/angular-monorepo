import express from 'express';

// TODO: adjust project tags and as the case may be
// rearrange the libs. 
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductInterface } from '@angular-monorepo/shared-business/examples';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const app = express();

const productsList: ProductInterface[] = [
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
]

const otherProductsList: ProductInterface[] = [
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
]

app.use(express.json());

app.get('/', (req, res) => {
  res.send({});
});

app.get('/api/examples/products', (req, res) => {
  res.send(productsList);
});

/**
 * Created on the fast track for E2E testing demo purposes.
 * One of the goals is to demonstrate E2E testing 
 * of a page with multiple API calls.
 */
app.get('/api/examples/other-products', (req, res) => {
  res.send(otherProductsList);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
