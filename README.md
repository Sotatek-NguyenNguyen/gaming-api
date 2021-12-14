# Gamify Gaming Service Backend

## Development

```
// install husky to run lint and commitlint when commit code
npx install husky

// install dependencies
yarn

// (Optional) if u dont have mongodb in local machine
docker-compose up -d

// Copy file .env.example to .env. Update value if needed

// Run
yarn start:dev
```

## Conventions
- Commit message must follow these rules: https://www.npmjs.com/package/@commitlint/config-conventional . Examples:
```
git commit -m "feat: api get prepaid balance"

git commit -m "fix: api get ..."
```
