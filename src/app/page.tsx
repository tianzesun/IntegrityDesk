"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Clock, Users } from 'lucide-react'; // Using lucide icons

// Types for API data
interface DashboardData {
  totalDeficit: number;
  avgWaitTime: string;
  newJoins: number;
  problemCourses: Array<{
    code: string;
    name: string;
    deficit: number;
    avgWaitDays: number;
    velocity: number;
    rec: string;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    color: string;
  }>;
  healthData: Array<{
    course: string;
    waitDays: number;
    status: string;
  }>;
  atRiskCount: number;
}

// Component to visualize the Gap (Deficit)
const GapAnalysisChart = ({ course }) => {
  // Mock logic: assume a class capacity of 100 for visualization purposes
  const capacity = 100;
  const enrolled = capacity;
  const totalDemand = enrolled + course.deficit;
  const deficitPercent = (course.deficit / totalDemand) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Deficit: {course.deficit} Seats</span>
        <span>Avg Wait: {course.avgWaitDays}d</span>
      </div>
      <div className="h-2 bg-red-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-l-full"
          style={{ width: `${(enrolled / totalDemand) * 100}%` }}
        ></div>
        <div
          className="h-full bg-red-500"
          style={{ width: `${deficitPercent}%`, marginLeft: `-${deficitPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

// Component for the main dashboard (App)
const App = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const result: DashboardData = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add error state
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load dashboard data. Please refresh or check API.</div>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort courses by Deficit Size for the Left Panel
  const sortedCourses = data.problemCourses.sort((a, b) => b.deficit - a.deficit);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Course Pulse | 容量规划仪表盘
        </h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-gray-400"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Updating...' : 'Refresh Data'}</span>
        </button>
      </header>

      {/* Key Metrics Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-red-500">
          <h2 className="text-sm font-semibold text-gray-500">总席位缺口 (Total Seat Deficit)</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.totalDeficit}</p>
          <p className="text-sm text-red-500 mt-2">Immediate action required across all departments.</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500">平均等待天数 (Avg. Wait Time)</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">14.5 Days</p>
          <p className="text-sm text-gray-500 mt-2">Targeting below 10 days for student success.</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500">今日新增需求 (New Joins)</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">+40</p>
          <p className="text-sm text-green-500 mt-2">Demand is high, especially in ECO/CS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel: Problem Areas / Capacity Gap Leaderboard */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-red-500" size={20} />
            <span>容量缺口排行榜 (Top Deficit)</span>
          </h2>
          <div className="space-y-4">
            {sortedCourses.map((course, index) => (
              <div key={course.code} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{index + 1}. {course.code}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.deficit > 40 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Deficit: {course.deficit}
                  </span>
                </div>
                <GapAnalysisChart course={course} />
                <p className="text-xs text-gray-600 mt-2">
                  **Action:** {course.rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Center: Queue Health & Stagnation */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">

          {/* Row 1: Wait Time Stagnation Map (Simulated) */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="text-blue-500" size={20} />
                <span>等待时间热力图 (Queue Health)</span>
            </h2>
            <div className="h-48 flex flex-col justify-around text-sm">
                <p className="text-gray-500 italic">
                    {/* Placeholder for a Chart.js/Recharts integration */}

                </p>
                <div className="space-y-2">
                    <p className="flex justify-between items-center">
                        <span className="font-medium">HIS100 (World History)</span>
                        <span className="text-red-600 font-bold">32 Days (Stagnant 🔴)</span>
                    </p>
                    <p className="flex justify-between items-center">
                        <span className="font-medium">CS101 (Intro to Comp Sci)</span>
                        <span className="text-orange-600 font-bold">21 Days (Critical 🟠)</span>
                    </p>
                    <p className="flex justify-between items-center">
                        <span className="font-medium">ECO101 (Microeconomics)</span>
                        <span className="text-green-600 font-bold">3 Days (Healthy 🟢)</span>
                    </p>
                </div>
            </div>
          </div>

          {/* Row 2: Alerts & Student Triage */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Alerts Panel */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="text-purple-500" size={18} />
                        <span>实时警报 (Alerts)</span>
                    </h3>
                    <div className="space-y-3">
                        {/* FIX APPLIED HERE: The > symbol is escaped with > */}
                        {data.alerts.map((alert, index) => (
                             <p key={index} className={`text-sm font-medium ${alert.color}`}>
                                {alert.type === 'CRITICAL' ? '⚠️ ' : '📈 '}
                                <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                            </p>
                        ))}
                    </div>
                </div>

                {/* Triage / Critical Needs */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Users className="text-teal-500" size={18} />
                        <span>学生分流 (Student Triage)</span>
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-800">高危等待者报告 (At-Risk)</p>
                        <p className="text-3xl font-bold text-teal-600 my-2">123</p>
                        <p className="text-xs text-gray-600">
                            学生等待时间超过 21 天，可能面临学业延误风险。
                        </p>
                        <button className="mt-3 w-full text-center text-sm text-teal-600 font-medium hover:text-teal-800 transition">
                            View All Veterans &rarr;
                        </button>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
