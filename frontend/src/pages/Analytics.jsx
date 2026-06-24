import React from 'react';
import { useGetDashboardAnalyticsQuery } from '../redux/api/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

const Analytics = () => {
  const { data: response, isLoading } = useGetDashboardAnalyticsQuery();

  if (isLoading) return <div className="p-8 text-center">Loading Analytics...</div>;

  const data = response?.data;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;

  const {
    totalMeetings = 0,
    activeMeetings = 0,
    completedMeetings = 0,
    meetingChartData = [],
    totalTasks = 0,
    completedTasks = 0,
    pendingTasks = 0,
    taskChartData = []
  } = data || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Analytics & Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Meetings</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalMeetings}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completed Meetings</h3>
          <p className="text-3xl font-bold text-emerald-600">{completedMeetings}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Tasks</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalTasks}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Tasks</h3>
          <p className="text-3xl font-bold text-red-500">{pendingTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meeting Frequency Chart */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">Meeting Frequency</h2>
          <div className="h-80">
            {meetingChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meetingChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                  <Legend />
                  <Bar dataKey="meetings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No meeting data available</div>
            )}
          </div>
        </div>

        {/* Task Completion Pie Chart */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">Task Completion Rate</h2>
          <div className="h-80">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No task data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
