export const CRM_COLORS = {
  background: '#0c0e17',
  surface: '#11131d',
  surfaceAlt: '#171924',
  surfaceRaised: '#1c1f2b',
  surfaceStrong: '#222532',
  border: '#2b3040',
  borderSoft: '#464752',
  text: '#f0f0fd',
  textMuted: '#aaaab7',
  textSoft: '#737580',
  primary: '#a1faff',
  primaryStrong: '#00e5ee',
  success: '#3fff8b',
  danger: '#ff716c',
  warning: '#ff928c',
} as const;

export const CRM_CURRENCY = 'usd';

export const CRM_PORTFOLIO = [
  { id: 'bitcoin', symbol: 'BTC', units: 8.2, bucket: 'Liquid Assets' },
  { id: 'ethereum', symbol: 'ETH', units: 46.5, bucket: 'Locked Vaults' },
  { id: 'solana', symbol: 'SOL', units: 920, bucket: 'Liquid Assets' },
  { id: 'chainlink', symbol: 'LINK', units: 2500, bucket: 'Opportunistic' },
  { id: 'ripple', symbol: 'XRP', units: 18000, bucket: 'Locked Vaults' },
] as const;

export const CRM_LEADS = [
  {
    id: 'lead-001',
    name: 'Maya Chen',
    company: 'Helix Digital Capital',
    stage: 'Qualified',
    score: 92,
    allocation: '$4.2M',
    focus: 'BTC treasury strategy',
    lastTouch: '2h ago',
  },
  {
    id: 'lead-002',
    name: 'Julian Park',
    company: 'Northstar Ventures',
    stage: 'Proposal',
    score: 88,
    allocation: '$2.1M',
    focus: 'DeFi yield basket',
    lastTouch: '5h ago',
  },
  {
    id: 'lead-003',
    name: 'Amina Rahman',
    company: 'Atlas Family Office',
    stage: 'Hot',
    score: 97,
    allocation: '$7.8M',
    focus: 'ETH + stablecoin hedge',
    lastTouch: '28m ago',
  },
  {
    id: 'lead-004',
    name: 'Luca Moretti',
    company: 'Orchid Advisory',
    stage: 'Nurture',
    score: 74,
    allocation: '$950K',
    focus: 'Layer 1 rotation',
    lastTouch: '1d ago',
  },
] as const;

export const CRM_WATCHLIST = [
  'bitcoin',
  'ethereum',
  'solana',
  'ripple',
  'chainlink',
  'sui',
  'dogecoin',
  'avalanche-2',
] as const;
