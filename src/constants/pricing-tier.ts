export interface Tier {
  name: string;
  id: "sweet_serenade" | "eternal_love" | "cupids_arrow";
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  buttonText: string;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: 'Sweet Serenade',
    id: 'sweet_serenade',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: 'Ideal for individuals who want to get started with simple design tasks.',
    features: [
      '5 poem generations per day',
      'Access to 5 romantic themes',
      'Basic poem editing tools',
      'Email support'
    ],
    featured: false,
    buttonText: 'Start Creating',
    priceId: { month: 'pri_01j9pcz9d9chr2z537fg2n9xy3', year: 'pri_01j9psh4mj2w55rr664kde6a9n' },
  },
  {
    name: 'Eternal Love',
    id: 'eternal_love',
    icon: '/assets/icons/price-tiers/basic-icon.svg',
    description: 'Enhanced design tools for scaling teams who need more flexibility.',
    features: [
      'Unlimited poem generations',
      'Access to 10 romantic themes',
      'Advanced poem editing tools',
      'Priority support'
    ],
    featured: true,
    buttonText: 'Spread The Love',
    priceId: { month: 'pri_01j9prtphe85kntnwprpbyzwnc', year: 'pri_01j9psjd8h1basgggehwn8sz7f' },
  },
  {
    name: "Cupid's Arrow",
    id: 'cupids_arrow',
    icon: '/assets/icons/price-tiers/pro-icon.svg',
    description: 'Powerful tools designed for extensive collaboration and customization.',
    features: [
      'All Eternal Love features',
      'Access to all 15+ romantic themes',
      'Exclusive seasonal templates',
      'Personalized theme creation',
      '24/7 dedicated support'
    ],
    featured: false,
    buttonText: 'Shoot Your Shot',
    priceId: { month: 'pri_01j9prygy06k7fj766snjt2vrw', year: 'pri_01j9psfmak0sdhgxmmf4ng3gmr' },
  },
];
