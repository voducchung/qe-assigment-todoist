import Page from './page';

class MainPage extends Page {
    get inboxLink() {
        return $('#filter_inbox')
    }

    async goToInbox() {
        await this.inboxLink.click()
    }

    /**
     * 
     * @param {string} taskName 
     */
    async createNewTask(taskName) {
        await $('button.plus_add_button').click()
        await $('div.public-DraftEditor-content').setValue(taskName.split(''))
        await $('button[type=submit]').click()
        await browser.pause(20000)
        const tasks = await this.getTaskList()
        browser.waitUntil(() => tasks.includes(taskName))
    }

    async getTaskList() {
        return await $$('div.task_list_item__content').map(taskItem => taskItem.getText())
    }

    open() {
        return super.open('app')
    }
}

export default new MainPage();
