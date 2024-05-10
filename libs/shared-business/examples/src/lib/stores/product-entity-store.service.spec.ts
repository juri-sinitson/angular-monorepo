import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductEntityStoreService } from './product-entity-store.service';
import { getAllProductsUrl } from './urls';
// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';
import { ProductInterface } from '../interfaces/product.interface';

// TODO! Crete the test generator

describe('ProductService', () => {
  let service: ProductEntityStoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductEntityStoreService],
    });
    service = TestBed.inject(ProductEntityStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });

  const mockProducts: ProductInterface[] = [
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

  describe('List Endpoint with the method GET', () => {
    const pageObject = {
      mockListEndpoint: () => {
        const req = httpMock.expectOne(getAllProductsUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockProducts);
      },
      mockListEndpointByEmptyList: () => {
        const req = httpMock.expectOne(getAllProductsUrl);
        expect(req.request.method).toBe('GET');
        req.flush([]);
      },
      simulateErrorOfListEndpoint: () => {
        const req = httpMock.expectOne(getAllProductsUrl);
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      },
    };

    it('should have entities ON data success BY any', () => {
      pageObject.mockListEndpoint();
      expect(service.entities()).toEqual(mockProducts);
    });

    it('should toggle loading ON data loading BY any', () => {
      expect(service.isLoading()).toBe(true);
      pageObject.mockListEndpoint();
      expect(service.isLoading()).toBe(false);
    });

    it('should have no entities ON data success BY no data', () => {
      pageObject.mockListEndpointByEmptyList();
      expect(service.noData()).toBe(true);
    });

    it('should have error ON network error BY any', () => {
      pageObject.simulateErrorOfListEndpoint();
      const error: MessageInterface = {
        severity: 'error',
        summary: 'Error of network request',
        detail: `Http failure response for ${getAllProductsUrl}: 404 Not Found`,
      };
      expect(service.messages()).toEqual([error]);
    });
  });
});
