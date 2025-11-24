# Course Pulse Analytics Platform

A comprehensive capacity planning and analytics platform for university course management, built specifically for processing daily waiting list data to provide actionable insights for department decision-making.

## Features

- **Real-time Analytics**: Process daily CMS waiting list files to provide capacity insights
- **Deficit Calculations**: Automatically calculate seat deficits based on course capacities
- **Wait Time Tracking**: Monitor student wait times with veteran identification
- **Queue Health Dashboard**: Visual monitoring of course queue status
- **Intelligent Alerts**: Automated alerts for critical capacity issues and stagnant queues
- **Interactive Visualizations**: Gap analysis charts and deficit visualizations

## Architecture

### Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes with Prisma ORM
- **Database**: PostgreSQL (Neon cloud)
- **Data Import**: Automated processing of TSV-based CMS files

### Data Pipeline
1. Daily CMS waitlist file (TSV format) → Import script
2. Parse students, courses, waitlist entries → Database
3. API calculations → Dashboard visualizations
4. Real-time metrics updates

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon cloud account)
- Daily CMS waiting list files (TSV format)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tianzesun/Coursepluse.git
cd coursepluse
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Copy database URL to .env.local
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL
```

4. Set up database schema:
```bash
npx prisma generate
npx prisma db push
```

5. Import sample data:
```bash
node scripts/importWaitlist.js cmswait_2025-11-23.txt
```

6. Start development server:
```bash
npm run dev
```

7. Open http://localhost:3000

### Daily Data Processing

To process daily CMS waiting list files:

```bash
node scripts/importWaitlist.js path/to/your/cms_file.txt
```

The script will automatically:
- Clear existing waitlist data
- Parse student and course information
- Calculate wait times and positions
- Update capacity metrics

## Project Structure

```
coursepulse/
├── docs/                 # Documentation
│   ├── README.md         # This file
│   ├── ProductFeatureDesign.md
│   ├── API.md           # API documentation
│   ├── Usage.md         # User guide
│   └── Deployment.md    # Deployment guide
├── scripts/              # Import scripts
│   └── importWaitlist.js # CMS data import
├── src/
│   ├── app/
│   │   ├── api/dashboard/route.ts # Dashboard API
│   │   ├── page.tsx      # Main dashboard
│   │   └── layout.tsx
│   └── prisma/
│       ├── migrations/   # Database migrations
│       └── schema.prisma # Database schema
├── prisma/
│   └── schema.prisma
├── public/               # Static assets
└── package.json
```

## Key Components

### Analytics Dashboard
- **Total Seat Deficit**: System-wide capacity gap calculation
- **Average Wait Time**: Mean wait days across all courses
- **Course-Specific Metrics**: Per-course deficit analysis
- **Alert System**: Automated notifications for critical issues

### Data Import System
- **Flexible Parser**: Handles variable TSV formats
- **Data Validation**: Ensures data integrity during import
- **Deduplication**: Handles duplicate student/course records
- **Position Calculation**: FIFO waitlist positioning

### Database Schema
- **Courses**: Academic sections with capacity data
- **Students**: Waitlist participants with contact info
- **Waitlist**: Many-to-many relationship with positions and timestamps

## Usage

### Professor Dashboard
1. View system-wide capacity summary
2. Identify courses with high deficits
3. Review student wait time distributions
4. Monitor queue health status
5. Check automated alerts

### Administrative Operations
1. Regular data imports from CMS feeds
2. Monitor capacity trends
3. Plan course additions based on analytics
4. Prioritize student accommodation requests

## Contributing

This is an academic project demonstrating analytics-driven decision support systems. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make changes with proper documentation
4. Test with sample data
5. Submit pull request

## License

This project is part of an academic demonstration of capacity analytics systems.
