(function () {
  window['env'] = {
    api: '${FLPY_API_HOST}',
    auth: {
      domain: '${FLPY_AUTH_DOMAIN}',
      clientId: '${FLPY_AUTH_CLIENT_ID}',
      authorizationParams: {
        audience: '${FLPY_AUTH_AUDIENCE}',
        redirect_uri: '${FLPY_AUTH_REDIRECT_URI}',
      },
      errorPath: '/callback',
    },
    loginMode: '${FLPY_LOGIN_MODE}',
    streamSource: {
      baseUrl: '${FLPY_STREAM_SOURCE_BASE_URL}',
    },
    enableDebugTools: !!'${FLPY_DEBUG}',
  };
})();
