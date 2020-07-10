import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";

class MenuActionCreator {
  selectMenuItem = (item) => {
    const action = {
      actionType: ActionType.MENU_SELECT,
      value: item,
    };
    Dispatcher.dispatch(action);
  };
}
export default new MenuActionCreator();
