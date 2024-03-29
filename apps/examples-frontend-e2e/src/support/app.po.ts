export const getGreeting = () => cy.get('h1');

export const getElemByTestId = (dataTestId: string) => 
  cy.get(`[data-testid="${dataTestId}"]`);

export const expectText = (dataTestId: string, expectedText: string) => 
  getElemByTestId(dataTestId).should('contain', expectedText);

export const expectTableDataValue = (columnKey: string, expectedText: string) => {
  getElemByTestId(`val-${columnKey}`).should('contain', expectedText);
}

export const expectLoadingShown = () => 
  getElemByTestId('loading').should('be.visible');

export const expectLoadingNotShown = () => 
  getElemByTestId('loading').should('not.exist');

export const expectErrorShown = () => 
  getElemByTestId('messages')
    .should('be.visible')          
    .contains(/error/i);

export const expectNoData = () => 
    getElemByTestId('no-data')
      .should('be.visible');

export const createDelayedInterceptor = (url: string, delay: number) => 
  cy.intercept(url, (req) => {
    req.on('response', (res) => {
      // Introduce a to delay e.g. for the loading indicator.
      // Cypress will not wait for the response to be sent
      // unless we explicitly wait for it.
      res.setDelay(delay);
    });
  });

export const createErrorInterceptor = (url: string) => 
  cy.intercept(url, { forceNetworkError: true });

export const createEmptyDataInterceptor = (url: string) => 
  cy.intercept(url, (req) => {
    req.reply(200, []);
  });  