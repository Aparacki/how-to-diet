describe('Auth-test', () => {
  it('Register', () => {
    cy.visit(Cypress.env('TEST_URL'))
    cy.fixture('user').as('user.json')

    cy.fixture('user').then(user => {
      cy.get('[data-cy="register"]')
        .click()

      cy.get('[data-cy="email"]')
        .type(user.username)

      cy.get('[data-cy="name"]')
        .type(user.firstName)

      cy.get('[data-cy="surname"]')
        .type(user.lastName)

      cy.get('[data-cy="password"]')
        .type(user.password)

      cy.get('[data-cy="confirm-password"]')
        .type(user.password)

      cy.get('.ant-btn')
        .click()

      cy.get('[data-cy="logout"]')
      .click()
    })
  })

  it('Log in and delete user', () => {
    cy.visit(Cypress.env('TEST_URL'))
    cy.fixture('user').as('user.json')

    cy.fixture('user').then(({username, password}) => {
      cy.get('[data-cy="email"]')
      .type(username)

      cy.get('[data-cy="password"]')
        .type(password)

      cy.get('.ant-btn')
        .click()

      cy.delete_user(username, password)

      cy.get('[data-cy="logout"]')
      .click()
    })
  })
})



