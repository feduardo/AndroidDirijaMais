import httpClient from '../http/client';

export type MessageOut = {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  attachment_url: string | null;
  attachment_type: 'image' | 'video' | 'document' | 'audio' | null;
  attachment_size_bytes: number | null;
  created_at: string;
};

export type MessagesListOut = {
  booking_id: string;
  chat_enabled: boolean;
  booking_status: string;
  messages: MessageOut[];
};

export type MessageCreateIn = {
  content: string;
  attachment_url?: string | null;
  attachment_type?: 'image' | 'video' | 'document' | 'audio' | null;
  attachment_size_bytes?: number | null;
};

export class MessageRepository {
  async listByBooking(bookingId: string, limit: number = 50, before?: string): Promise<MessagesListOut> {
    const params: any = { limit };
    if (before) params.before = before;

    const response = await httpClient.get<MessagesListOut>(`/api/v1/messages/bookings/${bookingId}`, { params });
    return response.data;
  }

  async send(bookingId: string, data: MessageCreateIn): Promise<MessageOut> {
    const response = await httpClient.post<MessageOut>(`/api/v1/messages/bookings/${bookingId}`, data);
    return response.data;
  }

  async markAsRead(bookingId: string): Promise<{ booking_id: string; marked_as_read: number }> {
    const response = await httpClient.post(`/api/v1/messages/bookings/${bookingId}/read`);
    return response.data;
  }
}

export default new MessageRepository();
