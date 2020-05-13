# Engineering Journal SDC Reviews Service

## Phase 1 Scale the DB

### Support CRUD with MONGO DB

Refactored database files and Models to use Mongodb atlas
Set up POST PUT DELETE. GET was already set up from initial code

**Observations/Next steps**
Need to completely refactor to connect to Postgres

### DBMS Selection and Data Generation

- Postgres and CouchDB

#### Implementing Postgres

Set up postgres on local machine.
Decided to use terminal instead of GUI to manage DB

_Still unsure if I want to implement Sequelize as will make DB more fluid if need to switch DB to MySql in the future but add more time/costs up front?_

_Thinking I should just use Sequelize as it will abstract out schema design and querying using SQL. This may save more time?_

#### Setting up Sequelize

- npm install sequelize pg --save

  - install sequelize for postgres, saved as dependency
  - ran sequelize init but got error.
  - need to install sequelize cli

- npm i -g sequelize-cli

- Set up new user in postgres terminal

  - type 'psql' in command line
  - type 'CREATE ROLE admin WITH password '{a-password}';'
  - type '\du'
  - allow admin list of attributes
  - type 'ALTER USER admin WITH Superuser;'
  - repeat for 'CreateDB, CreateRole, Login'
  - Update config.json file. For now, only update development section. _make sure to also update 'database' property with db name 'abreviews'_
  - run command 'sequelize db:migrate'

- Set up model and connect to DB _Refer to sequelize docs/Getting started_

_Also, unsure if I want to implement Docker now, later or at all? It would be nice to start creating containers for each element of the app but will have significant time costs. Need to analyze if Docker implementation is going to be a bottleneck further down the road?_

_Decided to just use Postgres and skip Sequelize for now. Adding too much complexity._

#### Connected to Postgres

- Created connection in database/index.js file
- Created schemas for listing and reviews tables at database/addTables.js

##### Create Schemas

- Created schemas and added them to 'addTables.js' file.

##### Data generation and seeding to Postgres

Relevant Docs

<https://www.postgresql.org/docs/current/populate.html>
<https://nodejs.org/api/stream.html#stream_event_drain>
<https://thoughtbot.com/blog/reading-an-explain-analyze-query-plan>

- Refactored helper funcs and created seed scripts
- Data can be successfully seed at 10k - 100k entries
- Decided to generate data as csv file. This will serve as a source if I want to migrate data to couchDB or AWS.
- Generated 24M reviews and 10M listings.
- Had to refactor 1 - 4 reviews per listing as 1 - 20 was creating 34GB of data!
- Added default eventemitter and set maxdefault to 500 after getting error
- Data successfully created and stored in csv file
- Used sql query

Reviews Query

```SQL
COPY reviews(username, date, avatar, text, listing_id, communication, checkin, value, accuracy, location, cleanliness) FROM {csvFile} DELIMITER ',' CSV;'
```

Listings Query

```SQL
COPY listings(id) FROM {csvFile} DELIMITER ',' CSV;'
```

#### DBMS Benchmarking

##### GET REQUESTS

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

##### POST REQUESTS

##### PUT REQUESTS

##### DELETE REQUESTS

#### Implementing CouchDB

Relevant Docs

<https://docs.couchdb.org/en/stable/index.html>
<https://www.youtube.com/watch?v=nlqv9Np3iAU>

##### Hello DB

- Downloaded and installed couch db
- Used GUI Fixation to interact with DB
- Set up testdb as cluster as this will help with faster querying for large data sets.
- Set up partition key with creating test documents. Set key as id.

``` javascript
{
  "_id": "{PARTITION KEY}:72e8bdde44adc8fc4a1b3fedba0086c5",
  "id": 1,
  "name": "testName1",
  "text": "alskdfaslkjdfalskdjfalksdjfaskdfja",
  "listing_id": 8
}
```

##### Migrate CSV to Couch DB

Relevant docs
<https://www.npmjs.com/package/couchimport>
<https://medium.com/codait/simple-csv-import-for-couchdb-71616200b095>

##### Seed small Data set

- Created small data set `myOutputReviewsSmall.csv` with 1000 entries to test migration.
- **Added header to CSV** current script does not generate header
- downloaded NPM package `couchimport`
- used script
  - `curl -X PUT http://localhost:5984/{documentName}`
  - to create document abreviews
- used script
  - `cat {filePathForCSVFile} | couchimport --url http://{username:password}@localhost:5984 --db {documentName} --delimiter ‘,’`
  - to seed small data set.

- Data small data set successfully Seeded!

##### Seed Large data set
