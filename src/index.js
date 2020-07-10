import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Keycloak from 'keycloak-js'
//import '../../styles/css/style.css';


   let initOptions = {
        url: 'http://localhost:8082/auth/', 
    realm: 'IAC_realm', clientId: 'IAC_UI_Client',
     onLoad: 'login-required'
    } 

let keycloak = Keycloak(initOptions); 

keycloak.init({ onLoad: initOptions.onLoad }).success((auth) => {

    if (!auth) {
        window.location.reload();
    } else {
        console.info("Authenticated", keycloak.tokenParsed.name);
    }
//put here
ReactDOM.render(<App/>, document.getElementById('app')) 

    setTimeout(() => {
        keycloak.updateToken(70).success((refreshed) => {
            if (refreshed) {
                console.debug('Token refreshed' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).error(() => {
            console.error('Failed to refresh token');
        });


    }, 6000) 
}).error(() => {
    console.error("Authenticated Failed");
});    
 
//ReactDOM.render(<App/>, document.getElementById('app'))
