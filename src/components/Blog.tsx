import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category?: string;
  imageUrl?: string;
  links?: Array<{ title: string; url: string }>;
  contentBlocks?: Array<{
    type: 'text' | 'image';
    content: string;
    imageWidth?: string;
    imageAlign?: 'left' | 'center' | 'right';
  }>;
}

interface BlogProps {
  isEditorMode: boolean;
}

// Convert markdown-style links [text](url) to HTML links
function convertMarkdownLinks(text: string): string {
  return text
    .split('\n')
    .map(line => {
      // Convert markdown links to HTML
      const withLinks = line.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
      );
      return withLinks;
    })
    .join('<br/>');
}

export function Blog({ isEditorMode }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const saved = localStorage.getItem('blogPosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      // Default sample posts for PE/Consulting professional
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Art of Value Creation in Private Equity',
          date: '2025-11-29',
          category: 'Private Equity',
          excerpt: 'Exploring operational improvements and strategic initiatives that drive portfolio company performance beyond financial engineering.',
          content: 'Value creation in private equity has evolved significantly over the past decade. While leverage and multiple arbitrage remain important, the focus has shifted toward operational improvements, strategic repositioning, and organic growth initiatives. This post explores the frameworks and methodologies that successful PE firms use to transform their portfolio companies.'
        },
        {
          id: '2',
          title: 'Strategic Frameworks for Complex Problem Solving',
          date: '2025-11-25',
          category: 'Consulting',
          excerpt: 'A deep dive into structured problem-solving approaches used in top-tier strategy consulting engagements.',
          content: 'Effective problem solving in consulting requires a combination of structured thinking, hypothesis-driven analysis, and pragmatic execution. This article breaks down the key frameworks—from issue trees to 80/20 analysis—that enable consultants to tackle ambiguous, multi-dimensional business challenges with clarity and confidence.'
        },
        {
          id: '3',
          title: 'Market Entry Strategy: A Case Study Approach',
          date: '2025-11-20',
          category: 'Strategy',
          excerpt: 'Analyzing critical success factors for entering new markets through the lens of recent case examples.',
          content: 'Market entry decisions represent some of the highest-stakes strategic choices companies face. Drawing from recent consulting projects and case studies, this post examines the analytical frameworks, market assessment methodologies, and execution considerations that determine success or failure in new market ventures.'
        }
      ];
      setPosts(defaultPosts);
      localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
    }
  };

  return (
    <div>
      {selectedPost ? (
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group text-[15px]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to insights
          </button>
          
          {selectedPost.category && (
            <span className="inline-block px-3 py-1.5 bg-secondary/80 text-muted-foreground rounded-full mb-6 text-[13px]">
              {selectedPost.category}
            </span>
          )}
          
          <h1 className="text-foreground mb-6 max-w-3xl text-[2.75rem] leading-[1.15]">{selectedPost.title}</h1>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-12 text-[14px]">
            <Calendar className="w-4 h-4" />
            <time>{selectedPost.date}</time>
          </div>
          
          {selectedPost.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {selectedPost.contentBlocks && selectedPost.contentBlocks.length > 0 ? (
              <div className="space-y-6">
                {selectedPost.contentBlocks.map((block, index) => (
                  <div key={index}>
                    {block.type === 'text' ? (
                      <div 
                        className="text-foreground/80 leading-relaxed text-[17px]"
                        dangerouslySetInnerHTML={{ 
                          __html: convertMarkdownLinks(block.content) 
                        }}
                      />
                    ) : (
                      <div 
                        className={`rounded-2xl overflow-hidden my-8 flex ${
                          block.imageAlign === 'left' ? 'justify-start' :
                          block.imageAlign === 'right' ? 'justify-end' :
                          'justify-center'
                        }`}
                      >
                        <img
                          src={block.content}
                          alt={`Content image ${index + 1}`}
                          className="h-auto"
                          style={{ 
                            width: block.imageWidth || '100%',
                            maxWidth: '100%'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-foreground/80 leading-relaxed text-[17px] whitespace-pre-line">
                {selectedPost.content}
              </div>
            )}
          </div>
          
          {selectedPost.links && selectedPost.links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-foreground mb-4">Related Links</h3>
              <div className="space-y-3">
                {selectedPost.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      ) : (
        <div>
          <div className="mb-12 max-w-3xl">
            <h2 className="text-foreground mb-3 text-[2.25rem] leading-tight">Insights & Analysis</h2>
            <p className="text-muted-foreground text-[16px] leading-relaxed">
              Perspectives on private equity, strategic consulting, and value creation—informed by 
              experience across deal execution, operational transformation, and market analysis.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-2xl">
              <p className="text-muted-foreground">
                No insights published yet. {isEditorMode && 'Enter editor mode to create your first post.'}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer pb-12 border-b border-border/40 last:border-0 hover:border-border transition-colors"
                >
                  <div className="flex flex-col gap-4 mb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {post.category && (
                          <span className="inline-block px-3 py-1.5 bg-secondary/60 text-muted-foreground rounded-full mb-4 text-[13px]">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <time className="text-muted-foreground text-[14px] whitespace-nowrap mt-1">{post.date}</time>
                    </div>
                    <h3 className="text-foreground group-hover:text-muted-foreground transition-colors text-[1.75rem] leading-tight">
                      {post.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-foreground group-hover:gap-3 transition-all text-[15px]">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
