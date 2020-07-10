import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import WebApi from "../webapiutils/WebApi";

import config from "../../config.json";
import url from "../../url.json";

class NameSpaceActionCreator {
  createNameSpace = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.CREATE_NAMESPACE, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.CREATE_NAMESPACE_SUCCESS,
        //   value: response.data.clusterID,
        };
        Dispatcher.dispatch(action);
      })
      .catch((reject) => {
        const action = {
          actionType: ActionType.CREATE_NAMESPACE_FAILED,
        };
        Dispatcher.dispatch(action);
      });
  };
  saveCustomBucketRange = (bucketRangeObject) => {
    const action = {
      actionType: ActionType.SAVE_CUSTOM_BUCKET_RANGE,
      value: bucketRangeObject
    };
    Dispatcher.dispatch(action);
  }
}
export default new NameSpaceActionCreator();
