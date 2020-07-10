import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./sideBar/Sidebar";
import PageWrapper from "./PageWrapper";
import Loader from "./loader/Loader";
import DashboardActionCreator from "../actionCreator/DashboardActionCreator";
import DashboardStore from "../stores/DashBoardStore";
import ClusterStore from "../stores/ClusterStore";
import EventType from "../constants/eventType";
import config from "../../config.json";
import url from "../../url.json";
import classNames from "classnames";

import '../../styles/css/bootstrap.min.css'
import '../../styles/css/blue.css';
import '../../styles/css/style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      isMenuHidden: false,
      renderedOn: Date.now,
    };
    this.eventSource = new EventSource(config.API_URL + url.GET_CLUSTER_STATUS);
  }
  lookupOptionDataLoaded = () => {
    this.setState({
      loading: false,
      renderedOn: Date.now,
    });
  };
  iframeLoaded = () => {
    //console.log("iframeLoaded");
    this.setState({
      isMenuHidden: true,
    });
  };

  getFilteredData = (clusterId) => {
    const { data } = this.state;
    //console.log('app data',data);
    const updatedData = Object.assign([], data);
    const filteredData = updatedData
      ? updatedData.filter((item) => {
          return item.clusterReqId !== clusterId;
        })
      : [];
    return filteredData;
  };

  clusterDeleted = (clusterId) => {
    const updatedData = this.getFilteredData(clusterId);
    this.setState({
      renderedOn: Date.now,
      data: Object.assign([], updatedData),
    });
  };
  clusterAdded = () => {
    this.setState({
      renderedOn: Date.now,
      data: [],
    });
    this.eventSource = null;
    this.eventSource = new EventSource(config.API_URL + url.GET_CLUSTER_STATUS);
    this.eventSource.onmessage = (e) =>
      //console.log('clsad ',JSON.parse(e.data))
      this.updateClusterStatus(JSON.parse(e.data));
  };
  toggleMenu = () => {
    this.setState({
      isMenuHidden: !this.state.isMenuHidden,
    });
  };
  updateClusterStatus = (result) => {
    const { data } = this.state;
    const updatedData = Object.assign([], data);
    const output =
      updatedData &&
      updatedData.find((item) => {
        return item.clusterReqId === result.clusterReqId;
      });
    if (!output) {
      updatedData.push(result);
    } else {
      let item = Object.assign({}, output);
      item.clusterName = result.clusterName;
      item.createStatus = result.createStatus;
      item.createTime = result.createTime;
      item.createUser = result.createUser;
      item.id = result.id;
      item.k8sDashboardUrl = result.k8sDashboardUrl;
      item.clusterReqId = result.clusterReqId;

      let index = updatedData.findIndex(
        (item) => item.clusterReqId === result.clusterReqId
      );
      updatedData[index] = item;
    }
    this.setState({
      data: Object.assign([], updatedData),
    });
  };
  componentDidMount() {
    DashboardActionCreator.loadOptionsData();
    DashboardActionCreator.loadClusterData();
    //console.log('app cpm',this.state.data);
    DashboardStore.addEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionDataLoaded
    );
    ClusterStore.addEventListener(EventType.LOAD_IFRAME, this.iframeLoaded);
    ClusterStore.addEventListener(
      EventType.DELETE_CLUSTER_SUCCESS,
      this.clusterDeleted
    );
    ClusterStore.addEventListener(
      EventType.CREATE_CLUSTER_SUCCESS,
      this.clusterAdded
    );
    this.eventSource.onmessage = (e) =>
      this.updateClusterStatus(JSON.parse(e.data));
  }
  componentWillUnmount() {
    DashboardStore.removeEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionDataLoaded
    );
    ClusterStore.removeEventListener(EventType.LOAD_IFRAME, this.iframeLoaded);
    ClusterStore.removeEventListener(
      EventType.DELETE_CLUSTER_SUCCESS,
      this.clusterDeleted
    );
    ClusterStore.removeEventListener(
      EventType.CREATE_CLUSTER_SUCCESS,
      this.clusterAdded
    );
  }
  render() {
    const toRender = this.state.loading ? (
      <div id="main-wrapper">
        <Header />
        <Loader />
      </div>
    ) : (
      <div
        id="main-wrapper"
        className={classNames(this.state.isMenuHidden ? "hide-sidebar" : "")}
      >
        <Header
          isMenuHidden={this.state.isMenuHidden}
          onClick={this.toggleMenu}
        />
        <PageWrapper clusterData={this.state.data} />
        <Sidebar />
      </div>
    );
    return toRender;
  }
}

export default App;
