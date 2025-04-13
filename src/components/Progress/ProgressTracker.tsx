
import React, { useState } from 'react';
import { useStudy } from '../../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  CheckSquare,
  Clock,
  Calendar,
  LineChart,
  PieChart,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Bar,
  BarChart as ReBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

export default function ProgressTracker() {
  const { subjects, tasks } = useStudy();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const { toast } = useToast();
  
  // Calculate completion stats
  const totalHours = subjects.reduce((sum, subject) => sum + subject.totalHours, 0);
  const completedHours = subjects.reduce((sum, subject) => sum + subject.completedHours, 0);
  const overallProgress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
  
  // Calculate task stats
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Subject progress data for charts
  const subjectData = subjects.map(subject => ({
    name: subject.name,
    completedHours: subject.completedHours,
    totalHours: subject.totalHours,
    progress: Math.round((subject.completedHours / subject.totalHours) * 100),
    color: subject.color,
  }));
  
  // Time distribution data
  const timeDistributionData = subjects.map(subject => ({
    name: subject.name,
    value: subject.completedHours,
    color: subject.color,
  }));
  
  // Generate mock weekly data
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const data: any = { name: day };
      subjects.forEach(subject => {
        // Random hours between 0-3 with 1 decimal
        data[subject.name] = Math.round(Math.random() * 30) / 10;
      });
      return data;
    });
  };
  
  // Generate mock monthly data
  const generateMonthlyData = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map(week => {
      const data: any = { name: week };
      subjects.forEach(subject => {
        // Random hours between 0-10 with 1 decimal
        data[subject.name] = Math.round(Math.random() * 100) / 10;
      });
      return data;
    });
  };
  
  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  
  const chartData = timeRange === 'weekly' ? weeklyData : monthlyData;
  
  const handleDownloadReport = () => {
    // This would generate and download a report in a real app
    toast({
      title: "Report downloaded",
      description: "Your study progress report has been downloaded.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Progress</h1>
          <p className="text-muted-foreground">Track your study progress and achievements</p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 sm:mt-0 flex items-center gap-2"
          onClick={handleDownloadReport}
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedHours} of {totalHours} hours completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CheckSquare className="h-5 w-5 mr-2 text-primary" />
              Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{taskCompletionRate}%</div>
            <Progress value={taskCompletionRate} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completedHours} hrs</div>
            <div className="h-2 bg-secondary rounded-full mb-2">
              <div 
                className="h-2 rounded-full bg-primary" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total study time logged
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Subject progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Subject Progress
          </CardTitle>
          <CardDescription>
            Hours completed vs. total required for each subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map(subject => {
              const progress = Math.round((subject.completedHours / subject.totalHours) * 100);
              return (
                <div key={subject.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: subject.color }}
                      ></div>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {subject.completedHours} / {subject.totalHours} hrs
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                    // @ts-ignore - for custom color
                    indicatorColor={subject.color}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="time" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <LineChart className="h-5 w-5 mr-2 text-primary" />
                  Study Time Tracking
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeRange === 'weekly' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant={timeRange === 'monthly' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('monthly')}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
              <CardDescription>
                Hours spent studying each subject over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {subjects.map((subject, index) => (
                      <Bar 
                        key={subject.id}
                        dataKey={subject.name} 
                        stackId="a" 
                        fill={subject.color}
                      />
                    ))}
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Study Time Distribution
              </CardTitle>
              <CardDescription>
                How your study time is divided between subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
