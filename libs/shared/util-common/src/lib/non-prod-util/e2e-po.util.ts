import { RequestEvents, CyHttpMessages } from "cypress/types/net-stubbing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const cy: any;

export const getGreeting = () => cy.get('h1');

export const getByTestId = (dataTestId: string) => 
  cy.get(`[data-testid="${dataTestId}"]`);

export const expectE2EText = (dataTestId: string, expectedText: string) => 
  getByTestId(dataTestId).should('contain', expectedText);

export const expectTableDataValue = (columnKey: string, expectedText: string) => {
  return getByTestId(`val-${columnKey}`).should('contain', expectedText);
}

export const expectLoadingIsShown = () => 
  getByTestId('loading').should('be.visible');

export const expectLoadingIsNotShown = () => 
  getByTestId('loading').should('not.exist');

export const expectErrorIsShown = () => 
  getByTestId('messages')
    .should('be.visible')          
    .contains(/error/i);

export const expectNoData = () => 
    getByTestId('no-data')
      .should('be.visible');

export const createDelayedInterceptor = (url: string, delay: number) => 
  cy.intercept(url, (req: RequestEvents ) => {
    req.on('response', (res: CyHttpMessages.IncomingHttpResponse) => {
      // Introduce a delay e.g. for the loading indicator.
      // Cypress will not wait for the response to be sent
      // unless we explicitly wait for it.
      res.setDelay(delay);
    });
  });

export const createErrorInterceptor = (url: string) => 
  cy.intercept(url, { forceNetworkError: true });

export const createEmptyDataInterceptor = (url: string) => 
  cy.intercept(url, (req: CyHttpMessages.IncomingHttpRequest) => {
    req.reply(200, []);
  });

// -- FORM --
//
// NOTE! 
// The selectors here may be UI library specific!
// The current library is PrimeNG.
// 
// NOTE!
// Don't forget to mark the PrimeNG specific selectors
// with the appropriate comment!

// Confirm Dialog
export const getConfirmDialog = () => cy.get('.confirm-dialog');
export const confirmYes = () => getConfirmDialog().contains('Yes').click();
export const confirmNo = () => getConfirmDialog().contains('No').click();

// Dropdown: the current PrimeNG implementation
// uses ul li and span instead of select and option.
export const selectDropdownValue = (dataTestId: string, value: string) => 
  getByTestId(dataTestId).click()
  // PrimeNG specific
  .then(() => cy.get('.dropdown-panel').should('be.visible'))
    // PrimeNG specific  
    .within(() => cy.get('ul li span').contains(value).click());

// CRUD
export const expectCrudIsDisabled = () => {
  getByTestId('new-button').should('be.disabled');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  return getByTestId('row').each((row: any) => {
    cy.wrap(row).within(() => {
      return getByTestId('crud')
        .within(() => {
          getByTestId('delete').should('be.disabled');
          getByTestId('edit').should('be.disabled');
        });
    });
  });
}
