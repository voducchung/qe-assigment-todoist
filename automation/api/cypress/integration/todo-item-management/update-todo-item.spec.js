/// <reference types="cypress" />

import { CLEAN_TODO_BEFORE_SUITE } from '../../../settings'
import todoItems from '../../fixtures/todo-rename.json'

context('Update todo item', () => {
    before(() => {
        if (CLEAN_TODO_BEFORE_SUITE == 1) {
            cy.deleteAllTodoItems()
        }
    })

    it('New name is plain text', () => {
        runRenameTestWithTodoItem(todoItems[0])
    })

    it('New name is markdown formatted', () => {
        runRenameTestWithTodoItem(todoItems[1])
    })

    it('New name contains hyperlink', () => {
        runRenameTestWithTodoItem(todoItems[2])
    })

    it('Mark todo item complete', () => {
        const todoItem = {
            name: "To be completed",
            due: { string: "yesterday" }
        }
        cy.log(`Creating todo item as ${JSON.stringify(todoItem)}`)

        cy.createNewTodoItem(todoItem.name, todoItem.due)
            .should(response => {
                expect(response.status).to.eq(200)
            })
            .then(response => {
                const tempIdMapping = response.body.temp_id_mapping
                const todoItemId = tempIdMapping[Object.keys(tempIdMapping)[0]]

                cy.log(`Marking complete the todo item of id ${todoItemId}`)
                cy.completeTodoItem(todoItemId)
                    .should(response => {
                        expect(response.status).to.eq(200)
                    })
                    .then(response => {
                        // verifying new changes has been applied
                        cy.getTodoItem(todoItemId)
                            .should(response => {
                                expect(response.status).to.eq(200)
                                const todoItem = response.body.item
                                expect(todoItem.checked).to.eq(1) // 1: checked - done; 0: unchecked - undone
                            })
                    })
            })
    })
})

/**
 * Run a test with data as a todo item in fixture file
 * @param { {name: string} } todoItem 
 */
function runRenameTestWithTodoItem(todoItem) {
    cy.log(`Creating todo item for renaming as ${JSON.stringify(todoItem)}`)

    cy.createNewTodoItem(todoItem.name, { string: 'today' })
        .should(response => {
            expect(response.status).to.eq(200)
        })
        .should(response => {
            const tempIdMapping = response.body.temp_id_mapping
            const todoItemId = tempIdMapping[Object.keys(tempIdMapping)[0]]

            cy.log(`Renaming todo item of id ${todoItemId}`)
            cy.renameTodoItem(todoItemId, todoItem.newName)
                .should(response => {
                    expect(response.status).to.eq(200)
                })
                .then(_ => {
                    cy.getTodoItem(todoItemId)
                        .should(response => {
                            expect(response.status).to.eq(200)
                            const item = response.body.item
                            expect(item.content).to.eq(todoItem.expectedName || todoItem.newName)
                        })
                })
        })
}