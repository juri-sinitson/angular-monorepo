// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getAllProductsUrl, getAllOtherProductsUrl } from '@angular-monorepo/shared-business/examples-e2e';

import {
  expectText,
  expectTableDataValue,
  getElemByTestId,  
  expectLoadingShown,
  expectLoadingNotShown,
  expectErrorShown,
  expectNoData,
  createDelayedInterceptor,
  createErrorInterceptor,
  createEmptyDataInterceptor,
} from '../support/app.po';

const products = 'products';
const otherProducts = 'other-products';
const productsFeature = 'products-feature';
const otherProductsFeature = 'other-products-feature';

const productsUrl = getAllProductsUrl;
const otherProductsUrl = getAllOtherProductsUrl;

// TODO! Create generator for E2E tests
// from this suite.
describe('Main Page', () => {
  describe('Data reading of feature components', () => {
    // We deactivate test isolation of this suite to
    // to speed up e2e by saving page visits. One tends
    // to make a visit for each feature component. But
    // usually one visit is necessary for this suite.
    describe('Happy case', { testIsolation: false }, () => {
      
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

      it('should display data for products feature ON data success BY any', () => {
        getElemByTestId(productsFeature).within(() => {

          expectCols();

          getElemByTestId('row')
            .first()
            .within(() => {
              expectTableDataValue('category', 'Accessories');
              expectTableDataValue('description', 'Product Description');
              expectTableDataValue('inventoryStatus', 'INSTOCK');
              expectTableDataValue('name', 'Bamboo Watch');
              expectTableDataValue('price', '65');
              expectTableDataValue('quantity', '24');
              expectTableDataValue('rating', '5');
            });

          getElemByTestId('row')
            .eq(1)
            .within(() => {
              expectTableDataValue('category', 'Accessories');
              expectTableDataValue('description', 'Product Description');
              expectTableDataValue('inventoryStatus', 'OUTOFSTOCK');
              expectTableDataValue('name', 'Black Watch');
              expectTableDataValue('price', '72');
              expectTableDataValue('quantity', '61');
              expectTableDataValue('rating', '4');
            });

          expectLoadingNotShown();
        });
      });

      it('should display data for other products feature ON data success BY any', () => {
        getElemByTestId(otherProductsFeature).within(() => {
          // Assert columns are there
          expectCols();

          getElemByTestId('row')
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
        
          getElemByTestId('row')
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

          expectLoadingNotShown();  
        });
      });
    });

    describe('Loading', () => {                
      before(() => {
        const delay = 1000;
        createDelayedInterceptor(productsUrl, delay);
        createDelayedInterceptor(otherProductsUrl, delay);
        cy.visit('/');
      });

      it('should toggle loading indicators ON data loading BY any', () => {
        // Creating delayed interceptors to simulate loading.
        // Thus loading indicators should get enough time to show up.
        // If we don't wait for the responses explicitly, Cypress
        // will not wait for them and just continue to the next test.        
        getElemByTestId(productsFeature).within(() =>expectLoadingShown());
        getElemByTestId(otherProductsFeature).within(() => expectLoadingShown());
      });
    });

    describe('Errors', () => {
      before(() => {
        createErrorInterceptor(productsUrl).as(`${products}Error`);
        createErrorInterceptor(otherProductsUrl).as(`${otherProducts}Error`);
        cy.visit('/');
      });

      it('should show errors ON network error BY any', () => {
        
        cy.wait(`@${products}Error`)
          .then(() => cy.wait(`@${otherProducts}Error`))
          .then(() => {
            getElemByTestId(productsFeature).within(() => expectErrorShown());
            getElemByTestId(otherProductsFeature).within(() => expectErrorShown());
            expectLoadingNotShown();
          });        
      });
    });

    describe('No data', () => {
      before(() => {
        createEmptyDataInterceptor(productsUrl).as(`${products}NoData`);
        createEmptyDataInterceptor(otherProductsUrl).as(`${otherProducts}NoData`);
        cy.visit('/');
      });

      it('should show no data ON data success BY no data', () => {
        
        cy.wait(`@${products}NoData`)
          .then(() => cy.wait(`@${otherProducts}NoData`))
          .then(() => {
            getElemByTestId(productsFeature).within(() => expectNoData());
            getElemByTestId(otherProductsFeature).within(() => expectNoData());
            expectLoadingNotShown();
          });
      });
    });

  });
});
