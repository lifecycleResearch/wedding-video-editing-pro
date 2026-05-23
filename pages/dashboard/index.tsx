import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Activity, Bell, BarChart3, TrendingUp, Clock, Zap,
  AlertTriangle, Shield, Database, Eye, ArrowUpRight, ArrowDownRight,
  Loader2, CheckCircle, XCircle, AlertCircle, Settings, CreditCard,
  Bot, Webhook, Mail, Phone, Globe, RefreshCw, Filter, Search,
  ChevronDown, ChevronRight, ExternalLink, Plus, Play, Pause, Trash2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../lib/utils'
import { useProduct } from '../../lib/product-context'
import type { User } from '@supabase/supabase-js'

type Tab = 'overview' | 'alerts' | 'incidents' | 'sources' | 'agents' | 'settings'

interface UsageData {
  plan: { name: string; label: string }
  usage: { queries: { used: number; limit: number; pct: number }; alerts: { used: number; limit: number; pct: number } }
  recent_activity: any[]
  can_upgrade: boolean
  can_access_db: boolean
  can_api: boolean
  can_agent: boolean
}

interface Incident {
  id: string
  title: string
  description: string
  source: string
  source_url: string
  category: string
  severity: 'info' | 'warning' | 'critical' | 'urgent'
  occurred_at: string
  metadata?: Record<string, unknown>
}

interface Alert {
  id: string
  title: string
  description: string
  severity: string
  read: boolean
  created_at: string
  incidents?: { title: string; source: string; severity: string }
}

const SEVERITY_COLORS = {
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
  urgent: 'bg-red-200 text-red-800',
}

const SEVERITY_ICONS = {
  info: <Activity className="w-4 h-4 text-blue-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  critical: <AlertCircle className="w-4 h-4 text-red-600" />,
  urgent: <Shield className="w-4 h-4 text-red-700" />,
}

