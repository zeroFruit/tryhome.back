import '../../config/env/env';

import __itemController from '../controllers/itemController';
import __siteController from '../controllers/siteController';
import __shoppingListController from '../controllers/shoppingListController';

module.exports = (app) => {
  app.post('/api/item', __itemController.createItem);
  app.get('/api/item', __itemController.fetchItems);
  app.delete('/api/item', __itemController.deleteItem);

  app.get('/api/site', __siteController.fetchSite);
  app.put('/api/site', __siteController.editSite);
  app.get('/api/site/exist', __siteController.checkSiteExist);

  app.post('/api/shoppinglist', __shoppingListController.addShoppingList);
  app.get('/api/shoppinglist', __shoppingListController.fetchShoppingList);
}
