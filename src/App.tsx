/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Church as ChurchIcon, 
  Activity, 
  ShieldAlert, 
  Settings, 
  Bell, 
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Globe,
  Filter,
  MapPin,
  Download,
  Server,
  UserCheck,
  UserX,
  Mail,
  Calendar as CalendarIcon,
  MoreVertical
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  MOCK_CHURCHES, 
  MOCK_PENDING, 
  ACTIVITY_DATA, 
  DEMOGRAPHICS_DATA, 
  SYSTEM_HEALTH,
  Church,
  PendingApproval,
  MOCK_USERS,
  User
} from './data/mockData';

const DashboardCard = ({ title, children, className, icon: Icon }: { title: string, children: React.ReactNode, className?: string, icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-dashboard-card border border-dashboard-border rounded-xl p-5 shadow-xl", className)}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon size={16} className="text-dashboard-accent" />}
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

const StatWidget = ({ label, value, trend, icon: Icon, color }: { label: string, value: string | number, trend?: number, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-dashboard-card border border-dashboard-border rounded-xl p-4 flex items-center gap-4"
  >
    <div className={cn("p-3 rounded-lg", color)}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        {trend !== undefined && (
          <span className={cn("text-xs font-bold flex items-center", trend >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

interface ServiceStatus {
  id: string;
  name: string;
  status: 'up' | 'degraded' | 'down';
  uptime: string;
  lastChecked: string;
}

const INITIAL_SERVICES: ServiceStatus[] = [
  { id: 'auth', name: 'Auth Service', status: 'up', uptime: '99.98%', lastChecked: 'Just now' },
  { id: 'api', name: 'API Gateway', status: 'up', uptime: '99.95%', lastChecked: 'Just now' },
  { id: 'db', name: 'Primary Database', status: 'up', uptime: '100%', lastChecked: 'Just now' },
  { id: 'storage', name: 'Cloud Storage', status: 'degraded', uptime: '99.90%', lastChecked: '2m ago' },
  { id: 'cache', name: 'Redis Cache', status: 'up', uptime: '99.99%', lastChecked: 'Just now' },
  { id: 'search', name: 'Search Engine', status: 'up', uptime: '99.92%', lastChecked: 'Just now' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(MOCK_PENDING);
  const [churches, setChurches] = useState<Church[]>(MOCK_CHURCHES);
  const [latency, setLatency] = useState(24);
  const [churchSearch, setChurchSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'flagged'>('all');
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  
  // User Management State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userChurchFilter, setUserChurchFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  // Simulate real-time latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(15, Math.min(120, prev + (Math.random() * 10 - 5))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApproval = (id: string, approved: boolean) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    // In real app, this would call API
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => {
        // Randomly change status for simulation
        if (Math.random() > 0.95) {
          const statuses: ('up' | 'degraded' | 'down')[] = ['up', 'degraded', 'down'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...service, status: newStatus, lastChecked: 'Just now' };
        }
        return service;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const exportToCSV = () => {
    const headers = ['Name', 'Location', 'User Count', 'Status', 'Activity Trend (%)'];
    const rows = filteredChurches.map(church => [
      `"${church.name}"`,
      `"${church.location}"`,
      church.userCount,
      church.status,
      church.activityTrend
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `church_clusters_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const anomalies = churches.filter(c => c.activityTrend <= -50);

  const filteredChurches = churches.filter(church => {
    const matchesSearch = church.location.toLowerCase().includes(churchSearch.toLowerCase()) || 
                         church.name.toLowerCase().includes(churchSearch.toLowerCase());
    const matchesCity = church.location.toLowerCase().split(',')[0].trim().includes(cityFilter.toLowerCase());
    const matchesCountry = church.location.toLowerCase().split(',')[1]?.trim().includes(countryFilter.toLowerCase()) ?? true;
    const matchesStatus = statusFilter === 'all' || church.status === statusFilter;
    return matchesSearch && matchesCity && matchesCountry && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                         user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesChurch = userChurchFilter === 'all' || user.churchId === userChurchFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    return matchesSearch && matchesChurch && matchesStatus;
  });

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'inactive' } : u));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-dashboard-border flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-dashboard-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">QT ADMIN</h1>
            <p className="text-[10px] text-dashboard-accent font-bold uppercase tracking-[0.2em]">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'churches', label: 'Church Clusters', icon: ChurchIcon },
            { id: 'analytics', label: 'Analytics Engine', icon: Activity },
            { id: 'ops', label: 'System Health', icon: ShieldAlert },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-dashboard-accent/10 text-dashboard-accent border border-dashboard-accent/20" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dashboard-border">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">System Status</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-slate-300">All systems operational</p>
            <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-dashboard-accent w-[98%]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-slate-400 text-sm">Real-time platform monitoring & administration</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="bg-dashboard-card border border-dashboard-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors w-64"
              />
            </div>
            <button className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-dashboard-card" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-dashboard-border">
              <div className="text-right">
                <p className="text-xs font-bold text-white">Admin Root</p>
                <p className="text-[10px] text-slate-500">Super Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dashboard-accent to-indigo-600 border-2 border-dashboard-border" />
            </div>
          </div>
        </header>

        {/* Anomaly Alert Banner */}
        {anomalies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 rounded-lg">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-400">Critical Anomaly Detected</h4>
                <p className="text-xs text-slate-400">{anomalies.length} church cluster(s) showing activity drops {'>'} 50%</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('churches')}
              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors"
            >
              Investigate
            </button>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatWidget label="Total Users" value="124,502" trend={12.5} icon={Users} color="bg-blue-600" />
              <StatWidget label="Active Churches" value="1,240" trend={3.2} icon={ChurchIcon} color="bg-indigo-600" />
              <StatWidget label="QT Completions" value="892,410" trend={8.7} icon={Activity} color="bg-emerald-600" />
              <StatWidget label="API Latency" value={`${Math.round(latency)}ms`} trend={-4.1} icon={Clock} color="bg-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Activity Chart */}
              <DashboardCard title="QT Activity Trends" className="lg:col-span-2" icon={Activity}>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACTIVITY_DATA}>
                      <defs>
                        <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#38bdf8' }}
                      />
                      <Area type="monotone" dataKey="completions" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletions)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Demographics */}
              <DashboardCard title="User Demographics" icon={Users}>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DEMOGRAPHICS_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {DEMOGRAPHICS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {DEMOGRAPHICS_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <DashboardCard title="Pending Approvals" icon={RefreshCw}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-dashboard-border">
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Entity</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dashboard-border">
                      <AnimatePresence>
                        {pendingApprovals.map((item) => (
                          <motion.tr 
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="group hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-4">
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-xs text-slate-500">{item.details}</p>
                            </td>
                            <td className="py-4">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                                item.type === 'church' ? "bg-indigo-500/10 text-indigo-400" : "bg-blue-500/10 text-blue-400"
                              )}>
                                {item.type}
                              </span>
                            </td>
                            <td className="py-4 text-xs text-slate-400">{item.requestDate}</td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleApproval(item.id, true)}
                                  className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleApproval(item.id, false)}
                                  className="p-1.5 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </DashboardCard>

              {/* Church Leaderboard & Anomalies */}
              <DashboardCard title="Global Church Clusters" icon={Globe}>
                <div className="space-y-4">
                  {churches.map((church) => (
                    <div key={church.id} className="p-4 bg-slate-800/30 rounded-xl border border-dashboard-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">{church.name}</h4>
                          <p className="text-xs text-slate-500">{church.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{church.userCount.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500 uppercase">Users</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              church.activityTrend <= -50 ? "bg-rose-500" : "bg-dashboard-accent"
                            )}
                            style={{ width: `${(church.activeUsers / church.userCount) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-bold flex items-center gap-1",
                          church.activityTrend >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {church.activityTrend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(church.activityTrend)}%
                        </span>
                      </div>
                      {church.activityTrend <= -50 && (
                        <div className="mt-3 flex items-center gap-2 text-rose-400 bg-rose-400/10 p-2 rounded-lg border border-rose-400/20">
                          <AlertTriangle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Critical Activity Drop Detected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
        )}

        {/* Church Clusters Tab */}
        {activeTab === 'churches' && (
          <div className="space-y-6">
            <DashboardCard title="Church Management & Clusters" icon={ChurchIcon}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Filter by name or location (e.g. Seoul, New York)..." 
                    value={churchSearch}
                    onChange={(e) => setChurchSearch(e.target.value)}
                    className="w-full bg-slate-800/50 border border-dashboard-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors"
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="City..." 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full bg-slate-800/50 border border-dashboard-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors"
                  />
                </div>
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Country..." 
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full bg-slate-800/50 border border-dashboard-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-500" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-slate-800/50 border border-dashboard-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors text-slate-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-dashboard-accent text-white text-sm font-bold rounded-lg hover:bg-dashboard-accent/90 transition-colors shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredChurches.map((church) => (
                    <motion.div 
                      key={church.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "p-4 rounded-xl border transition-all group relative overflow-hidden",
                        church.activityTrend <= -50 
                          ? "border-rose-500/50 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                          : "bg-slate-800/30 border-dashboard-border/50 hover:border-dashboard-accent/30"
                      )}
                    >
                      {church.activityTrend <= -50 && (
                        <div className="absolute top-0 right-0 px-2 py-1 bg-rose-500 text-white rounded-bl-lg flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={10} />
                          <span className="text-[8px] font-bold uppercase tracking-tighter">Anomaly</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            church.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                            church.status === 'flagged' ? "bg-rose-500/10 text-rose-400" :
                            "bg-amber-500/10 text-amber-400"
                          )}>
                            <ChurchIcon size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-dashboard-accent transition-colors">{church.name}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <MapPin size={10} />
                              {church.location}
                            </div>
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          church.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                          church.status === 'flagged' ? "bg-rose-500/10 text-rose-400" :
                          "bg-amber-500/10 text-amber-400"
                        )}>
                          {church.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900/40 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Total Users</p>
                          <p className="text-sm font-bold text-white">{church.userCount.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Active Rate</p>
                          <p className="text-sm font-bold text-white">{Math.round((church.activeUsers / church.userCount) * 100)}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden mr-4">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              church.activityTrend <= -50 ? "bg-rose-500" : "bg-dashboard-accent"
                            )}
                            style={{ width: `${(church.activeUsers / church.userCount) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-bold flex items-center gap-1",
                          church.activityTrend >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {church.activityTrend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(church.activityTrend)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredChurches.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No churches found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <DashboardCard title="User Management" icon={Users}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-slate-800/50 border border-dashboard-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ChurchIcon size={16} className="text-slate-500" />
                    <select 
                      value={userChurchFilter}
                      onChange={(e) => setUserChurchFilter(e.target.value)}
                      className="bg-slate-800/50 border border-dashboard-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors text-slate-300"
                    >
                      <option value="all">All Churches</option>
                      {MOCK_CHURCHES.map(church => (
                        <option key={church.id} value={church.id}>{church.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    <select 
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value as any)}
                      className="bg-slate-800/50 border border-dashboard-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-dashboard-accent transition-colors text-slate-300"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending Approval</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dashboard-border/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Church</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-border/30">
                    <AnimatePresence mode="popLayout">
                      {filteredUsers.map((user) => (
                        <motion.tr 
                          key={user.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-dashboard-accent/10 flex items-center justify-center text-dashboard-accent font-bold text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Mail size={10} />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <ChurchIcon size={12} className="text-slate-500" />
                              {user.churchName}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                              user.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                              user.status === 'pending' ? "bg-amber-500/10 text-amber-400 animate-pulse" :
                              "bg-slate-500/10 text-slate-400"
                            )}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <CalendarIcon size={12} />
                              {user.addedAt}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {user.status === 'pending' && (
                                <button 
                                  onClick={() => handleApproveUser(user.id)}
                                  className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                                  title="Approve User"
                                >
                                  <UserCheck size={16} />
                                </button>
                              )}
                              {user.status === 'active' && (
                                <button 
                                  onClick={() => handleDeactivateUser(user.id)}
                                  className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                                  title="Deactivate User"
                                >
                                  <UserX size={16} />
                                </button>
                              )}
                              <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'ops' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DashboardCard title="Backend Latency (KMP)" className="lg:col-span-2" icon={Clock}>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SYSTEM_HEALTH}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="latency" 
                        stroke="#38bdf8" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4, fill: '#38bdf8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              <DashboardCard title="Active Alerts" icon={ShieldAlert}>
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                      <div>
                        <h5 className="text-sm font-bold text-rose-400">Sync Failure</h5>
                        <p className="text-xs text-slate-400 mt-1">London Faith Fellowship cluster failed to sync 420 records.</p>
                        <p className="text-[10px] text-slate-500 mt-2">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Clock className="text-amber-500 shrink-0" size={18} />
                      <div>
                        <h5 className="text-sm font-bold text-amber-400">High Latency</h5>
                        <p className="text-xs text-slate-400 mt-1">API response times exceeded 100ms in Asia-East region.</p>
                        <p className="text-[10px] text-slate-500 mt-2">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>

            <DashboardCard title="Real-time Service Status" icon={Server}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <div key={service.id} className="p-4 bg-slate-800/40 border border-dashboard-border/50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        service.status === 'up' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                        service.status === 'degraded' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                        "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      )} />
                      <div>
                        <h5 className="text-sm font-bold text-white">{service.name}</h5>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                        service.status === 'up' ? "bg-emerald-500/10 text-emerald-400" :
                        service.status === 'degraded' ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      )}>
                        {service.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">Checked {service.lastChecked}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-dashboard-border/50 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">Operational (Up)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-400">Degraded Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-400">Service Outage (Down)</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'users' || activeTab === 'analytics') && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <Settings size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Module under construction</p>
            <p className="text-sm">Detailed {activeTab} management views are being provisioned.</p>
          </div>
        )}
      </main>
    </div>
  );
}
