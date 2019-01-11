// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("delete_user", (username, password) => {
  const Instance = Cypress.env('SYNCANO_PROJECT_INSTANCE')
  const apiKey = Cypress.env('API_KEY')

  cy.request({
    url: `https://api.syncano.io/v3/instances/${Instance}/endpoints/sockets/user-auth/login/`,
    method: 'POST',
    body: {
      username,
      password
    }
  }).then(res => {
    cy.request({
      url: `https://api.syncano.io/v3/instances/${Instance}/endpoints/sockets/user/profile/`,
      method: 'POST',
      headers: {
        'x-user-key': res.body.token
      },
      body: {
        username,
        password
      }
    }).then(res2 => {
      cy.request({
        url: `https://api.syncano.io/v1.1/instances/${Instance}/users/${res2.body.id}/`,
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey
        }
      })
    })
  })
 })

 Cypress.Commands.add("login", () => {
  const Instance = Cypress.env('SYNCANO_PROJECT_INSTANCE')

  cy.fixture('user').as('user.json')


  cy.fixture('user').then(({username, password}) => {
    cy.request({
      url: `https://api.syncano.io/v3/instances/${Instance}/endpoints/sockets/user-auth/login/`,
      method: 'POST',
      body: {username, password},
    }).then(res => window.localStorage.setItem('token', res.body.token))
  })
})
