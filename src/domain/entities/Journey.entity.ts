export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export type MilestoneCategory = 
  | 'documentation' 
  | 'medical' 
  | 'theoretical' 
  | 'practical' 
  | 'habilitation';

export interface Milestone {
  id: string;
  code: string;
  name: string;
  description: string;
  category: MilestoneCategory;
  step_order: number;
  is_mandatory: boolean;
  status: MilestoneStatus;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  evidence_url: string | null;
}

export interface JourneyProgress {
  progress_percentage: number;
  total_mandatory: number;
  completed: number;
  milestones: Milestone[];
}

export interface JourneyProgressSummary {
  progress_percentage: number;
}