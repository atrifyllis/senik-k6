import http, {RefinedParams, RequestBody} from 'k6/http';
import encoding from 'k6/encoding';

/*interface RequestBody {
    scope: string
    grant_type?: string
    username?: string
    password?: string
    client_id?: string
    client_secret?: string

}*/
/**
 * Authenticate using OAuth against Okta
 * @function
 * @param  {string} oktaDomain - Okta domain to authenticate against (e.g. 'k6.okta.com')
 * @param  {string} authServerId - Authentication server identifier (default is 'default')
 * @param  {string} clientId - Generated by Okta automatically
 * @param  {string} clientSecret - Generated by Okta automatically
 * @param  {string} scope - Space-separated list of scopes
 * @param  {string|object} resource - Either a resource ID (as string) or an object containing username and password
 */
export function authenticateUsingOkta(
    oktaDomain: string,
    authServerId: string,
    clientId: string,
    clientSecret: string,
    scope: string,
    resource: string | { username: string, password: string }
) {
    if (authServerId === 'undefined' || authServerId == '') {
        authServerId = 'default';
    }
    const url = `https://${oktaDomain}/oauth2/${authServerId}/v1/token`;
    const requestBody: RequestBody = {scope};

    let response;

    if (typeof resource === 'string') {
        requestBody.grant_type = 'client_credentials';

        const encodedCredentials = encoding.b64encode(`${clientId}:${clientSecret}`);
        const params: RefinedParams<any> = {
            auth: 'basic',
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
            },
        };

        response = http.post(url, requestBody, params);
    } else if (
        typeof resource === 'object' &&
        resource.hasOwnProperty('username') &&
        resource.hasOwnProperty('password')
    ) {
        requestBody['grant_type'] = 'password';
        requestBody['username'] = resource.username;
        requestBody['password'] = resource.password;
        requestBody['client_id'] = clientId;
        requestBody['client_secret'] = clientSecret;

        response = http.post(url, requestBody);
    } else {
        throw new Error('resource should be either a string or an object containing username and password');
    }
    console.log(response)
    return response.json();
}
