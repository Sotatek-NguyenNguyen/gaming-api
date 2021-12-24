# Gaming Service Backend

## Development

```
// install husky to run lint and commitlint when commit code
npx husky install

// install dependencies
yarn

// (Optional) if u dont have mongodb, redis in local machine
docker-compose up -d

// Copy file .env.example to .env. Update value if needed

// Run
yarn start:dev
```

In order to use transaction in mongodb, we need to set up mongodb replica set.

```
docker-compose -f docker-compose.mongo-rs.yml up -d

// If u are using Linux, pls follow this link https://stackoverflow.com/questions/68674897/mongodb-docker-replica-set-connection-error-host-not-found

// With MacOs
// Wait about 30s, and then exec into mongo1 container
docker exec -it mongo1 bash

// Inside mongo1 container run following commands:
mongo
// then
rs.initiate(
  {
    _id : 'mongo-rs',
    members: [
      { _id : 0, host : "mongo1:27017", priority: 3 },
      { _id : 1, host : "mongo2:27017", priority: 1 },
      { _id : 2, host : "mongo3:27017", priority: 1 }
    ]
  }
)

// Add following line in file /etc/hosts
127.0.0.1   mongo1 mongo2 mongo3


// Windows may be the same as MacOs
// If anyone has successfully set up in Windows, pls, confirm or write instructions. Tks!!!

```

## Conventions
- Commit message must follow these rules: https://www.npmjs.com/package/@commitlint/config-conventional . Examples:
```
git commit -m "feat: api get prepaid balance"

git commit -m "fix: api get ..."
```
