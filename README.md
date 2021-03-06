# Real-world class grading backend

A real-world class grading application built with Prisma.

The grading application is used to manage enrollment in online classes, tests (as in exams) for classes, and test results.

The goal if this application is to showcase a real-world scenario of an application using Prisma. the following aspects of Prisma
- Data modeling
- CRUD
- Aggregations
- API layer
- Validation
- Testing
- Authentication
- Authorization
- Integration with other APIs
- Deployment

Check out the [associated tutorial](https://www.prisma.io/blog/modern-backend-1-tsjs1ps7kip1/) to learn more about how the backend was built.

## Data model

The development of this project is driven by the database schema (also known as the data model).
The schema is first designed to represent the following concepts:

- **User**: this can be a student or a teacher, or both. The role of the user is determined through their association with a course.
- **Course**: represent a course that can have multiple students/teachers. Each user can be associated with multiple courses either as a student or as a teacher.
- **CourseEnrollment**: 
- **Test**: Each course can have many tests
- **TestResult**: Each Test can have many TestReusults that is associated with a student

These are defined in the [Prisma schema](./prisma/schema.prisma).
The database schema will be created by Prisma Migrate.

## Tech Stack

- Backend:
  - PostgreSQL
  - Node.js
  - Prisma
  - TypeScript
    - hapi
    - joi
    - jest
  - Jest
  - Hapi.js
    - boom
      - http errors
    - joi
      - validation
    - 

## How to use

Install npm dependencies:

```
npm install
```


## Migrate

- First, set the DATABASE_URL environment variable locally so that Prisma can connect to your database
  - export DATABASE_URL=""
- Save Migration
  - npm install -g @prisma/cli --save-dev
  - npx prisma migrate save --experimental --name "init-db" --create-db
- Run Migration
  - npx prisma migrate up --experimental
- Generate prisma client
  - add generator code to schema
- Install prisma/client 
  - npm install --save @prisma/client
- Generate Prisma Client with the following command:
  - npx prisma generate

### Understanding the Prisma Schema

- Prisma Schema is a declarative configuration for database tables
  - used as the source of truth for the generated prisma client and prisma migrate to create the db schema
- Prisma Migrate helps create the tables or adds columns to existing tables
- every model maps to a database table
- json data type allows for free form json, useful for inconsistent info across certain tables/columns

### Coding (Random)

- @unique constraint will also add the index
- using the 'Json' data-type, very flexible, can add fields without having to do db migration


### Many to Many

- implicit many to many
  - simply add the model as a datatype to another model's field
- explicit many to many
  - when defining a field, the datatype will be another model and we can choose what fields we need


### Primary Key

- combination has to be unique


## Routes

### Hapi 

- node js framework