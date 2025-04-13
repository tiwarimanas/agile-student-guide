
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateStudyPlan, suggestTasks } from '../utils/aiUtils';

export type Subject = {
  id: string;
  name: string;
  color: string;
  priority: number;
  totalHours: number;
  completedHours: number;
};

export type Task = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
  estimatedMinutes: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type TimeBlock = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  subjectColor: string;
  description?: string;
};

type StudyContextType = {
  subjects: Subject[];
  tasks: Task[];
  timeBlocks: TimeBlock[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  generateTimetable: () => void;
  suggestStudyTasks: () => void;
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Sample data
const initialSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#8B5CF6', priority: 3, totalHours: 40, completedHours: 12 },
  { id: '2', name: 'Physics', color: '#3B82F6', priority: 2, totalHours: 35, completedHours: 8 },
  { id: '3', name: 'Chemistry', color: '#10B981', priority: 2, totalHours: 30, completedHours: 10 },
  { id: '4', name: 'English', color: '#F59E0B', priority: 1, totalHours: 25, completedHours: 6 },
  { id: '5', name: 'Computer Science', color: '#EC4899', priority: 3, totalHours: 45, completedHours: 15 },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Calculus Homework',
    subject: 'Mathematics',
    subjectColor: '#8B5CF6',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2025-04-15',
    estimatedMinutes: 60,
    notes: 'Focus on integration by parts',
    createdAt: '2025-04-13T10:00:00Z',
  },
  {
    id: '2',
    title: 'Read Physics Chapter 7',
    subject: 'Physics',
    subjectColor: '#3B82F6',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '2025-04-14',
    estimatedMinutes: 45,
    createdAt: '2025-04-12T14:30:00Z',
  },
  {
    id: '3',
    title: 'Chemistry Lab Report',
    subject: 'Chemistry',
    subjectColor: '#10B981',
    priority: 'High',
    status: 'To Do',
    dueDate: '2025-04-16',
    estimatedMinutes: 120,
    notes: 'Include all experiment data and analysis',
    createdAt: '2025-04-11T09:15:00Z',
  },
  {
    id: '4',
    title: 'English Essay Draft',
    subject: 'English',
    subjectColor: '#F59E0B',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '2025-04-18',
    estimatedMinutes: 90,
    createdAt: '2025-04-10T16:45:00Z',
  },
];

// Sample timetable
const initialTimeBlocks: TimeBlock[] = [
  {
    id: '1',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    subject: 'Mathematics',
    subjectColor: '#8B5CF6',
    description: 'Calculus practice',
  },
  {
    id: '2',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    subject: 'Physics',
    subjectColor: '#3B82F6',
    description: 'Waves and optics',
  },
  {
    id: '3',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    subject: 'Chemistry',
    subjectColor: '#10B981',
    description: 'Organic chemistry',
  },
  {
    id: '4',
    day: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    subject: 'English',
    subjectColor: '#F59E0B',
    description: 'Literature review',
  },
  {
    id: '5',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    subject: 'Computer Science',
    subjectColor: '#EC4899',
    description: 'Programming practice',
  },
];

export function StudyProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(initialTimeBlocks);

  // Subject CRUD operations
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: crypto.randomUUID() };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Task CRUD operations
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = { 
      ...task, 
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString() 
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // TimeBlock CRUD operations
  const addTimeBlock = (block: Omit<TimeBlock, 'id'>) => {
    const newBlock = { ...block, id: crypto.randomUUID() };
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    setTimeBlocks(timeBlocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
  };

  // AI features
  const generateTimetable = () => {
    const newTimeBlocks = generateStudyPlan(subjects);
    setTimeBlocks(newTimeBlocks);
  };

  const suggestStudyTasks = () => {
    const newTasks = suggestTasks(subjects, tasks);
    setTasks(prev => [...prev, ...newTasks]);
  };

  return (
    <StudyContext.Provider value={{
      subjects,
      tasks,
      timeBlocks,
      addSubject,
      updateSubject,
      deleteSubject,
      addTask,
      updateTask,
      deleteTask,
      addTimeBlock,
      updateTimeBlock,
      deleteTimeBlock,
      generateTimetable,
      suggestStudyTasks,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
