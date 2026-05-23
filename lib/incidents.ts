import type { ProductData } from './types'

export interface Incident {
  id?: string
  product_slug: string
  title: string
  description: string
  source: string
  source_url: string
  category: string
  severity: 'info' | 'warning' | 'critical' | 'urgent'
  metadata: Record<string, unknown>
  occurred_at: string
}

const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString()

type CategoryIncidents = Record<string, Incident[]>

export const categoryIncidents: CategoryIncidents = {
  regulatory: [
    {
      product_slug: '__product__', title: 'FDA Class I Recall: Contaminated Heart Valve Device',
      description: 'The FDA has issued a Class I recall for MedTech CardioValve Pro series due to potential contamination risks. Distribution dates: Jan 2026 - Apr 2026. Lot numbers: CV-2026-001 through CV-2026-047.',
      source: 'FDA Enforcement Reports', source_url: 'https://www.fda.gov/enforcement', category: 'recall',
      severity: 'urgent', metadata: { recall_class: 'I', lot_numbers: ['CV-2026-001', 'CV-2026-047'], affected_units: 12400 },
      occurred_at: hoursAgo(2),
    },
    {
      product_slug: '__product__', title: 'EPA Violation Notice: Industrial Discharge Exceeds Permit Limits',
      description: 'ChemCorp Midwest facility cited for exceeding permitted discharge levels of volatile organic compounds by 340%. Notice of Violation issued under Clean Water Act Section 309.',
      source: 'EPA ECHO Database', source_url: 'https://echo.epa.gov', category: 'violation',
      severity: 'critical', metadata: { facility_id: 'EPA-MW-0043', compound: 'VOCs', exceedance_pct: 340 },
      occurred_at: hoursAgo(5),
    },
    {
      product_slug: '__product__', title: 'OSHA Citation: Repeat Violation at Manufacturing Plant',
      description: 'OSHA issued repeat citation to MetalWorks Inc. for failure to implement lockout/tagout procedures. Proposed penalty: $142,800. This is the third citation for the same violation type since 2024.',
      source: 'OSHA Inspection Database', source_url: 'https://www.osha.gov/inspection', category: 'citation',
      severity: 'warning', metadata: { citation_type: 'repeat', penalty: 142800, sic_code: '3321' },
      occurred_at: hoursAgo(8),
    },
    {
      product_slug: '__product__', title: 'SEC Filing Alert: Director Martinez Files Form 4 — $4.2M Stock Sale',
      description: 'Director Elena Martinez filed SEC Form 4 disclosing sale of 84,000 shares of common stock at $50.12/share. Total transaction value: $4,210,080. Sale occurred 48 hours before Q3 earnings miss announcement.',
      source: 'SEC EDGAR', source_url: 'https://www.sec.gov/cgi-bin/browse-edgar', category: 'insider_trading',
      severity: 'critical', metadata: { filing_type: 'Form 4', shares: 84000, price: 50.12, officer: 'Elena Martinez' },
      occurred_at: daysAgo(1),
    },
    {
      product_slug: '__product__', title: 'Federal Court Filing: $890M Patent Infringement Suit Filed',
      description: 'TechGiant Corp filed patent infringement lawsuit against DataStream Inc in Eastern District of Texas. Case No. 2:26-cv-00456. Claims cover proprietary data processing algorithms used in enterprise analytics.',
      source: 'PACER/Court Records', source_url: 'https://www.pacer.gov', category: 'litigation',
      severity: 'info', metadata: { case_number: '2:26-cv-00456', court: 'E.D. Texas', amount: 890000000 },
      occurred_at: daysAgo(2),
    },
    {
      product_slug: '__product__', title: 'HHS OIG Exclusion: Healthcare Provider Added to Exclusion List',
      description: 'Dr. Raymond Chen added to HHS OIG Exclusion list for conviction of healthcare fraud. All federal healthcare programs must immediately cease payments.',
      source: 'HHS OIG LEIE', source_url: 'https://exclusions.oig.hhs.gov', category: 'exclusion',
      severity: 'critical', metadata: { exclusion_type: 'conviction', program: 'Medicare/Medicaid' },
      occurred_at: daysAgo(3),
    },
    {
      product_slug: '__product__', title: 'New Regulation Proposed: CCPA Amendment Expands Data Broker Requirements',
      description: 'California Privacy Protection Agency published proposed amendments to CCPA regulations expanding data broker registration requirements and audit obligations. Public comment period open through July 15, 2026.',
      source: 'California Regulatory Notice', source_url: 'https://oag.ca.gov/privacy', category: 'regulation_change',
      severity: 'info', metadata: { jurisdiction: 'California', effective_date: '2026-09-01', comment_deadline: '2026-07-15' },
      occurred_at: daysAgo(4),
    },
  ],
  healthcare: [
    {
      product_slug: '__product__', title: 'Clinical Trial Phase III Suspended: Adverse Event Reports Exceed Threshold',
      description: 'BioPharm Therapeutics suspended Phase III trial for BTX-789 following 12 serious adverse event reports in the treatment arm. DSMB recommends immediate enrollment hold pending safety review.',
      source: 'ClinicalTrials.gov', source_url: 'https://clinicaltrials.gov', category: 'clinical_trial',
      severity: 'urgent', metadata: { trial_id: 'NCT05678901', phase: 'III', adverse_events: 12 },
      occurred_at: hoursAgo(1),
    },
    {
      product_slug: '__product__', title: 'Physician Sanction Update: Dr. Sarah Williams Board Action',
      description: 'State Medical Board of California issued public reprimand against Dr. Sarah Williams (License #MD-2019-44521) for failure to maintain adequate medical records. Effective immediately.',
      source: 'NPDB/State Licensing Board', source_url: 'https://www.npdb.hrsa.gov', category: 'physician_sanction',
      severity: 'warning', metadata: { license: 'MD-2019-44521', state: 'California', action_type: 'public_reprimand' },
      occurred_at: hoursAgo(6),
    },
    {
      product_slug: '__product__', title: 'FDA 510(k) Clearance: New AI-Powered Diagnostic Device Approved',
      description: 'MedAI Diagnostics received 510(k) clearance for NeuralScan Pro, an AI-powered diagnostic imaging device for early detection of lung cancer. Clearance number K261234.',
      source: 'FDA 510(k) Database', source_url: 'https://www.fda.gov/devices', category: 'device_approval',
      severity: 'info', metadata: { clearance_number: 'K261234', device_class: 'II' },
      occurred_at: daysAgo(1),
    },
  ],
  financial: [
    {
      product_slug: '__product__', title: 'Bankruptcy Filing: MegaCorp Holdings Files Chapter 11',
      description: 'MegaCorp Holdings Inc. filed voluntary Chapter 11 petition in Delaware Bankruptcy Court. Listed assets: $2.3B, liabilities: $4.7B. DIP financing secured from JPMorgan for $500M.',
      source: 'PACER/SEC Filings', source_url: 'https://www.pacer.gov', category: 'bankruptcy',
      severity: 'critical', metadata: { case_number: '26-bk-12345', court: 'D. Delaware', assets: 2300000000, liabilities: 4700000000 },
      occurred_at: hoursAgo(3),
    },
    {
      product_slug: '__product__', title: 'SEC Investigation: Insider Trading Alert on QRS Technologies',
      description: 'SEC Division of Enforcement opened formal investigation into potential insider trading at QRS Technologies. Activity detected in options market preceding merger announcement with AlphaNet Corp.',
      source: 'SEC EDGAR', source_url: 'https://www.sec.gov', category: 'investigation',
      severity: 'urgent', metadata: { investigation_type: 'insider_trading', ticker: 'QRSI' },
      occurred_at: hoursAgo(7),
    },
    {
      product_slug: '__product__', title: 'UCC Filing Alert: New Security Interest Filed Against Omega Industries',
      description: 'UCC-1 financing statement filed by First National Bank against Omega Industries Inc. covering all inventory, equipment, and receivables. Filing number 2026-UCC-87654321.',
      source: 'State UCC Filing Database', source_url: 'https://www.sos.state', category: 'ucc_filing',
      severity: 'info', metadata: { filing_number: '2026-UCC-87654321', filer: 'First National Bank' },
      occurred_at: daysAgo(2),
    },
  ],
  'real estate': [
    {
      product_slug: '__product__', title: 'Zoning Change Proposed: Mixed-Use Development Near Downtown Corridor',
      description: 'City Planning Commission published notice of proposed zoning change from C-2 Commercial to MU-3 Mixed Use for 15-acre parcel at intersection of Main St and 5th Ave. Public hearing scheduled for June 15, 2026.',
      source: 'City Planning Department', source_url: 'https://cityplanning.gov', category: 'zoning_change',
      severity: 'info', metadata: { parcel_id: 'APO-2026-0087', area_acres: 15, hearing_date: '2026-06-15' },
      occurred_at: daysAgo(1),
    },
    {
      product_slug: '__product__', title: 'Tax Lien Auction: 47 Properties Listed for June Auction',
      description: 'County Treasurer published list of 47 tax-delinquent properties scheduled for auction. Total assessed value: $8.2M. Minimum bids start at 60% of assessed value.',
      source: 'County Tax Collector', source_url: 'https://taxauction.gov', category: 'tax_lien',
      severity: 'warning', metadata: { properties: 47, total_value: 8200000, min_bid_pct: 60 },
      occurred_at: daysAgo(3),
    },
  ],
  'lead gen': [
    {
      product_slug: '__product__', title: 'New Business License Filing: 1,247 New Businesses Registered This Week',
      description: 'Weekly summary of new business entity filings across target metro areas. Top sectors: Food Services (312), Healthcare (241), Technology (198), Construction (167), Professional Services (149).',
      source: 'Secretary of State Filings', source_url: 'https://sos.state.gov', category: 'new_business',
      severity: 'info', metadata: { total_filings: 1247, top_sectors: ['Food Services', 'Healthcare', 'Technology'] },
      occurred_at: hoursAgo(4),
    },
  ],
  default: [
    {
      product_slug: '__product__', title: 'New Regulatory Update Published by Federal Agency',
      description: 'Federal register published proposed rule changes affecting your compliance requirements. Public comment period open. Key changes include updated reporting thresholds and new data submission formats.',
      source: 'Federal Register', source_url: 'https://www.federalregister.gov', category: 'regulatory_update',
      severity: 'info', metadata: { agency: 'Federal', notice_type: 'proposed_rule' },
      occurred_at: hoursAgo(3),
    },
    {
      product_slug: '__product__', title: 'Market Intelligence: Key Competitor Announces Product Pivot',
      description: 'Major competitor in your space announced strategic shift to AI-powered automation. This may impact pricing dynamics and market positioning. Full analysis available on dashboard.',
      source: 'Industry Intelligence Feed', source_url: 'https://industry.intel', category: 'market_intel',
      severity: 'warning', metadata: { competitor: 'Industry Leader', impact: 'medium' },
      occurred_at: hoursAgo(6),
    },
    {
      product_slug: '__product__', title: 'Data Source Updated: New Records Available in Primary Database',
      description: 'Feed synchronization completed. 2,847 new records detected across monitored sources. Updated records include new entity registrations, status changes, and compliance updates.',
      source: 'Internal Data Engine', source_url: 'https://app.grea.site/dashboard', category: 'data_update',
      severity: 'info', metadata: { new_records: 2847, sources_updated: 14 },
      occurred_at: daysAgo(1),
    },
  ],
}

export function getIncidentsForProduct(product: ProductData): Incident[] {
  const category = Object.keys(categoryIncidents).find(k =>
    product.category.toLowerCase().includes(k)
  )
  const incidents = category ? categoryIncidents[category] : categoryIncidents.default
  return incidents.map(inc => ({ ...inc, product_slug: product.slug }))
}

export const incidentCategories = [
  'recall', 'violation', 'citation', 'insider_trading', 'litigation', 'exclusion',
  'regulation_change', 'clinical_trial', 'physician_sanction', 'device_approval',
  'bankruptcy', 'investigation', 'ucc_filing', 'zoning_change', 'tax_lien',
  'new_business', 'regulatory_update', 'market_intel', 'data_update',
  'compliance', 'enforcement', 'permit', 'report', 'alert',
]