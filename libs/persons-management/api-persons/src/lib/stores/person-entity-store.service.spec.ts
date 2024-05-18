import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { PersonEntityStoreService as EntityStoreService } from './person-entity-store.service';
import { personsUrl as entitiesUrl } from './urls';
// TODO: adjust the project tags
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageInterface } from '@angular-monorepo/shared/util-common';
import { PersonInterface as EntityInterface } from '@angular-monorepo/persons-management/domain';

// Consciously duplicating this utility function 
// for safer testing.
type YearString = `${number}`;
type MonthString = `${number}`;
type DayString = `${number}`;
type DateAsString = `${YearString}-${MonthString}-${DayString}`;
const dateToString = (date: Date): DateAsString => {
  const year: YearString = `${date.getFullYear()}`;
  const month: MonthString = `${date.getMonth() + 1}`;
  const day: DayString = `${date.getDate()}`;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` as DateAsString;
}

describe('PersonEntityStoreService', () => {
  
  let service: EntityStoreService;
  let httpMock: HttpTestingController;
  const mockDate = new Date('2023-04-25');

  const additionalEntity: EntityInterface = {    
    id: '',
    name: 'John',
    surname: 'Doe',
    birthDay: 15,
    birthMonth: 6,
    birthYear: 1990,
  };
 
  const entitiesList: EntityInterface[] = [
    {
      id: '1000',      
      name: 'Mary',
      surname: 'Williams',
      birthDay: 15,
      birthMonth: 6,
      birthYear: 1990,
    },
    {
      id: '1001',
      name: 'Jane',
      surname: 'Smith',
      birthDay: 20,
      birthMonth: 8,
      birthYear: 1985,
    },
  ];

  beforeEach(() => {    
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);      

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntityStoreService],
    });
    service = TestBed.inject(EntityStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
    jest.restoreAllMocks();
  });

  const triggerListMock = (): void => {
    const req = httpMock.expectOne(entitiesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(entitiesList);
  };

  const expectError = (): void => {
    const error: MessageInterface = {
      severity: 'error',
      summary: 'Network error',
      detail: `Http failure response for ${entitiesUrl}: 404 Not Found`,
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
        const req = httpMock.expectOne(entitiesUrl);
        expect(req.request.method).toBe('GET');
        req.flush([]);
      },
      triggerListError: () => {
        const req = httpMock.expectOne(entitiesUrl);
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

    it('should have current date ON init BY any', () => {            
      pageObject.triggerListMock();
      expect(service.currentDate()).toBe(dateToString(mockDate));      
    });
  });

  describe('Create a new entity', () => {
    const pageObject = {
      triggerListMock,
      triggerEntityCreatingMock: () => {            
        const req = httpMock.expectOne(entitiesUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(additionalEntity);   
        req.flush(additionalEntity);
      },
      triggerCreationError: () => {
        const req = httpMock.expectOne(entitiesUrl);        
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
        const req = httpMock.expectOne(`${entitiesUrl}/${entityId}`);        
        expect(req.request.method).toBe('DELETE');
        expect(req.request.url).toBe(`${entitiesUrl}/${entityId}`);        
        req.flush({});
      },
      triggerDeleteError: () => {
        const req = httpMock.expectOne(`${entitiesUrl}/${entityId}`);
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
        const req = httpMock.expectOne(`${entitiesUrl}/${entityId}`);        
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(updatedEntity);
        req.flush(updatedEntity);
      },
      triggerUpdateError: () => {
        const req = httpMock.expectOne(`${entitiesUrl}/${entityId}`);
        expect(req.request.method).toBe('PUT');
        flushError(req);
      },
      expectError: () => {
        const error: MessageInterface = {
          severity: 'error',
          summary: 'Network error',
          detail: `Http failure response for ${entitiesUrl}/${entityId}: 404 Not Found`,
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
