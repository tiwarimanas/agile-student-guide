
import React from 'react';
import { useStudy } from '../../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckSquare, BarChart, BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function DashboardView() {
  const { subjects, tasks, timeBlocks, suggestStudyTasks } = useStudy();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter tasks for today
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.dueDate === today);
  
  // Get upcoming tasks (due in next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingTasks = tasks.filter(task => 
    task.status !== 'Completed' && 
    task.dueDate > today && 
    task.dueDate <= nextWeek.toISOString().split('T')[0]
  );
  
  // Filter today's time blocks
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[new Date().getDay()];
  const todayTimeBlocks = timeBlocks.filter(block => block.day === currentDay);
  
  // Calculate overall progress
  const totalCompleted = subjects.reduce((sum, subject) => sum + subject.completedHours, 0);
  const totalHours = subjects.reduce((sum, subject) => sum + subject.totalHours, 0);
  const overallProgress = totalHours > 0 ? Math.round((totalCompleted / totalHours) * 100) : 0;
  
  // Calculate task completion stats
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  const handleGetSuggestions = () => {
    suggestStudyTasks();
    toast({
      title: "New study tasks suggested!",
      description: "AI has suggested new tasks based on your progress.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Your study overview and today's plan</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 flex items-center gap-2"
          onClick={handleGetSuggestions}
        >
          <Sparkles className="h-4 w-4" />
          Get AI Suggestions
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
              {totalCompleted} of {totalHours} hours completed
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
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Study Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-1">
              {subjects.map(subject => (
                <div 
                  key={subject.id}
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${subject.color}20`, 
                    color: subject.color
                  }}
                >
                  {subject.name}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {subjects.length} subjects in your curriculum
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="today">Today's Plan</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="mt-6 space-y-6">
          {/* Today's schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your study blocks for {currentDay}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayTimeBlocks.length > 0 ? (
                <div className="space-y-3">
                  {todayTimeBlocks.map(block => (
                    <div key={block.id} className="flex items-start p-3 rounded-lg border border-border">
                      <div className="flex flex-col items-center mr-4">
                        <div className="text-sm font-medium">{block.startTime}</div>
                        <div className="h-14 w-0.5 bg-border my-1"></div>
                        <div className="text-sm font-medium">{block.endTime}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: block.subjectColor }}
                          ></div>
                          <h4 className="font-medium">{block.subject}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {block.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No study blocks today</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Go to the timetable to add some study sessions
                  </p>
                  <Button variant="outline" onClick={() => navigate('/timetable')}>
                    Create Timetable
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Today's tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                Today's Tasks
              </CardTitle>
              <CardDescription>
                Tasks due today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length > 0 ? (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <div key={task.id} className="flex items-center p-3 rounded-lg border border-border">
                      <div 
                        className="w-1 self-stretch rounded-full mr-3" 
                        style={{ backgroundColor: task.subjectColor }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center mt-1">
                          <span 
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${task.subjectColor}20`, 
                              color: task.subjectColor,
                            }}
                          >
                            {task.subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {task.estimatedMinutes} min
                          </span>
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                              task.priority === 'High' 
                                ? 'bg-destructive/10 text-destructive' 
                                : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate('/tasks')}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No tasks due today</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're all caught up! Add new tasks or get AI suggestions
                  </p>
                  <Button variant="outline" onClick={() => navigate('/tasks')}>
                    Manage Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>
                Tasks due in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center p-3 rounded-lg border border-border">
                      <div 
                        className="w-1 self-stretch rounded-full mr-3" 
                        style={{ backgroundColor: task.subjectColor }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center mt-1 flex-wrap gap-y-1">
                          <span 
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${task.subjectColor}20`, 
                              color: task.subjectColor,
                            }}
                          >
                            {task.subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric' 
                            })}
                          </span>
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                              task.priority === 'High' 
                                ? 'bg-destructive/10 text-destructive' 
                                : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate('/tasks')}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No upcoming tasks</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your schedule is clear for the next week
                  </p>
                  <Button variant="outline" onClick={() => navigate('/tasks')}>
                    Add Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
