
import React, { useState } from 'react';
import { useStudy, Task } from '../../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckSquare, 
  Plus, 
  X, 
  Edit3, 
  Clock, 
  Calendar, 
  PenLine, 
  Trash, 
  ArrowUpDown, 
  Sparkles
} from 'lucide-react';

export default function TaskManager() {
  const { subjects, tasks, addTask, updateTask, deleteTask, suggestStudyTasks } = useStudy();
  const [activeTab, setActiveTab] = useState('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'priority' | 'date'>('date');
  const { toast } = useToast();
  
  // Form state for adding/editing tasks
  const [formState, setFormState] = useState({
    title: '',
    subject: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 60,
    notes: '',
  });
  
  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'priority') {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });
  
  const handleAddTask = () => {
    if (!formState.title || !formState.subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedSubject = subjects.find(s => s.name === formState.subject);
    if (!selectedSubject) return;
    
    addTask({
      title: formState.title,
      subject: formState.subject,
      subjectColor: selectedSubject.color,
      priority: formState.priority,
      status: 'To Do',
      dueDate: formState.dueDate,
      estimatedMinutes: formState.estimatedMinutes,
      notes: formState.notes,
    });
    
    toast({
      title: "Task added",
      description: "Your new task has been added to your list.",
    });
    
    setDialogOpen(false);
    resetForm();
  };
  
  const handleUpdateTask = () => {
    if (!editingTask || !formState.title || !formState.subject) return;
    
    const selectedSubject = subjects.find(s => s.name === formState.subject);
    if (!selectedSubject) return;
    
    updateTask(editingTask.id, {
      title: formState.title,
      subject: formState.subject,
      subjectColor: selectedSubject.color,
      priority: formState.priority,
      dueDate: formState.dueDate,
      estimatedMinutes: formState.estimatedMinutes,
      notes: formState.notes,
    });
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
    
    setDialogOpen(false);
    setEditingTask(null);
    resetForm();
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };
  
  const handleStatusChange = (id: string, status: 'To Do' | 'In Progress' | 'Completed') => {
    updateTask(id, { 
      status, 
      completedAt: status === 'Completed' ? new Date().toISOString() : undefined 
    });
    
    toast({
      title: `Task ${status === 'Completed' ? 'completed' : 'updated'}`,
      description: `The task is now marked as ${status}.`,
      variant: status === 'Completed' ? 'success' : 'default',
    });
  };
  
  const editTask = (task: Task) => {
    setEditingTask(task);
    setFormState({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedMinutes: task.estimatedMinutes,
      notes: task.notes || '',
    });
    setDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormState({
      title: '',
      subject: '',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 60,
      notes: '',
    });
  };
  
  const handleOpenDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTask(null);
      resetForm();
    }
  };
  
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
          <h1 className="text-3xl font-bold font-heading mb-1">Tasks</h1>
          <p className="text-muted-foreground">Manage your study tasks and assignments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleGetSuggestions}
          >
            <Sparkles className="h-4 w-4" />
            Get AI Suggestions
          </Button>
          <Dialog open={dialogOpen} onOpenChange={handleOpenDialogChange}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input 
                    placeholder="E.g., Complete Algebra homework"
                    value={formState.title}
                    onChange={(e) => setFormState({...formState, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select 
                    value={formState.subject} 
                    onValueChange={(value) => setFormState({...formState, subject: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.name}>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: subject.color }}
                            ></div>
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select 
                      value={formState.priority} 
                      onValueChange={(value: 'High' | 'Medium' | 'Low') => 
                        setFormState({...formState, priority: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input 
                      type="date" 
                      value={formState.dueDate}
                      onChange={(e) => setFormState({...formState, dueDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Time (minutes)</label>
                  <Input 
                    type="number" 
                    min="5"
                    step="5"
                    value={formState.estimatedMinutes}
                    onChange={(e) => setFormState({
                      ...formState, 
                      estimatedMinutes: parseInt(e.target.value) || 60
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Input 
                    placeholder="Any additional details..."
                    value={formState.notes}
                    onChange={(e) => setFormState({...formState, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingTask ? handleUpdateTask : handleAddTask}>
                  {editingTask ? 'Update' : 'Add'} Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Task tabs and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="In Progress">In Progress</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={() => setSortOrder(sortOrder === 'date' ? 'priority' : 'date')}
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by {sortOrder === 'date' ? 'Priority' : 'Due Date'}
        </Button>
      </div>
      
      {/* Task list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CheckSquare className="h-5 w-5 mr-2 text-primary" />
            {activeTab === 'all' ? 'All Tasks' : 
             activeTab === 'In Progress' ? 'In Progress Tasks' : 
             'Completed Tasks'}
          </CardTitle>
          <CardDescription>
            {sortedTasks.length === 0 
              ? 'No tasks found.'
              : `${sortedTasks.length} task${sortedTasks.length !== 1 ? 's' : ''} in this view.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTasks.length > 0 ? (
            <div className="space-y-4">
              {sortedTasks.map(task => (
                <div key={task.id} className="flex items-start p-4 rounded-lg border border-border">
                  <div 
                    className="w-1 self-stretch rounded-full mr-3" 
                    style={{ backgroundColor: task.subjectColor }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <div className="flex ml-4 space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => editTask(task)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center mt-2 gap-2">
                      <span 
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${task.subjectColor}20`, 
                          color: task.subjectColor,
                        }}
                      >
                        {task.subject}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric' 
                        })}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.estimatedMinutes} minutes
                      </span>
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full ${
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
                    
                    {task.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {task.notes}
                      </p>
                    )}
                    
                    {/* Status selector */}
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant={task.status === 'To Do' ? 'default' : 'outline'} 
                        size="sm"
                        className="h-8"
                        onClick={() => handleStatusChange(task.id, 'To Do')}
                      >
                        To Do
                      </Button>
                      <Button 
                        variant={task.status === 'In Progress' ? 'default' : 'outline'} 
                        size="sm"
                        className="h-8"
                        onClick={() => handleStatusChange(task.id, 'In Progress')}
                      >
                        In Progress
                      </Button>
                      <Button 
                        variant={task.status === 'Completed' ? 'default' : 'outline'} 
                        size="sm"
                        className="h-8"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No tasks found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'all'
                  ? "You don't have any tasks yet. Add a new task to get started."
                  : activeTab === 'In Progress'
                  ? "You don't have any tasks in progress. Start working on a task."
                  : "You don't have any completed tasks. Keep going!"}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Add New Task</Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Task form content */}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
