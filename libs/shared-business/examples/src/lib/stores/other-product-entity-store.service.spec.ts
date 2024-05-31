import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { specConfig } from '@angular-monorepo/shared/util-common-non-prod';

import { OtherProductEntityStoreService } from './other-product-entity-store.service';
import { otherProductsUrl } from './urls'
import { ProductInterface } from '../interfaces/product.interface';
// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';

describe('ProductService', () => {
 let service: OtherProductEntityStoreService;
 let httpMock: HttpTestingController;

 beforeEach(() => {
    TestBed.configureTestingModule({      
      providers: [
         specConfig.providers,
         OtherProductEntityStoreService
      ]
    });
    service = TestBed.inject(OtherProductEntityStoreService);
    httpMock = TestBed.inject(HttpTestingController);
 });

 afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
 });

const mockProducts: ProductInterface[] =  [
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
];

const productPage = {
  flushProducts: () => {
     const req = httpMock.expectOne(otherProductsUrl);
     expect(req.request.method).toBe('GET');
     req.flush(mockProducts);
  },
  flushEmpty: () => {
     const req = httpMock.expectOne(otherProductsUrl);
     expect(req.request.method).toBe('GET');
     req.flush([]);
  },
  flushError: () => {
     const req = httpMock.expectOne(otherProductsUrl);
     req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  },
  flushUnknownError: () => {
    const req = httpMock.expectOne(otherProductsUrl);
    req.error(new ProgressEvent(''));
 }
};

 it('should have products ON data success BY any', () => {        
    productPage.flushProducts();
    expect(service.entities()).toEqual(mockProducts);    
 });

 it('should toggle loading ON data loading BY any', () => {            
    expect(service.isLoading()).toBe(true);
    productPage.flushProducts();
    expect(service.isLoading()).toBe(false);
 });

 it('should have no products ON data success BY no data', () => {
   productPage.flushEmpty();
   expect(service.noData()).toBe(true);    
 });

 it('should have error ON network error BY any', () => {
    productPage.flushError();
    const error: MessageInterface = {
      severity: 'error',
      summary: 'Network error',
      detail: `Http failure response for ${otherProductsUrl}: 404 Not Found`
    }
    expect(service.messages()).toEqual([error]);
 });
});
