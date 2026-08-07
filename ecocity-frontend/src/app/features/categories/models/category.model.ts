export interface Category {
  id: string;
  name: string;
  icon: string;
  reportsCount: number;
  createdAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon: string;
}
