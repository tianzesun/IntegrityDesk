# Product Feature Design: Course Pulse (Capacity & Efficiency Edition)

## Version
2.0

## Focus
Capacity Planning & Queue Velocity

## Target Audience
Department Heads, Program Managers

## 1. The Core Philosophy

We are moving away from "How many people are waiting?" to "How many seats are we missing?"

The system converts raw student numbers into actionable Resourcing Decisions.

## Feature Set 1: Capacity Planning (The "Supply" Engine)

**Goal:** Tell the department exactly how many seats to add to satisfy demand.

### 1.1 The "Seat Deficit" Calculator

Instead of showing a raw list of 50 names, we calculate the "Deficit" based on standard class sizes.

**The Logic:**

If Waitlist = 50 and Tutorial Capacity = 20.

System Output: "You have a 2.5 Section Deficit."

**The UI Visualization:**

A "Gap Analysis" Bar Chart.

- Green Bar: Current Enrolled (Full).
- Red Bar (The Gap): The Waitlist size.

Action Button: A dynamic label that says "Recommendation: Open 2 new Labs."

### 1.2 "Flash Mob" Detection (Velocity Tracking)

We need to know when to react.

**The Feature:** A velocity meter that tracks New Signups Per Day.

**Use Cases:**

- Scenario A: 50 people joined over 2 months. -> Low Urgency. (Slow drip).
- Scenario B: 50 people joined yesterday. -> High Urgency. (Viral/Crisis).

**Visual:** A sparkline graph (mini line chart) next to the course name showing the spike.

## Feature Set 2: Queue Health (The "Flow" Engine)

**Goal:** Reduce student wait time by identifying "Stuck" queues.

### 2.1 The Stagnation Heatmap

This answers: Is the line moving, or is it dead?

**The Logic:**

Calculate Average Wait Days for every course.

- If average wait > 14 days, the course turns Red.
- If average wait < 3 days (high turnover), the course is Green.

**Why this matters:** A "Red" course means students are trapped. No one is dropping, no one is getting in. This requires Department intervention (increasing cap).

### 2.2 The "Bottleneck" Leaderboard

A sorted list of courses causing the most pain.

Examples:
- CSC108: 200 Waiting | Avg Wait: 21 Days (CRITICAL)
- MAT137: 50 Waiting | Avg Wait: 5 Days (Normal)

## Feature Set 3: Student Triage (The "Human" Engine)

**Goal:** Ensure the "right" people get the seats first.

### 3.1 The "Critical Needs" Filter

Not all waitlisted students are equal. The system parses the PERSON_ID or linked info (if available later) to tag students.

- **Tag:** "The Veteran" -> Student has been on the list for > 30 days.

**Feature:** A one-click filter for the professor to see only "Veterans."

**Action:** Professor can manually prioritize these students for entry.

### 3.2 "Ghost" Detection (Clean-up Tool)

**The Logic:** Identifying students who are on 5 different waitlists for the same time slot (using WAITLIST_TS and session info).

**The Insight:** These students are "hoarding" spots. The actual demand is lower than it looks.

**Value:** Helps the department realize they might not need as many extra seats as they thought.

## 4. User Interface Mockup Description (The Dashboard)

### Header
"Fall 2025 Capacity Dashboard"

### Big Number
"Total Seat Deficit: 450 Seats" (The headline metric).

### Left Panel: The Problem Areas
List of Courses sorted by Deficit Size.

Example: CS101: -45 Seats (Requires +2 Tutorials)

### Main Center: The Trend
Line Chart: "Total Waitlist Size over last 30 Days."

Annotation: "Enrollment Day 1 Spike" marked on the chart.

### Right Panel: Alerts
- ⚠️ 15 Students waiting > 30 Days in HIS100.
- 📈 ECO101 saw +40% demand growth yesterday.

## 5. Success Metrics (How we know it works)

- **Reduction in "Red" Courses:** Dept adds seats -> Wait time drops -> Course turns Green.
- **Zero "Veterans":** No student remains on a list for > 30 days without a resolution.
