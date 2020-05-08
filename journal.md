# Engineering Journal SDC Reviews Service

## Setting up CRUD MONGO DB

Refactored database files and Models to use Mongodb atlas
Set up POST PUT DELETE. GET was already set up from initial code

**Observations/Next steps**
Need to completely refactor to connect to Postgres

## Implementing Postgres

Set up postgres on local machine.
Decided to use terminal instead of GUI to manage DB

_Still unsure if I want to implement Sequelize as will make DB more fluid if need to switch DB to MySql in the future but add more time/costs up front?_

_Thinking I should just use Sequelize as it will abstract out schema design and querying using SQL. This may save more time?_

### Setting up Sequelize

- npm install sequelize pg --save

  - install sequelize for postgres, saved as dependency
  - ran sequelize init but got error.
  - need to install sequelize cli

- npm i -g sequelize-cli

- Set up new user in postgres terminal

  - type 'psql' in command line
  - type 'CREATE ROLE admin WITH password '{a-password}';'
  - type '\du'
  - allow admin list of attrubutes
  - type 'ALTER USER admin WITH Superuser;'
  - repeat for 'CreateDB, CreateRole, Login'
  - Update config.json file. For now, only update development section. _make sure to also update 'database' property with db name 'abreviews'_
  - run command 'sequelize db:migrate'

- Set up model and connect to DB _Refer to sequelize docs/Getting started_

_Also, unsure if I want to implement Docker now, later or at all? It would be nice to start creating containers for each element of the app but will have significant time costs. Need to analyze if Docker implementation is going to be a bottleneck further down the road?_

_Decided to just use Postgres and skip Sequelize for now. Adding too much complexity._

### Connected to Postgres

- Created connection in database/index.js file
- Created schemas for listing and reviews tables at database/addTables.js

#### Create Schemas

- Created schemas and added them to 'addTables.js' file.

#### Seed Data to Postgres

- Refactored helper funcs and created seed scripts
- Data can be successfully seed at 10k - 100k entries
- **Researching use of promises to seed data 10k at a time to reach 10M**

## CRUD Postgres

- Need to research controllers and refactor for Postgres, Mongo, CouchDB

### GET REQUESTS

- **URL:** '/listing?data={listId}
- **Query string:** 'SELECT listings.id, reviews.\* FROM listings, reviews WHERE listings.id = \${listId} AND listings.id = reviews.listing_id;'
- **Data:** 'res.rows' object.
- **Format:**

```javascript
[
  {
    id: 110417,
    username: 'Jolie.Cronin',
    date: 'April 2020',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/m4rio/128.jpg',
    text:
      'Mollitia aperiam distinctio ducimus. Illo vel aliquam at ut dicta ut corrupti distinctio. Cupiditate minus est qui id sunt cum reiciendis praesentium. Numquam libero repellat corrupti.',
    listing_id: 10456,
    communication: '3.3',
    checkin: '1.6',
    value: '4.6',
    accuracy: '1.8',
    location: '2.2',
    cleanliness: '2.8',
  },
];
```

### POST REQUESTS

### PUT REQUESTS

### DELETE REQUESTS
