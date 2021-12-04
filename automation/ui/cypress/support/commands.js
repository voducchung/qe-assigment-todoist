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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/// <reference types="cypress" />

import {
    TODOIST_WEB_BASE_URL
} from '../../settings'

// `login(username, password)` - login todoist with username and password
Cypress.Commands.add('login', (username, password) => {
    cy.visit(`${TODOIST_WEB_BASE_URL}/users/showlogin`)
    cy.get('#email').type(username)
    cy.get('#password').type(password)
    cy.get('button.submit_btn').click()
})

// `goToInbox()` go to Inbox project
Cypress.Commands.add('goToInbox', () => {
    cy.get('#filter_inbox').click()
})

// `createTaskWithNameAndDueDate(username, password)` - create a todoist task with name and due date
Cypress.Commands.add('createTaskWithNameAndDueDate', (taskName, dueDate) => {
    cy.get('button.plus_add_button').click()
    cy.get('div.public-DraftEditor-content').type(taskName)
    cy.get('button.item_due_selector').click()
    cy.get('button.scheduler-suggestions-item').contains(dueDate).click()
    cy.get('button[type=submit]').click()
})
