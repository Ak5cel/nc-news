# Northcoders News API

A simple news API complete with topics, articles, users, and comments. Part of a backend project to learn more about building REST APIs using express.js, interacting with postgres databases and CRUD operations, error handling, TDD, and best practices.

## It's now live! 🚀

Try it out [HERE](https://ak-nc-news.onrender.com/api/) for a preview

(As this is a 🔬small🔬 project, it's deployed on a free plan so the instance might spin down with inactivity every 15 mins. If your first request takes a few seconds, this is likely the reason why)

Some of the supported `GET` endpoints to try out:
- `GET /api`
- `GET /api/topics`
- `GET /api/articles` (with optional query parameter `topic`, try `?topic=coding`)
- `GET /api/articles/:article_id`
- `GET /api/articles/:article_id/comments`

For a full list of available endpoints and their detailed descriptions, check out [`endpoints.json`](./endpoints.json), or [/api](https://ak-nc-news.onrender.com/api/)

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
