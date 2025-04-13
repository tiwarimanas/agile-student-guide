
import React, { useState } from 'react';
import { useStudy, TimeBlock } from '../../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, X, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetableGenerator() {
  const { subjects, timeBlocks, addTimeBlock, updateTimeBlock, deleteTimeBlock, generateTimetable } = useStudy();
  const [activeDay, setActiveDay] = useState('Monday');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const { toast } = useToast();
  
  // Form state for adding/editing blocks
  const [formState, setFormState] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    subject: '',
    description: '',
  });
  
  // Filter blocks by active day
  const filteredBlocks = timeBlocks.filter(block => block.day === activeDay);
  
  // Sort blocks by start time
  const sortedBlocks = [...filteredBlocks].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  const handleGenerateTimetable = () => {
    generateTimetable();
    toast({
      title: "Timetable generated!",
      description: "Your new AI-powered study schedule is ready.",
    });
  };
  
  const handleAddBlock = () => {
    if (!formState.subject) {
      toast({
        title: "Missing information",
        description: "Please select a subject for your study block.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedSubject = subjects.find(s => s.name === formState.subject);
    if (!selectedSubject) return;
    
    addTimeBlock({
      day: formState.day,
      startTime: formState.startTime,
      endTime: formState.endTime,
      subject: formState.subject,
      subjectColor: selectedSubject.color,
      description: formState.description,
    });
    
    toast({
      title: "Study block added",
      description: `${formState.subject} added to your timetable.`,
    });
    
    setDialogOpen(false);
    resetForm();
  };
  
  const handleUpdateBlock = () => {
    if (!editingBlock || !formState.subject) return;
    
    const selectedSubject = subjects.find(s => s.name === formState.subject);
    if (!selectedSubject) return;
    
    updateTimeBlock(editingBlock.id, {
      day: formState.day,
      startTime: formState.startTime,
      endTime: formState.endTime,
      subject: formState.subject,
      subjectColor: selectedSubject.color,
      description: formState.description,
    });
    
    toast({
      title: "Study block updated",
      description: `${formState.subject} was updated in your timetable.`,
    });
    
    setDialogOpen(false);
    setEditingBlock(null);
    resetForm();
  };
  
  const handleDeleteBlock = (id: string) => {
    deleteTimeBlock(id);
    toast({
      title: "Study block removed",
      description: "The study block has been removed from your timetable.",
    });
  };
  
  const editBlock = (block: TimeBlock) => {
    setEditingBlock(block);
    setFormState({
      day: block.day,
      startTime: block.startTime,
      endTime: block.endTime,
      subject: block.subject,
      description: block.description || '',
    });
    setDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormState({
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      subject: '',
      description: '',
    });
  };
  
  const handleOpenDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingBlock(null);
      resetForm();
    }
  };
  
  const openNewBlockDialog = () => {
    setFormState({
      ...formState,
      day: activeDay,
    });
    setDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Timetable</h1>
          <p className="text-muted-foreground">Create and manage your weekly study schedule</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleGenerateTimetable}
          >
            <RefreshCw className="h-4 w-4" />
            Generate with AI
          </Button>
          <Dialog open={dialogOpen} onOpenChange={handleOpenDialogChange}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={openNewBlockDialog}>
                <Plus className="h-4 w-4" />
                Add Study Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBlock ? 'Edit Study Block' : 'Add New Study Block'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Day</label>
                  <Select 
                    value={formState.day} 
                    onValueChange={(value) => setFormState({...formState, day: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input 
                      type="time" 
                      value={formState.startTime}
                      onChange={(e) => setFormState({...formState, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input 
                      type="time" 
                      value={formState.endTime}
                      onChange={(e) => setFormState({...formState, endTime: e.target.value})}
                    />
                  </div>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input 
                    placeholder="E.g., Review notes, Practice problems"
                    value={formState.description}
                    onChange={(e) => setFormState({...formState, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingBlock ? handleUpdateBlock : handleAddBlock}>
                  {editingBlock ? 'Update' : 'Add'} Block
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Day selector */}
      <div className="flex overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {daysOfWeek.map(day => (
          <button
            key={day}
            className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium mr-2 transition-colors ${
              activeDay === day 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      
      {/* Timetable for selected day */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            {activeDay}'s Schedule
          </CardTitle>
          <CardDescription>
            {sortedBlocks.length === 0 
              ? 'No study blocks scheduled for this day.'
              : `${sortedBlocks.length} study block${sortedBlocks.length !== 1 ? 's' : ''} scheduled.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedBlocks.length > 0 ? (
            <div className="space-y-4">
              {sortedBlocks.map(block => (
                <div key={block.id} className="flex items-start p-4 rounded-lg border border-border">
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
                    {block.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {block.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => editBlock(block)}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteBlock(block.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No study blocks for {activeDay}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add study blocks manually or generate a timetable with AI
              </p>
              <Button variant="outline" onClick={openNewBlockDialog}>
                Add Study Block
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
