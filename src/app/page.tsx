"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Clock, Users } from 'lucide-react';

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
  error?: never;
}

interface APIError {
  error: string;
}

// Component to visualize the Gap (Deficit)
const GapAnalysisChart = ({ course }: { course: any }) => {
  const capacity = 100;
  const enrolled = capacity;
  const deficit = course.deficit || 0;
  const totalDemand = enrolled + deficit;
  const deficitPercent = totalDemand > 0 ? (deficit / totalDemand) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Deficit: {course.deficit} Seats</span>
        <span>Avg Wait: {course.avgWaitDays}d</span>
      </div>
      <div className="h-2 bg-red-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${(enrolled / totalDemand) * 100}%` }} />
        <div className="h-full bg-red-500" style={{ width: `${deficitPercent}%`, marginLeft: `-${deficitPercent}%` }} />
      </div>
    </div>
  );
};

// Main dashboard component
const App = () => {
  const [data, setData] = useState<DashboardData | APIError | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      console.log('Starting fetch from /api/dashboard');
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      const response = await fetch('/api/dashboard', { signal: controller.signal });
      clearTimeout(timeoutId);
      console.log('Fetch response:', { status: response.status, ok: response.ok });
      const result: DashboardData | APIError = await response.json();
      console.log('Fetch result:', result);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setData({ error: 'Failed to load dashboard data. Please refresh or check API.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Error state
  if (!data || 'error' in data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center p-6">
          <p className="text-xl font-semibold mb-2">Dashboard Error</p>
          <p>{data?.error || 'Unable to load dashboard data'}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ensure data is valid
  if (!('totalDeficit' in data)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Invalid dashboard data received.</div>
      </div>
    );
  }

  // Sort courses by Deficit Size for the Left Panel
  const sortedCourses = [...data.problemCourses].sort((a, b) => b.deficit - a.deficit);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Course Pulse | Capacity Planning Dashboard</h1>
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
          <h2 className="text-sm font-semibold text-gray-500">Total Seat Deficit</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.totalDeficit || 0}</p>
          <p className="text-sm text-red-500 mt-2">Immediate action required</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500">Avg. Wait Time</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.avgWaitTime || '0.0'} Days</p>
          <p className="text-sm text-gray-500 mt-2">Targeting under 10 days</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500">New Joins Today</h2>
          <p className="text-3xl font-bold text-gray-900 mt-1">+{data.newJoins || 0}</p>
          <p className="text-sm text-green-500 mt-2">Demand is active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Problem Areas */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-red-500" size={20} />
            <span>Top Deficit Courses</span>
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
                <p className="text-xs text-gray-600 mt-2">**Action:** {course.rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Center: Queue Health & Alerts */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">
          {/* Queue Health */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="text-blue-500" size={20} />
              <span>Queue Health</span>
            </h2>
            <div className="space-y-3">
              {data.healthData.slice(0, 5).map((item) => (
                <div key={item.course} className="flex justify-between items-center">
                  <span className="font-medium">{item.course}</span>
                  <span className={`font-bold ${item.status === '🔴' ? 'text-red-600' : item.status === '🟠' ? 'text-orange-500' : 'text-green-600'}`}>
                    {item.waitDays} Days ({item.status})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Triage */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alerts Panel */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="text-purple-500" size={18} />
                  <span>Alerts</span>
                </h3>
                <div className="space-y-3">
                  {data.alerts.map((alert, index) => (
                    <p key={index} className={`text-sm font-medium ${alert.color}`} dangerouslySetInnerHTML={{ __html: alert.message }}></p>
                  ))}
                </div>
              </div>

              {/* Student Triage */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="text-teal-500" size={18} />
                  <span>Student Triage</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">At-Risk Students</p>
                  <p className="text-3xl font-bold text-teal-600 my-2">{data.atRiskCount || 0}</p>
                  <p className="text-xs text-gray-600">Students waiting {'>'} 21 days may face academic delays.</p>
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
