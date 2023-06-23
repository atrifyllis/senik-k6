import {check, sleep} from 'k6';
import {Options} from 'k6/options';
import http, {RequestBody} from 'k6/http';
import {authenticateUsingOkta} from "./oauth";

export let options: Options = {
    vus: 100,
    duration: '60s'
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
    let body: RequestBody = `
    {
      "individual": {
        "insuranceType": "TSMEDE",
        "efkaClassId": "d55ec320-c0fe-4222-808e-3b52d9087061",
        "eteaepClassId": "14d0b02a-2898-4c7b-8519-3bf163f8f931",
        "grossDailyIncomes": [
          {
            "days": 220,
            "dailyIncome": {
              "amount": 500.00,
              "currencyCode": "EUR"
            }
          }
        ],
        "annualExpensesAmount": {
          "amount": 0.00,
          "currencyCode": "EUR"
        }
      }
    }
    `
    const res = http.post('http://localhost:8080/calculate-income', body, params);
    check(res, {
        'status is 200': () => res.status === 200,
    });
    sleep(1);
};
