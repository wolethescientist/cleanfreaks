export const PRICE_PER_RUG = 15000;

export const RUG_SERVICES = {
  'on-site': {
    id: 'on-site',
    title: 'On-Site Steam Cleaning',
    subtitle: 'Professional deep clean right in your home',
    badge: 'Same-Day Service',
    description: 'Our specialist technicians bring high-powered steam extraction equipment straight to your doorstep. Perfect when you need quick, convenient turnaround without rugs leaving your premises.',
    highlights: [
      'Cleaned on-site at your home or office',
      'High-speed extraction for quick 2–4 hr drying',
      'Pre-treatment for pet stains and stubborn spills',
      'Protective underlays safe for all floorings',
    ],
    duration: '1–2 hour cleaning visit',
  },
  'pickup': {
    id: 'pickup',
    title: 'Facility Deep Wash & Delivery',
    subtitle: 'Intensive immersion wash at our facility',
    badge: 'Recommended for Deep Grime',
    description: 'We pick up your rugs directly from your home, transport them to our industrial wash facility for full immersion cleaning, centrifuge extraction, and heat-chamber drying, then return them sealed and fresh.',
    highlights: [
      'Free doorstep pickup and return delivery',
      'Full deep-water bath & centrifuge spin drying',
      'Total allergen, dust mite, and odor eradication',
      'Wrapped in protective, sanitized packaging',
    ],
    duration: 'Delivered fresh within 48–72 hours',
  },
} as const;

export const RUG_INCLUDES = [
  'Multi-stage deep extraction shampooing',
  'Eco-friendly, fiber-safe and color-fast cleaning agents',
  'Targeted spot treatment for tough stains & blemishes',
  'Anti-bacterial sanitization and deodorizing treatment',
  'Safe for Persian, Wool, Shag, Turkish, Sisal & Synthetic rugs',
];

export const RUG_FAQ = [
  {
    question: 'How long does drying take?',
    answer: 'For On-Site cleaning, our high-power extraction leaves rugs only damp; they typically dry fully within 2 to 4 hours. For Pickup & Delivery, your rugs are dried in our specialized heated chambers and delivered 100% dry and sealed.',
  },
  {
    question: 'Will cleaning damage delicate fibers or colors?',
    answer: 'Not at all. We inspect every rug first to test fiber composition and dye stability, applying pH-balanced formulas customized for wool, synthetic, silk, or shag textures.',
  },
  {
    question: 'How does pickup and delivery work?',
    answer: 'Select your preferred pickup window. Our team will collect the rugs from your address, log them with a unique tag, and schedule a delivery date within 48–72 hours.',
  },
];
