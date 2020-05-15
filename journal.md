# Engineering Journal SDC Reviews Service

## Phase 1 Scale the DB

### Support CRUD with MONGO DB

Refactored database files and Models to use Mongodb atlas
Set up POST PUT DELETE. GET was already set up from initial code

**Observations/Next steps**
Need to completely refactor to connect to Postgres

### DBMS Selection and Data Generation

- Postgres and CouchDB

### Implementing Postgres

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

#### Create Schemas

- Created schemas and added them to 'addTables.js' file.

#### Data generation and seeding to Postgres

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

### Implementing CouchDB

Relevant Docs

<https://docs.couchdb.org/en/stable/index.html>
<https://www.youtube.com/watch?v=nlqv9Np3iAU>

#### Hello DB

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

#### Migrate CSV to Couch DB

Relevant docs
<https://www.npmjs.com/package/couchimport>

<https://medium.com/codait/simple-csv-import-for-couchdb-71616200b095>

#### Seed small Data set

- Created small data set `myOutputReviewsSmall.csv` with 1000 entries to test migration.
- **Added header to CSV** current script does not generate header
- downloaded NPM package `couchimport`
- used script
  - `curl -X PUT http://{username:password}@localhost:5984/{documentName}`
  - to create document abreviews
- used script
  - `cat {filePathForCSVFile} | couchimport --url http://{username:password}@localhost:5984 --db {documentName} --delimiter ‘,’ CSV HEADER`
  - to seed small data set.

- Data small data set successfully Seeded!

#### Seed Large data set

- Used same script for Large data set and was seeded successfully!

### DBMS Benchmarking PostgreSQL

#### Initial query speeds

Query:

``` SQL
EXPLAIN ANALYZE SELECT * FROM reviews WHERE id = 24000000;
```

- `Planning Time: 0.694 ms`
- `Execution Time: 25.541 ms`

Ran same query again and speeds were significantly faster.

- `Planning Time: 0.079 ms`
- `Execution Time: 0.038 ms`

**Issue: when querying reviews based on foreign key `listing_id` performnce is significantly slower**

```SQL
EXPLAIN ANALYZE SELECT * FROM reviews WHERE listing_id = 9000000;
```

- `Planning Time: 0.089 ms`
- `Execution Time: 84658.076 ms`

Made no difference if I ran it again still querying very slow.

**Research**
Looked into posgres VACUUM

Ran query:

```SQL
VACUUM(FULL, ANALYZE, VERBOSE) reviews;
```

- still slow, no effect on query speed.
- doc ref: <https://confluence.atlassian.com/kb/optimize-and-improve-postgresql-performance-with-vacuum-analyze-and-reindex-885239781.html>

Looked into creating an index on my foreign key

- doc ref:
  - <https://www.postgresql.org/docs/9.1/sql-createindex.html>
  - <https://www.youtube.com/watch?v=19eLh1ZdoLY>

Ran query:

```SQL
CREATE INDEX idx_listing_id ON reviews(listing_id);
```

GET REQUEST

```SQL
EXPLAIN ANALYZE SELECT * FROM reviews WHERE listing_id = 9000000;
```

- `Planning Time: 0.092 ms`
- `Execution Time: 26.683 ms`

Ran SELECT query again and got:

- `Planning Time: 0.087 ms`
- `Execution Time: 0.042 ms`

POST REQUEST
***Two part***

- have to create a new listing
- then can create new review
***Due to foreign key constraint***

Create new listing

```SQL
  EXPLAIN ANALYZE INSERT INTO listings(id) VALUES(10000003);
```

- `Planning Time: 0.021 ms`
- `Execution Time: 0.091 ms`

Create new review

```SQL
  EXPLAIN ANALYZE INSERT INTO reviews(id, listing_id, username, date, avatar, text, communication, checkin, value, accuracy, location, cleanliness) VALUES(25000983, 10000003, 'test3', 'December 2020', 'https://s3.amazonaws.com/uifaces/faces/twitter/scrapdnb/130.jpg', 'laksdjfalksdjaa', 3.6, 3.5, 5.0, 3.1, 4.2, 5.0);
```

- `Planning Time: 0.069 ms`
- `Trigger for constraint reviews_listing_id_fkey: time=0.126 calls=1`
- `Execution Time: 34.482 ms`

SUCCESS!!

### DBMS Benchmarking CouchDB

GET REQUESTS

- Used Mango Query to query CouchDB
- `Executed in 20 ms`

Ran query again

- `Executed in 14 ms`

Did not notice a significant difference in query speed when query was run multiple times.

### Postgres vs CouchDB

#### Postgres

Pros:

- Postgres is a bit slower on first query however is exponentially faster on subsequent queries.
- Rich documentation available on line, lots of resources on Stack overflow and youtube. Feel if I need help or run into problems down the line, the rich resource library will be very useful.
- Can implement ORM with Sequelize.
- Large adoption within the dev community.

Cons:

- Some parts of the documentation can be dense.
- Syntax can be quirky

#### CouchDB

Pros

- Slightly faster on first query but stays constant on subsequent queries.
- Nice GUI called "Fauxton" which can be a better experience however Postgres also has one called pgAdmin.
- After initial learning curve is a fairly smooth experience.

Cons

- Lack of documentation, poor resources. This can be very problematic down the line...
- Steep learning curve.
- Low adoption from dev community.

#### Recommendation: POSTGRES
