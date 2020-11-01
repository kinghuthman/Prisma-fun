# Migration `20201028033337`

This migration has been generated by kinghuthman at 10/27/2020, 10:33:37 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'TEACHER')

CREATE TABLE "public"."User" (
"id" SERIAL,
"email" text   NOT NULL ,
"updatedAt" timestamp(3)   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"firstName" text   NOT NULL ,
"lastName" text   NOT NULL ,
"social" jsonb   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Course" (
"id" SERIAL,
"name" text   NOT NULL ,
"courseDetails" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."CourseEnrollment" (
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"role" "UserRole"  NOT NULL ,
"userId" integer   NOT NULL ,
"courseId" integer   NOT NULL ,
PRIMARY KEY ("userId","courseId","role")
)

CREATE TABLE "public"."Test" (
"id" SERIAL,
"updatedAt" timestamp(3)   NOT NULL ,
"name" text   NOT NULL ,
"date" timestamp(3)   NOT NULL ,
"courseId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."TestResult" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"result" integer   NOT NULL ,
"testId" integer   NOT NULL ,
"studentId" integer   NOT NULL ,
"graderId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

ALTER TABLE "public"."CourseEnrollment" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."CourseEnrollment" ADD FOREIGN KEY ("courseId")REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Test" ADD FOREIGN KEY ("courseId")REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TestResult" ADD FOREIGN KEY ("testId")REFERENCES "public"."Test"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TestResult" ADD FOREIGN KEY ("studentId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TestResult" ADD FOREIGN KEY ("graderId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201028033337
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,81 @@
+generator client {
+  provider        = "prisma-client-js"
+  previewFeatures = ["connectOrCreate", "transactionApi"]
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model User {
+  id        Int                @id @default(autoincrement())
+  email     String             @unique
+  updatedAt DateTime           @updatedAt
+  createdAt DateTime           @default(now())
+  firstName String
+  lastName  String
+  social    Json
+  // explicit many to many, models just point to each other
+  courses   CourseEnrollment[]
+
+  // one to many
+  testResults TestResult[] @relation(name: "results")
+  testsGraded TestResult[] @relation(name: "graded")
+}
+
+// model Token {
+// }
+
+model Course {
+  id            Int                @id @default(autoincrement())
+  name          String
+  courseDetails String
+  // can have both student and teachers, explcit many to many
+  members       CourseEnrollment[]
+  tests         Test[]
+}
+
+model CourseEnrollment {
+  createdAt DateTime @default(now())
+  role      UserRole
+
+  // explicit many to many
+  userId   Int
+  user     User   @relation(fields: [userId], references: [id])
+  courseId Int
+  course   Course @relation(fields: [courseId], references: [id])
+  // allows to write primary keys, this pk allows for
+  @@id([userId, courseId, role])
+}
+
+enum UserRole {
+  STUDENT
+  TEACHER
+}
+
+model Test {
+  id          Int          @id @default(autoincrement())
+  updatedAt   DateTime     @updatedAt
+  name        String
+  date        DateTime
+  courseId    Int
+  course      Course       @relation(fields: [courseId], references: [id])
+  // one-to-many
+  testResults TestResult[]
+}
+
+model TestResult {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  result    Int // percentage precise to one decimal point `result * 10^-1`
+
+  // one-to-many
+  testId Int
+  test   Test @relation(fields: [testId], references: [id])
+
+  studentId Int
+  student   User @relation(name: "results", fields: [studentId], references: [id])
+  graderId  Int
+  gradedBy  User @relation(name: "graded", fields: [graderId], references: [id])
+}
```

