import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class SecurityStore extends EventEmitter {
  credentialsList = [];
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
  }

  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_SECURITY_SUCCESS:
        this.emit(EventType.CREATE_SECURITY_SUCCESS, action.value);
        break;
      case ActionType.CREATE_SECURITY_FAILED:
        this.emit(EventType.CREATE_SECURITY_FAILED);
        break;
      case ActionType.GET_LOOKUP_OPTIONS_DATA:
        this.lookupOptionData = action.value;
        this.emit(EventType.GET_LOOKUP_OPTIONS);
        break;
      case ActionType.GET_CREDENTIALS_SUCCESS:
        this.credentialsList = action.data;
        this.emit(EventType.GET_CREDENTIALS_SUCCESS);
        break;
      case ActionType.CREDENTIAL_DELETED:
        this.credentialsList = [];
        this.emit(EventType.DELETE_CREDENTIAL_SUCCESS);
        break;
      default:
        break;
    }
  };

  getCredentialComponents(credentialType) {
    const credentialsList = this.lookupOptionData.credComponentsList;
    const credential = credentialsList.find(
      (item) => item.credentialType === credentialType
    );

    return credential && credential.components;
  }

  getCredentialTypeOptions = () => {
    //NEED CORRECTION
    return this.lookupOptionData.options.credentialType.map((item) => {
      return {
        description: item.credentialType,
        value: item.credentialType,
      };
    });
  };

  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new SecurityStore();
