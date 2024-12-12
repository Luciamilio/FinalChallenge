describe('TestSaucedemo', () => {
  beforeEach('Interceptar solicitudes externas y visitar la página', () => {
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    });

    cy.visit('https://www.saucedemo.com/');
  });

  it('Prueba Password Incorrecto', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match');
    cy.url().should('include', 'saucedemo.com');
  });

  it('Prueba User Incorrecto', () => {
    cy.get('[data-test="username"]').type('wrong_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match');
    cy.url().should('include', 'saucedemo.com');
  });

  it('Iniciar Sesión Con standard_user', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory');
    cy.get(':nth-child(1) > .inventory_item_description')
      .find('[data-test^="add-to-cart-"]')
      .click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should('include', '/cart');
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Lucia');
    cy.get('[data-test="lastName"]').type('Florencia');
    cy.get('[data-test="postalCode"]').type('5000');
    cy.get('[data-test="continue"]').click();
    cy.url().should('include', '/checkout-step-two');
    cy.get('[data-test="finish"]').click();
    cy.url().should('include', '/checkout-complete');
    cy.contains('Thank you for your order!').should('be.visible');
    cy.get('[data-test="back-to-products"]').click();
    cy.url().should('include', '/inventory');
    cy.get('#react-burger-menu-btn').click();
    cy.get('[data-test="logout-sidebar-link"]').click();
  });

  it('Iniciar Sesión con problem_user', () => {
    cy.get('[data-test="username"]').type('problem_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().then((url) => {
      cy.log('La URL después del login es: ' + url);
      expect(url).to.include('/inventory');
    });
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should('include', '/cart');
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Lucia');
    cy.get('[data-test="lastName"]').type('Florencia', { force: true });
    cy.get('[data-test="postalCode"]').type('5000');
    cy.get('[data-test="continue"]').click();
    cy.url().should('include', '/checkout-step-two');
    cy.get('[data-test="finish"]').click();
    cy.url().should('include', '/checkout-complete');
    cy.contains('Thank you for your order!').should('be.visible');
    cy.get('[data-test="back-to-products"]').click();
    cy.url().should('include', '/inventory');
    cy.get('#react-burger-menu-btn').click();
    cy.get('[data-test="logout-sidebar-link"]').click();
  });
});

