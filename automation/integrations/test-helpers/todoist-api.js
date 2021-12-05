import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'
import { TODOIST_API_TOKEN, TODOIST_PROJECT_ID } from '../settings'

/**
 * Create new task on Todoist
 * @param {string} name task name
 * @param {string} dueDate task due date
 * @returns task object
 */
export async function createTask(name, dueDate) {
    return fetch(
        'https://api.todoist.com/rest/v1/tasks',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Request-Id': uuid()
            },
            body: JSON.stringify({
                project_id: TODOIST_PROJECT_ID,
                content: name,
                due_string: dueDate
            })
        }
    ).then(response => response.json())
}

/**
 * Get all active tasks
 * @returns task list
 */
export async function getActiveTasks() {
    return fetch(
        'https://api.todoist.com/rest/v1/tasks',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TODOIST_API_TOKEN}`
            }
        }
    ).then(response => response.json())
}