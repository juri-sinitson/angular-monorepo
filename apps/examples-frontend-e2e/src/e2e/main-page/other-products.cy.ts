// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { otherProductsUrl as entitiesUrl } from '@angular-monorepo/shared-business/examples-e2e';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  expectE2EText as expectText,
  expectTableDataValue,
  getByTestId,  
  expectLoadingIsShown,
  expectLoadingIsNotShown,
  expectErrorIsShown,
  expectNoData,
  createDelayedInterceptor,
  createErrorInterceptor,
  createEmptyDataInterceptor,
} from '@angular-monorepo/shared/util-common-non-prod-e2e';

const entitiesFeature = 'other-products-feature';
const entities = 'other-products';

describe('Main Page: Other products', () => {

  before(() => {
    // Use the POST method to send a request to the seed endpoint
    cy.request({
      method: 'POST',
      url: '/api/seed', // Adjust the URL according to your application's routing
      // Optionally, include any required headers or body data if needed
    }).then((response) => {
      // Check the response status and message to ensure the seed operation was successful
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Data restored successfully');
    });
  });

  describe('READ', () => {
    describe('Happy case', () => {
      const expectCols = () => {  
        expectText('col-category', 'Category');
        expectText('col-description', 'Description');
        expectText('col-inventoryStatus', 'Status');
        expectText('col-name', 'Name');
        expectText('col-price', 'Price');
        expectText('col-quantity', 'Quantity');
        expectText('col-rating', 'Rating');
      }
      
      before(() => {
        cy.visit('/');
      });

      it('should display data ON any BY success', () => {
        getByTestId(entitiesFeature).within(() => {
          // Assert columns are there
          expectCols();

          getByTestId('row')
            .first()
            .within(() => {
              expectTableDataValue('category', 'Accessories');
              expectTableDataValue('description', 'Product Description');
              expectTableDataValue('inventoryStatus', 'LOWSTOCK');
              expectTableDataValue('name', 'Chakra Bracelet');
              expectTableDataValue('price', '32');
              expectTableDataValue('quantity', '5');
              expectTableDataValue('rating', '3');
            });
        
          getByTestId('row')
            .eq(1)
            .within(() => {
              expectTableDataValue('category', 'Accessories');
              expectTableDataValue('description', 'Product Description');
              expectTableDataValue('inventoryStatus', 'INSTOCK');
              expectTableDataValue('name', 'Galaxy Earrings');
              expectTableDataValue('price', '34');
              expectTableDataValue('quantity', '23');
              expectTableDataValue('rating', '5');
          });

          expectLoadingIsNotShown();  
        });
      });
    });

    describe('Loading', () => {
      before(() => {
        const delay = 4000;
        createDelayedInterceptor(entitiesUrl, delay);
        cy.visit('/');
      });

      it('should toggle loading indicator ON any BY data loading', () => {
        // Using delayed interceptors to simulate loading.
        // Thus loading indicators should get enough time to show up.
        // If we don't wait for the responses explicitly, Cypress
        // will not wait for them and just continue to the next test.        
        getByTestId(entitiesFeature).within(() => expectLoadingIsShown());
      });

    });

    describe('Error', () => {
      before(() => {
        createErrorInterceptor(entitiesUrl).as(`${entities}Error`);
        cy.visit('/');
      });
      
      it('should show errors ON any BY network error', () => {
      
        cy.wait(`@${entities}Error`)            
          .then(() => {              
            getByTestId(entitiesFeature).within(() => expectErrorIsShown());
            expectLoadingIsNotShown();
          });
      });
              
    });

    describe('No data', () => {
      before(() => {
        createEmptyDataInterceptor(entitiesUrl).as(`${entities}NoData`);
        cy.visit('/');
      });

      it('should show no data ON data success BY no data', () => {
        cy.wait(`@${entities}NoData`)            
          .then(() => {              
            getByTestId(entitiesFeature).within(() => expectNoData());
            expectLoadingIsNotShown();
          });
      });
    });
  });
});
