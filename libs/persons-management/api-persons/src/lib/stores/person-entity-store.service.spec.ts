import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';

import { PersonEntityStoreService } from './person-entity-store.service';
// -- STEP 1: ADJUST THE URL! --
import { getAllPersonsUrl } from './urls';
// -- STEP 2: ADJUST THE INTERFACE PATH! --
import { PersonInterface } from '../interfaces/person.interface';

describe('PersonEntityStoreService', () => {
  let service: PersonEntityStoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonEntityStoreService],
    });
    service = TestBed.inject(PersonEntityStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });

  // -- STEP 3: ADJUST THE MOCK DATA! --
  // You can tell an AI-Solution (e.g. GitHub copilot)
  // to do this for you by telling which entity interface
  // should be used for this.
  const mockProducts: PersonInterface[] = [
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
    flushEntities: () => {
      const req = httpMock.expectOne(getAllPersonsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    },
    flushEmpty: () => {
      const req = httpMock.expectOne(getAllPersonsUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    },
    flushError: () => {
      const req = httpMock.expectOne(getAllPersonsUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    },
    flushUnknownError: () => {
      const req = httpMock.expectOne(getAllPersonsUrl);
      req.error(new ProgressEvent(''));
    },
  };

  it('should have Persons ON data success BY any', () => {
    productPage.flushEntities();
    expect(service.entities()).toEqual(mockProducts);
  });

  it('should toggle loading ON data loading BY any', () => {
    expect(service.isLoading()).toBe(true);
    productPage.flushEntities();
    expect(service.isLoading()).toBe(false);
  });

  it('should have no Persons ON data success BY no data', () => {
    productPage.flushEmpty();
    expect(service.noData()).toBe(true);
  });

  it('should have error ON network error BY any', () => {
    productPage.flushError();
    const error: MessageInterface = {
      severity: 'error',
      summary: 'Error loading products',
      detail: `Http failure response for ${getAllPersonsUrl}: 404 Not Found`,
    };
    expect(service.messages()).toEqual([error]);
  });
});
