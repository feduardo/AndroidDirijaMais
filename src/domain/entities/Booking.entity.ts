import { BookingStatus, PaymentStatus, PaymentMethod } from './BookingAPI.types';


// Aliases para manter compatibilidade com código existente
export const CONFIRMED = BookingStatus.ACCEPTED;

export interface Booking {
  id: string;
  studentId: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  category: string;
  date: Date;
  time: string;
  duration: number;
  location: string;
  notes?: string;
  status: BookingStatus;
  pricePerHour: number;
  totalPrice: number;
  startCode?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  startedAt?: Date;
  finishedByInstructorAt?: Date;
  completedByStudentAt?: Date;
  paymentReleased: boolean;
  paymentReleasedAt?: Date;
  autoConfirmationDeadline?: Date;
  paymentStatus?: PaymentStatus;   // novo
  paymentMethod?: PaymentMethod;   // novo
  canCancel?: boolean;             // novo

}

export class BookingEntity implements Booking {
  id: string;
  studentId: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  category: string;
  date: Date;
  time: string;
  duration: number;
  location: string;
  notes?: string;
  status: BookingStatus;
  pricePerHour: number;
  totalPrice: number;
  
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  startedAt?: Date;
  finishedByInstructorAt?: Date;
  completedByStudentAt?: Date;
  
  paymentReleased: boolean;
  paymentReleasedAt?: Date;
  autoConfirmationDeadline?: Date;
  startCode?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  canCancel?: boolean;


  constructor(data: Booking) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.instructorId = data.instructorId;
    this.instructorName = data.instructorName;
    this.instructorAvatar = data.instructorAvatar;
    this.category = data.category;
    this.date = data.date;
    this.time = data.time;
    this.duration = data.duration;
    this.location = data.location;
    this.notes = data.notes;
    this.status = data.status;
    this.pricePerHour = data.pricePerHour;
    this.totalPrice = data.totalPrice;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.confirmedAt = data.confirmedAt;
    this.startedAt = data.startedAt;
    this.finishedByInstructorAt = data.finishedByInstructorAt;
    this.completedByStudentAt = data.completedByStudentAt;
    this.paymentReleased = data.paymentReleased;
    this.paymentReleasedAt = data.paymentReleasedAt;
    this.autoConfirmationDeadline = data.autoConfirmationDeadline;
    this.startCode = data.startCode;
    this.paymentStatus = data.paymentStatus;
    this.paymentMethod = data.paymentMethod;
    this.canCancel = data.canCancel;

  }

  isPending(): boolean {
    return this.status === BookingStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === BookingStatus.ACCEPTED;
  }

  isInProgress(): boolean {
    return this.status === BookingStatus.IN_PROGRESS;
  }

  isAwaitingStudentConfirmation(): boolean {
    return this.status === BookingStatus.AWAITING_STUDENT_CONFIRMATION;
  }

  isCompleted(): boolean {
    return this.status === BookingStatus.COMPLETED;
  }

  isRejected(): boolean {
    return this.status === BookingStatus.REJECTED;
  }

  isCancelledByStudent(): boolean {
    return this.status === BookingStatus.CANCELLED_STUDENT;
  }

  isCancelledByInstructor(): boolean {
    return this.status === BookingStatus.CANCELLED_INSTRUCTOR;
  }

  isDisputed(): boolean {
    return this.status === BookingStatus.DISPUTED;
  }

  isNoShow(): boolean {
    return this.status === BookingStatus.NO_SHOW;
  }

  studentCanCancel(): boolean {
    return this.status === BookingStatus.PENDING || 
           this.status === BookingStatus.ACCEPTED;
  }

  studentCanConfirmCompletion(): boolean {
    return this.status === BookingStatus.AWAITING_STUDENT_CONFIRMATION;
  }

  studentCanRate(): boolean {
    return this.status === BookingStatus.COMPLETED;
  }

  instructorCanAccept(): boolean {
    return this.status === BookingStatus.PENDING;
  }

  instructorCanReject(): boolean {
    return this.status === BookingStatus.PENDING;
  }

  instructorCanStart(): boolean {
    return this.status === BookingStatus.ACCEPTED;
  }

  instructorCanFinish(): boolean {
    return this.status === BookingStatus.IN_PROGRESS;
  }

  instructorCanCancel(): boolean {
    return this.status === BookingStatus.ACCEPTED;
  }

  canReleasePayment(): boolean {
    return this.status === BookingStatus.COMPLETED && !this.paymentReleased;
  }

  isPaymentReleased(): boolean {
    return this.paymentReleased;
  }

  needsAutoConfirmation(): boolean {
    if (!this.autoConfirmationDeadline) return false;
    return new Date() > this.autoConfirmationDeadline;
  }

  getHoursUntilAutoConfirmation(): number | null {
    if (!this.autoConfirmationDeadline) return null;
    const diff = this.autoConfirmationDeadline.getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  }

  getStatusLabel(): string {
    const labels = {
      [BookingStatus.PENDING]: 'Aguardando instrutor',
      [BookingStatus.ACCEPTED]: 'Confirmada',
      [BookingStatus.IN_PROGRESS]: 'Em andamento',
      [BookingStatus.AWAITING_STUDENT_CONFIRMATION]: 'Aguardando sua confirmação',
      [BookingStatus.COMPLETED]: 'Concluída',
      [BookingStatus.REJECTED]: 'Recusada',
      [BookingStatus.CANCELLED_STUDENT]: 'Cancelada por você',
      [BookingStatus.CANCELLED_INSTRUCTOR]: 'Cancelada pelo instrutor',
      [BookingStatus.DISPUTED]: 'Contestada',
      [BookingStatus.NO_SHOW]: 'Não compareceu',
    };
    return labels[this.status];
  }

  getStatusColor(): string {
    const colors = {
      [BookingStatus.PENDING]: '#FFC107',
      [BookingStatus.ACCEPTED]: '#4CAF50',
      [BookingStatus.IN_PROGRESS]: '#2196F3',
      [BookingStatus.AWAITING_STUDENT_CONFIRMATION]: '#9C27B0',
      [BookingStatus.COMPLETED]: '#4CAF50',
      [BookingStatus.REJECTED]: '#E53935',
      [BookingStatus.CANCELLED_STUDENT]: '#757575',
      [BookingStatus.CANCELLED_INSTRUCTOR]: '#757575',
      [BookingStatus.DISPUTED]: '#FF9800',
      [BookingStatus.NO_SHOW]: '#9E9E9E',
    };
    return colors[this.status];
  }

  getStatusIcon(): string {
    const icons = {
      [BookingStatus.PENDING]: 'clock-outline',
      [BookingStatus.ACCEPTED]: 'check-circle-outline',
      [BookingStatus.IN_PROGRESS]: 'car',
      [BookingStatus.AWAITING_STUDENT_CONFIRMATION]: 'alert-circle-outline',
      [BookingStatus.COMPLETED]: 'check-all',
      [BookingStatus.REJECTED]: 'close-circle-outline',
      [BookingStatus.CANCELLED_STUDENT]: 'cancel',
      [BookingStatus.CANCELLED_INSTRUCTOR]: 'cancel',
      [BookingStatus.DISPUTED]: 'alert-octagon',
      [BookingStatus.NO_SHOW]: 'account-off-outline',
    };
    return icons[this.status];
  }

  getActionLabel(): string | null {
    if (this.studentCanCancel()) return 'Cancelar';
    if (this.studentCanConfirmCompletion()) return 'Confirmar Conclusão';
    if (this.studentCanRate()) return 'Avaliar';
    return null;
  }
}

// Re-export para compatibilidade
export { BookingStatus };