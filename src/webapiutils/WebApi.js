import axios from "axios";

class WebAPi {
  apiPost = (uri, parameterList) => {
    var response;
    return new Promise((resolve, reject) => {
      response = axios
        .post(uri, parameterList)
        .then((response) => {
          return resolve(response);
        })
        .catch((e) => {
          return reject(e);
        });
    });
  };

  apiGet = (uri) => {
    var response;
    return new Promise((resolve, reject) => {
      response = axios
        .get(uri)
        .then((response) => {
          return resolve(response);
        })
        .catch((e) => {
          return reject(e);
        });
    });
  };

  apiDelete = (uri, parameterList) => {
    var response;
    return new Promise((resolve, reject) => {
      response = axios
        .delete(uri, { data: parameterList })
        .then((response) => {
          return resolve(response);
        })
        .catch((e) => {
          return reject(e);
        });
    });
  };
}

export default new WebAPi();
