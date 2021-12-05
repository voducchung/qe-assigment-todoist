import { TODOIST_WEB_BASE_URL } from '../settings'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open(path) {
        console.log(`${TODOIST_WEB_BASE_URL}/${path}`)
        return browser.url(`${TODOIST_WEB_BASE_URL}/${path}`)
    }
}
