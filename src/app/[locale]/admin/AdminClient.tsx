'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Users, Mail, Settings, Trash2, MessageSquare,
  Ticket as TicketIcon, LogOut, Loader2, Search,
  ChevronRight, Shield, ShieldCheck, CheckCircle2,
  XCircle, Globe, LayoutDashboard, Menu, X,
  Activity, Zap, FileCode2, TrendingUp, DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export default function AdminClient({ users, tickets, chats, settings }: any) {
  const t = useTranslations('AdminPanel');
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Settings Form
  const [smtpForm, setSmtpForm] = useState({
    smtpHost: settings?.smtpHost || '',
    smtpPort: settings?.smtpPort || 587,
    smtpUser: settings?.smtpUser || '',
    smtpPass: settings?.smtpPass || '',
    smtpSecure: settings?.smtpSecure ?? true,
  });
  const [msg, setMsg] = useState('');
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState('');

  // Selections
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState<{ [key: string]: string }>({});
  const [userSearch, setUserSearch] = useState('');

  // Email Compose State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Hydration state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const selectedTicket = tickets.find((t: any) => t.id === selectedTicketId);
  const selectedChat = chats.find((c: any) => c.id === selectedChatId);

  const filteredUsers = users.filter((u: any) =>
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.companyName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.firstName || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const stats = {
    revenue: "€0.00",
    customers: users.length,
    activeFiles: 0,
    completedFiles: 0,
    openTickets: tickets.filter((t:any) => t.status === 'OPEN').length,
    activeChats: chats.filter((c:any) => c.status === 'ACTIVE').length
  };

  const handleReplyChange = (id: string, val: string) => {
    setReplyMsg(prev => ({ ...prev, [id]: val }));
  };

  const sendChatReply = async (chatId: string) => {
    if (!replyMsg[chatId]?.trim()) return;
    await fetch('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ chatId, message: replyMsg[chatId], isAdmin: true })
    });
    setReplyMsg(prev => ({ ...prev, [chatId]: '' }));
    router.refresh();
  };

  const sendTicketReply = async (ticketId: string) => {
    if (!replyMsg[ticketId]?.trim()) return;
    await fetch('/api/tickets', {
      method: 'PUT',
      body: JSON.stringify({ ticketId, message: replyMsg[ticketId] })
    });
    setReplyMsg(prev => ({ ...prev, [ticketId]: '' }));
    router.refresh();
  };

  const closeTicket = async (ticketId: string) => {
    if(!confirm(t('ticketsCloseConfirm'))) return;
    await fetch('/api/tickets', {
      method: 'PATCH',
      body: JSON.stringify({ ticketId, status: 'CLOSED' })
    });
    router.refresh();
    setSelectedTicketId(null);
  };

  const updateSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(smtpForm)
      });
      if (res.ok) {
        setMsg(t('settingsSaveSuccess'));
        router.refresh();
      } else {
        setMsg(t('settingsSaveError'));
      }
    } finally {
      setSavingSmtp(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim() || testing) return;
    setTesting(true);
    setTestMsg('');
    try {
      const res = await fetch('/api/admin/settings/test', {
        method: 'POST',
        body: JSON.stringify({ to: testEmail.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTestMsg(t('settingsTestSuccess', { email: testEmail.trim() }));
      } else {
        setTestMsg(t('settingsTestError', { error: data.error || t('settingsTestFailedGeneric') }));
      }
    } catch {
      setTestMsg(t('settingsTestTimeout'));
    } finally {
      setTesting(false);
    }
  };

  const deleteUser = async (id: string) => {
    if(!confirm(t('usersDeleteConfirm'))) return;
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    router.refresh();
  };

  const sendEmailToCustomer = async () => {
    if (!emailTo || !emailSubject || !emailBody) return;
    setSendingEmail(true);
    try {
      const res = await fetch('/api/admin/users/email', {
        method: 'POST',
        body: JSON.stringify({ to: emailTo, subject: emailSubject, message: emailBody })
      });
      if (res.ok) {
        alert(t('emailModalSentSuccess'));
        setEmailModalOpen(false);
        setEmailSubject('');
        setEmailBody('');
      } else {
        const err = await res.json();
        alert(t('emailModalSendFailed', { error: err.error || t('emailModalUnknownError') }));
      }
    } catch (e) {
      alert(t('emailModalSendError'));
    } finally {
      setSendingEmail(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="fixed inset-0 bg-[#050505] text-gray-200 flex z-[100] h-screen w-screen overflow-hidden font-sans selection:bg-[#e8192c]/30">

      {/* Premium Subtle Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)',
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#0a0a0a]/90 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Image src="/logo.png" alt="TunerPortal" width={140} height={35} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" priority />
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-[#e8192c]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{t('sidebarSystemAdmin')}</div>
              <div className="text-[10px] text-gray-500 font-mono">{t('sidebarWorkspaceOwner')}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <button
            onClick={()=>{setTab('dashboard'); setIsSidebarOpen(false);}}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === 'dashboard' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className={`w-4 h-4 mr-3 ${tab === 'dashboard' ? 'text-[#e8192c]' : 'opacity-70'}`} /> {t('navDashboard')}
          </button>

          <button
            onClick={()=>{setTab('users'); setIsSidebarOpen(false);}}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === 'users' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className={`w-4 h-4 mr-3 ${tab === 'users' ? 'text-[#e8192c]' : 'opacity-70'}`} /> {t('navUsers')}
          </button>

          <button
            onClick={()=>{setTab('tickets'); setIsSidebarOpen(false);}}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === 'tickets' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <TicketIcon className={`w-4 h-4 mr-3 ${tab === 'tickets' ? 'text-[#e8192c]' : 'opacity-70'}`} /> {t('navTickets')}
            {stats.openTickets > 0 && (
              <span className="ml-auto bg-[#e8192c]/20 text-[#e8192c] text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.openTickets}</span>
            )}
          </button>

          <button
            onClick={()=>{setTab('chats'); setIsSidebarOpen(false);}}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === 'chats' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare className={`w-4 h-4 mr-3 ${tab === 'chats' ? 'text-[#e8192c]' : 'opacity-70'}`} /> {t('navChats')}
            {stats.activeChats > 0 && (
              <span className="ml-auto bg-[#e8192c]/20 text-[#e8192c] text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.activeChats}</span>
            )}
          </button>

          <button
            onClick={()=>{setTab('settings'); setIsSidebarOpen(false);}}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === 'settings' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings className={`w-4 h-4 mr-3 ${tab === 'settings' ? 'text-[#e8192c]' : 'opacity-70'}`} /> {t('navSettings')}
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-white/[0.05]">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-md transition-all"
          >
             <LogOut className="w-4 h-4 mr-3" /> {t('signOut')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden bg-transparent">

        {/* Top Header */}
        <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">{t('headerWorkspace')}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-white font-medium capitalize">{tab.replace('-', ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#e8192c]/10 border border-[#e8192c]/20 rounded-full text-[#e8192c] text-xs font-mono">
              <Activity className="w-3 h-3" /> {t('headerSystemOperational')}
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">

          {/* DASHBOARD TAB */}
          {tab === 'dashboard' && (
            <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Archivo' }}>{t('dashOverview')}</h2>
                <p className="text-sm text-gray-400">{t('dashSubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 backdrop-blur-xl shadow-lg hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#e8192c]/10 rounded-lg"><DollarSign className="w-5 h-5 text-[#e8192c]" /></div>
                    <span className="text-xs font-medium text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-md">+12.5%</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">{t('dashTotalRevenue')}</h3>
                  <div className="text-3xl font-bold text-white tracking-tight">{stats.revenue}</div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 backdrop-blur-xl shadow-lg hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/5 rounded-lg"><Users className="w-5 h-5 text-gray-300" /></div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">{t('dashActiveCustomers')}</h3>
                  <div className="text-3xl font-bold text-white tracking-tight">{stats.customers}</div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 backdrop-blur-xl shadow-lg hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#e8192c]/10 rounded-lg"><TicketIcon className="w-5 h-5 text-[#e8192c]" /></div>
                    {stats.openTickets > 0 && <span className="text-xs font-medium text-[#e8192c] bg-[#e8192c]/10 px-2 py-1 rounded-md">{t('dashActionReq')}</span>}
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">{t('dashOpenTickets')}</h3>
                  <div className="text-3xl font-bold text-white tracking-tight">{stats.openTickets}</div>
                </div>
              </div>

              {/* Decorative Empty Chart Area */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 backdrop-blur-xl shadow-lg h-[300px] flex flex-col items-center justify-center text-gray-500">
                <TrendingUp className="w-12 h-12 opacity-20 mb-4" />
                <p className="text-sm font-medium">{t('dashChartPlaceholder')}</p>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {tab === 'users' && (
            <div className="max-w-[1400px] mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Archivo' }}>{t('usersTitle')}</h2>
                  <p className="text-sm text-gray-400">{t('usersSubtitle')}</p>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('usersSearchPlaceholder')}
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full md:w-[280px] bg-black/40 border border-white/10 pl-9 pr-4 py-2 rounded-md text-sm text-white focus:outline-none focus:border-[#e8192c]/50 transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-[#0a0a0a] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/[0.05] sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4">{t('usersColTenant')}</th>
                        <th className="px-6 py-4">{t('usersColContact')}</th>
                        <th className="px-6 py-4">{t('usersColSecurity')}</th>
                        <th className="px-6 py-4 text-right">{t('usersColActions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-20">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Users className="w-12 h-12 opacity-20 mb-3" />
                              <p className="text-sm">{t('usersNoneFound')}</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.map((u:any) => {
                        // Real registration/tenant state — u.tenantRegistrationStatus never
                        // existed on the User model (schema has tenantRegistrationId/Error/
                        // SubmittedAt instead), so this previously silently never rendered.
                        // Derive it from the linked Tenant (now included in the query) instead.
                        const tenant = u.memberships?.[0]?.tenant;
                        const registrationLabel = u.tenantRegistrationError
                          ? t('usersRegistrationError')
                          : tenant
                          ? tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)
                          : u.tenantRegistrationSubmittedAt
                          ? t('usersRegistrationSubmitted')
                          : null;

                        return (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4 align-top">
                            <div className="font-semibold text-white text-sm">{u.companyName || t('usersIndependentClient')}</div>
                            <div className="text-[11px] text-gray-500 font-mono mt-1">{t('usersVat', { value: u.euVat || t('usersNA') })}</div>
                            {u.adminDomain && <div className="text-[11px] text-[#e8192c] font-mono mt-1">{t('usersAdminDomain', { value: u.adminDomain })}</div>}
                            {u.customerDomain && <div className="text-[11px] text-[#00ff88] font-mono mt-1">{t('usersPortalDomain', { value: u.customerDomain })}</div>}
                            {registrationLabel && (
                              <div className={twMerge('text-[10px] uppercase mt-1', u.tenantRegistrationError ? 'text-red-400' : 'text-gray-400')} title={u.tenantRegistrationError || undefined}>
                                {t('usersStatus', { value: registrationLabel })}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="text-gray-200 text-sm">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              {u.email}
                              <button
                                onClick={() => { setEmailTo(u.email); setEmailModalOpen(true); }}
                                className="text-[#e8192c] hover:text-white transition-colors"
                                title={t('usersSendEmailTitle')}
                              >
                                <Mail className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{u.phone || t('usersNoPhone')}</div>
                            {(u.address || u.zip || u.country) && (
                              <div className="text-[11px] text-gray-600 mt-2">
                                {u.address} {u.zip} {u.country}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top">
                            {u.portalPassword && (
                              <div className="text-xs text-gray-400 mb-1">
                                <span className="text-gray-600">{t('usersPortalPass')}</span> <span className="font-mono text-white">{u.portalPassword}</span>
                              </div>
                            )}
                            {u.password && (
                              <div className="text-xs text-gray-400">
                                <span className="text-gray-600">{t('usersPass')}</span> <span className="font-mono truncate max-w-[120px] inline-block align-bottom text-white" title={u.password}>{u.password}</span>
                              </div>
                            )}
                            {!u.password && !u.portalPassword && <span className="text-xs text-gray-600">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {(u.email === 'info@tunerportal.com' || u.email === 'info@deepxclusive.com') ? (
                              <span className="inline-flex items-center px-2 py-1 rounded bg-white/5 text-gray-400 text-[10px] font-bold uppercase border border-white/10">
                                {t('usersProtected')}
                              </span>
                            ) : (
                              <button
                                onClick={()=>deleteUser(u.id)}
                                className="p-1.5 text-gray-500 hover:bg-[#e8192c]/10 rounded hover:text-[#e8192c] transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TICKETS TAB */}
          {tab === 'tickets' && (
            <div className="max-w-[1400px] mx-auto h-full flex flex-col animate-in fade-in duration-500">
              <div className="mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Archivo' }}>{t('ticketsTitle')}</h2>
                <p className="text-sm text-gray-400">{t('ticketsSubtitle')}</p>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                {/* Ticket List */}
                <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl overflow-hidden shrink-0">
                  <div className="p-4 border-b border-white/[0.05] bg-[#0a0a0a]">
                    <h3 className="font-semibold text-gray-300 text-xs uppercase tracking-wider">{t('ticketsInbox', { count: stats.openTickets })}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {tickets.length === 0 && (
                      <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 opacity-20 mb-2" />
                        <span className="text-xs">{t('ticketsAllCaughtUp')}</span>
                      </div>
                    )}
                    {tickets.map((t:any) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all border ${selectedTicketId === t.id ? 'bg-[#e8192c]/10 border-[#e8192c]/20 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/[0.04]'}`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="font-mono text-[10px] text-gray-500">#{t.id.substring(t.id.length - 6).toUpperCase()}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${t.status === 'OPEN' ? 'bg-[#e8192c]/20 text-[#e8192c]' : 'bg-white/5 text-gray-500'}`}>
                            {t.status}
                          </span>
                        </div>
                        <h4 className={`text-sm truncate mb-0.5 ${selectedTicketId === t.id ? 'text-white font-semibold' : 'text-gray-300'}`}>{t.subject}</h4>
                        <p className="text-gray-500 text-xs truncate">{t.user?.email || t('ticketsUnknownUser')}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ticket Conversation View */}
                <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl flex flex-col shadow-xl min-w-0">
                  {selectedTicket ? (
                    <>
                      <div className="p-5 border-b border-white/[0.05] bg-[#0a0a0a]/50 flex justify-between items-center shrink-0">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-0.5">{selectedTicket.subject}</h3>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                            <span>{selectedTicket.user?.email}</span>
                            <span>•</span>
                            <span className={selectedTicket.status === 'OPEN' ? 'text-[#e8192c]' : ''}>{selectedTicket.status}</span>
                          </div>
                        </div>
                        {selectedTicket.status === 'OPEN' && (
                          <button onClick={() => closeTicket(selectedTicket.id)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-[#00ff88]/20 hover:text-[#00ff88] text-gray-300 rounded-md text-xs font-semibold transition-colors border border-white/5">
                            <CheckCircle2 className="w-3 h-3" /> {t('ticketsResolve')}
                          </button>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Original Message */}
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                            {selectedTicket.user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-4 text-gray-300 text-sm leading-relaxed inline-block">
                              <span className="block text-[9px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{t('ticketsOriginalRequest')}</span>
                              {selectedTicket.message}
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {selectedTicket.replies?.map((r: any) => (
                          <div key={r.id} className={`flex gap-4 ${r.isAdmin ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${r.isAdmin ? 'bg-gradient-to-br from-[#e8192c] to-blue-600' : 'bg-white/10'}`}>
                              {r.isAdmin ? 'A' : selectedTicket.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className={`flex-1 flex ${r.isAdmin ? 'justify-end' : 'justify-start'}`}>
                              <div className={`rounded-2xl p-4 text-sm leading-relaxed inline-block max-w-[85%] ${r.isAdmin ? 'bg-[#e8192c]/10 border border-[#e8192c]/20 text-white rounded-tr-sm' : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-sm'}`}>
                                {r.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      {selectedTicket.status === 'OPEN' ? (
                        <div className="p-4 border-t border-white/[0.05] bg-[#0a0a0a] shrink-0">
                          <div className="flex gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 focus-within:border-[#e8192c]/50 transition-colors">
                            <input
                              type="text"
                              value={replyMsg[selectedTicket.id] || ''}
                              onChange={e => handleReplyChange(selectedTicket.id, e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && sendTicketReply(selectedTicket.id)}
                              placeholder={t('ticketsReplyPlaceholder')}
                              className="flex-1 bg-transparent px-3 py-2 text-white text-sm focus:outline-none placeholder:text-gray-600"
                            />
                            <button
                              onClick={() => sendTicketReply(selectedTicket.id)}
                              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md text-xs font-bold transition-all"
                            >
                              {t('ticketsSend')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border-t border-white/[0.05] bg-[#0a0a0a] text-center shrink-0">
                          <p className="text-gray-500 text-xs inline-flex items-center gap-1.5">
                            <XCircle className="w-3 h-3" /> {t('ticketsResolved')}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                      <TicketIcon className="w-12 h-12 opacity-20 mb-3" />
                      <p className="text-sm">{t('ticketsSelectPrompt')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LIVE CHATS TAB */}
          {tab === 'chats' && (
            <div className="max-w-[1400px] mx-auto h-full flex flex-col animate-in fade-in duration-500">
              <div className="mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Archivo' }}>{t('chatsTitle')}</h2>
                <p className="text-sm text-gray-400">{t('chatsSubtitle')}</p>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                {/* Chat List */}
                <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl overflow-hidden shrink-0">
                  <div className="p-4 border-b border-white/[0.05] bg-[#0a0a0a] flex justify-between items-center">
                    <h3 className="font-semibold text-gray-300 text-xs uppercase tracking-wider">{t('chatsActiveSessions')}</h3>
                    <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chats.length === 0 && (
                      <div className="text-center py-10 text-gray-500 text-xs">{t('chatsNoneActive')}</div>
                    )}
                    {chats.map((c:any) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChatId(c.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all border ${selectedChatId === c.id ? 'bg-[#e8192c]/10 border-[#e8192c]/20' : 'bg-transparent border-transparent hover:bg-white/[0.04]'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-white text-sm font-semibold truncate">{c.name}</h4>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-[#00ff88]' : 'bg-gray-600'}`} />
                        </div>
                        <p className="text-gray-500 text-xs truncate">{c.email}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl flex flex-col shadow-xl min-w-0">
                  {selectedChat ? (
                    <>
                      <div className="p-5 border-b border-white/[0.05] bg-[#0a0a0a]/50 flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold text-sm">{selectedChat.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">{selectedChat.name}</h3>
                          <p className="text-[10px] text-gray-400 font-mono">{selectedChat.email}</p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {selectedChat.messages.map((m:any) => (
                          <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm ${m.isAdmin ? 'bg-white text-black rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm border border-white/5'}`}>
                              {m.message}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-white/[0.05] bg-[#0a0a0a] shrink-0">
                        <div className="flex gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 focus-within:border-white/30 transition-colors">
                          <input
                            type="text"
                            value={replyMsg[selectedChat.id] || ''}
                            onChange={e => handleReplyChange(selectedChat.id, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendChatReply(selectedChat.id)}
                            placeholder={t('chatsMessagePlaceholder')}
                            className="flex-1 bg-transparent px-3 py-2 text-white text-sm focus:outline-none placeholder:text-gray-600"
                          />
                          <button
                            onClick={() => sendChatReply(selectedChat.id)}
                            className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md text-xs font-bold transition-all"
                          >
                            {t('ticketsSend')}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-12 h-12 opacity-20 mb-3" />
                      <p className="text-sm">{t('chatsSelectPrompt')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === 'settings' && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Archivo' }}>{t('settingsTitle')}</h2>

              <div className="grid grid-cols-1 gap-6">
                {/* SMTP Setup Card */}
                <form onSubmit={updateSmtp} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl overflow-hidden shadow-xl">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Mail className="w-5 h-5 text-[#e8192c]" />
                      <h3 className="text-lg font-bold text-white">{t('settingsSmtpTitle')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('settingsHostProvider')}</label>
                        <input type="text" value={smtpForm.smtpHost} onChange={e=>setSmtpForm({...smtpForm, smtpHost: e.target.value})} placeholder="smtp.mailgun.org" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all placeholder:text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('settingsAuthKey')}</label>
                        <input type="email" value={smtpForm.smtpUser} onChange={e=>setSmtpForm({...smtpForm, smtpUser: e.target.value})} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('settingsSecret')}</label>
                        <input type="password" value={smtpForm.smtpPass} onChange={e=>setSmtpForm({...smtpForm, smtpPass: e.target.value})} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('settingsPort')}</label>
                        <input type="number" value={smtpForm.smtpPort} onChange={e=>setSmtpForm({...smtpForm, smtpPort: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('settingsEncryption')}</label>
                        <button type="button" onClick={()=>setSmtpForm({...smtpForm, smtpSecure: !smtpForm.smtpSecure})} className={`w-full flex items-center justify-between border p-3 rounded-lg text-white transition-all h-[46px] ${smtpForm.smtpSecure ? 'bg-[#e8192c]/10 border-[#e8192c]/30' : 'bg-black/40 border-white/10'}`}>
                          <span className="text-xs font-semibold">{smtpForm.smtpSecure ? t('settingsSslTls') : t('settingsStartTls')}</span>
                          <span className={`w-10 h-5 rounded-full relative shrink-0 transition-colors duration-300 ${smtpForm.smtpSecure ? 'bg-[#e8192c]' : 'bg-white/10'}`}>
                            <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${smtpForm.smtpSecure ? 'left-6' : 'left-1'}`} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border-t border-white/[0.05] p-4 px-6 md:px-8 flex items-center justify-between">
                    <p className={`text-xs font-medium ${msg.includes('✓') ? 'text-[#00ff88]' : 'text-red-400'}`}>{msg}</p>
                    <button type="submit" disabled={savingSmtp} className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-md text-xs font-bold transition-all disabled:opacity-50">
                      {savingSmtp && <Loader2 className="w-3 h-3 animate-spin" />}
                      {t('settingsSavePolicy')}
                    </button>
                  </div>
                </form>

                {/* Test Connection Card */}
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl overflow-hidden shadow-xl p-6 md:p-8">
                  <h3 className="text-sm font-bold text-white mb-1">{t('settingsDiagnosticTitle')}</h3>
                  <p className="text-xs text-gray-400 mb-5">{t('settingsDiagnosticDesc')}</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={e=>setTestEmail(e.target.value)}
                      placeholder="test@domain.com"
                      className="flex-1 bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-700"
                    />
                    <button
                      onClick={sendTestEmail}
                      disabled={testing || !testEmail.trim()}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      {t('settingsRunTest')}
                    </button>
                  </div>

                  {testMsg && (
                    <div className={`mt-4 p-3 rounded-lg border text-xs font-medium ${testMsg.startsWith('✓') ? 'bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]' : 'bg-[#e8192c]/10 border-[#e8192c]/20 text-red-400'}`}>
                      {testMsg}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Email Customer Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e8192c]" />
                {t('emailModalTitle')}
              </h3>
              <button onClick={() => setEmailModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('emailModalTo')}</label>
                <input
                  type="text"
                  value={emailTo}
                  disabled
                  className="w-full bg-black/40 border border-white/5 p-2.5 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('emailModalSubject')}</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder={t('emailModalSubjectPlaceholder')}
                  className="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('emailModalMessage')}</label>
                <textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={6}
                  placeholder={t('emailModalMessagePlaceholder')}
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-[#e8192c]/50 outline-none transition-all placeholder:text-gray-700 custom-scrollbar resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {t('emailModalCancel')}
              </button>
              <button
                onClick={sendEmailToCustomer}
                disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {t('emailModalSend')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
