import fetch from 'node-fetch'

/**
 * Get new refresh token
 * @param {string} clientId client id of the app created within Google Cloud Console
 * @param {string} clientSecrete client secrete associated with the client id
 * @param {string} previousRefreshToken the previous refresh token
 * @returns refresh token object
 */
export function getAccessToken(clientId, clientSecrete, previousRefreshToken) {
    return fetch(
        'https://oauth2.googleapis.com/token',
        {

            method: 'POST',
            body: JSON.stringify({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecrete,
                refresh_token: previousRefreshToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json())
}

/**
 * Get calendar list
 * @param {string} accessToken working access token
 * @returns calendar list
 */
export async function getCalendarList(accessToken) {
    return fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    ).then(res => res.json())
}

/**
 * Get event list of a specific calendar
 * @param {string} calendarId 
 * @param {string} accessToken working access token
 * @returns event list
 */
export async function getEventList(calendarId, accessToken) {
    return fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    ).then(res => res.json())
}

/**
 * Create an event on Google Calendar
 * @param {string} calendarId calendar id
 * @param {string} eventName event name
 * @param {string} accessToken working access token
 * @returns event object
 */
export async function createSimpleEvent(calendarId, eventName, accessToken) {
    return fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/quickAdd`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: eventName
            })
        }
    ).then(res => res.json())
}