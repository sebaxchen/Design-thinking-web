export type AchievementType = 
  | 'first-task' 
  | 'three-tasks'
  | 'five-tasks' 
  | 'ten-tasks' 
  | 'fifteen-tasks'
  | 'twenty-tasks'
  | 'fifty-tasks'
  | 'team-member-1-month'
  | 'team-member-3-months'
  | 'team-member-6-months'
  | 'team-member-1-year'
  | 'high-efficiency';

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  isNew: boolean; // Para mostrar notificaciones de logros nuevos
}

export interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  condition: (userStats: UserStats) => boolean;
  priority: number; // Para ordenar los logros
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  completionRate: number;
  joinDate: Date;
  daysInTeam: number;
}

export interface CreateAchievementRequest {
  userId: string;
  type: AchievementType;
  earnedAt?: Date;
}
