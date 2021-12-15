module.exports = {
  apps: [
    {
      name: 'dev-gaming-service',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'develop',
      },
      exec_mode: 'cluster',
    },
    {
      name: 'stg-gaming-service',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'staging',
      },
      exec_mode: 'cluster',
    },
    {
      name: 'gaming-service',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
    },
  ],
};
