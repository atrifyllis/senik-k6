import {check, sleep} from 'k6';
import {Options} from 'k6/options';
import http from 'k6/http';
import {authenticateUsingOkta} from "./oauth";

export let options: Options = {
    vus: 10,
    duration: '30s'
};

export const OKTA_DOMAIN = 'dev-12550077.okta.com'
export const OKTA_AUTH_SERVER_ID = 'default'
export const OKTA_CLIENT_ID = '0oa54gy6kbqpXlYeu5d7'
export const OKTA_CLIENT_SECRET = 'OdRy6Akv2_tE7qD9H6eiIsQZMRIgDBTMWqQFkyKm'
export const OKTA_SCOPE = 'k6'
export const OKTA_USERNAME = 'test_user'

export const OKTA_PASSWORD = 'open123'

export function setup() {
    let oktaResponse = authenticateUsingOkta(
        OKTA_DOMAIN,
        OKTA_AUTH_SERVER_ID,
        OKTA_CLIENT_ID,
        OKTA_CLIENT_SECRET,
        OKTA_SCOPE,
        ''
    );
    console.log(JSON.stringify(oktaResponse));

    return oktaResponse;
}

export default (data: any) => {
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access_token}`, // or `Bearer ${clientAuthResp.access_token}`
        },
    };
    const res = http.get('http://localhost:8080/reference-data', params);
    check(res, {
        'status is 200': () => res.status === 200,
    });
    sleep(1);
};
