const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importWaitlist(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');

    if (lines.length < 2) {
      console.log('File too short');
      return;
    }

    const headers = lines[0].split('\t').map(h => h.trim().replace(/_/g, '').toLowerCase());
    const rows = lines.slice(1);

    console.log('Headers:', headers);

    // Clear existing waitlists
    await prisma.waitlist.deleteMany({});
    console.log('Cleared existing waitlists');

    // Process courses and students first
    const coursesMap = new Map(); // code -> courseId
    const studentsMap = new Map(); // person_id -> studentId

    const courseData = new Map(); // code -> course obj
    const studentData = new Map(); // person_id -> student obj
    const waitlistData = []; // array of waitlist entries

    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].trim()) continue;
      const cols = rows[i].split('\t').map(c => c.trim());
      if (cols.length < headers.length) continue;

      const entry = {};
      headers.forEach((h, idx) => entry[h] = cols[idx]);

      const { personid, sessioncd, acadactcd, sectioncd, teachmethod, sectionnr, waitlistts, surname, givenname } = entry;

      // Course key
      const code = acadactcd + sectionnr;
      if (!courseData.has(code)) {
        courseData.set(code, {
          AcadActCd: acadactcd,
          sessionCode: sessioncd,
          sectionCode: sectioncd,
          teachMethod: teachmethod,
          sectionNumber: sectionnr,
          code,
          name: acadactcd, // placeholder
          department: acadactcd.substring(0,3).toUpperCase(),
        });
      }

      // Student
      if (!studentData.has(personid)) {
        studentData.set(personid, {
          person_id: personid,
          surname,
          given_name: givenname,
        });
      }

      // Waitlist
      const signUpDate = new Date(waitlistts.replace(' ', 'T'));
      waitlistData.push({
        code,
        personid,
        signUpDate,
        position: 0, // set later
      });
    }

    // Insert students
    for (const stud of studentData.values()) {
      const existing = await prisma.student.upsert({
        where: { person_id: stud.person_id },
        update: { surname: stud.surname, given_name: stud.given_name },
        create: stud,
      });
      studentsMap.set(stud.person_id, existing.id);
    }
    console.log('Inserted students');

    // Insert courses
    for (const cour of courseData.values()) {
      const existing = await prisma.course.upsert({
        where: { code: cour.code },
        update: { name: cour.name },
        create: cour,
      });
      coursesMap.set(cour.code, existing.id);
    }
    console.log('Inserted courses');

    // Group by course for positions
    const byCourse = new Map();
    for (const wl of waitlistData) {
      if (!byCourse.has(wl.code)) byCourse.set(wl.code, []);
      byCourse.get(wl.code).push(wl);
    }

    // Sort by signUpDate and set positions
    for (const courseWl of byCourse.values()) {
      courseWl.sort((a, b) => new Date(a.signUpDate) - new Date(b.signUpDate));
      courseWl.forEach((wl, idx) => wl.position = idx + 1);
    }

    // Insert waitlists
    for (const wl of waitlistData) {
      await prisma.waitlist.create({
        data: {
          course_id: coursesMap.get(wl.code),
          student_id: studentsMap.get(wl.personid),
          sign_up_date: wl.signUpDate,
          position: wl.position,
          days_waited: Math.floor((new Date() - wl.signUpDate) / (1000 * 60 * 60 * 24)),
          time_slot: wl.code.substring(wl.code.length-4), // section? arbitrary
        }
      });
    }

    console.log('Inserted waitlists');

    // Now calculate metrics
    await calculateMetrics();

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

async function calculateMetrics() {
  const courses = await prisma.course.findMany({
    include: { waitlists: true },
  });

  const totalWaitlist = courses.reduce((sum, course) => sum + course.waitlists.length, 0);

  // For now, simple deficit = waitlist.length / tutorial_capacity + 1
  for (const course of courses) {
    const waitlistCount = course.waitlists.length;
    const deficit = waitlistCount > 0 ? Math.ceil(waitlistCount / course.tutorial_capacity) : 0;
    const avgWaitDays = course.waitlists.length > 0 ? course.waitlists.reduce((sum, wl) => sum + wl.days_waited, 0) / course.waitlists.length : 0;

    await prisma.course.update({
      where: { id: course.id },
      data: { avg_wait_days: avgWaitDays },
    });
  }

  console.log('Calculated metrics');
}

async function main() {
  const filePath = process.argv[2] || 'cmswait_2025-11-23.txt';
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  await importWaitlist(filePath);
}

if (require.main === module) {
  main();
}

  const filePath = process.argv[2] || 'cmswait_2025-11-23.txt';
