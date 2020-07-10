import React, { Component, createFactory } from "react";
import CreateCluster from "./cluster/CreateCluster";
import ClusterWrapper from "./cluster/ClusterWrapper";
import Security from "./security/SecurityNew";
import UnderConstruction from "./UnderConstruction";
import DashBoard from "./dashboard/Dashboard";
import NameSpace from "./namespace/CreateNameSpace";
import MenuStore from "../stores/MenuStore";
import EventType from "../constants/eventType";
import Menu from "../constants/menu";

class PageWrapper extends Component {
  constructor(props) {
    super(props);
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
  componentToRender = () => {
    let component = <UnderConstruction />;
    const selectedMenu = MenuStore.getSelectedMenu();
    switch (selectedMenu.name) {
      case Menu.DASHBOARD:
        component = <DashBoard />;
        break;
      case Menu.CLUSTER_MANAGEMENT:
        component = <ClusterWrapper clusterData={this.props.clusterData} />;
        break;
      case Menu.SECURITY:
        component = <Security />;
        break;
      case Menu.NAMESPACE:
        component = <NameSpace />;
        break;
      default:
        break;
    }
    return component;
  };
  render() {
    return <div className="page-wrapper">{this.componentToRender()}</div>;
  }
}

export default PageWrapper;
