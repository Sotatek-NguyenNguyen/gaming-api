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
      name: 'gaming-treasury-event-service',
      script: 'node ./dist/console.js treasury-event',
      env: {
        NODE_ENV: 'develop',
      },
    },
    {
      name: 'gaming-treasury-signature-service',
      script: 'node ./dist/console.js treasury-signature',
      env: {
        NODE_ENV: 'develop',
      },
    },
    {
      name: 'gaming-nft-scan-service',
      script: 'node ./dist/app-nft-scan-console.js nft-item-scan',
      env: {
        NODE_ENV: 'develop',
      },
    },
  ],
};
