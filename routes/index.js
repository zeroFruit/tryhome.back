import itemController from '../controllers/itemController';
import siteController from '../controllers/siteController';
import shoppingListController from '../controllers/shoppingListController';

module.exports = (app) => {
    app.post('/api/item', itemController.createItem);
    app.get('/api/item', itemController.fetchItems);
    app.get('/api/all/item', itemController.fetchAllItems);
    app.delete('/api/item', itemController.deleteItem);

    app.get('/api/site', siteController.fetchSite);
    app.put('/api/site', siteController.editSite);
    app.get('/api/site/exist', siteController.checkSiteExist);

    app.post('/api/shoppinglist', shoppingListController.addShoppingList);
    app.get('/api/shoppinglist', shoppingListController.fetchShoppingList)
}
