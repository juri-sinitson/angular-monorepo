// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries

// -- STEP 1: ADJUST THE URL AND ITS IMPORT PATH! --
import { getAllPersonsUrl as entitiesUrl } from '@angular-monorepo/shared-business/examples-e2e';

// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  expectE2EText as expectText,
  expectTableDataValue,
  getElemByTestId,
  expectLoadingShown,
  expectLoadingNotShown,
  expectErrorShown,
  expectNoData,
  createDelayedInterceptor,
  createErrorInterceptor,
  createEmptyDataInterceptor,
} from '@angular-monorepo/shared/util-common-non-prod';

const entities = 'persons';
const entitiesFeature = 'persons-feature';

// TODO! Create generator for E2E tests
// from this suite.
describe('Main Page', () => {
  describe('Data reading of feature components', () => {
    // We deactivate test isolation of this suite to
    // to speed up e2e by saving page visits. One tends
    // to make a visit for each feature component. But
    // usually one visit is necessary for this suite.
    describe('Happy case', { testIsolation: false }, () => {
      // -- STEP 2: ADJUST THE COLUMNS! --
      // You can tell an AI-Solution (e.g. GitHub copilot)
      // to do this for you by telling which entity interface
      // should be used for this.
      const expectCols = () => {
        expectText('col-category', 'Category');
        expectText('col-description', 'Description');
        expectText('col-inventoryStatus', 'Status');
        expectText('col-name', 'Name');
        expectText('col-price', 'Price');
        expectText('col-quantity', 'Quantity');
        expectText('col-rating', 'Rating');
      };

      before(() => {
        cy.visit('/');
      });

      it('should display data for products feature ON data success BY any', () => {
        getElemByTestId(entitiesFeature).within(() => {
          expectCols();

          getElemByTestId('row')
            .first()
            .within(() => {
              // -- STEP 3: ADJUST THE COLUMNS AND VALUES! --
              // You can tell an AI-Solution (e.g. GitHub copilot)
              // to do this for you by telling which entity interface
              // should be used for this.
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
              // -- STEP 4: ADJUST THE COLUMNS AND VALUES AGAIN! --
              // You can tell an AI-Solution (e.g. GitHub copilot)
              // to do this for you by telling which entity interface
              // should be used for this.
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
    });

    describe('Loading', () => {
      before(() => {
        const delay = 4000;
        createDelayedInterceptor(entitiesUrl, delay);
        cy.visit('/');
      });

      it('should toggle loading indicators ON data loading BY any', () => {
        // Creating delayed interceptors to simulate loading.
        // Thus loading indicators should get enough time to show up.
        // If we don't wait for the responses explicitly, Cypress
        // will not wait for them and just continue to the next test.
        getElemByTestId(entitiesFeature).within(() => expectLoadingShown());
      });
    });

    describe('Errors', () => {
      before(() => {
        createErrorInterceptor(entitiesUrl).as(`${entities}Error`);
        cy.visit('/');
      });

      it('should show errors ON network error BY any', () => {
        cy.wait(`@${entities}Error`).then(() => {
          getElemByTestId(entitiesFeature).within(() => expectErrorShown());
          expectLoadingNotShown();
        });
      });
    });

    describe('No data', () => {
      before(() => {
        createEmptyDataInterceptor(entitiesUrl).as(`${entities}NoData`);
        cy.visit('/');
      });

      it('should show no data ON data success BY no data', () => {
        cy.wait(`@${entities}NoData`).then(() => {
          getElemByTestId(entitiesFeature).within(() => expectNoData());
          expectLoadingNotShown();
        });
      });
    });
  });
});
