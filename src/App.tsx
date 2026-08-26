import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
  LineChart,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TimerReset,
  Wrench,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

type View = 'overview' | 'properties' | 'applications' | 'maintenance'
type Theme = 'light' | 'dark'

type Property = {
  id: number
  name: string
  city: string
  type: string
  image: string
  occupancy: number
  revenue: number
  units: number
  delinquent: number
  status: 'Stable' | 'Attention' | 'Growth'
}

type Application = {
  id: string
  applicant: string
  property: string
  rent: number
  stage: 'Lead' | 'Documents' | 'KYC' | 'Review' | 'Approved'
  score: number
  submitted: string
}

type WorkOrder = {
  id: string
  title: string
  property: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'Assigned' | 'In progress' | 'Done'
  owner: string
  due: string
}

const properties: Property[] = [
  {
    id: 1,
    name: 'Loma Norte Residences',
    city: 'Mexico City',
    type: 'Apartments',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
    occupancy: 94,
    revenue: 284200,
    units: 42,
    delinquent: 2,
    status: 'Stable',
  },
  {
    id: 2,
    name: 'Casa Laurel',
    city: 'Tepoztlan',
    type: 'Short stays',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    occupancy: 81,
    revenue: 138900,
    units: 12,
    delinquent: 0,
    status: 'Growth',
  },
  {
    id: 3,
    name: 'Distrito Central Lofts',
    city: 'Guadalajara',
    type: 'Mixed use',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    occupancy: 88,
    revenue: 219700,
    units: 31,
    delinquent: 4,
    status: 'Attention',
  },
]

const applications: Application[] = [
  {
    id: 'APP-2048',
    applicant: 'Mariana Ortega',
    property: 'Loma Norte Residences',
    rent: 28500,
    stage: 'KYC',
    score: 92,
    submitted: 'Today',
  },
  {
    id: 'APP-2049',
    applicant: 'Diego Ramos',
    property: 'Distrito Central Lofts',
    rent: 24100,
    stage: 'Documents',
    score: 77,
    submitted: 'Yesterday',
  },
  {
    id: 'APP-2050',
    applicant: 'Lucia Herrera',
    property: 'Casa Laurel',
    rent: 39200,
    stage: 'Review',
    score: 86,
    submitted: '2 days ago',
  },
  {
    id: 'APP-2051',
    applicant: 'Nolan Pierce',
    property: 'Loma Norte Residences',
    rent: 31200,
    stage: 'Approved',
    score: 95,
    submitted: '3 days ago',
  },
]

const workOrders: WorkOrder[] = [
  {
    id: 'WO-781',
    title: 'Replace smart lock battery cluster',
    property: 'Loma Norte Residences',
    priority: 'High',
    status: 'In progress',
    owner: 'Vendor team',
    due: 'Today',
  },
  {
    id: 'WO-782',
    title: 'Water pressure inspection',
    property: 'Casa Laurel',
    priority: 'Medium',
    status: 'Assigned',
    owner: 'Facilities',
    due: 'Tomorrow',
  },
  {
    id: 'WO-783',
    title: 'Lobby lighting calibration',
    property: 'Distrito Central Lofts',
    priority: 'Low',
    status: 'Open',
    owner: 'Internal',
    due: 'Friday',
  },
  {
    id: 'WO-784',
    title: 'HVAC preventive service',
    property: 'Loma Norte Residences',
    priority: 'Medium',
    status: 'Done',
    owner: 'Vendor team',
    due: 'Closed',
  },
]

const revenueTrend = [
  { month: 'Jan', revenue: 518000, occupancy: 82 },
  { month: 'Feb', revenue: 542000, occupancy: 84 },
  { month: 'Mar', revenue: 565000, occupancy: 86 },
  { month: 'Apr', revenue: 611000, occupancy: 89 },
  { month: 'May', revenue: 628000, occupancy: 91 },
  { month: 'Jun', revenue: 642800, occupancy: 88 },
]

const channelData = [
  { source: 'Portal', leads: 38 },
  { source: 'Referral', leads: 24 },
  { source: 'Broker', leads: 18 },
  { source: 'Walk-in', leads: 11 },
]

