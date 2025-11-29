import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Twitter, Briefcase, GraduationCap, Award, Download } from 'lucide-react';

export interface AboutData {
  name: string;
  title: string;
  bio: string;
  email: string;
  profileImage?: string;
  resumeUrl?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  experience?: Array<{
    company: string;
    role: string;
    period: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    period: string;
  }>;
  skills?: string[];
}

interface AboutProps {
  isEditorMode: boolean;
}

export function About({ isEditorMode }: AboutProps) {
  const [data, setData] = useState<AboutData>({
    name: 'Your Name',
    title: 'Consultant | PM | Aspiring PE Analyst',
    bio: 'Strategic professional with experience in management consulting and product leadership, now pursuing opportunities in private equity. Passionate about value creation, operational excellence, and data-driven decision making.\n\nBackground spans strategy development, financial analysis, and cross-functional team leadership across technology, healthcare, and industrial sectors. Proven track record of driving growth initiatives and operational improvements for Fortune 500 clients and high-growth startups.',
    email: 'hello@example.com',
    social: {
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourprofile'
    },
    experience: [
      {
        company: 'Top Strategy Firm',
        role: 'Management Consultant',
        period: '2023 - Present'
      },
      {
        company: 'Tech Startup',
        role: 'Product Manager',
        period: '2021 - 2023'
      }
    ],
    education: [
      {
        institution: 'Top University',
        degree: 'MBA',
        period: '2021'
      },
      {
        institution: 'University',
        degree: 'Bachelor of Science',
        period: '2017'
      }
    ],
    skills: [
      'Financial Modeling',
      'Due Diligence',
      'Strategic Analysis',
      'Valuation',
      'M&A',
      'Operations',
      'Data Analytics',
      'Python'
    ]
  });

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = () => {
    const saved = localStorage.getItem('aboutData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            {/* Profile Image */}
            {data.profileImage && (
              <div className="mb-8">
                <img
                  src={data.profileImage}
                  alt={data.name}
                  className="w-48 h-48 rounded-2xl object-cover border-2 border-border shadow-lg"
                />
              </div>
            )}
            
            <h2 className="text-foreground mb-4 text-[2.25rem] leading-tight">{data.name}</h2>
            <p className="text-muted-foreground text-[16px] mb-8 leading-relaxed">{data.title}</p>
            <div className="space-y-4 text-foreground/80 leading-relaxed whitespace-pre-line text-[16px]">
              {data.bio}
            </div>

            {/* Resume Download Button */}
            {data.resumeUrl && (
              <div className="mt-8">
                <a
                  href={data.resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-foreground text-background rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span className="font-medium">Download Resume</span>
                </a>
              </div>
            )}
          </div>

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-foreground text-[1.375rem]">Experience</h3>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-border pl-6">
                    <h4 className="text-foreground mb-1 text-[1.0625rem]">{exp.role}</h4>
                    <p className="text-muted-foreground mb-1 text-[15px]">{exp.company}</p>
                    <p className="text-muted-foreground/70 text-[14px]">{exp.period}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-foreground text-[1.375rem]">Education</h3>
              </div>
              <div className="space-y-6">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-border pl-6">
                    <h4 className="text-foreground mb-1 text-[1.0625rem]">{edu.degree}</h4>
                    <p className="text-muted-foreground mb-1 text-[15px]">{edu.institution}</p>
                    <p className="text-muted-foreground/70 text-[14px]">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Contact & Skills */}
        <div className="space-y-8">
          {/* Contact */}
          <div className="sticky top-32">
            <h3 className="text-foreground mb-6 text-[1.375rem]">Get in Touch</h3>
            
            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[15px]"
              >
                <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-secondary/70 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{data.email}</span>
              </a>

              {data.social.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[15px]"
                >
                  <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-secondary/70 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>LinkedIn</span>
                </a>
              )}

              {data.social.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[15px]"
                >
                  <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-secondary/70 transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>GitHub</span>
                </a>
              )}

              {data.social.twitter && (
                <a
                  href={data.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[15px]"
                >
                  <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-secondary/70 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <span>Twitter</span>
                </a>
              )}
            </div>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <h4 className="text-foreground text-[1.0625rem]">Core Competencies</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-secondary/60 text-muted-foreground rounded-lg border border-border/50 text-[13px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
