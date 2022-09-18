const newLogout = new LogoutButton();

newLogout.action = () => {
  ApiConnector.logout((response) => {

    if (response.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {

  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const newRatesBoard = new RatesBoard();

const getExchangeRate = () => {
  ApiConnector.getStocks((response) => {

    if (response.success) {
      newRatesBoard.clearTable();
      newRatesBoard.fillTable(response.data);
    }
  });
};

getExchangeRate();

setInterval(() => getExchangeRate(), 60000);

const newMoneyManager = new MoneyManager();

newMoneyManager.addMoneyCallback = (response) => {
  const currency = response.currency;
  const amount = response.amount;

  ApiConnector.addMoney({ currency, amount }, (response) => {

    if (response.success) {
      ProfileWidget.showProfile(response.data);
      newMoneyManager.setMessage(
        response.success,
        "Вы успешно пополнили свой баланс"
      );
    } else {
      response.error = "Некорректно введеные данные";
      newMoneyManager.setMessage(response.success, `${response.error}`);
    }
  });
};

newMoneyManager.conversionMoneyCallback = (response) => {
  const fromCurrency = response.fromCurrency;
  const targetCurrency = response.targetCurrency;
  const fromAmount = response.fromAmount;

  ApiConnector.convertMoney(
    { fromCurrency, targetCurrency, fromAmount },
    (response) => {

      if (response.success) {
        ProfileWidget.showProfile(response.data);
        newMoneyManager.setMessage(
          response.success,
          `Вы успешно конвертировали валюту из ${fromCurrency} в  ${targetCurrency}`
        );
      } else {
        response.error = "Некорректно введеные данные";
        newMoneyManager.setMessage(response.success, `${response.error}`);
      }
    }
  );
};

newMoneyManager.sendMoneyCallback = (response) => {
  const to = response.to;
  const currency = response.currency;
  const amount = response.amount;
  
  ApiConnector.transferMoney({ to, currency, amount }, (response) => {
    
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      newMoneyManager.setMessage(
        response.success,
        `Вы успешно совершили перевод на сумму ${amount} ${currency} пользователю с id: ${to}`
      );
    } else {
      newMoneyManager.setMessage(response.success, `${response.error}`);
    }
  });
};

const newFavoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
 
  if (response.success) {
    newFavoritesWidget.clearTable();
    newFavoritesWidget.fillTable(response.data);
    newMoneyManager.updateUsersList(response.data);
  }
});

newFavoritesWidget.addUserCallback = (response) => {
  const id = response.id;
  const name = response.name;

  ApiConnector.addUserToFavorites({ id, name }, (response) => {
   

    if (response.success) {
      newFavoritesWidget.clearTable();
      newFavoritesWidget.fillTable(response.data);
      newMoneyManager.updateUsersList(response.data);
      newFavoritesWidget.setMessage(
        response.success,
        `Вы успешно добавили пользователя ${name} в избранное`
      );
    } else {
      newFavoritesWidget.setMessage(response.success, `${response.error}`);
    }
  });
};

newFavoritesWidget.removeUserCallback = (response) => {
  const id = response;
  ApiConnector.removeUserFromFavorites(id, (response) => {
    
    if (response.success) {
      newFavoritesWidget.clearTable();
      newFavoritesWidget.fillTable(response.data);
      newMoneyManager.updateUsersList(response.data);
      newFavoritesWidget.setMessage(
        response.success,
        `Вы удалили пользователя с id:${id} из избранного`
      );
    } else {
      newFavoritesWidget.setMessage(response.success, `${response.error}`);
    }
  });
};