const navItems = [
  { id: 'overview' as const, label: 'Overview', icon: Home },
  { id: 'properties' as const, label: 'Properties', icon: Building2 },
  { id: 'applications' as const, label: 'Applications', icon: ClipboardCheck },
  { id: 'maintenance' as const, label: 'Maintenance', icon: Wrench },
]

const money = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

function App() {
  const [view, setView] = useState<View>('overview')
  const [theme, setTheme] = useState<Theme>('light')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const filteredProperties = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return properties

    return properties.filter((property) =>
      [property.name, property.city, property.type].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
  }, [query])

  const totalRevenue = properties.reduce((sum, item) => sum + item.revenue, 0)
  const averageOccupancy = Math.round(
    properties.reduce((sum, item) => sum + item.occupancy, 0) /
      properties.length,
  )
  const openWorkOrders = workOrders.filter((item) => item.status !== 'Done')
  const activeApplications = applications.filter(
    (item) => item.stage !== 'Approved',
  )

  return (
    <main className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Building2 size={22} aria-hidden="true" />
          </div>
          <div>
            <strong>PropertyOps</strong>
            <span>Portfolio command center</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Workspace">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                className={view === item.id ? 'nav-item active' : 'nav-item'}
                key={item.id}
                onClick={() => {
                  setView(item.id)
                  setMenuOpen(false)
                }}
                type="button"
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-note">
          <Sparkles size={18} aria-hidden="true" />
          <p>Mock SaaS dashboard built with React, TypeScript, Recharts, and production-style UI patterns.</p>
        </div>
      </aside>

      {menuOpen ? (
        <button
          aria-label="Close navigation"
          className="scrim"
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      ) : null}

      <section className="workspace">
        <header className="topbar">
          <button
            aria-label="Open navigation"
            className="icon-button mobile-only"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>{navItems.find((item) => item.id === view)?.label}</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label="Search properties"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search portfolio"
                value={query}
              />
            </label>
            <button
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="icon-button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              type="button"
            >
              {theme === 'light' ? (
                <Moon size={19} aria-hidden="true" />
              ) : (
                <Sun size={19} aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {view === 'overview' ? (
          <Overview
            activeApplications={activeApplications.length}
            averageOccupancy={averageOccupancy}
            openWorkOrders={openWorkOrders.length}
            totalRevenue={totalRevenue}
          />
        ) : null}

        {view === 'properties' ? (
          <PropertiesView properties={filteredProperties} />
        ) : null}

        {view === 'applications' ? <ApplicationsView /> : null}

        {view === 'maintenance' ? <MaintenanceView /> : null}
      </section>
    </main>
  )
}

function Overview({
  activeApplications,
  averageOccupancy,
  openWorkOrders,
  totalRevenue,
}: {
  activeApplications: number
  averageOccupancy: number
  openWorkOrders: number
  totalRevenue: number
}) {
  return (
    <div className="view-stack">
      <section className="metric-grid" aria-label="Portfolio metrics">
        <MetricCard
          icon={LineChart}
          label="Monthly revenue"
          tone="green"
          value={money.format(totalRevenue)}
          detail="+12.4% vs last month"
        />
        <MetricCard
          icon={Users}
          label="Average occupancy"
          tone="blue"
          value={`${averageOccupancy}%`}
          detail="Across 85 active units"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Active applications"
          tone="violet"
          value={String(activeApplications)}
          detail="2 ready for final review"
        />
        <MetricCard
          icon={Wrench}
          label="Open work orders"
          tone="orange"
          value={String(openWorkOrders)}
          detail="1 high priority today"
        />
      </section>

      <section className="overview-grid">
        <div className="panel wide">
          <PanelHeader
            icon={LineChart}
            label="Revenue and occupancy"
            value="6 month trend"
          />
          <div className="chart-frame">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f9f6e" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#0f9f6e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => money.format(Number(value))} />
                <Area
                  dataKey="revenue"
                  fill="url(#revenue)"
                  isAnimationActive={false}
                  stroke="#0f9f6e"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <PanelHeader icon={Users} label="Lead sources" value="This month" />
          <div className="chart-frame compact">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="source" tickLine={false} />
                <YAxis width={30} />
                <Tooltip />
                <Bar
                  dataKey="leads"
                  fill="#2f6fed"
                  isAnimationActive={false}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="split-grid">
        <div className="panel">
          <PanelHeader
            icon={ShieldCheck}
            label="Compliance queue"
            value="Risk review"
          />
          <div className="timeline-list">
            {applications.slice(0, 3).map((item) => (
              <div className="timeline-item" key={item.id}>
                <span className="status-dot" />
                <div>
                  <strong>{item.applicant}</strong>
                  <p>
                    {item.stage} for {item.property}
                  </p>
                </div>
                <span className="score">{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            icon={TimerReset}
            label="Maintenance SLA"
            value="Next 72 hours"
          />
          <div className="timeline-list">
            {workOrders.slice(0, 3).map((item) => (
              <div className="timeline-item" key={item.id}>
                <span className={`priority-dot ${item.priority.toLowerCase()}`} />
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.property} - {item.due}
                  </p>
                </div>
                <span className="pill">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function PropertiesView({ properties }: { properties: Property[] }) {
  return (
    <div className="view-stack">
      <section className="property-grid">
        {properties.map((property) => (
          <article className="property-card" key={property.id}>
            <img alt="" src={property.image} />
            <div className="property-body">
              <div>
                <p className="eyebrow">{property.city}</p>
                <h2>{property.name}</h2>
              </div>
              <span className={`status-badge ${property.status.toLowerCase()}`}>
                {property.status}
              </span>
              <div className="property-stats">
                <Stat label="Units" value={property.units} />
                <Stat label="Occupancy" value={`${property.occupancy}%`} />
                <Stat label="Revenue" value={money.format(property.revenue)} />
                <Stat label="Late" value={property.delinquent} />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

function ApplicationsView() {
  const stages: Application['stage'][] = [
    'Lead',
    'Documents',
    'KYC',
    'Review',
    'Approved',
  ]

  return (
    <div className="view-stack">
      <section className="pipeline">
        {stages.map((stage) => (
          <div className="stage-column" key={stage}>
            <div className="stage-header">
              <strong>{stage}</strong>
              <span>
                {applications.filter((item) => item.stage === stage).length}
              </span>
            </div>
            {applications
              .filter((item) => item.stage === stage)
              .map((application) => (
                <article className="application-card" key={application.id}>
                  <div className="card-row">
                    <strong>{application.applicant}</strong>
                    <span className="pill">{application.id}</span>
                  </div>
                  <p>{application.property}</p>
                  <div className="card-row">
                    <span>{money.format(application.rent)}</span>
                    <span className="score">{application.score}</span>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${application.score}%` }} />
                  </div>
                </article>
              ))}
          </div>
        ))}
      </section>
    </div>
  )
}

function MaintenanceView() {
  return (
    <div className="view-stack">
      <section className="panel table-panel">
        <PanelHeader icon={Wrench} label="Work orders" value="Live queue" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Request</th>
                <th>Property</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.property}</td>
                  <td>{item.owner}</td>
                  <td>
                    <span className={`priority-label ${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.status}</td>
                  <td>{item.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="maintenance-grid">
        <ActionPanel
          icon={AlertTriangle}
          label="Risk signals"
          value="1 high priority ticket needs same-day vendor confirmation."
        />
        <ActionPanel
          icon={FileText}
          label="Evidence"
          value="3 service reports attached to closed and in-progress tickets."
        />
        <ActionPanel
          icon={CheckCircle2}
          label="SLA health"
          value="91% of maintenance tickets closed inside target window."
        />
      </section>
    </div>
  )
}

function MetricCard({
  detail,
  icon: Icon,
  label,
  tone,
  value,
}: {
  detail: string
  icon: typeof LineChart
  label: string
  tone: string
  value: string
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon">
        <Icon size={19} aria-hidden="true" />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}

function PanelHeader({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof LineChart
  label: string
  value: string
}) {
  return (
    <div className="panel-header">
      <div>
        <Icon size={18} aria-hidden="true" />
        <strong>{label}</strong>
      </div>
      <span>{value}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ActionPanel({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertTriangle
  label: string
  value: string
}) {
  return (
    <article className="action-panel">
      <Icon size={20} aria-hidden="true" />
      <strong>{label}</strong>
      <p>{value}</p>
      <button type="button">
        <span>Review</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </article>
  )
}

export default App
