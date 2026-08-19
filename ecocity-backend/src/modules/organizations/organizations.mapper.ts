import { Injectable } from '@nestjs/common';
import { OrganizationWithCounts } from './organizations.repository';

/** Correspond à `Organization` côté Angular. */
export interface OrganizationDto {
  id: string;
  name: string;
  city: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  usersCount: number;
  reportsCount: number;
  active: boolean;
  createdAt: string;
}

@Injectable()
export class OrganizationsMapper {
  toDto(org: OrganizationWithCounts): OrganizationDto {
    return {
      id: org.id,
      name: org.name,
      city: org.city,
      address: org.address,
      phone: org.phone,
      email: org.email,
      logoUrl: org.logoUrl,
      usersCount: org._count.users,
      reportsCount: org._count.reports,
      active: org.active,
      createdAt: org.createdAt.toISOString(),
    };
  }

  toDtoList(orgs: OrganizationWithCounts[]): OrganizationDto[] {
    return orgs.map((o) => this.toDto(o));
  }
}
