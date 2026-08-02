export class UserResponseDto {
  id!: string;

  firstName!: string;

  lastName!: string;

  email!: string;

  phone?: string | null;

  role!: string;

  organization!: string;
}