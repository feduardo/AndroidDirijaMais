import httpClient from '../http/client';
import { JourneyProgress, JourneyProgressSummary } from '../../domain/entities/Journey.entity';

export class JourneyRepository {
  async getJourney(): Promise<JourneyProgress> {
    const response = await httpClient.get<JourneyProgress>('/api/v1/students/me/journey');
    return response.data;
  }

  async getProgress(): Promise<JourneyProgressSummary> {
    const response = await httpClient.get<JourneyProgressSummary>('/api/v1/students/me/journey/progress');
    return response.data;
  }

  async startMilestone(milestoneId: string): Promise<void> {
    await httpClient.post(`/api/v1/students/me/journey/${milestoneId}/start`);
  }

  async completeMilestone(milestoneId: string): Promise<void> {
    await httpClient.post(`/api/v1/students/me/journey/${milestoneId}/complete`);
  }

  async updateMilestoneNotes(
    milestoneId: string,
    notes: string | null,
    evidenceUrl?: string | null
  ): Promise<void> {
    await httpClient.patch(`/api/v1/students/me/journey/${milestoneId}`, {
      notes,
      ...(evidenceUrl !== undefined && { evidence_url: evidenceUrl }),
    });
  }
}

export const journeyRepository = new JourneyRepository();