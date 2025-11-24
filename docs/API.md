# Course Pulse API Documentation

## Overview

The Course Pulse API provides real-time analytics data from daily CMS waiting list imports. All endpoints are served via Next.js API routes at `/api/*`.

## Authentication

Currently, no authentication is required. In production, consider adding API key authentication or JWT tokens for secure access.

## Base URL

```
http://localhost:3000/api  (development)
https://yourdomain.com/api  (production)
```

## Endpoints

### GET /api/dashboard

Returns comprehensive analytics metrics for the Course Pulse dashboard.

**Response Format:**
```json
{
  "totalDeficit": 450,
  "avgWaitTime": "14.5",
  "newJoins": 40,
  "problemCourses": [
    {
      "code": "CS101",
      "name": "CSC108H1-LEC0101",
      "deficit": 65,
      "avgWaitDays": 21,
      "velocity": 15,
      "rec": "+3 Sections"
    }
  ],
  "alerts": [
    {
      "type": "CRITICAL",
      "message": "15 Students waiting > 30 Days in HIS100.",
      "color": "text-red-600"
    }
  ],
  "healthData": [
    {
      "course": "CSC108H1",
      "waitDays": 32,
      "status": "🔴"
    }
  ],
  "atRiskCount": 123
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `totalDeficit` | number | Total sections needed across all courses |
| `avgWaitTime` | string | Average wait time in days (formatted) |
| `newJoins` | number | Students who joined waitlists today |
| `problemCourses` | array | Courses with capacity deficits, sorted by severity |
| `alerts` | array | Active system alerts requiring attention |
| `healthData` | array | Queue health status for top courses |
| `atRiskCount` | number | Students waiting over 21 days |

**Response Codes:**
- `200` - Success
- `500` - Database or internal server error

## Data Import

### Command Line Import

Process daily CMS waiting list files:

```bash
node scripts/importWaitlist.js path/to/cmswait_DD-MM-YYYY.txt
```

**File Format:**
TSV (Tab-Separated Values) with headers:
```
PERSON_ID	SESSION_CD	ACAD_ACT_CD	SECTION_CD	TEACH_METHOD	SECTION_NR	WAITLIST_TS	SURNAME	GIVEN_NAME
```

**Expected Data Types:**
- PERSON_ID: String (student identifier)
- SESSION_CD: String (session code like "20261")
- ACAD_ACT_CD: String (course code like "CSC108H1")
- SECTION_CD: String (section type like "S")
- TEACH_METHOD: String (teaching method like "LEC")
- SECTION_NR: String (section number like "0301")
- WAITLIST_TS: ISO datetime string (YYYY-MM-DD HH:mm:ss.ms)
- SURNAME: String (student surname)
- GIVEN_NAME: String (student given name)

## Database Schema

### Courses
```sql
CREATE TABLE Course (
  id SERIAL PRIMARY KEY,
  AcadActCd VARCHAR NOT NULL,
  sessionCode VARCHAR NOT NULL,
  sectionCode VARCHAR NOT NULL,
  teachMethod VARCHAR NOT NULL,
  sectionNumber VARCHAR UNIQUE NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  name TEXT,
  capacity INTEGER DEFAULT 50,
  tutorial_capacity INTEGER DEFAULT 20,
  department VARCHAR(3) DEFAULT 'CSC',
  enrolled_amount INTEGER DEFAULT 0,
  avg_wait_days FLOAT DEFAULT 0,
  velocity FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Students
```sql
CREATE TABLE Student (
  id SERIAL PRIMARY KEY,
  person_id VARCHAR UNIQUE NOT NULL,
  surname VARCHAR NOT NULL,
  given_name VARCHAR,
  email VARCHAR,
  veteran BOOLEAN DEFAULT FALSE,
  ghost_rules_violated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Waitlists
```sql
CREATE TABLE Waitlist (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES Course(id),
  student_id INTEGER REFERENCES Student(id),
  sign_up_date TIMESTAMP NOT NULL,
  position INTEGER NOT NULL,
  days_waited INTEGER DEFAULT 0,
  time_slot VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX waitlist_course_date_idx ON Waitlist(course_id, sign_up_date);
CREATE INDEX waitlist_student_idx ON Waitlist(student_id);
```

## Metrics Calculations

### Total Seat Deficit
Calculates additional sections/sections needed:
```
totalDeficit = Σ(CEIL(waitlist_count / tutorial_capacity) for each course)
```

### Average Wait Time
System-wide mean wait days:
```
avgWaitTime = Σ(course.avg_wait_days) / course_count
```

### Student Status Computation
- **Veteran**: Students with ANY waitlist entry > 30 days old
- **At-Risk**: Students with latest waitlist entry > 21 days
- **Velocity**: Daily signup rate per course

### Queue Health Classification
- 🟢 Healthy: Average wait ≤ 15 days
- 🟠 Critical: Average wait 15-29 days
- 🔴 Stagnant: Average wait ≥ 30 days

## Error Handling

The API includes comprehensive error handling:

```javascript
try {
  // Database operations
} catch (error) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Performance Considerations

- API responses are cached by Next.js for performance
- Database queries use indexed fields for fast lookups
- Import script uses bulk operations for efficiency
- Metrics calculations are pre-computed daily

## Future Extensions

### Additional Endpoints
- `GET /api/courses` - Filtered course data
- `GET /api/students/veterans` - Veteran student list
- `POST /api/import` - Webhook for file uploads

### Real-time Updates
- WebSocket integration for live dashboard updates
- Email alerts for critical capacity issues
- Slack/Discord notifications for team alerts

## Troubleshooting

### Common Issues

**"Failed to load dashboard data"**
- Check database connection in .env.local
- Verify PostgreSQL server is running
- Run `npx prisma db push` to ensure schema sync

**Empty import results**
- Verify TSV file format and headers
- Check for encoding issues (use UTF-8)
- Validate tab-separated values

**Slow API responses**
- Check database indexes
- Monitor PostgreSQL query logs
- Consider pagination for large datasets
