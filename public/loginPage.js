"use strict";

const newUserForm = new UserForm();

newUserForm.loginFormCallback = (response) => {
    let login = response.login;
    let password = response.password;

    ApiConnector.login({ login, password }, (response) => {
        if (response.success) {
            location.reload();
        } else {
            newUserForm.setLoginErrorMessage(response.error);
        }
    });
};

newUserForm.registerFormCallback = (response) => {
    let login = response.login;
    let password = response.password;

    ApiConnector.register({ login, password }, (response) => {
        if (response.success) {
            location.reload();
        } else {
            newUserForm.setRegisterErrorMessage(response.error);
        }
    });
};
