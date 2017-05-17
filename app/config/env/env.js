const env = (process.env.NODE_ENV || 'development').trim();

if (env === 'development' || env === 'test' || env === 'production') {

  let config = require('./env.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
