export interface Church {
  id: string;
  name: string;
  location: string;
  userCount: number;
  activeUsers: number;
  status: 'active' | 'pending' | 'flagged';
  activityTrend: number; // percentage change
}

export interface PendingApproval {
  id: string;
  type: 'user' | 'church';
  name: string;
  email?: string;
  requestDate: string;
  details: string;
}

export interface SystemMetric {
  timestamp: string;
  latency: number;
  cpu: number;
  memory: number;
  status: 'up' | 'down' | 'degraded';
}

export interface User {
  id: string;
  name: string;
  email: string;
  churchId: string;
  churchName: string;
  role: 'member' | 'leader' | 'admin';
  status: 'active' | 'pending' | 'inactive';
  addedAt: string;
  lastActive: string;
}

export const MOCK_CHURCHES: Church[] = [
  { id: '1', name: 'Seoul Central Church', location: 'Seoul, KR', userCount: 1250, activeUsers: 890, status: 'active', activityTrend: 5.2 },
  { id: '2', name: 'Berlin Grace Community', location: 'Berlin, DE', userCount: 450, activeUsers: 310, status: 'active', activityTrend: -2.1 },
  { id: '3', name: 'NY Hope Chapel', location: 'New York, US', userCount: 2100, activeUsers: 1450, status: 'active', activityTrend: 12.5 },
  { id: '4', name: 'London Faith Fellowship', location: 'London, UK', userCount: 820, activeUsers: 400, status: 'flagged', activityTrend: -52.0 },
  { id: '5', name: 'Tokyo Peace Church', location: 'Tokyo, JP', userCount: 320, activeUsers: 280, status: 'active', activityTrend: 1.5 },
  { id: '6', name: 'Paris Light Church', location: 'Paris, FR', userCount: 150, activeUsers: 120, status: 'pending', activityTrend: 0 },
  { id: '7', name: 'Sydney Harbour Grace', location: 'Sydney, AU', userCount: 600, activeUsers: 450, status: 'pending', activityTrend: 0 },
  { id: '8', name: 'Toronto Life Gate', location: 'Toronto, CA', userCount: 950, activeUsers: 700, status: 'active', activityTrend: 3.8 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Kim Min-jun', email: 'minjun@seoul.kr', churchId: '1', churchName: 'Seoul Central Church', role: 'member', status: 'active', addedAt: '2026-01-15', lastActive: '2026-03-26' },
  { id: 'u2', name: 'Hans Müller', email: 'hans@example.de', churchId: '2', churchName: 'Berlin Grace Community', role: 'leader', status: 'pending', addedAt: '2026-03-25', lastActive: '2026-03-25' },
  { id: 'u3', name: 'Sarah Johnson', email: 'sarah.j@hope.us', churchId: '3', churchName: 'NY Hope Chapel', role: 'member', status: 'active', addedAt: '2026-02-10', lastActive: '2026-03-24' },
  { id: 'u4', name: 'David Smith', email: 'david.s@faith.uk', churchId: '4', churchName: 'London Faith Fellowship', role: 'member', status: 'active', addedAt: '2025-12-05', lastActive: '2026-03-20' },
  { id: 'u5', name: 'Yuki Tanaka', email: 'yuki@peace.jp', churchId: '5', churchName: 'Tokyo Peace Church', role: 'leader', status: 'active', addedAt: '2026-02-20', lastActive: '2026-03-26' },
  { id: 'u6', name: 'Marie Dubois', email: 'marie@light.fr', churchId: '6', churchName: 'Paris Light Church', role: 'member', status: 'pending', addedAt: '2026-03-24', lastActive: '2026-03-24' },
  { id: 'u7', name: 'James Wilson', email: 'james@harbour.au', churchId: '7', churchName: 'Sydney Harbour Grace', role: 'member', status: 'pending', addedAt: '2026-03-25', lastActive: '2026-03-25' },
  { id: 'u8', name: 'Emily Chen', email: 'emily@lifegate.ca', churchId: '8', churchName: 'Toronto Life Gate', role: 'member', status: 'active', addedAt: '2026-01-30', lastActive: '2026-03-25' },
  { id: 'u9', name: 'Park Ji-won', email: 'jiwon@seoul.kr', churchId: '1', churchName: 'Seoul Central Church', role: 'leader', status: 'active', addedAt: '2026-01-20', lastActive: '2026-03-26' },
  { id: 'u10', name: 'Thomas Weber', email: 'thomas@example.de', churchId: '2', churchName: 'Berlin Grace Community', role: 'member', status: 'inactive', addedAt: '2026-02-05', lastActive: '2026-03-10' },
];

export const MOCK_PENDING: PendingApproval[] = [
  { id: 'p1', type: 'church', name: 'Paris Light Church', requestDate: '2026-03-24', details: 'New registration request from Paris, FR' },
  { id: 'p2', type: 'user', name: 'Hans Müller', email: 'hans@example.de', requestDate: '2026-03-25', details: 'Leader role request for Berlin Grace' },
  { id: 'p3', type: 'church', name: 'Sydney Harbour Grace', requestDate: '2026-03-25', details: 'Re-activation request' },
];

export const ACTIVITY_DATA = [
  { name: 'Mon', completions: 4200, users: 5100 },
  { name: 'Tue', completions: 4500, users: 5300 },
  { name: 'Wed', completions: 3900, users: 5200 },
  { name: 'Thu', completions: 4800, users: 5500 },
  { name: 'Fri', completions: 5100, users: 5800 },
  { name: 'Sat', completions: 3200, users: 4500 },
  { name: 'Sun', completions: 2800, users: 4200 },
];

export const DEMOGRAPHICS_DATA = [
  { name: 'Male', value: 45, color: '#3b82f6' },
  { name: 'Female', value: 55, color: '#ec4899' },
];

export const SYSTEM_HEALTH = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  latency: Math.floor(Math.random() * 50) + 20,
  status: Math.random() > 0.95 ? 'degraded' : 'up',
}));
