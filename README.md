# Northcoders News API

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)](https://expressjs.com)
[![codecov](https://codecov.io/gh/Ak5cel/nc-news/graph/badge.svg?token=LKKE9VC0FE)](https://codecov.io/gh/Ak5cel/nc-news)

A simple news API complete with topics, articles, users, comments, and some sample data to get started. Part of a backend project to learn more about building REST APIs using Express.js, interacting with postgres databases and CRUD operations, error handling, TDD, and best practices.

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

## Setup and Testing
To run the development server and tests on your own device: 
> [!IMPORTANT]
> Make sure you have node.js and npm installed and updated, and psql setup and running before proceeding.
> 
> This project was developed using `node.js v20.5.0`, `npm 9.8.0`, and `psql 14.8` 


### 1. Clone the repo
```sh
  git clone https://github.com/Ak5cel/nc-news.git
  cd nc-news/
```

### 2. Install dependencies
  ```sh
    npm install
  ```

  This will install all dependencies, including the devDependencies used for testing and seeding the development+test databases

### 3. Setup environment variables
Create two dotenv files `.env.test` and `.env.development` in the root directory as follows:
```sh
  # in .env.development
  PGDATABASE=nc_news
```
```sh
  # in .env.test
  PGDATABASE=nc_news_test
```

### 4. Create the databases and seed the development database

```sh
  npm run setup-dbs
  npm run seed
```

### 5. Test everything's working:
(The tests are setup to automatically re-seed the testing database before each test)
```sh
  # to run full test suite (using jest)
  npm test

  # (OR)
  #  to run just the tests for the api endpoints
  npm test app
```

### 6. Run the server locally (on port 9090 by default)
```sh
  npm run dev
```

All good! 🎉 

Now open up a client (Insomnia, Postman, browser, or from your terminal using `curl`) and make a `GET` request to `http://localhost:9090/api` to get started.

<br/>
💜
