/// <reference types="cypress" />

import { v4 as uuid } from 'uuid'
import { TODOIST_API_BASE_URL, TODOIST_API_TOKEN } from '../../../settings'

export { deleteAllTodoItems }

/**
 * Send a request with some pre-configred settings to todoist
 * @param {string} partialPath 
 * @param {string} method 
 * @param {*}} headers 
 * @param {*} body 
 * @returns 
 */
function sendTodoistRequest(partialPath, method, headers, body) {
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
}

/**
 * Get all todo items
 * @returns 
 */
function getAllTodoItems() {
    return sendTodoistRequest(
        'sync',
        'POST',
        {},
        {
            "sync_token": "*",
            "resource_types": "[\"items\"]"
        }
    )
}

/**
 * Delete a batch of todo items. Deleting items in batch help reduce the risk of hitting access rate limit
 * @param {[number]} todoItemIds 
 * @returns 
 */
function deleteBatchOfTodoItems(todoItemIds) {
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


    return sendTodoistRequest(
        'sync',
        'POST',
        {},
        bodyOfBatch
    )
}

/**
 * Delete all todo items
 */
function deleteAllTodoItems() {
    getAllTodoItems()
        .then(response => {
            const todoItemIds = response.body.items.map(item => item.id)
            cy.log(`
                Preparing to delete ${todoItemIds.length} todo items
            `)
            deleteBatchOfTodoItems(todoItemIds)
            cy.log(`
                Deleted ${todoItemIds.length} todo items
            `)
        })
}