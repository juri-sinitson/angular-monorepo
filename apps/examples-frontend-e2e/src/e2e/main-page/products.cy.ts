// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { productsUrl as entitiesUrl } from '@angular-monorepo/shared-business/examples-e2e';

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
  getConfirmDialog,
  confirmYes,
  expectCrudIsDisabled,
  selectDropdownValue,
} from '@angular-monorepo/shared/util-common-non-prod-e2e';

const entities = 'products';
const entitiesFeature = 'products-feature';

// TODO! Create generator for E2E tests
// from this suite.
describe('Main Page: Products', () => {

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
    // We deactivate test isolation of this suite to
    // to speed up e2e by saving page visits. One tends
    // to make a visit for each feature component. But
    // usually one visit is necessary for this suite.
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

          expectCols();

          getByTestId('row')
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

          getByTestId('row')
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

      it('should show errors ON network error BY any', () => {
        
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

  describe('UPDATE', () => {

    const newValue = 'New Value';

    describe('Happy case', () => {
      before(() => {
        cy.visit('/');
      });

      it('should update product ON success BY any', () => {
                            
        const submitNewValue = getByTestId(entitiesFeature)
          .within(() => 
            getByTestId('row').first()
              .within(() => getByTestId('edit').click())
                .then(() => getByTestId('product-form'))
                .within(() => 
                  getByTestId('name-input').clear().type(newValue)
                  .then(() => getByTestId('submit-button').click()                
                )
              )
          );
  
        submitNewValue.then(() => 
          getByTestId(entitiesFeature)
            .within(() => 
              getByTestId('product-form').should('not.exist')
                .then(() => getByTestId('row').first()
                  .within(() => expectTableDataValue('name', newValue)))
          ));
      
      });
    });

    describe('Error', () => {
      before(() => {
        createErrorInterceptor(`${entitiesUrl}/*`).as(`${entities}Error`);
        cy.visit('/');
      });
      it('dialog should show error and stay open ON update failure BY any', () => {          
        getByTestId(entitiesFeature).within(() => {
          getByTestId('row')
            .first()
            .within(() => getByTestId('edit').click())
            .then(() => getByTestId('product-form'))
            .within(() =>
              getByTestId('name-input').clear().type(`${newValue}-2`)
                .then(() => getByTestId('submit-button').click())
                .then(() => expectLoadingIsNotShown())
                .then(() => expectErrorIsShown())
                .then(() => getByTestId('cancel-button').click())                  
             )
            .then(() => getByTestId('product-form').should('not.exist'))
            .then(() => expectCrudIsDisabled());
        });
      });
    });

    describe('Loading', () => {
      before(() => {
        const delay = 4000;
        createDelayedInterceptor(`${entitiesUrl}/*`, delay);
        cy.visit('/');
      });

      it('should toggle loading indicator ON data loading BY loading', () => {
        
        const newName = 'New Name';
        
        const submitNewValue = getByTestId(entitiesFeature)
          .within(() => {
            return getByTestId('row').first()
            .within(() => getByTestId('edit').click())
              .then(() => getByTestId('product-form'))
              .within(() => 
                getByTestId('name-input').clear().type(newName)
                .then(() => getByTestId('submit-button').click()                
              )
            )
          });
  
        submitNewValue.then(() => 
          getByTestId(entitiesFeature)
            .within(() => expectLoadingIsShown()));
      });

    });
    // describe('Error', () => {});
  });

  describe('DELETE', () => {
    describe('Happy case', () => {

      before(() => {
        cy.visit('/');
      });

      it('should delete product ON success BY any', () => {
                  
        let rowsBefore = 0;

        getByTestId(entitiesFeature).within( ()=> {
          getByTestId('row').its('length')
            .then((length: number) => {
              rowsBefore = length;
            })
            .then(() => getByTestId('row').first())
            .within(() => getByTestId('delete').click())
            .then(() => getConfirmDialog())
            .then(() => confirmYes())
            .then(() => getByTestId('row').should('have.length', rowsBefore - 1));
        });

      });

    });
    describe('Loading', () => {
      before(() => {
        const delay = 4000;
        createDelayedInterceptor(`${entitiesUrl}/*`, delay);
        cy.visit('/');
      });

      it('should toggle loading indicator ON delete loading BY loading', () => {
        getByTestId(entitiesFeature).within(() => {
          getByTestId('row').first()
            .within(() => getByTestId('delete').click())
            .then(() => getConfirmDialog())
            .then(() => confirmYes())
            .then(() => expectLoadingIsShown());
        });
      });
    });
    describe('Error', () => {
      before(() => {          
        createErrorInterceptor(`${entitiesUrl}/*`).as(`${entities}Error`);          
        cy.visit('/');
      });

      it('should show error ON delete failure BY any', () => {
          getByTestId(entitiesFeature).within(() => {
            getByTestId('row').first()
              .within(() => getByTestId('delete').click())
              .then(() => getConfirmDialog())
              .then(() => confirmYes())
              .then(() => expectErrorIsShown())
              .then(() => expectCrudIsDisabled());
          });          
      });
    });
  });

  describe('CREATE', () => {

    const fillInFormAndSubmit = () => {
      const newProduct = {
        category: 'Accessories',
        description: 'New Description',
        inventoryStatus: 'In Stock',
        name: 'New Product',
        price: '100',
        quantity: '100',
        rating: '5',
      };

      return getByTestId('product-form')
        .within(() => {
          getByTestId('name-input').type(newProduct.name);
          getByTestId('description-input').type(newProduct.description);
          getByTestId('price-input').type(newProduct.price);
          getByTestId('category-input').type(newProduct.category);
          getByTestId('quantity-input').type(newProduct.quantity);
          selectDropdownValue('inventory-status-input', newProduct.inventoryStatus);
          getByTestId('rating-input').type(newProduct.rating);
          return getByTestId('submit-button').click();
        });
    }

    describe('Happy case', () => {
      before(() => {
        cy.visit('/');
      });

      it('should create product ON success BY any', () => {

        let rowsBefore = 0;
        
        getByTestId(entitiesFeature).within(() => {           
         getByTestId('row').its('length')
            .then((length: number) => {
              rowsBefore = length;
            })
            .then(() => getByTestId('new-button').click())
            .then(() => getByTestId('product-form'))
            .then(() => fillInFormAndSubmit())
            .then(() => expectLoadingIsNotShown())
            .then(() => getByTestId('row').should('have.length', rowsBefore + 1));
        });            
        
      });
    });
    describe('Loading', () => {
      
      before(() => {
        cy.visit('/');
      });

      const delayRequest = () => {
        const delay = 4000;
        return createDelayedInterceptor(`${entitiesUrl}`, delay);       
      };

      it('should toggle loading indicator ON create loading BY loading', () => {
        getByTestId(entitiesFeature).within(() =>
          expectLoadingIsNotShown()
            .then(() => delayRequest())
            .then(() => getByTestId('new-button').click())            
            .then(() => fillInFormAndSubmit())
            .then(() => getByTestId('product-form'))
              .within(() => expectLoadingIsShown())
        );
      });

    });
    describe('Error', () => {
      before(() => {          
        cy.visit('/');
      });

      const provokeError = () => {
        return createErrorInterceptor(`${entitiesUrl}`).as(`${entities}Error`);
      }

      it('should show error ON create failure BY any', () => {
        getByTestId(entitiesFeature).within(() => {
          expectLoadingIsNotShown()
            .then(() => getByTestId('new-button').click())
            .then(() => provokeError())
            .then(() => fillInFormAndSubmit())
            .then(() => getByTestId('product-form'))
              .within(() => expectErrorIsShown()
                .then(() => getByTestId('cancel-button').click())
             )
            .then(() => expectCrudIsDisabled())
            .then(() => expectErrorIsShown());
        });
      });
    });
  });

});
