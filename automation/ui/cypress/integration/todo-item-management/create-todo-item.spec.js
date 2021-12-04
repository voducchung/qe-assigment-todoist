/// <reference types="cypress" />

import { calculateExpectedDueDate } from '../../support/utils/test-utils'
import { deleteAllTodoItems } from '../../support/utils/api-utils'
import { TODOIST_PASSWORD, TODOIST_USERNAME } from '../../../settings'

context('Create todo item', () => {
    before('Clean all tasks', () => {
        deleteAllTodoItems()
    })

    beforeEach('Login and go to Inbox', () => {
        cy.login(TODOIST_USERNAME, TODOIST_PASSWORD)
        cy.goToInbox()
    })

    it('Name supports many formats', () => {
        runTestWithTodoItem({
            taskName: 'Task **bold** and *italic* [Todoist Hypertext](http://todoist.com/) ~~strikethrough~~',
            dueDate: 'Today',
            expectedTaskName: 'Task bold and italic Todoist Hypertext strikethrough'
        })
    })

    it('Due date is today', () => {
        runTestWithTodoItem({
            taskName: 'Due day 1',
            dueDate: 'Today'
        })
    })

    it('Due date is tomorrow', () => {
        runTestWithTodoItem({
            taskName: 'Due date 2',
            dueDate: 'Tomorrow'
        })
    })

    // TODO: add more tests of due date options provided on UI
})

/**
 * Run a test with data as a todo item in fixture file
 * @param {{
 *              taskName: string,
 *              dueDate: {string: string},
 *              expectedTaskName?: string
 *        }} item 
 */
function runTestWithTodoItem(item) {
    const now = Date.now()
    const uniqueTaskName = `${item.taskName} ${now}`
    const expectedTaskName = `${item.expectedTaskName || item.taskName} ${now}`
    const expectedDueDate = calculateExpectedDueDate(item.dueDate)

    cy.log(`Creating new task with name [${uniqueTaskName}] and due date [${item.dueDate}]`)

    cy.createTaskWithNameAndDueDate(uniqueTaskName, item.dueDate)

    // verifying the task has been successfully created
    cy.get('li.task_list_item').as('tasks')
    cy.get('@tasks').contains(now).should('have.text', expectedTaskName)
    cy.get('@tasks').contains(expectedDueDate).should('have.text', expectedDueDate)

    // verifying the task is still shown in the task list after browser is reloaded
    cy.reload()
    cy.get('@tasks').contains(now).should('have.text', expectedTaskName)
    cy.get('@tasks').contains(expectedDueDate).should('have.text', expectedDueDate)
}