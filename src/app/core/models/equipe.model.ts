export interface EmpresaRequest { name: string; description?: string; }

export interface EmpresaSummary {
  id: string;
  name: string;
  description?: string;
  ownerName: string;
  myRole: 'OWNER' | 'MEMBER';
  memberCount: number;
  createdAt: string;
}

export interface MembroResponse {
  userId: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

export interface ConviteResponse {
  id: string;
  companyId: string;
  companyName: string;
  invitedByName: string;
  invitedEmail: string;
  status: string;
  createdAt: string;
}

export interface EmpresaDetail {
  id: string;
  name: string;
  description?: string;
  ownerName: string;
  myRole: 'OWNER' | 'MEMBER';
  members: MembroResponse[];
  pendingInvites: ConviteResponse[];
  createdAt: string;
}

export interface MemberPerformance {
  name: string;
  email: string;
  clients: number;
  revenue: number;
  items: number;
}

export interface EmpresaAnalytics {
  memberCount: number;
  totalClients: number;
  totalRevenue: number;
  totalItems: number;
  performances: MemberPerformance[];
}
