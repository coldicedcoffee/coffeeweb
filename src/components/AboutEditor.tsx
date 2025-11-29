import { useState, useEffect } from 'react';
import { AboutData } from './About';
import { Save, Plus, Trash2 } from 'lucide-react';

export function AboutEditor() {
  const [formData, setFormData] = useState<AboutData>({
    name: 'Your Name',
    title: 'Consultant | PM | Aspiring PE Analyst',
    bio: 'Write about yourself here...',
    email: 'hello@example.com',
    social: {},
    experience: [],
    education: [],
    skills: []
  });

  const [newExperience, setNewExperience] = useState({ company: '', role: '', period: '' });
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', period: '' });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem('aboutData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aboutData', JSON.stringify(formData));
    alert('About information updated successfully!');
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.role && newExperience.period) {
      setFormData({
        ...formData,
        experience: [...(formData.experience || []), newExperience]
      });
      setNewExperience({ company: '', role: '', period: '' });
    }
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience?.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree && newEducation.period) {
      setFormData({
        ...formData,
        education: [...(formData.education || []), newEducation]
      });
      setNewEducation({ institution: '', degree: '', period: '' });
    }
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education?.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Save className="w-5 h-5" />
        <h3 className="text-foreground">Edit About Section</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-5">
          <div>
            <label htmlFor="profileImage" className="block text-foreground mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              id="profileImage"
              value={formData.profileImage || ''}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://example.com/your-photo.jpg"
            />
            {formData.profileImage && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-xl object-cover border-2 border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="resumeUrl" className="block text-foreground mb-2">
              Resume URL
            </label>
            <input
              type="url"
              id="resumeUrl"
              value={formData.resumeUrl || ''}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://example.com/your-resume.pdf"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload your resume to a cloud service (Google Drive, Dropbox, etc.) and paste the shareable link here
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-foreground mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground resize-none"
              rows={6}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-6 space-y-5">
          <h4 className="text-foreground">Social Links</h4>
          
          <div>
            <label htmlFor="linkedin" className="block text-foreground mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin"
              value={formData.social.linkedin || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, linkedin: e.target.value }
              })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-foreground mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              id="github"
              value={formData.social.github || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, github: e.target.value }
              })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-foreground mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              id="twitter"
              value={formData.social.twitter || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, twitter: e.target.value }
              })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="border-t border-border pt-6 space-y-5">
          <h4 className="text-foreground">Experience</h4>
          
          {formData.experience && formData.experience.length > 0 && (
            <div className="space-y-2">
              {formData.experience.map((exp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="text-foreground">{exp.role} at {exp.company}</p>
                    <p className="text-muted-foreground">{exp.period}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newExperience.role}
              onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              placeholder="Role"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              placeholder="Company"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
            <input
              type="text"
              value={newExperience.period}
              onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
              placeholder="Period"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="border-t border-border pt-6 space-y-5">
          <h4 className="text-foreground">Education</h4>
          
          {formData.education && formData.education.length > 0 && (
            <div className="space-y-2">
              {formData.education.map((edu, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="text-foreground">{edu.degree} from {edu.institution}</p>
                    <p className="text-muted-foreground">{edu.period}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="Degree"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="Institution"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
            <input
              type="text"
              value={newEducation.period}
              onChange={(e) => setNewEducation({ ...newEducation, period: e.target.value })}
              placeholder="Period"
              className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="border-t border-border pt-6 space-y-5">
          <h4 className="text-foreground">Core Competencies</h4>
          
          {formData.skills && formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/60 text-foreground rounded-lg border border-border/50">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-destructive hover:text-destructive/70"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className="flex-1 px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
            />
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </form>
    </div>
  );
}
