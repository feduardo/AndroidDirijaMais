const ENV = {
  API_URL: __DEV__
    ? 'https://dirijacerto-api.dirijacerto.com.br'
    : 'https://dirijacerto-api.dirijacerto.com.br',
  API_TIMEOUT: 30000,
  ENABLE_LOGS: __DEV__,
  STRIPE_PUBLISHABLE_KEY: 'pk_live_bdkMhyGN1nVXfBO8Mx0XWnF0',
  GOOGLE_CLIENT_ID:'430611634023-de2g63gfv9cl96b4vla52plgsje3lm0l.apps.googleusercontent.com'
};

export default ENV;
