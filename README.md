# Northcoders News API

## Setup

1. Create two dotenv files `.env.test` and `.env.development` in the root directory as follows:

```sh
  # in .env.development
  PGDATABASE=nc_news

  # in .env.test
  PGDATABASE=nc_news_test
```

2. Run the following commands to setup the databases and seed the development database

```
  npm run setup-dbs
  npm run seed
```
