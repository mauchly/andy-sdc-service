# FEC: AirBnb Reviews Service

## Table of Contents

1. [Introduction](#Introduction)
1. [Related Projects](#Related-Projects)
1. [Usage](#Usage)
1. [Tech](#Tech)

## Introduction

> This is the AirBnb Reviews Service. While the service itself is stand-alone, it was built to be part of an entire AirBnb replica listing page. This replica page was built with 3 other individuals and they each handled a particular of the site design. We worked as a team to build and develop these services and were able to bring them together on a single page.

> I was responsible for the design, implementation and execution of the Reviews Service and making sure it was able to integrate properly with all the other services our team developed.

## Related Projects

  - Reservation Service: https://github.com/rpt19-umibozu/FEC_Yingwen_service
  - Photo Carousel: https://github.com/rpt19-umibozu/jason_FEC_service
  - Recommendations Service: https://github.com/rpt19-umibozu/FEC-Youzhu-recommendation

## Usage

####npm install
  - Install dependencies in a local node_modules directory

####npm run seed
  - Seed the MongoDB with Faker data

####npm run react-dev
  - Builds out app in production mode, will make new bundle.js on each iteration

####npm run server-dev
  - Runs development server in nodemon to see changes made

####npm run test
  - Runs Jest tests

####npm run build
  - Gives a production build of bundle.js, also will output a Brotli compressed bersion of file.

## Tech

- NVM
- Node
- Express
- React
- MongoDB
- Mongoose
- Webpack
- Jest
- SuperTest
- Babel
- AWS (EC2 & S3)
- Faker
- Brotli

## CRUD

Create - http://{HOSTNAME}:{PORT}/listing/
Read - http://{HOSTNAME}:{PORT}/listing/
Update - http://{HOSTNAME}:{PORT}/listing/:id
Delete - http://{HOSTNAME}:{PORT}/listing/:id
