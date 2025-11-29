import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
  type?: string;
  showButton?: boolean;
  buttonText?: string;
}

interface PortfolioProps {
  isEditorMode: boolean;
}

export function Portfolio({ isEditorMode }: PortfolioProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = () => {
    const saved = localStorage.getItem('portfolioItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Default sample portfolio items for PE/Consulting professional
      const defaultItems: PortfolioItem[] = [
        {
          id: '1',
          title: 'Multi-Site Healthcare Rollup',
          type: 'Private Equity',
          description: 'Led buy-and-build strategy for regional healthcare provider, identifying 12 acquisition targets and developing integration playbook that delivered 23% EBITDA margin improvement.',
          imageUrl: 'https://images.unsplash.com/photo-1643880364831-c7ff006e38d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJ1c2luZXNzJTIwZGFya3xlbnwxfHx8fDE3NjQzOTk3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          tags: ['Healthcare', 'M&A', 'Value Creation']
        },
        {
          id: '2',
          title: 'SaaS Revenue Optimization',
          type: 'Consulting',
          description: 'Redesigned pricing architecture and go-to-market strategy for B2B SaaS platform, resulting in 40% increase in average contract value and improved unit economics.',
          imageUrl: 'https://images.unsplash.com/photo-1762427354051-a9bdb181ae3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NjQzNjIxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
          tags: ['SaaS', 'Pricing', 'Growth Strategy']
        },
        {
          id: '3',
          title: 'Industrial Manufacturing Turnaround',
          type: 'Private Equity',
          description: 'Executed operational transformation of underperforming portfolio company through supply chain optimization, SKU rationalization, and manufacturing footprint consolidation.',
          imageUrl: 'https://images.unsplash.com/photo-1665043548178-8e606eca11eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBtaW5pbWFsfGVufDF8fHx8MTc2NDM3ODM1OXww&ixlib=rb-4.1.0&q=80&w=1080',
          tags: ['Operations', 'Turnaround', 'Manufacturing']
        },
        {
          id: '4',
          title: 'Tech Sector Market Entry',
          type: 'Consulting',
          description: 'Developed comprehensive market entry strategy for Fortune 500 client expanding into adjacent technology vertical, including competitive analysis, customer segmentation, and channel strategy.',
          imageUrl: 'https://images.unsplash.com/photo-1761941210086-d44de26a4efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjQzOTk3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
          tags: ['Strategy', 'Market Entry', 'Technology']
        }
      ];
      setItems(defaultItems);
      localStorage.setItem('portfolioItems', JSON.stringify(defaultItems));
    }
  };

  return (
    <div>
      <div className="mb-12 max-w-3xl">
        <h2 className="text-foreground mb-3 text-[2.25rem] leading-tight">Selected Work</h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed">
          A collection of strategic engagements and value creation initiatives across 
          private equity investments, consulting projects, and operational transformations.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-2xl">
          <p className="text-muted-foreground">
            No work samples yet. {isEditorMode && 'Enter editor mode to add your first project.'}
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="relative aspect-[16/10] bg-muted rounded-2xl overflow-hidden mb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="space-y-4">
                {item.type && (
                  <span className="inline-block px-3 py-1.5 bg-secondary/60 text-muted-foreground rounded-full text-[13px]">
                    {item.type}
                  </span>
                )}
                
                <div>
                  <h3 className="text-foreground mb-3 group-hover:text-muted-foreground transition-colors text-[1.5rem] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-secondary/40 text-muted-foreground rounded-lg border border-border/50 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {item.showButton && item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
                  >
                    {item.buttonText || 'View Project'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
