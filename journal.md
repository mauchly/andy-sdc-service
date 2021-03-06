# Engineering Journal SDC Reviews Service

## Table of Contents

- [Engineering Journal SDC Reviews Service](#engineering-journal-sdc-reviews-service)
  - [Table of Contents](#table-of-contents)
  - [Phase 1 Scale the DB](#phase-1-scale-the-db)
    - [MongoDB](#mongodb)
      - [Support CRUD with MONGO DB](#support-crud-with-mongo-db)
    - [Postgres](#postgres)
      - [Sequelize](#sequelize)
      - [Data Generation/Seeding](#data-generationseeding)
    - [CouchDB](#couchdb)
      - [Hello DB](#hello-db)
      - [Migrate CSV to Couch DB](#migrate-csv-to-couch-db)
      - [Seed Small Data Set](#seed-small-data-set)
      - [Seed Large data set](#seed-large-data-set)
    - [Benchmarking](#benchmarking)
        - [Postgres Benchmark](#postgres-benchmark)
      - [CouchDB BenchMark](#couchdb-benchmark)
    - [Postgres vs CouchDB](#postgres-vs-couchdb)
      - [Postgres Results](#postgres-results)
      - [CouchDB Results](#couchdb-results)
  - [Phase 2 Measure Initial Performance](#phase-2-measure-initial-performance)
    - [New Relic](#new-relic)
    - [Artillery](#artillery)
    - [Clustering Server](#clustering-server)
    - [Stress Test Single Server](#stress-test-single-server)
    - [Stress Test Cluster Server](#stress-test-cluster-server)
    - [Notes](#notes)
    - [Server Side Rendering Research](#server-side-rendering-research)
  - [Phase 3: Deploy the Service and Proxy](#phase-3-deploy-the-service-and-proxy)
    - [AWS](#aws)
      - [Postgres](#postgres-1)
        - [Connect](#connect)
        - [Migrate Data](#migrate-data)
      - [App Service](#app-service)
    - [Stress Test (AWS)](#stress-test-aws)
      - [Loader.io](#loaderio)
      - [Stress Test Results](#stress-test-results)
    - [Docker](#docker)
  - [Phase 4: Scale the Service and Proxy](#phase-4-scale-the-service-and-proxy)
    - [Nginx Reverse Proxy](#nginx-reverse-proxy)
      - [Set up](#set-up)
      - [Load Balancing](#load-balancing)
      - [Shell Script](#shell-script)
    - [Stress Test](#stress-test)
      - [Architecture](#architecture)
      - [Redis](#redis)
      - [Stress Test Results](#stress-test-results-1)
      - [Nginx caching](#nginx-caching)

## Phase 1 Scale the DB

### MongoDB

#### Support CRUD with MONGO DB

Refactored database files and Models to use Mongodb atlas
Set up POST PUT DELETE. GET was already set up from initial code

**Observations/Next steps**
Need to completely refactor to connect to Postgres

### Postgres

Set up postgres on local machine.
Decided to use terminal instead of GUI to manage DB

_Still unsure if I want to implement Sequelize as will make DB more fluid if need to switch DB to MySql in the future but add more time/costs up front?_

_Thinking I should just use Sequelize as it will abstract out schema design and querying using SQL. This may save more time?_

#### Sequelize

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

**Connection**

- Created connection in database/index.js file
- Created schemas for listing and reviews tables at database/addTables.js

**Create Schemas**

- Created schemas and added them to 'addTables.js' file.

#### Data Generation/Seeding

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

### CouchDB

Relevant Docs

<https://docs.couchdb.org/en/stable/index.html>
<https://www.youtube.com/watch?v=nlqv9Np3iAU>

#### Hello DB

- Downloaded and installed couch db
- Used GUI Fixation to interact with DB
- Set up testdb as cluster as this will help with faster querying for large data sets.
- Set up partition key with creating test documents. Set key as id.

```javascript
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

#### Seed Small Data Set

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

### Benchmarking

##### Postgres Benchmark

**Initial query speeds**

Query:

```SQL
EXPLAIN ANALYZE SELECT * FROM reviews WHERE id = 24000000;
```

- `Planning Time: 0.694 ms`
- `Execution Time: 25.541 ms`

Ran same query again and speeds were significantly faster.

- `Planning Time: 0.079 ms`
- `Execution Time: 0.038 ms`

**Issue: when querying reviews based on foreign key `listing_id` performance is significantly slower**

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
**_Two part_**

- have to create a new listing
- then can create new review
  **_Due to foreign key constraint_**

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

#### CouchDB BenchMark

GET REQUESTS

- Used Mango Query to query CouchDB
- `Executed in 20 ms`

Ran query again

- `Executed in 14 ms`

Did not notice a significant difference in query speed when query was run multiple times.

### Postgres vs CouchDB

#### Postgres Results

Pros:

- Postgres is a bit slower on first query however is exponentially faster on subsequent queries.
- Rich documentation available on line, lots of resources on Stack overflow and youtube. Feel if I need help or run into problems down the line, the rich resource library will be very useful.
- Can implement ORM with Sequelize.
- Large adoption within the dev community.

Cons:

- Some parts of the documentation can be dense.
- Syntax can be quirky

#### CouchDB Results

Pros

- Slightly faster on first query but stays constant on subsequent queries.
- Nice GUI called "Fauxton" which can be a better experience however Postgres also has one called pgAdmin.
- After initial learning curve is a fairly smooth experience.

Cons

- Lack of documentation, poor resources. This can be very problematic down the line...
- Steep learning curve.
- Low adoption from dev community.

**Recommendation: POSTGRES**

## Phase 2 Measure Initial Performance

### New Relic

- Set up account and save `key`
- Had to rename server.js to app.js because new relic config was looking for app.js
- Copied `newrelic.js` file from node modules and inserted `key` and `app-name`. Added `newrelic.js` to server folder in main directory.
- Updated `.gitignore` to not add `newrelic.js` as it contained newrelic service `key`.
- New relic dashboard benchmarking `app.js`.

### Artillery

Relevant Docs: <https://artillery.io/docs/getting-started>

- Looked at k6m, Jmeter and Artillery for stress testing.
- Decided to go with Artillery.

- `npm install -g artillery`
- created a helpers folder in `server` folder and added file `test.yaml`
- In `test.yaml` duration refers to time/sec that requests will be fired. Arrival rate refers to number of requests per second.
- Settings:
  - `duration = 240`
  - `arrivalRate = 1 || 10 || 100 || 1000`

### Clustering Server

Relevant Docs:
<https://www.youtube.com/watch?v=w1IzRF6AkuI>
<https://www.youtube.com/watch?v=6xIbVPyh9wo>

Need to cluster app. Clustering allows cpu to use multiple cores. This allows for higher traffic processing.

- Create `cluster.js` file in server folder.
- Add in code

```Javascript
const newrelic = require('newrelic');
const cluster = require('cluster');

// If the process is the Master Process than fork off n-cores clusters available
if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
  // If cluster is worker process then run instance of app.js
  require('./app');
}
```

- Run `node cluster.js` instead of `npm run server-dev` to start cluster server.

### Stress Test Single Server

**1 Request**

<img src="./photos/1_RPS_ST.png" width="300" >

**10 Requests**

<img src="./photos/10_RPS_ST.png" width="300">

**100 Requests**

<img src="./photos/100_RPS_ST.png" width="300">

**1000 Requests**

<img src="./photos/1K_RPS_ST.png" width="300">

**New Relic Dashboard**

Single Server

<img src="./photos/NR_Dashboard_ST_test.png">

### Stress Test Cluster Server

**1 Request**

<img src="./photos/1_RPS_MT.png" width="300">

**10 Requests**

<img src="./photos/10_RPS_MT.png" width="300">

**100 Requests**

<img src="./photos/100_RPS_MT.png" width="300">

**1000 Requests**

<img src="./photos/1K_RPS_MT_v2a.png" width="300">

**New Relic Dashboard Cluster**

<img src="./photos/1k_RPS_MT_v2.png">

### Notes

Cluster vs Single Core

- Seems that below 100-RPS performance is similar between using once instance of server vs clustering. However at 1k-RPS, single instance of server immediately crashes. Cluster server runs but still gets about 3k 500 errors out of 240k requests.
- First request to postgres is still significantly slower than subsequent requests for both single server and cluster server.

Further Research

- Server side rendering
- Caching pages with Redis
- Removing dependencies from app to reduce size

### Server Side Rendering Research

**Server side vs Client side**

Server side

Pros:

- Search engines can crawl site resulting in better SEO
- Initial page load is faster
- Good for static sites

Cons:

- Frequent server requests
- Overall slower page rendering
- Ful page reloads
- Not good for interactive sites

Client side

Pros:

- Good for interactive sites
- Fast rendering after initial load
- Good for web applications
- Lots of JS libraries

Cons:

- Bad for SEO
- Initial load time is slower
- Uses external libraries

Research:

Electrode JS.

- A npm package to reduce React `RenderToString` time by 70%.

Ran test where I just sent back a `h1` string for any call made to server.
Then load tested 1k RPS. Results were similar to original structure.

Conclusion:

- Server side rendering or Redis caching is not going to solve the bottle neck.
- Most likely a limitation with my local machine.
- Moving forward to cloud migration.

## Phase 3: Deploy the Service and Proxy

### AWS

Adding env variables

- install dotenv npm package
- create `.env` file and add variables for port, db info and new relic key

#### Postgres

1. Create new EC2 instance
2. Install Postgres on EC2
3. Migrate Data from `csv` into EC2 postgres instance

**Create new EC2 instance**

Relevant Docs:

<https://www.shubhamdipt.com/blog/postgresql-on-ec2-ubuntu-in-aws/>

- Use `Ubuntu` t2.micro and set storage to 20GB
- Set security group as

  1. Custom TCP: 5432, Source: Anywhere
  2. SSH TCP:22, Source: Anywhere
  3. Lauch Instance

- SSH into EC2 instance
  - In EC2 terminal

##### Connect

Relevant Docs:
<https://www.shubhamdipt.com/blog/postgresql-on-ec2-ubuntu-in-aws/>

<https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html>

```bash
sudo apt-get update && sudo apt-get -y upgrade
sudo apt-get install postgresql postgresql-contrib​
```

Sudo into postgres and set password

```text
sudo -u postgres psql
postgres=#\password​
```

after setting pw exit out of postgres by `\q`

Now update configuration for remote access for clients.

**Make sure that postgres version matches sudo command!**

```bash
# Edit pg_hba.conf in vim
sudo vim /etc/postgresql/9.5/main/pg_hba.conf

# Near bottom of file after local rules, add rule (allows remote access):
host    all             all             0.0.0.0/0               md5

# save file​
```

```bash
# Edit config in vim
# make sure psql version matches! Currently using 9.5
sudo vim /etc/postgresql/9.5/main/postgresql.conf

# Change line 59 to listen to external requests:
listen_address='*'

# save file​
```

Restart the PostgreSQL server

```bash
# Restart postgres server
sudo /etc/init.d/postgresql restart​
```

Make sure in the `ubuntu` terminal you log in to postgres as the `superuser` and set a password

e.g

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

Now you may connect to the EC2 postgresql using the public DNS provided and port 5432.

Create database.

```text
$sudo su postgres
$psql
postgres=# CREATE DATABASE <database_name>;
postgres=# CREATE USER <user> with encrypted password '<password>';
postgres=# GRANT ALL PRIVILEGES ON DATABASE <database_name> TO <user>;​
```

**Can now connect local machine to EC2 postgres DB!**

- In `.env` file on local machine change
- import env into `database/postgres/index.js` with command:
  - `require('dotenv').config({ path: '../../.env' });`
- `host` to aws public DNS
- `user`, `password`, `database` and `port` to match EC2.

##### Migrate Data

1. Migrate csv data from local machine into S3

   - Create s3 Bucket in AWS
   - Drag and drop csv files into s3.

2. Transfer from S3 to Postgres EC2 master instance
   Relevant Docs: <https://www.youtube.com/watch?v=qRT8DuPD0Ak>

   - In aws ubuntu server, create a file `data` to store
   - install `aws cli`
   - In aws, create a IAM role.
   - In EC2, attach IAM role.
   - In aws umbuntu server, use command
     - `aws s3 cp s3://{bucketName}/{csvFileName} {fileNameToBeSavedInUmbuntu}`

3. Use `Copy` command csv data into Postgres EC2 master

- log into postgres at `/home/data`
- copy listings and reviews into postgres from csv files saved in `/home/data...` folder
- create index for `listing_id`
- Test connection to local machine

Notes:

- Looked into npm package `pg-copy-streams` as well as `scp` terminal commands.
- Found it to be a bit complex to migrate data directly from local machine to EC2 because of authentication issues.
- Instead chose to migrate data to s3 bucket and then transfer from s3 to EC2.
- This process was very smooth.

#### App Service

Relevant docs:

Deploying App on AWS

- <https://itnext.io/deploy-a-mongodb-expressjs-reactjs-nodejs-mern-stack-web-application-on-aws-ec2-2a0d8199a682>

- <https://www.youtube.com/watch?v=fIeIzHMC4BQ>

Notes:

- Have to install all global packages on to EC2.
- Used process of elimination for errors to figure out what was missing.
- Make sure to add `.env` file to EC2 as it's git ignored when cloning.
- In `client/src/index.jsx` make sure to change ajax API address. There is no need to put port on URL. e.g. `http://ec2-54-193-53-224.us-west-1.compute.amazonaws.com:/listing`

- Fairly smooth process

### Stress Test (AWS)

#### Loader.io

Relevant Docs:

- <https://loader.io/>
- <https://support.loader.io/article/20-verifying-an-app>
- <https://support.loader.io/article/21-expression-syntax>

Notes:

- Download API key.
- **Put the {loaderio-APIKEY.txt} file in `Public` folder and NOT in the root folder**
  - Loaderio is looking for auth file in public where the bundle.js file and index.html files reside.
- Set up tests for 1, 10, 100, 1K with App and DB running on respective EC2 instances.
- When setting up tests, input `path` as `%{*:9000000-9100000}` this creates a varialbe that randomly picks a number between 9000000-9100000

#### Stress Test Results

**1 EC2 Instance**

10 RPS

<img src="./photos/10_RPS_1_EC2_Loader_Dash.png" width="50%">

<img src="./photos/10_RPS_1_EC2_NewRelic_Dash.png" width="50%">

At 10RPS we have a response time under `2ms` and 0% error rate

<hr>

100 RPS

<img src="./photos/100_RPS_1_EC2_Loader_Dash.png" width="50%">

<img src="./photos/100_RPS_1_EC2_NewRelic_Dash.png" width="50%">

At 100RPS we have a response time under `3ms` and 0% error rate

<hr>

1000 RPS

<img src="./photos/1k_RPS_1_EC2_Loader_Dash.png" width="50%">

**Everything Breaks!**

<hr>

300 RPS

<img src="./photos/300_RPS_1_EC2_Loader_Dash.png" width="50%">

<img src="./photos/300_RPS_1_EC2_NewRelic_Dash.png" width="50%">

At 300RPS we have a response time under `4ms` and 0% error rate

<hr>

Result Analysis:

Seems that 300RPS is the sweet spot for running app on 1 EC2 instance. I stress tested with 500 and 700. Got around a 10 - 30% error rate respectively.

Moving forward, I'm going to cap each EC2 at 200RPS to play it safe. Going to also look into Vertical scaling the EC2 instance. But have to take in to account AWS costs....

Notes:
Moving forward decided to containerize the app, create and containerize a load balancer and then re-deploy to EC2.

### Docker

Relevant Docs:
<https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/>

Create `Dockerfile` in root directory of app

```GO
# Base Image. Alpine is a compressed version of Node
FROM node:alpine

# Where the app will be placed inside docker image
WORKDIR '/usr/app'

# Path to folder xx Path to copy inside of container
COPY ./ ./

# Install dependencies
RUN npm install

# Default command
CMD ["npm", "start"]
```

In terminal:

From root directory
`docker build .`

`docker run -p <new_port>:<port_in_app> <container_id>`

can set container name so you don't have to use `container_id`
`docker build -t <docker_username>/<name_of_app> .`

now can just run
`docker run -p <new_port>:<port_in_app> <image_name>`

Notes:

Had to create `npm start` script that included a webpack build and a server start script. App can now start with one command.

Had to install nodemon as a dev dependency as it was installed globally on my local machine.

Had to install `@babel/compat-data` as I was getting a error when trying to run app in docker container.

Had to delete eslint hack reactor package in package.json as well as set `extend: 'hackreactor'` in `.eslintrc`

**Realized that docker is not vital, decided to table it for now**
**Moving forward with creating a reverse proxy with Nginx**

## Phase 4: Scale the Service and Proxy

### Nginx Reverse Proxy

#### Set up

Connect Nginx to single EC2 service instance

Relevant docs:
<https://www.youtube.com/watch?v=WmdL8aOVooM>
<https://linuxize.com/post/start-stop-restart-nginx/>
<https://www.youtube.com/watch?v=28ioY4vgC9I>

- Launch EC2 instance
  - Used linux ami
  - Set security group to `SSH` and `HTTP` at `anywhere`
  - SSH into EC2 instance

```BASH
  # Get into bash terminal
  sudo bash

  # Install nginx
  amazon-linux-extras install -y nginx1.12

  # Start nginx
  sudo systemctl restart nginx

  # Set reverse proxy url
  # Vim into nginx.conf
  vi /etc/nginx/nginx.conf

  # Scroll down to "location"
  location / {
          proxy_pass http://{ec2_service_ip}:{nginx_proxy_port};
                e.g  http://127.0.0.0:80;
  }

  # Save and exit
  # Reload
  nginx -s reload
```

Might have to use terminal commands if `nginx -s reload` gives error?

<https://serverfault.com/questions/565339/nginx-fails-to-stop-and-nginx-pid-is-missing>

```bash
sudo systemctl daemon-reload
sudo systemctl start nginx
```

Proxy now working!

#### Load Balancing

**Use multiple EC2 service instances**

Create new EC2 instance and pull from git for latest app version.

Set up app to run on EC2.

After app setup in EC2, sign in as root user with command
`sudo su root`

You should now have your app running on EC2.

SSH into nginx EC2 and go to conf file to set up RoundRobin.

Relevant doc
<https://www.nginx.com/resources/wiki/start/topics/examples/loadbalanceexample/>

```C
http {
  upstream roundrobin {

    server {EC2PubicIP}:{nginxPort};
    // e.g. server 12.140.2.300:8001;
    server {EC2PubicIP2}:{nginxPort};
    // e.g. server 12.149.60.500:8001;
  }

  server {
    location / {
      proxy_pass http://myproject;
    }
  }
}
```

#### Shell Script

**automate EC2 set up on creation**

Relevant Docs
<https://www.shellscript.sh/>

Script

```bash
#! /bin/bash
sudo apt-get update
sudo apt-get install -y build-essential openssl libssl-dev pkg-config
sudo apt-get install -y nodejs
sudo apt-get install npm -y
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo apt-get install git -y
sudo mkdir /var/www
cd /var/www
sudo git clone -b scale https://github.com/mauchly/andy-sdc-service.git
sudo npm install pm2 -g
cd /var/www/
sudo chown -R ubuntu andy-sdc-service
cd andy-sdc-service
sudo npm install
echo "PORT=80" > .env
echo "NEWRELICKEY="{NEWRELIC_KEY}" >> .env
echo "USERDB={DB_USERNAME}" >> .env
echo "HOST={DB_EC2_address}" >> .env
echo "DATABASE={DBNAME}" >> .env
echo "PASSWORD={DBPASSOWRD}" >> .env
echo "DBPORT={DBPORT}" >> .env
echo "{Loader.io_KEY}" >> {Loader.io.txt_FILE}
cd /var/www/andy-sdc-service
sudo su root
killall -9 node
pm2 start npm -- start
```

Add this script `Configure Instance Detains >> Advanced Details >> User Data >> text` upon EC2 launch.

### Stress Test

#### Architecture

<img src="./photos/AppArch.jpg"/>

- Currently optimal performance is at 4 instances connected to one DB, load balanced with Nginx round robin on EC2.

- If I add more instances to Load balancer performance actually decreases!

Loader.io results

<img src="./photos/2k_RPS_Test_Setup.png" />

<img src="./photos/2KRPS_Optimal.png" />

Next Steps:

- Add caching with Redis or Nginx (Research pros and cons)
- Implement Server Side Rendering and cache with Redis

#### Redis

Relevant docs:
<https://www.youtube.com/watch?v=oaJq1mQ3dFI>
<https://www.sitepoint.com/using-redis-node-js/>

- Refactor app by adding controllers folder;
- Redis only caches strings so objects from database must be stringified
- Parse redis data return strings to objects

**Installing Redis on EC2**

```bash
sudo apt update
sudo apt install redis-server

sudo systemctl restart redis.service

# test if running
sudo systemctl status redis

# test redis-cli
redis-cli
# should be in redis local command line
ping
# should return PONG
# exit out of redis command line

sudo systemctl restart redis

# bind to local host
sudo vi /etc/redis/redis.conf

# find this line 'bind 127.0.0.1' and change to 'bind 127.0.0.1 ::1'
sudo systemctl restart redis

# check connection
sudo netstat -lnp | grep redis

# connect elistcache to local redis server
redis-cli -h #{awsElisticacheHostAddress}

# test connection

```

cd into `redis` folder and open `index.js`

change to this

```javascript
var client = require('redis').createClient(
  6379,
  'elastichache endpoint string',
  {
    no_ready_check: true,
  }
);
```

Start app!

#### Stress Test Results

**No Redis**

<img src="./photos/1k-RPC-2-Servers-W:O-Cache.png">

**With Redis**

<img src="./photos/1K-RPS-2-Server-With-Cache.png">

Redis added significant improvement in performance.

**Ramp up to 4 servers and also removal of `New Relic`**

<img src="./photos/3K-RPS-4-Servers-With-Cache-No-NewRelic.png">

Best performance currently obtainable.

When I add more servers performance decreases!

8 Servers with Redis Cache

<img src="./photos/3K-RPS-8-Server-With-Cache-No-NewRelic.png">
<img src="./photos/Nginx-8-Servers.png">

8 Server Architicture

<img src="./photos/AppArchScale.jpg">

Notes

Going to try and add a new instance of Redis to each 4 App servers.

Getting optimal performance at 4 app servers.
Bottleneck may be Redis when attached to more than 4 servers?

Tried scaling up to 17 servers but still same results.
<img src="./photos/2.4-RPS-17-Servers.png">

#### Nginx caching

Relevant Docs:
<https://www.ryadel.com/en/nginx-reverse-proxy-cache-centos-7-linux/>

In `nginx.conf` file
To access type `vi /etc/nginx/nginx.conf` in terminal

```bash

http {

   upstream roundrobin {
        server {serverIP}:{port};
        # e.g. server 127.0.0.1:80
   }

  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=9000g inactive=1d;

  proxy_temp_path /var/cache/nginx/tmp;
  proxy_cache_lock on;
  proxy_cache_use_stale updating;
  proxy_cache_valid 200 302 10m;
  proxy_cache_valid 301 1h;
  proxy_cache_valid any 1m;

  server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;

    location / {
       proxy_cache my_cache;
       proxy_http_version 1.1;
       proxy_set_header Connection "";
       add_header X-Cache-Status $upstream_cache_status;
       add_header X-Handled-By $proxy_host;
       proxy_pass http://roundrobin;
    }
  }
}
```

10k-RPS with two servers!!

<img src="./photos/10K-RPS-Cache-NewRelic.png">
