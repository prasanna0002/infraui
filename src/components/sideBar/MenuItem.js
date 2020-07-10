import React, { Component } from "react";
import MenuActionCreator from "../../actionCreator/MenuActionCreator";
import MenuStore from "../../stores/MenuStore";
import Item from "./Item";
import EventType from "../../constants/eventType";

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedOn: null,
    };
  }
  componentDidMount() {
    MenuStore.addEventListener(EventType.MENU_SELECTED, this.menuSeleted);
  }
  componentWillUnmount() {
    MenuStore.removeEventListener(EventType.MENU_SELECTED, this.menuSeleted);
  }
  menuSeleted = () => {
    this.setState({
      renderedOn: Date.now(),
    });
  };
  hadleClick = (item) => {
    MenuActionCreator.selectMenuItem(item);
  };
  render() {
    const items = MenuStore.items.map((item, i) => {
      return (
        <Item
          key={item.id}
          onClick={() => {
            this.hadleClick(item);
          }}
          isActive={item.isActive}
          name={item.name}
          class={item.class}
        />
      );
    });
    return items;
  }
}

export default MenuItem;
