/// <reference types="cypress" />

import { CLEAN_TODO_BEFORE_SUITE } from '../../../settings'
import todoItems from '../../fixtures/todo-create.json'

context('Create todo item', () => {
    before(() => {
        if (CLEAN_TODO_BEFORE_SUITE == 1) {
            cy.deleteAllTodoItems()
        }
    })

    it('Name is plain text', () => {
        runTestWithTodoItem(todoItems[0])
    })

    it('Name is markdown formatted', () => {
        runTestWithTodoItem(todoItems[1])
    })

    it('Name contains hyperlink', () => {
        runTestWithTodoItem(todoItems[2])
    })

    it('Due date is full date - tomorrow', () => {
        runTestWithTodoItem(todoItems[3])
    })

    it('Due date is full date - today', () => {
        runTestWithTodoItem(todoItems[4])
    })

    it('Due date is floating date with time - today', () => {
        runTestWithTodoItem(todoItems[5])
    })

    it('Due date is floating date with time - tomorrow', () => {
        runTestWithTodoItem(todoItems[6])
    })

    it('Due date is with time and timezone #1', () => {
        runTestWithTodoItem(todoItems[7])
    })

    it('Due date is with time and timezone #2', () => {
        runTestWithTodoItem(todoItems[8])
    })
})

/**
 * Run a test with data as a todo item in fixture file
 * @param {{
 *            name: string, due: {string: string}
 *        }} todoItem 
 */
function runTestWithTodoItem(todoItem) {
    cy.log(`Creating todo as ${JSON.stringify(todoItem)}`)

    cy.createNewTodoItem(todoItem.name, todoItem.due)
        .should(response => {
            expect(response.status).to.eq(200)
        })
        .should(response => {
            const syncStatus = response.body.sync_status
            const syncStatusValue = syncStatus[Object.keys(syncStatus)[0]]
            expect(syncStatusValue).to.be.eq('ok')
        })
        .should(response => {
            const tempIdMapping = response.body.temp_id_mapping
            const todoItemId = tempIdMapping[Object.keys(tempIdMapping)[0]]

            expect(todoItemId).to.be.not.null

            // verifying the created task is persitent
            cy.log(`Fetching todo item of id ${todoItemId}`)

            cy.getTodoItem(todoItemId)
                .should(response => {
                    expect(response.status).to.eq(200)

                    const item = response.body.item
                    expect(item.content).to.eq(todoItem.expectedName || todoItem.name)
                    expect(item.due.string).to.eq(todoItem.due.string)
                })

        })
}