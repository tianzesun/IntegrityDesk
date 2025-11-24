import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch courses with waitlists
    const courses = await prisma.course.findMany({
      include: {
        waitlists: {
          select: {
            days_waited: true,
            sign_up_date: true,
          },
        },
        _count: {
          select: { waitlists: true },
        },
      },
    });

    // Calculate total seat deficit (sum of waitlist sizes / tutorial capacity)
    const totalDeficit = courses.reduce((sum, course) => {
      const waitlistSize = course._count.waitlists;
      const sectionsNeeded = waitlistSize > 0 ? Math.ceil(waitlistSize / course.tutorial_capacity) : 0;
      return sum + sectionsNeeded;
    }, 0);

    // Overall average wait days
    const avgWaitDays = courses.length > 0
      ? courses.reduce((sum, course) => sum + course.avg_wait_days, 0) / courses.length
      : 0;

    // Total new joins today (mock for now, can be calculated from recent waitlists)
    const todayJoins = courses.reduce((sum, course) =>
      course.waitlists.filter(wl => {
        const today = new Date();
        const signup = new Date(wl.sign_up_date);
        return signup.toDateString() === today.toDateString();
      }).length, 0
    );

    // Problem courses sorted by deficit
    const problemCourses = courses
      .map(course => ({
        code: course.code,
        name: course.name || course.AcadActCd,
        deficit: Math.ceil(course._count.waitlists / course.tutorial_capacity),
        avgWaitDays: course.avg_wait_days,
        velocity: course.velocity,
        rec: course._count.waitlists > course.tutorial_capacity * 2 ? '+2 Sections' : '+1 Section',
      }))
      .sort((a, b) => b.deficit - a.deficit)
      .filter(course => course.deficit > 0);

    // Alerts
    const alerts = [];

    // Check for veterans ( >30 days)
    const veteranCount = courses.reduce((sum, course) =>
      course.waitlists.filter(wl => wl.days_waited > 30).length, 0
    );
    if (veteranCount > 0) {
      alerts.push({
        type: 'CRITICAL',
        message: `${veteranCount} Students waiting > 30 Days in ${problemCourses[0]?.code || 'courses'}.`,
        color: 'text-red-600',
      });
    }

    // Stagnant courses (>20 days avg)
    const stagnant = courses.filter(c => c.avg_wait_days > 20);
    if (stagnant.length > 0) {
      alerts.push({
        type: 'STAGNANT',
        message: `${stagnant[0].code} queue is stagnant (Avg Wait: ${stagnant[0].avg_wait_days.toFixed(0)} Days).`,
        color: 'text-orange-600',
      });
    }

    // Velocity alert
    const highVelocity = courses.filter(c => c.velocity > 15);
    if (highVelocity.length > 0) {
      alerts.push({
        type: 'VELOCITY',
        message: `${highVelocity[0].code} saw +${highVelocity[0].velocity} demand surge yesterday.`,
        color: 'text-green-600',
      });
    }

    // Queue health data
    const healthData = courses
      .slice(0, 5) // First 5 for display
      .map(course => ({
        course: course.name,
        waitDays: course.avg_wait_days,
        status: course.avg_wait_days > 30 ? '🔴' : course.avg_wait_days > 15 ? '🟠' : '🟢',
      }));

    // Student triage
    const atRiskCount = courses.reduce((sum, course) =>
      course.waitlists.filter(wl => wl.days_waited > 21).length, 0
    );

    const response = {
      totalDeficit,
      avgWaitTime: avgWaitDays.toFixed(1),
      newJoins: todayJoins,
      problemCourses,
      alerts,
      healthData,
      atRiskCount,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
