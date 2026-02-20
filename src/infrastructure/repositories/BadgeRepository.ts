import httpClient from '../http/client';
import { BadgesResponse } from '../../domain/entities/Badge.entity';

export class BadgeRepository {
  async getBadges(): Promise<BadgesResponse> {
    const response = await httpClient.get<BadgesResponse>('/students/me/badges');
    return response.data;
  }
}

export const badgeRepository = new BadgeRepository();