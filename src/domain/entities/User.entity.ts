export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;

  // legado (se ainda existir em algum lugar do app)
  avatar?: string;

  // novo (do backend)
  avatar_url?: string | null;

  createdAt: Date;
  cpf?: string | null;
}

export class UserEntity implements User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;

  avatar?: string;
  avatar_url?: string | null;

  createdAt: Date;
  cpf?: string | null;

  constructor(data: User) {
    this.id = data.id;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone = data.phone;
    this.role = data.role;

    this.avatar = data.avatar;
    this.avatar_url = data.avatar_url ?? null;

    this.createdAt = data.createdAt;
    this.cpf = data.cpf ?? null;
  }

  isInstructor(): boolean {
    return this.role === UserRole.INSTRUCTOR;
  }

  isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }
}
