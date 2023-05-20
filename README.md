# Coding Assessment for a Certain Company

Demo on https://stealth-coding-assessment-backend.onrender.com/users

---

## Tech Stack

Aside from Node.js + Express required by the coding exercise, the major DB/libraries/APIs used are:

- PostgreSQL :elephant:
- [TypeORM](https://typeorm.io/)
- [`@jmondi/oauth2-server`](https://github.com/jasonraimondi/ts-oauth2-server)
  * Chosen since it supports PKCE, which I thought was needed for the project :sweat_smile:. That
    turned out to be just me overhyping things and thinking it's a full-blown OAuth2 server upon seeing
    _"OAuth2 Bearer Token"_ in the coding :man_facepalming: exercise spec.
- [EmailJS](https://www.emailjs.com/) is used to send the verification email
  * Most of the popular ones require a work email, and won't send emails using personal domains like `gmail.com`
  * SMTP is also [blocked on render.com](https://community.render.com/t/is-it-possible-to-use-sendmail/9640)
   _(it's where I hosted the demo version of this coding exercise)_

## Running Locally

Clone the repo:

```sh
git clone git@github.com:myknbani/stealth-coding-assessment.git
  ```

Install NPM dependencies

```sh
npm i
```

*Optional:* Run PostgreSQL via Docker

```sh
docker-compose up
```

Run migrations and seeds

```sh
# Create the DB and run migrations
npm run db:create

# Optionally seed the database
npm run seed
```

Create an [EmailJS account](https://dashboard.emailjs.com/sign-up), a service, and a template.  The
template must contain 3 Handlebars placeholders:

- `{{to_name}}` for the recipient's name
- `{{to_email}}` for the recipient's email address
- `{{link}}` for the activation link

Create an `.env` file that looks like this:

```sh
# these environment variables are also used by docker-compose
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/stealth_assessment"
POSTGRES_PASSWORD="postgres" # don't remove, used by docker-compose
PGADMIN_DEFAULT_EMAIL="richard.michael.coo@gmail.com"
PGADMIN_DEFAULT_PASSWORD="postgres"

# this key is exposed in Github, use only for local development and not prod -- OR YOU WILL BE FIRED
JWT_SECRET="neIt4mypbeflelmaXyssJSKe+EMza/P8lhdsneGHErmPW569WfKIzdQwSEui8u/y4PVWzrde6HHrStLG6YHVwA=="

# These are not real EmailJS secrets, please use your own, but the format looks like these:
EMAILJS_PUBLIC_KEY="fsnTxEv5zYOV-zk0D"
EMAILJS_PRIVATE_KEY="Q1lX5XGrr-nVjD88PiAP7"
EMAILJS_TEMPLATE_ACTIVATION="service_ujz28wr"
EMAILJS_SERVICE_ID="template_q0na4pa"
```

Run locally:

```sh
npm run dev
```

## Testing in the Demo Server: Postman Collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/27528170-50f7b6f1-04c4-47a7-80e3-8faa64689f90?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D27528170-50f7b6f1-04c4-47a7-80e3-8faa64689f90%26entityType%3Dcollection%26workspaceId%3D26083ddf-228d-40f6-bdf9-aa47b1edfec8)

## Testing in the Demo Server: cURL Requests

These access tokens would have already expired.

### Get an OAuth2 bearer/access token

```sh
curl -L -X POST 'https://stealth-coding-assessment-backend.onrender.com/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'grant_type=password' \
-d 'client_id=8a5e42d8-3d55-4e9b-a3f2-4fc92a83f7be' \
-d 'username=richard.michael.coo%40gmail.com' \
-d 'password=yahoo123!'
```

### Refresh an expired/about-to-expire bearer/access token

```sh
curl -L -X POST 'https://stealth-coding-assessment-backend.onrender.com/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'grant_type=refresh_token' \
-d 'client_id=8a5e42d8-3d55-4e9b-a3f2-4fc92a83f7be' \
-d 'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback' \
-d 'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.some_refresh_token_that_takes_too_long_to_expire.3eTYYcCsUlDRvaOWEZCq_HfGQsdqp3Hn5uXMmDsI3bs'
```

### Register a new user

```sh
curl -L -X POST 'https://stealth-coding-assessment-backend.onrender.com/users' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "richard.michael.coo+555@gmail.com",
  "password": "foo12345!",
  "firstName": "Mykee",
  "lastName": "Ruru"
}'
```

### Get the list of users without auth

_`limit` and `offset` are optional_

```sh
curl -L -X GET 'https://stealth-coding-assessment-backend.onrender.com/users?limit=5&offset=1'
```

### Get the list of users with auth

_`limit` and `offset` are optional_

```sh
curl -L -X GET 'https://stealth-coding-assessment-backend.onrender.com/users?limit=5&offset=1' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJTb21lIDNyZCBQYXJ0eSBQdWJsaWMgQmFja2VuZCIsInNjb3BlIjoiIiwic3ViIjoxLCJleHAiOjE2ODQ1ODY3ODcsIm5iZiI6MTY4NDU4NTg4NywiaWF0IjoxNjg0NTg1ODg3LCJqdGkiOiJuOGxKemg2YURYT210WkJJQlk3YmpBcjhELS15WDdlMGE5bmZObjJNRUVzIn0.i6hpPXdI9j-uYDuJumcDXOWFWLvNlUNo-v0Aq8gvzVA'
```

### Get a single user (user detail) with auth

Just remove the `-H Authorization:...` header to remove auth

```sh
curl -L -X GET 'https://stealth-coding-assessment-backend.onrender.com/users/3' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJTb21lIDNyZCBQYXJ0eSBQdWJsaWMgQmFja2VuZCIsInNjb3BlIjoiIiwic3ViIjoxLCJleHAiOjE2ODQ1ODQ4OTgsIm5iZiI6MTY4NDU4Mzk5OCwiaWF0IjoxNjg0NTgzOTk4LCJqdGkiOiJPdXdZWklUNzQxbHlvNkhRX0FEdldDdDBIYzNvLW5pcWUwM2VvUlZ3cHRBIn0.zEThO5-HO_fydCxA5LBsxv_6gNDNXOUiKoRbL1gBALU'
```

## Change Password

```sh
curl -L -X PATCH 'https://stealth-coding-assessment-backend.onrender.com/users/1/change-password' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJTb21lIDNyZCBQYXJ0eSBQdWJsaWMgQmFja2VuZCIsInNjb3BlIjoiIiwic3ViIjoxLCJleHAiOjE2ODQ1ODg4MTIsIm5iZiI6MTY4NDU4NTIxMiwiaWF0IjoxNjg0NTg1MjEyLCJqdGkiOiJncGV5X1pzTHBJcHBRVlhuSHVKaWdMRTNjYUNFT0JHOTlxZllEUFQyalNrIn0.5S8aEIzEISiOUhZU2_MG-Cf-N45gGw5sf7FOuDOgtS4' \
-d '{
  "password": "yahoo123!"
}'
```
