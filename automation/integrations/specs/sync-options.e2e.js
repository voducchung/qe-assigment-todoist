import { v4 as uuid } from 'uuid'
import loginPage from '../pageobjects/login.page';
import integrationsPage from '../pageobjects/integrations.page';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRETE, GOOGLE_REFRESH_TOKEN, SYNC_DURATION, TODOIST_PASSWORD, TODOIST_USERNAME } from '../settings';
import { getCalendarList, getAccessToken, getEventList, createSimpleEvent } from '../test-helpers/google-calendar-api';
import { createTask, getActiveTasks } from '../test-helpers/todoist-api';
import { log } from '../test-helpers/logger';

describe('Google Calendar Integration - Sync Options', () => {
    let googleAccessToken = ''
    let googleTodoistCalendarId = ''

    beforeEach('Check if Todoist is integrated to Google Calendar', async () => {
        log('Getting Google access token')
        const accessTokenResponse = await getAccessToken(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRETE, GOOGLE_REFRESH_TOKEN)
        googleAccessToken = accessTokenResponse.access_token

        log('Fetching Google calendar list')
        const calendarListResponse = await getCalendarList(googleAccessToken)
        const calendars = calendarListResponse.items
        expect(calendars.length).toBeGreaterThan(0)

        log('Verifying Todoist has been integrated to Google Calendar')
        const googleTodoistCalendar = calendars.find(cal => cal.summary === 'Todoist')
        expect(googleTodoistCalendar).toBeTruthy()
        googleTodoistCalendarId = googleTodoistCalendar.id
    })


    it('Todoist should have been configured in advance to be integrated to Google Calendar', async () => {
        await loginPage.open()
        await loginPage.login(TODOIST_USERNAME, TODOIST_PASSWORD)
        await integrationsPage.open()
        await integrationsPage.openEditGoogleCalendarConnectionModal()
        log('Looks good. Todoist has been integrated to Google Calendar')
    })

    it('Task created on Todoist is synced in Google Calendar', async () => {
        const uniqueId = uuid()
        const taskName = `Task from Todoist ${uniqueId}`

        log('Creating a Todoist task')
        const createTaskResponse = await createTask(taskName, 'today')
        expect(createTaskResponse.content).toBe(taskName)

        log('Waiting for sync between Google Calendar and Todoist')
        await browser.pause(SYNC_DURATION)

        log('Fetching Google Calendar event list')
        const eventListResponse = await getEventList(googleTodoistCalendarId, googleAccessToken)
        const events = eventListResponse.items
        expect(events.length).toBeGreaterThan(0)

        log(`Verifying the task "${taskName}" is synced in Google Calendar`)
        const syncedTask = events.find(evt => evt.summary.includes(taskName))
        expect(syncedTask).toBeTruthy()
    })

    it('Task created on Google Calendar is synced in Todoist', async () => {
        const uniqueId = uuid()
        const eventName = `Task from Todoist ${uniqueId}`

        log('Creating a Google Calendar event')
        const createEventResponse = await createSimpleEvent(googleTodoistCalendarId, eventName, googleAccessToken)
        const event = createEventResponse
        expect(event.summary).toBe(eventName)

        log('Waiting for sync between Google Calendar and Todoist')
        await browser.pause(SYNC_DURATION)

        log('Fetching Todoist task list')
        const taskListResponse = await getActiveTasks()
        const tasks = taskListResponse
        expect(tasks.length).toBeGreaterThan(0)

        log(`Verifying the event "${eventName}" is synced in Todoist`)
        const syncedEvent = tasks.find(task => task.content.includes(eventName))
        expect(syncedEvent).toBeTruthy()
    })
});


