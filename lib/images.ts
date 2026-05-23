const UNSPLASH_BASE = 'https://images.unsplash.com'

const categoryImages: Record<string, { hero: string; dashboard: string; features: string[]; testimonials: string[] }> = {
  regulatory: {
    hero: 'photo-1450101499163-c8848c66ca85?w=1200&q=80',
    dashboard: 'photo-1551288049-bebda4e38f71?w=1200&q=80',
    features: [
      'photo-1507925921958-8a62f3d1a50d?w=800&q=80',
      'photo-1450101499163-c8848c66ca85?w=800&q=80',
      'photo-1554224155-6726b3ff858f?w=800&q=80',
    ],
    testimonials: [
      'photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'photo-1438761681033-6461ffad8d80?w=100&q=80',
      'photo-1472099645785-5658abf4ff4e?w=100&q=80',
    ],
  },
  'lead gen': {
    hero: 'photo-1553729459-afe8f2e2c8b2?w=1200&q=80',
    dashboard: 'photo-1460925895917-afdab827c52f?w=1200&q=80',
    features: [
      'photo-1553729459-afe8f2e2c8b2?w=800&q=80',
      'photo-1460925895917-afdab827c52f?w=800&q=80',
      'photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    testimonials: [
      'photo-1500648767791-00dcc994a43e?w=100&q=80',
      'photo-1494790108377-be9c29b29330?w=100&q=80',
      'photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    ],
  },
  financial: {
    hero: 'photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    dashboard: 'photo-1551288049-bebda4e38f71?w=1200&q=80',
    features: [
      'photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      'photo-1554224155-6726b3ff858f?w=800&q=80',
      'photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    testimonials: [
      'photo-1472099645785-5658abf4ff4e?w=100&q=80',
      'photo-1500648767791-00dcc994a43e?w=100&q=80',
      'photo-1438761681033-6461ffad8d80?w=100&q=80',
    ],
  },
  healthcare: {
    hero: 'photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    dashboard: 'photo-1551288049-bebda4e38f71?w=1200&q=80',
    features: [
      'photo-1576091160399-112ba8d25d1d?w=800&q=80',
      'photo-1554224155-6726b3ff858f?w=800&q=80',
      'photo-1507925921958-8a62f3d1a50d?w=800&q=80',
    ],
    testimonials: [
      'photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'photo-1494790108377-be9c29b29330?w=100&q=80',
      'photo-1472099645785-5658abf4ff4e?w=100&q=80',
    ],
  },
  'hr/workforce': {
    hero: 'photo-1521791136064-7986c29209f1?w=1200&q=80',
    dashboard: 'photo-1553877522-43269d4ea984?w=1200&q=80',
    features: [
      'photo-1521791136064-7986c29209f1?w=800&q=80',
      'photo-1553877522-43269d4ea984?w=800&q=80',
      'photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    testimonials: [
      'photo-1500648767791-00dcc994a43e?w=100&q=80',
      'photo-1438761681033-6461ffad8d80?w=100&q=80',
      'photo-1472099645785-5658abf4ff4e?w=100&q=80',
    ],
  },
  'real estate': {
    hero: 'photo-1560518883-ce09059eeffa?w=1200&q=80',
    dashboard: 'photo-1551288049-bebda4e38f71?w=1200&q=80',
    features: [
      'photo-1560518883-ce09059eeffa?w=800&q=80',
      'photo-1554224155-6726b3ff858f?w=800&q=80',
      'photo-1460925895917-afdab827c52f?w=800&q=80',
    ],
    testimonials: [
      'photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'photo-1472099645785-5658abf4ff4e?w=100&q=80',
      'photo-1500648767791-00dcc994a43e?w=100&q=80',
    ],
  },
}

const defaultImages = {
  hero: 'photo-1559136555-9303baea8ebd?w=1200&q=80',
  dashboard: 'photo-1551288049-bebda4e38f71?w=1200&q=80',
  features: [
    'photo-1559136555-9303baea8ebd?w=800&q=80',
    'photo-1551288049-bebda4e38f71?w=800&q=80',
    'photo-1460925895917-afdab827c52f?w=800&q=80',
  ],
  testimonials: [
    'photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    'photo-1438761681033-6461ffad8d80?w=100&q=80',
    'photo-1472099645785-5658abf4ff4e?w=100&q=80',
  ],
}

export function getImageUrl(category: string, type: keyof typeof defaultImages, index = 0): string {
  const catKey = Object.keys(categoryImages).find(k => category.toLowerCase().includes(k)) || 'default'
  const imgSet = catKey !== 'default' ? categoryImages[catKey] : defaultImages
  const id = type === 'features'
    ? imgSet.features[index % imgSet.features.length]
    : type === 'testimonials'
    ? imgSet.testimonials[index % imgSet.testimonials.length]
    : imgSet[type]
  return `${UNSPLASH_BASE}/${id}`
}

export function getAltText(category: string, type: string, productName: string, index?: number): string {
  const key = `${type}${index ?? ''}`
  const altMap: Record<string, string> = {
    hero: `${productName} dashboard showing real-time ${category} intelligence data and analytics`,
    dashboard: `${productName} analytics dashboard with charts and monitoring interface`,
    feature0: `${productName} real-time monitoring and alert configuration interface`,
    feature1: `${productName} data analysis and reporting dashboard`,
    feature2: `${productName} integration and API configuration screen`,
    testimonial0: `${productName} customer portrait - happy client`,
    testimonial1: `${productName} satisfied customer testimonial`,
    testimonial2: `${productName} client success story`,
  }
  return altMap[key] || `${productName} ${type} screenshot`
}
