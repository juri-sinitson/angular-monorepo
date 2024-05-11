import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { ProductEntityStoreService } from './product-entity-store.service';
import { productsUrl as url } from './urls';
// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';
import { ProductInterface as EntityInterface } from '../interfaces/product.interface';

describe('ProductEntityStoreService', () => {
  
  let service: ProductEntityStoreService;
  let httpMock: HttpTestingController;

  const additionalEntity: EntityInterface = {
    id: '1002',
    code: 'nvklal433',
    name: 'Blue Watch',
    description: 'An extra blue watch',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4,
 };
 
  const entitiesList: EntityInterface[] = [
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

  const triggerListMock = (): void => {
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(entitiesList);
  };

  const expectError = (): void => {
    const error: MessageInterface = {
      severity: 'error',
      summary: 'Network error',
      detail: `Http failure response for ${url}: 404 Not Found`,
    };
    expect(service.messages()).toEqual([error]);
    expect(service.isError()).toBe(true);
  };

  const flushError = (req: TestRequest): void => {
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  }

  describe('List of entities', () => {
    const pageObject = {
      triggerListMock,
      triggerListMockByEmptyList: () => {
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush([]);
      },
      triggerListError: () => {
        const req = httpMock.expectOne(url);
        flushError(req);
      },
      expectError,
    };

    it('should have entities ON data success BY any', () => {
      pageObject.triggerListMock();
      expect(service.entities()).toEqual(entitiesList);
      expect(service.messages()).toEqual([]);
    });

    it('should toggle loading ON data loading BY any', () => {
      expect(service.isLoading()).toBe(true);
      pageObject.triggerListMock();
      expect(service.isLoading()).toBe(false);
    });

    it('should have no entities ON data success BY no data', () => {
      pageObject.triggerListMockByEmptyList();
      expect(service.noData()).toBe(true);
    });

    it('should have error ON network error BY any', () => {
      pageObject.triggerListError();
      pageObject.expectError();
    });
  });

  describe('Create a new entity', () => {
    const pageObject = {
      triggerListMock,
      triggerEntityCreatingMock: () => {            
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(additionalEntity);   
        req.flush(additionalEntity);
      },
      triggerCreationError: () => {
        const req = httpMock.expectOne(url);        
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(additionalEntity);        
        flushError(req);
      },
      expectAddedEntity: () => {
        expect(service.entities()[2]).toEqual(additionalEntity);
      },
      expectError,
    };

    it('should add entity ON data success BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      triggerListMock();
      // Then test the adding
      service.addEntity(additionalEntity);      
      pageObject.triggerEntityCreatingMock();
      pageObject.expectAddedEntity();
    });

    it('should toggle loading ON loading BY any', () => {      
      // Trigger the loading of the data first because we load
      // the data on init of the store
      triggerListMock();
      // Then test the adding
      service.addEntity(additionalEntity);
      expect(service.isLoading()).toBe(true);
      pageObject.triggerEntityCreatingMock();
      expect(service.isLoading()).toBe(false);    
      pageObject.expectAddedEntity();
    });

    it('should have error ON network error BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      triggerListMock();
      // Then test the error when adding
      service.addEntity(additionalEntity);
      pageObject.triggerCreationError();
      pageObject.expectError();
    });

    it('should select uncreated entity', () => {
      pageObject.triggerListMock();
      service.selectUncreatedEntity();
      expect(service.selectedEntity()).toBe(null);
      expect(service.isNewEntityBeingEdited()).toBe(true);
    });
  });

  describe('Delete an entity', () => {
    const entityId = entitiesList[0].id;

    const pageObject = {
      triggerListMock,
      triggerDeleteMock: () => {        
        const req = httpMock.expectOne(`${url}/${entityId}`);        
        expect(req.request.method).toBe('DELETE');
        expect(req.request.url).toBe(`${url}/${entityId}`);        
        req.flush({});
      },
      triggerDeleteError: () => {
        const req = httpMock.expectOne(`${url}/${entityId}`);
        expect(req.request.method).toBe('DELETE');
        flushError(req);
      },
      expectError,
      expectEntityDeleted: () => {
        expect(service.entities()).not.toContainEqual({ id: entityId });
        expect(service.entities()).toEqual([entitiesList[1]]);        
      }
    };

    it('should delete entity ON delete success BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      triggerListMock();
      // Then test the deleting
      service.deleteEntity(entityId);
      pageObject.triggerDeleteMock();
      pageObject.expectEntityDeleted();
    });
  
    it('should toggle loading ON loading BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      pageObject.triggerListMock();
      // Then test the loading when deleting
      service.deleteEntity(entityId);
      expect(service.isLoading()).toBe(true);
      pageObject.triggerDeleteMock();
      expect(service.isLoading()).toBe(false);
      pageObject.expectEntityDeleted();
    });

    it('should have error ON network error BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      pageObject.triggerListMock();
      // Then test the error when deleting
      service.deleteEntity(entityId);
      pageObject.triggerDeleteError();
      pageObject.expectError;
    });    
  
  });

  describe('Update an entity', () => {
    const entityId = entitiesList[0].id;
    const updatedEntity: EntityInterface = { ...entitiesList[0], name: 'Updated Name' };

    const pageObject = {
      triggerListMock,
      triggerUpdateMock: () => {        
        const req = httpMock.expectOne(`${url}/${entityId}`);        
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(updatedEntity);
        req.flush(updatedEntity);
      },
      triggerUpdateError: () => {
        const req = httpMock.expectOne(`${url}/${entityId}`);
        expect(req.request.method).toBe('PUT');
        flushError(req);
      },
      expectError: () => {
        const error: MessageInterface = {
          severity: 'error',
          summary: 'Network error',
          detail: `Http failure response for ${url}/${entityId}: 404 Not Found`,
        };
        expect(service.messages()).toEqual([error]);
      },
      expectEntityUpdated: () => {
        expect(service.entities()).toContainEqual(updatedEntity);
        expect(service.entities()).not.toContainEqual(entitiesList[0]);        
      }
    };

    it('should update entity ON update success BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      pageObject.triggerListMock();
      // Then test the updating
      service.updateEntity(updatedEntity);
      pageObject.triggerUpdateMock();
      pageObject.expectEntityUpdated();
    });

    it('should toggle loading ON loading BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      pageObject.triggerListMock();
      // Then test the loading when updating
      service.updateEntity(updatedEntity);
      expect(service.isLoading()).toBe(true);
      pageObject.triggerUpdateMock();
      expect(service.isLoading()).toBe(false);
      pageObject.expectEntityUpdated();
    });

    it('should have error ON network error BY any', () => {
      // Trigger the loading of the data first because we load
      // the data on init of the store
      pageObject.triggerListMock();
      // Then test the error when updating
      service.updateEntity(updatedEntity);
      pageObject.triggerUpdateError();
      pageObject.expectError();
    });
    
    // create test for selectEntityId
    it('should select entity id', () => {
      pageObject.triggerListMock();
      service.selectEntityId(entityId);
      expect(service.selectedEntity()).toEqual(entitiesList[0]);
    });
    
    it('should reset selected entity', () => {
      pageObject.triggerListMock();
      service.selectEntityId(entityId);
      service.resetSelectedEntity();
      expect(service.selectedEntity()).toBe(null);
      expect(service.isNewEntityBeingEdited()).toBe(false);
    });
  });

});
