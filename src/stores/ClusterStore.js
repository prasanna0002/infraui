import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class ClusterStore extends EventEmitter {
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.clusterData = [];
  }
  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_CLUSTER:
        this.emit(EventType.CREATE_CLUSTER_SUCCESS, action.value);
        break;
      case ActionType.CREATE_CLUSTER_FAILED:
        this.emit(EventType.CREATE_CLUSTER_FAILED);
        break;
      case ActionType.DELETE_CLUSTER:
        this.emit(EventType.DELETE_CLUSTER_SUCCESS, action.value);
        break;
      case ActionType.DELETE_CLUSTER_FAILED:
        this.emit(EventType.DELETE_CLUSTER_FAILED);
        break;
      case ActionType.UPDATE_CLUSTER_DATA:
        this.clusterData = action.value;
        this.emit(EventType.UPDATE_CLUSTER_DATA);
        break;
      case ActionType.LOAD_IFRAME:
        this.emit(EventType.LOAD_IFRAME);
        break;
      default:
        break;
    }
  };
  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new ClusterStore();
