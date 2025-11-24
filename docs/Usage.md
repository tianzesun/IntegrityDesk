# Course Pulse User Guide

## Overview

Course Pulse is a capacity planning analytics dashboard that processes daily waiting list data from university CMS systems to provide actionable insights for course management and student accommodation planning.

## Dashboard Features

### Capacity Metrics Panel
The top dashboard displays three key system metrics:

#### Total Seat Deficit
- **Calculation**: Sum of section/sections needed across all courses
- **Formula**: `CEIL(waitlist_count / tutorial_capacity)` per course
- **Action**: Indicates additional sections required

#### Average Wait Time
- **Calculation**: Mean wait days across all active courses
- **Range**: Typically 5-40 days depending on enrollment pressure
- **Action**: Target reduction to improve student experience

#### New Joins Today
- **Tracking**: Students added to waitlists in the last 24 hours
- **Velocity**: Indicates enrollment demand intensity
- **Action**: Signals trending demand for new sections

### Capacity Gap Leaderboard

#### Left Panel: Problem Areas
Displays courses with capacity deficits, sorted by severity:
- **Course Code**: Unique section identifier (e.g., CSC108H10301)
- **Deficit Score**: Additional sections needed
- **Gap Visualization**: Bar chart showing supply vs demand
- **Action Recommendations**: Suggested capacity increases

#### Gap Analysis Chart
- **Green Bar**: Current enrolled capacity
- **Red Bar**: Waitlist size (deficit)
- **Action Button**: Dynamic recommendation based on deficit

### Queue Health Monitoring

#### Right Panel: System Status
Three visual health indicators:

1. **Alert System** (Top)
   - **Critical Alerts**: Students waiting >30 days
   - **Velocity Alerts**: Sudden demand spikes
   - **Stagnant Queues**: No movement for prolonged periods

2. **Health Status Map** (Middle)
   - **🔴 Stagnant**: Average wait ≥ 30 days
   - **🟠 Critical**: Average wait 15-29 days
   - **🟢 Healthy**: Average wait ≤ 15 days

3. **At-Risk Students** (Bottom)
   - **Count**: Students waiting over 21 days
   - **Purpose**: Prioritize accommodation requests

## Daily Operations

### Processing Waiting List Data

1. **Receive Daily CMS File**
   - Format: TSV (Tab-Separated Values)
   - Filename Pattern: `cmswait_YYYY-MM-DD.txt`

2. **Import Data**
   ```bash
   node scripts/importWaitlist.js cmswait_2025-11-23.txt
   ```

3. **Automatic Processing**
   - Parse student and course records
   - Calculate wait times and positions
   - Update capacity metrics
   - Generate action recommendations

### Using the Dashboard

#### For Course Administrators
1. **Morning Review**: Check alerts and new joins
2. **Capacity Planning**: Review deficit leaderboard
3. **Course Planning**: Prioritize section additions
4. **Trend Monitoring**: Track demand velocity

#### For Student Services
1. **Veteran Identification**: Locate students with long waits
2. **Accommodation Planning**: Prioritize urgent cases
3. ** caseload Balancing**: Distribute student support

#### For Department Heads
1. **Resource Planning**: Request additional teaching allocation
2. **Budget Planning**: Plan for new course sections
3. **Stakeholder Reports**: Generate capacity reports

## Data Interpretation

### Understanding Deficit Scores

The lesson deficit calculation determines how many additional sections/sections are needed:

```
Deficit = CEIL(waitlist_students / tutorial_capacity)
Example: 45 waiting + 20 capacity per section = 23 lessons needed
```

### Wait Time Classification

- **< 14 days**: Normal enrollment pressure
- **15-21 days**: Increased monitoring required
- **22-29 days**: High priority interventions
- **> 30 days**: Immediate intervention required

### Velocity Trends

Daily signup rates indicate course appeal and capacity adequacy:

- **High Velocity (>20/day)**: Suggests course is in demand
- **Medium Velocity (10-20/day)**: Balanced enrollment
- **Low Velocity (<10/day)**: Consider course closure or promotion

## Troubleshooting

### No Data Display

1. **Check Database Connection**
   ```bash
   npx prisma db push
   ```

2. **Import Recent Data**
   ```bash
   node scripts/importWaitlist.js path/to/latest/file.txt
   ```

3. **Refresh Dashboard**
   - Hard refresh browser (Ctrl+F5)
   - Clear browser cache

### Incorrect Metrics

1. **Verify Data Format**
   - Ensure TSV format with tab separators
   - Check for encoding issues (use UTF-8)

2. **Check Import Scripts**
   - View logs during import
   - Verify no duplicate records

### Performance Issues

1. **Database Optimization**
   ```bash
   # Check Prisma query optimization
   npx prisma studio
   ```

2. **Server Resources**
   - Monitor Node.js memory usage
   - Check PostgreSQL performance

## Advanced Features

### Custom Analytics Views

#### Filtered Course Lists
```javascript
// In API endpoints, add filtering logic
const courses = await prisma.course.findMany({
  where: {
    department: 'CSC',
    avg_wait_days: { gte: 15 }
  }
});
```

#### Historical Trend Analysis
- Track metrics over semester terms
- Compare across academic years
- Predict seasonal enrollment patterns

### Automated Reporting

#### Daily Summary Emails
```
Subject: Course Pulse Daily Report - 2025-11-23

✅ Total Deficit: 450 sections
⚠️ Critical Courses: 12
🎯 Veteran Students: 85
```

#### Executive Dashboards
- Department-specific views
- Faculty utilization metrics
- Budget impact calculations

## Best Practices

### Data Quality
1. **Consistent File Naming**: Use standard `cmswait_YYYY-MM-DD.txt` format
2. **Complete Records**: Ensure all required fields are populated
3. **Timely Imports**: Process files within 24 hours of generation

### Dashboard Usage
1. **Regular Monitoring**: Check dashboard at start of each workday
2. **Action Logging**: Record capacity decisions based on analytics
3. **Trend Tracking**: Compare metrics across time periods

### Metrics Reliability
1. **Context Consideration**: Metrics reflect but don't dictate decisions
2. **Manual Overrides**: Computation analytics should inform, not replace judgment
3. **Comprehensive Assessment**: Consider multiple factors beyond wait times

## Support

### Getting Help
- **Documentation**: Check `/docs/` folder for detailed guides
- **Code Comments**: All source files include explanatory comments
- **Build Logs**: Check `%npm run dev` output for compilation errors

### Common Issues Resolution
- **React Compilation Errors**: Check JSX syntax, especially with `>`
- **Prisma Connection Errors**: Verify `.env.local` database URL
- **Import Script Failures**: Validate TSV file format and headers

## Conclusion

Course Pulse transforms complex waiting list data into clear, actionable insights for proactive course capacity management. The dashboard serves as a decision-support tool that helps optimize student access while efficiently allocating institutional resources.

Regular use enables evidence-based planning that balances student needs with operational constraints.
