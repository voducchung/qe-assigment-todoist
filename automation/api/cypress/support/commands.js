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

import { v4 as uuid } from 'uuid'
import { TODOIST_API_BASE_URL, TODOIST_API_TOKEN, TODOIST_PROJECT_ID } from '../../settings'

// `sendTodoistRequest(partialPath, method, headers, body)` - a general purpose method to make a request to todoist
Cypress.Commands.add('sendTodoistRequest', (partialPath, method, headers, body) => {
    return cy.request({
        url: `${TODOIST_API_BASE_URL}/${partialPath}`,
        method,
        headers: {
            'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
            'Content-Type': 'application/json',
            ...headers
        },
        body
    })
})

// `createNewTodoItem(todoName, todoDueDate)` - make a request to create new todo item with name and due date
Cypress.Commands.add('createNewTodoItem', (todoName, todoDueDate) => {
    return cy.sendTodoistRequest(
        'sync',
        'POST',
        {},
        {
            "commands": [{
                "type": "item_add",
                "args": {
                    "project_id": TODOIST_PROJECT_ID,
                    "content": todoName,
                    "due": todoDueDate
                },
                "temp_id": uuid(),
                "uuid": uuid()
            }]
        }
    )
})

// `getTodoItem(todoItemId)` - make a request with todo item id to fetch details of a todo item
Cypress.Commands.add('getTodoItem', todoItemId => {
    return cy.sendTodoistRequest(
        'items/get',
        'POST',
        {},
        {
            item_id: todoItemId
        }
    )
})

// `renameTodoItem(todoItemId, newTodoName)` - make a request to rename a todo item
Cypress.Commands.add('renameTodoItem', (todoItemId, newTodoName) => {
    return cy.sendTodoistRequest(
        'sync',
        'POST',
        {},
        {
            "commands": [{
                "type": "item_update",
                "args": {
                    "id": todoItemId,
                    "content": newTodoName,
                },
                "uuid": uuid()
            }]
        }
    )
})

// `completeTodoItem(todoItemId)` - make a request to mark a to do item completed
Cypress.Commands.add('completeTodoItem', (todoItemId) => {
    return cy.sendTodoistRequest(
        'sync',
        'POST',
        {},
        {
            "commands": [{
                "type": "item_complete",
                "args": {
                    "id": todoItemId
                },
                "uuid": uuid()
            }]
        }
    )
})

// `deleteBatchOfTodoItems(todoItemIds)` - make a single request to delete an array of todo items. This helps prevent the Rate Limit issue
Cypress.Commands.add('deleteBatchOfTodoItems', (todoItemIds) => {
    const bodyOfBatch = {
        commands: []
    }
    todoItemIds.forEach(id => {
        bodyOfBatch.commands.push({
            type: 'item_delete',
            uuid: uuid(),
            args: {
                id: id
            }
        })
    })


    return cy.sendTodoistRequest(
        'sync',
        'POST',
        {},
        bodyOfBatch
    )
})

// `getAllTodoItems()` - make a request to fetch all tasks
Cypress.Commands.add('getAllTodoItems', () => {
    return cy.sendTodoistRequest(
        'sync',
        'POST',
        {},
        {
            "sync_token": "*",
            "resource_types": "[\"items\"]"
        }
    )
})

// `deleteAllTodoItems()` - make a request to clean all tasks
Cypress.Commands.add('deleteAllTodoItems', () => {
    cy.getAllTodoItems()
        .then(response => {
            const todoItemIds = response.body.items.map(item => item.id)

            cy.log(`Preparing to delete ${todoItemIds.length} todo items`)
            cy.deleteBatchOfTodoItems(todoItemIds)
            cy.log(`Deleted ${todoItemIds.length} todo items`)
        })
})

