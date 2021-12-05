import Page from './page';

class IntegrationsPage extends Page {
    get integrationsModal() {
        return $('[id~=reactist-modal-box]')
    }

    get customizeButton() {
        return $('button*=Customize')
    }

    get editGoogleCalendarConnectionModal() {
        return $('#GB_window')
    }

    async openEditGoogleCalendarConnectionModal() {
        await this.customizeButton.click()
    }

    async closeEditGoogleCalendarConnectionModal() {
        await browser.keys(['Escape'])
    }

    open() {
        return super.open('app/settings/integrations')
    }
}

export default new IntegrationsPage();
