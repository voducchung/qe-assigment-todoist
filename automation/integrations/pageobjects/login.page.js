import Page from './page';

class LoginPage extends Page {
    get emailInput() {
        return $('#email')
    }

    get passwordInput() {
        return $('#password')
    }

    get submitButton() {
        return $('button.submit_btn')
    }

    async login(username, password) {
        await this.emailInput.setValue(username)
        await this.passwordInput.setValue(password)
        await this.submitButton.click()
    }

    open() {
        return super.open('users/showlogin')
    }
}

export default new LoginPage();
