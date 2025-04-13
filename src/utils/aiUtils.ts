
import { Subject, Task, TimeBlock } from '../contexts/StudyContext';

// Mock AI generation for timetable
export function generateStudyPlan(subjects: Subject[]): TimeBlock[] {
  // This would be replaced with a real AI API call
  console.log('Generating study plan based on subjects:', subjects);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    { start: '08:00', end: '09:30' },
    { start: '10:00', end: '11:30' },
    { start: '13:00', end: '14:30' },
    { start: '15:00', end: '16:30' },
    { start: '18:00', end: '19:30' },
  ];
  
  const plan: TimeBlock[] = [];
  
  // Generate blocks based on subject priority
  days.forEach(day => {
    // Skip some weekend days sometimes
    if ((day === 'Saturday' || day === 'Sunday') && Math.random() > 0.7) {
      return;
    }
    
    // Add 2-3 study blocks per day
    const numBlocks = Math.floor(Math.random() * 2) + 2;
    const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
    const shuffledTimeSlots = [...timeSlots].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numBlocks && i < shuffledTimeSlots.length; i++) {
      const subject = shuffledSubjects[i % shuffledSubjects.length];
      const timeSlot = shuffledTimeSlots[i];
      
      plan.push({
        id: crypto.randomUUID(),
        day,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        subject: subject.name,
        subjectColor: subject.color,
        description: `Study ${subject.name}`,
      });
    }
  });
  
  return plan;
}

// Mock AI generation for task suggestions
export function suggestTasks(subjects: Subject[], existingTasks: Task[]): Task[] {
  // This would be replaced with a real AI API call
  console.log('Suggesting tasks based on subjects:', subjects);
  
  const suggestedTasks: Task[] = [];
  const tasksPerSubject = 1; // Limit for demo purposes
  
  // Find subjects that need more attention (less completed hours)
  const subjectsNeedingAttention = [...subjects]
    .sort((a, b) => (a.completedHours / a.totalHours) - (b.completedHours / b.totalHours));
  
  // Generate task suggestions for priority subjects
  for (let i = 0; i < Math.min(subjectsNeedingAttention.length, 3); i++) {
    const subject = subjectsNeedingAttention[i];
    
    // Generate new tasks
    for (let j = 0; j < tasksPerSubject; j++) {
      // Create a suggested task
      const task: Task = {
        id: crypto.randomUUID(),
        title: generateTaskTitle(subject.name),
        subject: subject.name,
        subjectColor: subject.color,
        priority: calculatePriority(subject),
        status: 'To Do',
        dueDate: generateDueDate(),
        estimatedMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
        createdAt: new Date().toISOString(),
      };
      
      suggestedTasks.push(task);
    }
  }
  
  return suggestedTasks;
}

// Helper functions for task generation
function generateTaskTitle(subject: string): string {
  const taskTypes = {
    'Mathematics': [
      'Practice problems on {topic}',
      'Review formulas for {topic}',
      'Complete homework on {topic}',
      'Watch tutorial on {topic}',
    ],
    'Physics': [
      'Solve {topic} equations',
      'Review laws of {topic}',
      'Lab report preparation',
      'Practice numerical problems on {topic}',
    ],
    'Chemistry': [
      'Review {topic} reactions',
      'Memorize formulas for {topic}',
      'Practice balancing equations',
      'Study molecular structures',
    ],
    'English': [
      'Read chapter on {topic}',
      'Write essay draft',
      'Analyze passage from {topic}',
      'Review grammar rules',
    ],
    'Computer Science': [
      'Practice coding {topic}',
      'Debug programs',
      'Read documentation for {topic}',
      'Build small project using {topic}',
    ],
    'default': [
      'Review notes on {topic}',
      'Practice problems for {topic}',
      'Read chapter on {topic}',
      'Complete assignment on {topic}',
    ],
  };
  
  const topics: Record<string, string[]> = {
    'Mathematics': ['Calculus', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
    'Physics': ['Mechanics', 'Electricity', 'Optics', 'Thermodynamics', 'Waves'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    'English': ['Literature', 'Grammar', 'Composition', 'Poetry', 'Critical Analysis'],
    'Computer Science': ['Algorithms', 'Data Structures', 'Programming Languages', 'Web Development', 'Databases'],
    'default': ['Chapter 1', 'Chapter 2', 'Advanced Topics', 'Fundamentals', 'Key Concepts'],
  };
  
  const taskTemplates = taskTypes[subject as keyof typeof taskTypes] || taskTypes.default;
  const subjectTopics = topics[subject as keyof typeof topics] || topics.default;
  
  const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
  const topic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
  
  return template.replace('{topic}', topic);
}

function calculatePriority(subject: Subject): 'High' | 'Medium' | 'Low' {
  const completionRate = subject.completedHours / subject.totalHours;
  
  if (subject.priority === 3 || completionRate < 0.3) {
    return 'High';
  } else if (subject.priority === 2 || completionRate < 0.6) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

function generateDueDate(): string {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 7) + 1; // 1-7 days from now
  const dueDate = new Date(now);
  dueDate.setDate(now.getDate() + daysToAdd);
  return dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}
