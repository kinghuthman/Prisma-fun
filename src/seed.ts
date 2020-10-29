import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
  await prisma.courseEnrollment.deleteMany({}); // don't do in production
  await prisma.testResult.deleteMany({}); // don't do in production
  await prisma.user.deleteMany({}); // don't do in production
  await prisma.test.deleteMany({}); // don't do in production
  await prisma.course.deleteMany({}); // don't do in production

  const grace = await prisma.user.create({
    data: {
      email: "grace@hey.com",
      firstName: "Grace",
      lastName: "Bell",
      social: {
        facebook: "gbell",
        twitter: "g_bell",
      },
    },
  });

  const weekFromNow = add(new Date(), { days: 7 });
  const twoWeeksFromNow = add(new Date(), { days: 14 });
  const monthFromNow = add(new Date(), { days: 28 });

  const course = await prisma.course.create({
    data: {
      name: "CRUD with Prisma in the real real world...",
      courseDetails: "A soft intro to CRUD with Prisma",
      tests: {
        create: [
          {
            date: weekFromNow,
            name: "First test",
          },
          {
            date: twoWeeksFromNow,
            name: "Second test",
          },
          {
            date: monthFromNow,
            name: "Final exam",
          },
        ],
      },
      members: {
        create: {
          role: "TEACHER",
          user: {
            connect: { email: grace.email },
          },
        },
      },
    },
    // allows us to select additional fields (relations)
    include: {
      tests: true,
      members: {
        include: { user: true },
      },
    },
  });

  const shakuntala = await prisma.user.create({
    data: {
      email: "devi@prisma.io",
      firstName: "Shakuntala",
      lastName: "Devi",
      social: {
        twitter: "devi1",
      },
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@prisma.io",
      firstName: "David",
      lastName: "Deutsch",
      social: {
        twitter: "davidD",
      },
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const testResults = [800, 950, 700];

  let counter = 0;

  // reference testResult model if needed to understand
  for (const test of course.tests) {
    const shakuntalaTestResult = await prisma.testResult.create({
      data: {
        gradedBy: { connect: { email: grace.email } },
        student: { connect: { email: shakuntala.email } },
        test: { connect: { id: test.id } },
        result: testResults[counter],
      },
    });
    counter++;
  }

  const results = await prisma.testResult.aggregate({
    where: { studentId: shakuntala.id },
    avg: { result: true },
    max: { result: true },
    min: { result: true },
    count: true,
  });

  console.log(results);
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