export default function Dashboard() {
  const product = useProduct()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [incidentTotal, setIncidentTotal] = useState(0)
  const [incidentPage, setIncidentPage] = useState(1)
  const [alertFilter, setAlertFilter] = useState<'all' | 'unread'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.replace('/auth'); return }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

  const fetchUsage = useCallback(async () => {
    if (!user) return
    try {
      const token = await supabase.auth.getSession().then(s => s.data.session?.access_token)
      const res = await fetch('/api/usage', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setUsage(await res.json())
    } catch (e) { console.error('Usage fetch error:', e) }
  }, [user])

  const fetchIncidents = useCallback(async (page = 1) => {
    if (!user) return
    try {
      setRefreshing(true)
      const token = await supabase.auth.getSession().then(s => s.data.session?.access_token)
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (severityFilter !== 'all') params.set('severity', severityFilter)
      const res = await fetch(`/api/incidents?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setIncidents(data.incidents || [])
        setIncidentTotal(data.total || 0)
      }
    } catch (e) { console.error('Incidents fetch error:', e) }
    finally { setRefreshing(false) }
  }, [user, severityFilter])

  const fetchAlerts = useCallback(async () => {
    if (!user) return
    try {
      const token = await supabase.auth.getSession().then(s => s.data.session?.access_token)
      const params = new URLSearchParams({ limit: '50' })
      if (alertFilter === 'unread') params.set('unread', 'true')
      const res = await fetch(`/api/alerts?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setAlerts(data.alerts || [])
      }
      // Also get unread count
      const unreadRes = await fetch(`/api/alerts?unread=true&limit=1`, { headers: { Authorization: `Bearer ${token}` } })
      if (unreadRes.ok) {
        const data = await unreadRes.json()
        setUnreadCount(data.total || 0)
      }
    } catch (e) { console.error('Alerts fetch error:', e) }
  }, [user, alertFilter])

  useEffect(() => {
    if (user) {
      fetchUsage()
      fetchIncidents(1)
      fetchAlerts()
    }
  }, [user, fetchUsage, fetchIncidents, fetchAlerts])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  const planLabel = usage?.plan.label || 'Starter'
  const planName = usage?.plan.name || 'starter'
  const canAccessDb = usage?.can_access_db || false
  const canAgent = usage?.can_agent || false

  return (
    <>
      <Head><title>Dashboard — {product.name}</title></Head>
      <Header productName={product.name} slug={product.slug} />
      <main className="pt-24 pb-16 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text">Dashboard</h1>
              <p className="text-text-muted">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className={cn(planName === 'enterprise' ? 'bg-purple-600' : planName === 'pro' ? 'bg-primary' : 'bg-slate-500')}>
                {planLabel} Plan
              </Badge>
              {usage?.can_upgrade && (
                <Button as="a" href="/pricing" size="sm">Upgrade</Button>
              )}
              <button onClick={() => { fetchUsage(); fetchIncidents(1); fetchAlerts() }} className="p-2 rounded-lg border border-border hover:bg-white" title="Refresh">
                <RefreshCw className={cn('w-4 h-4 text-text-muted', refreshing && 'animate-spin')} />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Queries Used"
              value={`${usage?.usage.queries.used || 0} / ${usage?.usage.queries.limit || 1000}`}
              icon={Activity}
              pct={usage?.usage.queries.pct || 0}
              color="primary"
            />
            <StatCard
              label="Alerts Triggered"
              value={String(unreadCount)}
              icon={Bell}
              trend={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              color={unreadCount > 0 ? 'red' : 'green'}
            />
            <StatCard
              label="Incidents Tracked"
              value={String(incidentTotal)}
              icon={Database}
              trend={canAccessDb ? 'Full access' : 'Last 7 days'}
              color={canAccessDb ? 'green' : 'amber'}
            />
            <StatCard
              label="Monitoring Sources"
              value="12"
              icon={Globe}
              trend="All active"
              color="primary"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl border border-border p-1 overflow-x-auto">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: BarChart3 },
              { id: 'alerts' as Tab, label: `Alerts${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: Bell },
              { id: 'incidents' as Tab, label: 'Incidents', icon: AlertTriangle },
              { id: 'sources' as Tab, label: 'Sources', icon: Globe },
              ...(canAgent ? [{ id: 'agents' as Tab, label: 'Agents', icon: Bot }] : []),
              { id: 'settings' as Tab, label: 'Settings', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text hover:bg-surface'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">{error}</div>}

          {activeTab === 'overview' && <OverviewTab usage={usage} incidents={incidents} product={product} />}
          {activeTab === 'alerts' && (
            <AlertsTab alerts={alerts} filter={alertFilter} onFilterChange={setAlertFilter} onRefresh={fetchAlerts} />
          )}
          {activeTab === 'incidents' && (
            <IncidentsTab
              incidents={incidents}
              total={incidentTotal}
              page={incidentPage}
              onPageChange={setIncidentPage}
              severityFilter={severityFilter}
              onSeverityChange={setSeverityFilter}
              canAccessDb={canAccessDb}
              planName={planName}
              onRefresh={() => fetchIncidents(incidentPage)}
            />
          )}
          {activeTab === 'sources' && <SourcesTab product={product} />}
          {activeTab === 'agents' && <AgentsTab planName={planName} />}
          {activeTab === 'settings' && <SettingsTab product={product} user={user} />}
        </div>
      </main>
      <Footer product={product} />
    </>
  )
}

function StatCard({ label, value, icon: Icon, pct, trend, color }: {
  label: string; value: string; icon: any; pct?: number; trend?: string; color: string
}) {
  const colors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
  }
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors[color] || colors.primary)}>
          <Icon className="w-5 h-5" />
        </div>
        {pct !== undefined && (
          <div className="flex items-center gap-1">
            <span className={cn('text-xs font-medium', pct > 80 ? 'text-red-500' : 'text-green-600')}>
              {pct}%
            </span>
            {pct > 80 ? <ArrowUpRight className="w-3 h-3 text-red-500" /> : <ArrowDownRight className="w-3 h-3 text-green-600" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text mb-1">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
      {trend && <div className={cn('text-xs mt-1', trend.includes('unread') ? 'text-red-500 font-medium' : 'text-text-muted')}>{trend}</div>}
      {pct !== undefined && (
        <div className="h-1.5 rounded-full bg-surface mt-2 overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', pct > 80 ? 'bg-red-500' : 'bg-primary')} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
    </div>
  )
}

function OverviewTab({ usage, incidents, product }: { usage: UsageData | null; incidents: Incident[]; product: any }) {
  const planName = usage?.plan.name || 'starter'
  const canAccessDb = usage?.can_access_db || false

  return (
    <div className="space-y-6">
      {/* Plan Info */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text">Your Plan: {usage?.plan.label || 'Starter'}</h2>
          {usage?.can_upgrade && (
            <Button as="a" href="/pricing" size="sm">Upgrade to {planName === 'starter' ? 'Pro' : 'Enterprise'}</Button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Monthly Queries</span>
              <span className="text-text font-medium">{usage?.usage.queries.used || 0} / {usage?.usage.queries.limit || 1000}</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(usage?.usage.queries.pct || 0, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Alert Quota</span>
              <span className="text-text font-medium">{usage?.usage.alerts.used || 0} / {usage?.usage.alerts.limit || 50}</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${Math.min(usage?.usage.alerts.pct || 0, 100)}%` }} />
            </div>
          </div>
        </div>
        {!canAccessDb && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Upgrade to Pro</strong> for full incident database access, webhook delivery, and API access.
            </p>
          </div>
        )}
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-4">Recent Incidents</h2>
        {incidents.length === 0 ? (
          <p className="text-text-muted text-sm">No incidents detected yet. Monitoring sources are active.</p>
        ) : (
          <div className="space-y-3">
            {incidents.slice(0, 5).map(inc => (
              <div key={inc.id || inc.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors">
                <div className="mt-0.5">{SEVERITY_ICONS[inc.severity as keyof typeof SEVERITY_ICONS] || SEVERITY_ICONS.info}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{inc.title}</p>
                  <p className="text-xs text-text-muted">{inc.source} • {new Date(inc.occurred_at).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className={cn('text-xs', SEVERITY_COLORS[inc.severity as keyof typeof SEVERITY_COLORS])}>
                  {inc.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <QuickAction icon={Bell} title="Configure Alerts" desc="Set up email, SMS, or webhook notifications" href="/dashboard/settings" />
        <QuickAction icon={Database} title="Browse Incidents" desc={`View ${canAccessDb ? 'full' : 'recent'} incident database`} href="#" />
        <QuickAction icon={BarChart3} title="View Reports" desc="Analytics and trend reports" href="/dashboard/billing" />
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, title, desc, href }: { icon: any; title: string; desc: string; href: string }) {
  return (
    <a href={href} className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-medium text-text text-sm mb-1">{title}</h3>
      <p className="text-xs text-text-muted">{desc}</p>
    </a>
  )
}

function AlertsTab({ alerts, filter, onFilterChange, onRefresh }: {
  alerts: Alert[]; filter: string; onFilterChange: (f: 'all' | 'unread') => void; onRefresh: () => void
}) {
  const markRead = async (id: string) => {
    const token = await supabase.auth.getSession().then(s => s.data.session?.access_token)
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ alert_id: id, read: true }),
    })
    onRefresh()
  }

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-text">Alerts</h2>
        <div className="flex gap-2">
          <button onClick={() => onFilterChange('all')} className={cn('px-3 py-1 rounded-lg text-sm', filter === 'all' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface')}>All</button>
          <button onClick={() => onFilterChange('unread')} className={cn('px-3 py-1 rounded-lg text-sm', filter === 'unread' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface')}>Unread</button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <Bell className="w-8 h-8 mx-auto mb-3 text-text-muted/50" />
            <p>No alerts yet. You'll be notified when incidents match your criteria.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={cn('p-4 flex items-start gap-3', !alert.read && 'bg-amber-50/50')}>
              <button onClick={() => markRead(alert.id)} className="mt-1">
                {alert.read ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              </button>
              <div className="flex-1">
                <p className={cn('text-sm', !alert.read ? 'font-semibold text-text' : 'text-text')}>{alert.title}</p>
                {alert.description && <p className="text-xs text-text-muted mt-1">{alert.description}</p>}
                <p className="text-xs text-text-muted mt-1">{new Date(alert.created_at).toLocaleString()}</p>
              </div>
              {alert.incidents && (
                <Badge variant="outline" className={cn('text-xs', SEVERITY_COLORS[alert.incidents.severity as keyof typeof SEVERITY_COLORS] || '')}>
                  {alert.incidents.severity}
                </Badge>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function IncidentsTab({ incidents, total, page, onPageChange, severityFilter, onSeverityChange, canAccessDb, planName, onRefresh }: {
  incidents: Incident[]; total: number; page: number; onPageChange: (p: number) => void
  severityFilter: string; onSeverityChange: (s: string) => void; canAccessDb: boolean; planName: string; onRefresh: () => void
}) {
  const severities = ['all', 'urgent', 'critical', 'warning', 'info']
  const perPage = 20
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-text">Incidents</h2>
          <p className="text-xs text-text-muted">
            {canAccessDb ? 'Full database access' : `Showing last 7 days (upgrade to Pro for full history)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {severities.map(s => (
              <button key={s} onClick={() => onSeverityChange(s)}
                className={cn('px-2 py-1 rounded text-xs capitalize', severityFilter === s ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface')}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={onRefresh} className="p-1.5 rounded-lg border border-border hover:bg-surface">
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {incidents.map(inc => (
          <div key={inc.id || inc.title} className="p-4 hover:bg-surface/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{SEVERITY_ICONS[inc.severity as keyof typeof SEVERITY_ICONS] || SEVERITY_ICONS.info}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-text">{inc.title}</h3>
                  <Badge variant="outline" className={cn('text-xs', SEVERITY_COLORS[inc.severity as keyof typeof SEVERITY_COLORS])}>
                    {inc.severity}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mb-2">{inc.description?.slice(0, 200)}{inc.description && inc.description.length > 200 ? '...' : ''}</p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{inc.source}</span>
                  <span>{new Date(inc.occurred_at).toLocaleDateString()}</span>
                  {inc.category && <span className="capitalize">{inc.category}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {incidents.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            <Database className="w-8 h-8 mx-auto mb-3 text-text-muted/50" />
            <p>No incidents found for the selected filters.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-text-muted">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1 rounded-lg border border-border text-sm disabled:opacity-50">Prev</button>
            <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-3 py-1 rounded-lg border border-border text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

function SourcesTab({ product }: { product: any }) {
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/monitoring?product=${product.slug}`)
      .then(r => r.json())
      .then(d => { setSources(d.sources || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [product.slug])

  const typeIcons: Record<string, any> = {
    rss: Globe, api: Database, web_scraper: Search, database: BarChart3, email_parser: Mail,
  }

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-semibold text-text">Monitoring Sources</h2>
        <p className="text-xs text-text-muted">Data sources actively monitored for {product.name}</p>
      </div>
      {loading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div> : (
        <div className="divide-y divide-border">
          {sources.map((src, i) => {
            const Icon = typeIcons[src.source_type] || Globe
            return (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">{src.name}</p>
                  <p className="text-xs text-text-muted">{src.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Every {src.check_interval_minutes}min</p>
                  <p className={cn('text-xs font-medium', src.status === 'active' ? 'text-green-600' : 'text-red-500')}>
                    {src.status === 'active' ? 'Active' : 'Error'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AgentsTab({ planName }: { planName: string }) {
  if (planName !== 'enterprise') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-8 text-center">
        <Bot className="w-12 h-12 mx-auto mb-4 text-purple-600" />
        <h2 className="text-xl font-bold text-text mb-2">Autonomous Agents</h2>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          Enterprise plan includes AI-powered autonomous agents that monitor, analyze, and respond to incidents automatically.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
          {[
            { icon: Bot, name: 'Monitor Agent', desc: 'Continuous 24/7 monitoring' },
            { icon: BarChart3, name: 'Analyzer Agent', desc: 'Pattern detection & insights' },
            { icon: Zap, name: 'Responder Agent', desc: 'Auto-response to incidents' },
            { icon: Mail, name: 'Reporter Agent', desc: 'Automated report generation' },
          ].map(a => (
            <div key={a.name} className="p-4 bg-white rounded-lg border border-purple-100">
              <a.icon className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-text">{a.name}</p>
              <p className="text-xs text-text-muted">{a.desc}</p>
            </div>
          ))}
        </div>
        <Button as="a" href="/pricing" className="bg-purple-600 hover:bg-purple-700">Upgrade to Enterprise</Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="font-semibold text-text mb-4">Autonomous Agents</h2>
      <p className="text-text-muted text-sm">Configure and manage your AI agents.</p>
      <div className="mt-4 p-8 text-center text-text-muted">No agents configured yet. Create your first agent to get started.</div>
    </div>
  )
}

function SettingsTab({ product, user }: { product: any; user: User | null }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-4">Account</h2>
        <div className="space-y-3">
          <div><label className="text-sm text-text-muted">Email</label><p className="text-sm text-text font-medium">{user?.email}</p></div>
          <div><label className="text-sm text-text-muted">Product</label><p className="text-sm text-text font-medium">{product.name}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-4">Alert Channels</h2>
        <div className="space-y-3">
          <AlertChannel icon={Mail} label="Email" desc="Receive alerts via email" enabled />
          <AlertChannel icon={Phone} label="SMS" desc="Receive alerts via text message" enabled={false} />
          <AlertChannel icon={Webhook} label="Webhook" desc="POST alerts to your endpoint" enabled={false} />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-4">Billing</h2>
        <Button as="a" href="/dashboard/billing" variant="outline">Manage Billing & Invoices</Button>
      </div>
    </div>
  )
}

function AlertChannel({ icon: Icon, label, desc, enabled }: { icon: any; label: string; desc: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-text-muted" />
        <div><p className="text-sm font-medium text-text">{label}</p><p className="text-xs text-text-muted">{desc}</p></div>
      </div>
      <div className={cn('w-10 h-5 rounded-full relative', enabled ? 'bg-primary' : 'bg-surface')}>
        <div className={cn('w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all', enabled ? 'left-5' : 'left-0.5')} />
      </div>
    </div>
  )
}