/// <reference types="cypress" />

import { deleteAllTodoItems } from "../../support/utils/api-utils"

context('Update todo item', () => {
    before('Clean all tasks', () => {
        deleteAllTodoItems()
    })

    beforeEach('Login and go to Inbox', () => {
        cy.login()
        cy.goToInbox()
    })

    it('Rename todo item name', () => {
        const now = Date.now()
        const todoItem = {
            taskName: `Task name ${now}`,
            newTaskName: `Task **bold** and *italic* [Todoist Hypertext](http://todoist.com/) ~~strikethrough~~ ${now}`,
            expectedTaskName: `Task bold and italic Todoist Hypertext strikethrough ${now}`
        }

        cy.createTaskWithNameAndDueDate(todoItem.taskName, 'Today')

        // renaming the created task
        cy.get('li.task_list_item').as('tasks')
        cy.get('@tasks').contains(now).trigger('mouseover')
        cy.get('button[data-action-hint="task-edit"]').click()
        cy.get('div.public-DraftEditor-content').clear().type(`${todoItem.newTaskName}`)
        cy.get('button[type=submit]').click()

        // verify the task has been successfully renamed
        cy.get('li.task_list_item').as('tasks')
        cy.get('@tasks').contains(now).should('not.have.text', todoItem.taskName)
        cy.get('@tasks').contains(now).should('have.text', todoItem.expectedTaskName)

        // verify the new task name is persitent by reloading browser
        cy.reload()
        cy.get('@tasks').contains(now).should('not.have.text', todoItem.taskName)
        cy.get('@tasks').contains(now).should('have.text', todoItem.expectedTaskName)
    })

    it('Mark todo item complete', () => {
        const now = Date.now()
        const todoItem = {
            taskName: `To be complete ${now}`
        }

        cy.createTaskWithNameAndDueDate(todoItem.taskName, 'Today')

        cy.get('li.task_list_item').as('tasks')
        cy.get('@tasks').contains(todoItem.taskName)
            .parent()
            .invoke('attr', 'id') // getting element id
            .then(elementId => {
                cy.get(`button[aria-describedby="${elementId}"`).click() // check the task

                // verify the task is no longer shown after completed
                cy.get('@tasks').not().contains(todoItem.taskName)
                cy.get('div.undo_toast div.text_holder').should('contain.text', '1 task completed')
            })
    })
})
