import React from 'react';
import { useAppSelector } from '../../hooks';
import { ResumeData } from '../../types/resume';

// ─── shared helpers ────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

// ─── Template: PROFESSIONAL (clean centered header, colored section bars) ─────

const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, sections, sectionOrder, styling } = data;
  const pc = styling.colors.primary;
  const sc = styling.colors.secondary;
  const font = styling.fontFamily;
  const fs = styling.fontSize;

  return (
    <div style={{ fontFamily: font, fontSize: `${fs}pt`, lineHeight: styling.spacing, color: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: `2px solid ${pc}` }}>
        <h1 style={{ fontSize: `${fs * 2.4}pt`, fontWeight: 800, color: pc, margin: '0 0 4px' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', fontSize: `${fs * 0.9}pt`, color: sc }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>✆ {personalInfo.phone}</span>}
          {personalInfo.location && <span>⌖ {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>in {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>⌥ {personalInfo.github}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Summary
          </h2>
          <p style={{ margin: 0, color: '#333' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(s => s.visible).map(section => {
        switch (section.type) {
          case 'skills':
            return sections.skills.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.skills.map(s => (
                  <div key={s.id} style={{ marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: pc }}>{s.category}: </span>
                    <span>{s.skills}</span>
                  </div>
                ))}
              </div>
            );

          case 'experience':
            return sections.experience.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.experience.map(exp => (
                  <div key={exp.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: pc }}>{exp.company}</div>
                        <div style={{ fontWeight: 600, color: sc }}>{exp.position}</div>
                      </div>
                      <div style={{ textAlign: 'right', color: sc, fontSize: `${fs * 0.88}pt`, flexShrink: 0 }}>
                        <div>{fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}</div>
                        {exp.location && <div>{exp.location}</div>}
                      </div>
                    </div>
                    {exp.achievements.filter(a => a.trim()).length > 0 && (
                      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {exp.achievements.filter(a => a.trim()).map((a, i) => (
                          <li key={i} style={{ marginBottom: 2 }}>{a}</li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && (
                      <div style={{ marginTop: 4, fontSize: `${fs * 0.88}pt` }}>
                        <span style={{ fontWeight: 600 }}>Tech: </span>{exp.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );

          case 'education':
            return sections.education.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: pc }}>{edu.institution}</div>
                        <div style={{ color: sc }}>{edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                      </div>
                      <div style={{ color: sc, fontSize: `${fs * 0.88}pt`, flexShrink: 0 }}>
                        {fmtDate(edu.startDate)} – {fmtDate(edu.endDate)}
                      </div>
                    </div>
                    {edu.coursework && <div style={{ fontSize: `${fs * 0.88}pt`, marginTop: 2 }}><span style={{ fontWeight: 600 }}>Coursework: </span>{edu.coursework}</div>}
                  </div>
                ))}
              </div>
            );

          case 'projects':
            return sections.projects.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: pc }}>{proj.title}</span>
                      {proj.year && <span style={{ color: sc, fontSize: `${fs * 0.88}pt` }}>{proj.year}</span>}
                    </div>
                    {proj.description && <div style={{ fontSize: `${fs * 0.9}pt`, marginTop: 2 }}>{proj.description}</div>}
                    {proj.technologies && <div style={{ fontSize: `${fs * 0.88}pt`, marginTop: 2 }}><span style={{ fontWeight: 600 }}>Tech: </span>{proj.technologies}</div>}
                    {proj.url && <div style={{ fontSize: `${fs * 0.85}pt`, marginTop: 2, color: sc }}>{proj.url}</div>}
                  </div>
                ))}
              </div>
            );

          case 'awards':
            return sections.awards.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.awards.map(aw => (
                  <div key={aw.id} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: pc }}>{aw.title}</span>
                      {aw.date && <span style={{ fontSize: `${fs * 0.88}pt`, color: sc }}>{aw.date}</span>}
                    </div>
                    {aw.issuer && <div style={{ fontSize: `${fs * 0.88}pt`, color: sc }}>{aw.issuer}</div>}
                    {aw.description && <div style={{ fontSize: `${fs * 0.9}pt` }}>{aw.description}</div>}
                  </div>
                ))}
              </div>
            );

          case 'certifications':
            return sections.certifications.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.name}
                </h2>
                {sections.certifications.map(cert => (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{cert.name}</span>
                      {cert.issuer && <span style={{ color: sc }}> · {cert.issuer}</span>}
                    </div>
                    {cert.date && <span style={{ fontSize: `${fs * 0.88}pt`, color: sc }}>{cert.date}</span>}
                  </div>
                ))}
              </div>
            );

          case 'custom': {
            const cs = sections.custom.find(c => c.id === section.id);
            return cs && cs.entries.length > 0 ? (
              <div key={section.id} style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: `${fs * 1.1}pt`, fontWeight: 700, color: pc, borderBottom: `1.5px solid ${pc}`, paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cs.name}
                </h2>
                {cs.entries.map(e => (
                  <div key={e.id} style={{ marginBottom: 6 }}>
                    {e.title && <div style={{ fontWeight: 600, color: pc }}>{e.title}</div>}
                    {e.content && <div style={{ fontSize: `${fs * 0.9}pt` }}>{e.content}</div>}
                  </div>
                ))}
              </div>
            ) : null;
          }

          default: return null;
        }
      })}
    </div>
  );
};

// ─── Template: MODERN (left accent bar, name left-aligned, pill skills) ───────

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, sections, sectionOrder, styling } = data;
  const pc = styling.colors.primary;
  const sc = styling.colors.secondary;
  const ac = styling.colors.accent || pc;
  const font = styling.fontFamily;
  const fs = styling.fontSize;

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ width: 4, height: 18, backgroundColor: ac, borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: `${fs * 1.05}pt`, fontWeight: 700, color: pc, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {children}
      </h2>
    </div>
  );

  return (
    <div style={{ fontFamily: font, fontSize: `${fs}pt`, lineHeight: styling.spacing, color: '#1a1a1a' }}>
      {/* Header bar */}
      <div style={{ backgroundColor: pc, padding: '18px 24px', marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: `${fs * 2.6}pt`, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: `${fs * 0.88}pt`, color: 'rgba(255,255,255,0.85)' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: 16 }}>
            <SectionTitle>Summary</SectionTitle>
            <p style={{ margin: 0, color: '#444', borderLeft: `3px solid ${ac}`, paddingLeft: 10 }}>{personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.filter(s => s.visible).map(section => {
          switch (section.type) {
            case 'skills':
              return sections.skills.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.skills.map(s => (
                    <div key={s.id} style={{ marginBottom: 4, display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, color: ac, minWidth: 100, flexShrink: 0 }}>{s.category}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {s.skills.split(',').map((sk, i) => (
                          <span key={i} style={{ backgroundColor: `${ac}18`, color: pc, padding: '1px 8px', borderRadius: 12, fontSize: `${fs * 0.85}pt`, border: `1px solid ${ac}40` }}>
                            {sk.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case 'experience':
              return sections.experience.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.experience.map(exp => (
                    <div key={exp.id} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${ac}40` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: pc }}>{exp.position}</div>
                          <div style={{ color: sc, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                        </div>
                        <div style={{ fontSize: `${fs * 0.85}pt`, color: '#888', flexShrink: 0, textAlign: 'right' }}>
                          {fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.achievements.filter(a => a.trim()).length > 0 && (
                        <ul style={{ margin: '5px 0 0 14px', padding: 0 }}>
                          {exp.achievements.filter(a => a.trim()).map((a, i) => (
                            <li key={i} style={{ marginBottom: 2, fontSize: `${fs * 0.95}pt` }}>{a}</li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies && (
                        <div style={{ marginTop: 4, fontSize: `${fs * 0.85}pt`, color: '#555' }}>
                          <span style={{ fontWeight: 600 }}>Stack: </span>{exp.technologies}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );

            case 'education':
              return sections.education.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.education.map(edu => (
                    <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: pc }}>{edu.institution}</div>
                        <div style={{ color: sc }}>{edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                        {edu.coursework && <div style={{ fontSize: `${fs * 0.85}pt`, color: '#666', marginTop: 2 }}>{edu.coursework}</div>}
                      </div>
                      <div style={{ fontSize: `${fs * 0.85}pt`, color: '#888', flexShrink: 0, textAlign: 'right' }}>
                        {fmtDate(edu.startDate)} – {fmtDate(edu.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case 'projects':
              return sections.projects.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.projects.map(proj => (
                    <div key={proj.id} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: ac }}>{proj.title}</span>
                        {proj.year && <span style={{ fontSize: `${fs * 0.85}pt`, color: '#888' }}>{proj.year}</span>}
                      </div>
                      {proj.description && <div style={{ fontSize: `${fs * 0.9}pt`, color: '#444', marginTop: 2 }}>{proj.description}</div>}
                      {proj.technologies && <div style={{ fontSize: `${fs * 0.85}pt`, marginTop: 2, color: sc }}>{proj.technologies}</div>}
                    </div>
                  ))}
                </div>
              );

            case 'awards':
              return sections.awards.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.awards.map(aw => (
                    <div key={aw.id} style={{ marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: pc }}>{aw.title}</span>
                        {aw.issuer && <span style={{ color: '#888', fontSize: `${fs * 0.88}pt` }}> · {aw.issuer}</span>}
                        {aw.description && <div style={{ fontSize: `${fs * 0.88}pt`, color: '#555' }}>{aw.description}</div>}
                      </div>
                      {aw.date && <span style={{ fontSize: `${fs * 0.85}pt`, color: '#888', flexShrink: 0 }}>{aw.date}</span>}
                    </div>
                  ))}
                </div>
              );

            case 'certifications':
              return sections.certifications.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{section.name}</SectionTitle>
                  {sections.certifications.map(cert => (
                    <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div><span style={{ fontWeight: 600 }}>{cert.name}</span>{cert.issuer && <span style={{ color: sc }}> · {cert.issuer}</span>}</div>
                      {cert.date && <span style={{ fontSize: `${fs * 0.85}pt`, color: '#888' }}>{cert.date}</span>}
                    </div>
                  ))}
                </div>
              );

            case 'custom': {
              const cs = sections.custom.find(c => c.id === section.id);
              return cs && cs.entries.length > 0 ? (
                <div key={section.id} style={{ marginBottom: 16 }}>
                  <SectionTitle>{cs.name}</SectionTitle>
                  {cs.entries.map(e => (
                    <div key={e.id} style={{ marginBottom: 5 }}>
                      {e.title && <div style={{ fontWeight: 600, color: pc }}>{e.title}</div>}
                      {e.content && <div style={{ fontSize: `${fs * 0.9}pt` }}>{e.content}</div>}
                    </div>
                  ))}
                </div>
              ) : null;
            }
            default: return null;
          }
        })}
      </div>
    </div>
  );
};

// ─── Template: CLASSIC (Times-style, fully text-based, maximally ATS-safe) ────

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, sections, sectionOrder, styling } = data;
  const font = 'Times New Roman';
  const fs = styling.fontSize;

  return (
    <div style={{ fontFamily: font, fontSize: `${fs}pt`, lineHeight: styling.spacing, color: '#000' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: `${fs * 2}pt`, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ fontSize: `${fs * 0.9}pt` }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join('  ·  ')}
        </div>
      </div>

      {personalInfo.summary && (
        <>
          <div style={{ borderTop: '2px solid #000', borderBottom: '1px solid #000', padding: '2px 0', marginBottom: 6 }}>
            <strong style={{ fontSize: `${fs * 0.9}pt`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Summary</strong>
          </div>
          <p style={{ margin: '0 0 10px' }}>{personalInfo.summary}</p>
        </>
      )}

      {sectionOrder.filter(s => s.visible).map(section => {
        const heading = (
          <div key={`h-${section.id}`} style={{ borderTop: '2px solid #000', borderBottom: '1px solid #000', padding: '2px 0', marginBottom: 6 }}>
            <strong style={{ fontSize: `${fs * 0.9}pt`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.name}</strong>
          </div>
        );

        switch (section.type) {
          case 'skills':
            return sections.skills.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.skills.map(s => (
                  <div key={s.id} style={{ marginBottom: 2 }}>
                    <strong>{s.category}: </strong>{s.skills}
                  </div>
                ))}
              </div>
            );
          case 'experience':
            return sections.experience.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.experience.map(exp => (
                  <div key={exp.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><strong>{exp.company}</strong>, <em>{exp.position}</em>{exp.location ? `, ${exp.location}` : ''}</div>
                      <div style={{ flexShrink: 0 }}>{fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}</div>
                    </div>
                    <ul style={{ margin: '3px 0 0 18px', padding: 0 }}>
                      {exp.achievements.filter(a => a.trim()).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                    {exp.technologies && <div style={{ marginTop: 2 }}><em>Technologies:</em> {exp.technologies}</div>}
                  </div>
                ))}
              </div>
            );
          case 'education':
            return sections.education.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><strong>{edu.institution}</strong> — {edu.degree} in {edu.field}{edu.gpa ? `, GPA: ${edu.gpa}` : ''}</div>
                      <div style={{ flexShrink: 0 }}>{fmtDate(edu.startDate)} – {fmtDate(edu.endDate)}</div>
                    </div>
                    {edu.coursework && <div><em>Coursework:</em> {edu.coursework}</div>}
                  </div>
                ))}
              </div>
            );
          case 'projects':
            return sections.projects.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{proj.title}</strong>
                      {proj.year && <span>{proj.year}</span>}
                    </div>
                    {proj.description && <div>{proj.description}</div>}
                    {proj.technologies && <div><em>Technologies:</em> {proj.technologies}</div>}
                  </div>
                ))}
              </div>
            );
          case 'awards':
            return sections.awards.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.awards.map(aw => (
                  <div key={aw.id} style={{ marginBottom: 3 }}>
                    <strong>{aw.title}</strong>{aw.issuer ? ` — ${aw.issuer}` : ''}{aw.date ? ` (${aw.date})` : ''}
                    {aw.description && <div style={{ paddingLeft: 8 }}>{aw.description}</div>}
                  </div>
                ))}
              </div>
            );
          case 'certifications':
            return sections.certifications.length === 0 ? null : (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {sections.certifications.map(cert => (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div><strong>{cert.name}</strong>{cert.issuer ? ` — ${cert.issuer}` : ''}</div>
                    {cert.date && <span>{cert.date}</span>}
                  </div>
                ))}
              </div>
            );
          case 'custom': {
            const cs = sections.custom.find(c => c.id === section.id);
            return cs && cs.entries.length > 0 ? (
              <div key={section.id} style={{ marginBottom: 10 }}>
                {heading}
                {cs.entries.map(e => (
                  <div key={e.id} style={{ marginBottom: 4 }}>
                    {e.title && <strong>{e.title}: </strong>}
                    {e.content && <span>{e.content}</span>}
                  </div>
                ))}
              </div>
            ) : null;
          }
          default: return null;
        }
      })}
    </div>
  );
};

// ─── Template: COMPACT (max info density, 2-column skills/contact sidebar) ────

const CompactTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, sections, sectionOrder, styling } = data;
  const pc = styling.colors.primary;
  const sc = styling.colors.secondary;
  const font = styling.fontFamily;
  const fs = Math.max(styling.fontSize - 1, 9);

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 style={{ fontSize: `${fs * 1.05}pt`, fontWeight: 700, color: '#fff', backgroundColor: pc, padding: '2px 8px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {children}
    </h2>
  );

  const mainSections = ['experience', 'education', 'projects'];
  const sideSections = ['skills', 'awards', 'certifications', 'custom'];

  return (
    <div style={{ fontFamily: font, fontSize: `${fs}pt`, lineHeight: styling.spacing, color: '#111' }}>
      {/* Header */}
      <div style={{ backgroundColor: pc, padding: '12px 16px', marginBottom: 0 }}>
        <h1 style={{ color: '#fff', fontSize: `${fs * 2.2}pt`, fontWeight: 800, margin: '0 0 4px' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: `${fs * 0.88}pt`, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join('  |  ')}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ padding: '8px 16px', backgroundColor: `${pc}12`, borderBottom: `1px solid ${pc}30`, fontSize: `${fs * 0.9}pt`, color: '#333' }}>
          {personalInfo.summary}
        </div>
      )}

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Main column */}
        <div style={{ flex: '0 0 65%', padding: '10px 12px 10px 16px', borderRight: `1px solid ${pc}30` }}>
          {sectionOrder.filter(s => s.visible && mainSections.includes(s.type)).map(section => {
            switch (section.type) {
              case 'experience':
                return sections.experience.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.experience.map(exp => (
                      <div key={exp.id} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontWeight: 700, color: pc }}>{exp.position}</span>
                            <span style={{ color: sc }}> · {exp.company}</span>
                          </div>
                          <span style={{ fontSize: `${fs * 0.82}pt`, color: '#777', flexShrink: 0 }}>
                            {fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}
                          </span>
                        </div>
                        <ul style={{ margin: '2px 0 0 12px', padding: 0 }}>
                          {exp.achievements.filter(a => a.trim()).map((a, i) => <li key={i} style={{ marginBottom: 1 }}>{a}</li>)}
                        </ul>
                        {exp.technologies && <div style={{ fontSize: `${fs * 0.82}pt`, color: '#666', marginTop: 2 }}>{exp.technologies}</div>}
                      </div>
                    ))}
                  </div>
                );
              case 'education':
                return sections.education.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.education.map(edu => (
                      <div key={edu.id} style={{ marginBottom: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: pc }}>{edu.institution}</span>
                          <span style={{ fontSize: `${fs * 0.82}pt`, color: '#777' }}>{fmtDate(edu.endDate)}</span>
                        </div>
                        <div style={{ color: sc }}>{edu.degree} in {edu.field}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
                      </div>
                    ))}
                  </div>
                );
              case 'projects':
                return sections.projects.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.projects.map(proj => (
                      <div key={proj.id} style={{ marginBottom: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: pc }}>{proj.title}</span>
                          {proj.year && <span style={{ fontSize: `${fs * 0.82}pt`, color: '#777' }}>{proj.year}</span>}
                        </div>
                        {proj.description && <div style={{ fontSize: `${fs * 0.88}pt` }}>{proj.description}</div>}
                        {proj.technologies && <div style={{ fontSize: `${fs * 0.82}pt`, color: '#666' }}>{proj.technologies}</div>}
                      </div>
                    ))}
                  </div>
                );
              default: return null;
            }
          })}
        </div>

        {/* Sidebar column */}
        <div style={{ flex: '0 0 35%', padding: '10px 16px 10px 12px', backgroundColor: `${pc}06` }}>
          {sectionOrder.filter(s => s.visible && (sideSections.includes(s.type))).map(section => {
            switch (section.type) {
              case 'skills':
                return sections.skills.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.skills.map(s => (
                      <div key={s.id} style={{ marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, color: pc, fontSize: `${fs * 0.9}pt` }}>{s.category}</div>
                        <div style={{ color: '#333', fontSize: `${fs * 0.88}pt` }}>{s.skills}</div>
                      </div>
                    ))}
                  </div>
                );
              case 'awards':
                return sections.awards.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.awards.map(aw => (
                      <div key={aw.id} style={{ marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: `${fs * 0.9}pt`, color: pc }}>{aw.title}</div>
                        {aw.issuer && <div style={{ fontSize: `${fs * 0.82}pt`, color: sc }}>{aw.issuer}</div>}
                        {aw.description && <div style={{ fontSize: `${fs * 0.85}pt` }}>{aw.description}</div>}
                      </div>
                    ))}
                  </div>
                );
              case 'certifications':
                return sections.certifications.length === 0 ? null : (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{section.name}</SectionTitle>
                    {sections.certifications.map(cert => (
                      <div key={cert.id} style={{ marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: `${fs * 0.88}pt` }}>{cert.name}</div>
                        {cert.issuer && <div style={{ fontSize: `${fs * 0.82}pt`, color: sc }}>{cert.issuer} · {cert.date}</div>}
                      </div>
                    ))}
                  </div>
                );
              case 'custom': {
                const cs = sections.custom.find(c => c.id === section.id);
                return cs && cs.entries.length > 0 ? (
                  <div key={section.id} style={{ marginBottom: 10 }}>
                    <SectionTitle>{cs.name}</SectionTitle>
                    {cs.entries.map(e => (
                      <div key={e.id} style={{ marginBottom: 4 }}>
                        {e.title && <div style={{ fontWeight: 600, fontSize: `${fs * 0.9}pt` }}>{e.title}</div>}
                        {e.content && <div style={{ fontSize: `${fs * 0.88}pt` }}>{e.content}</div>}
                      </div>
                    ))}
                  </div>
                ) : null;
              }
              default: return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Template: EXECUTIVE (bold side stripe, formal look) ──────────────────────

const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, sections, sectionOrder, styling } = data;
  const pc = styling.colors.primary;
  const sc = styling.colors.secondary;
  const font = styling.fontFamily;
  const fs = styling.fontSize;

  return (
    <div style={{ fontFamily: font, fontSize: `${fs}pt`, lineHeight: styling.spacing, color: '#111', display: 'flex', minHeight: '100%' }}>
      {/* Left stripe */}
      <div style={{ width: 8, backgroundColor: pc, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: '16px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 14, paddingBottom: 10, borderBottom: `3px double ${pc}` }}>
          <h1 style={{ fontSize: `${fs * 2.4}pt`, fontWeight: 900, color: pc, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 16px', fontSize: `${fs * 0.88}pt`, color: sc }}>
            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>

        {personalInfo.summary && (
          <div style={{ marginBottom: 14, padding: '8px 12px', backgroundColor: `${pc}0d`, borderLeft: `4px solid ${pc}` }}>
            <div style={{ fontWeight: 700, fontSize: `${fs * 0.85}pt`, color: pc, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Executive Summary</div>
            <p style={{ margin: 0 }}>{personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.filter(s => s.visible).map(section => {
          const SH = () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: `${fs * 1.05}pt`, fontWeight: 800, color: pc, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{section.name}</h2>
              <div style={{ flex: 1, height: 1, backgroundColor: `${pc}60` }} />
            </div>
          );

          switch (section.type) {
            case 'skills':
              return sections.skills.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {sections.skills.flatMap(s => s.skills.split(',').map(sk => sk.trim())).filter(Boolean).map((sk, i) => (
                      <span key={i} style={{ backgroundColor: `${pc}15`, color: pc, padding: '2px 10px', borderRadius: 3, fontSize: `${fs * 0.88}pt`, fontWeight: 500 }}>{sk}</span>
                    ))}
                  </div>
                </div>
              );
            case 'experience':
              return sections.experience.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {sections.experience.map(exp => (
                    <div key={exp.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div>
                          <span style={{ fontWeight: 800, color: pc, fontSize: `${fs * 1.05}pt` }}>{exp.position}</span>
                          <span style={{ color: '#555' }}> — {exp.company}</span>
                          {exp.location && <span style={{ color: '#777', fontSize: `${fs * 0.85}pt` }}>, {exp.location}</span>}
                        </div>
                        <span style={{ fontSize: `${fs * 0.85}pt`, color: '#777', flexShrink: 0 }}>
                          {fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}
                        </span>
                      </div>
                      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {exp.achievements.filter(a => a.trim()).map((a, i) => <li key={i} style={{ marginBottom: 2 }}>{a}</li>)}
                      </ul>
                      {exp.technologies && <div style={{ marginTop: 3, fontSize: `${fs * 0.85}pt`, color: '#555', fontStyle: 'italic' }}>{exp.technologies}</div>}
                    </div>
                  ))}
                </div>
              );
            case 'education':
              return sections.education.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {sections.education.map(edu => (
                    <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{edu.institution}</div>
                        <div style={{ color: sc }}>{edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                      </div>
                      <span style={{ fontSize: `${fs * 0.85}pt`, color: '#777' }}>{fmtDate(edu.endDate)}</span>
                    </div>
                  ))}
                </div>
              );
            case 'projects':
              return sections.projects.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {sections.projects.map(proj => (
                    <div key={proj.id} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: pc }}>{proj.title}</span>
                        {proj.year && <span style={{ fontSize: `${fs * 0.85}pt`, color: '#777' }}>{proj.year}</span>}
                      </div>
                      {proj.description && <div style={{ fontSize: `${fs * 0.9}pt` }}>{proj.description}</div>}
                      {proj.technologies && <div style={{ fontSize: `${fs * 0.82}pt`, color: sc }}>{proj.technologies}</div>}
                    </div>
                  ))}
                </div>
              );
            case 'awards':
              return sections.awards.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {sections.awards.map(aw => (
                    <div key={aw.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{aw.title}</span>
                        {aw.issuer && <span style={{ color: sc }}> · {aw.issuer}</span>}
                        {aw.description && <div style={{ fontSize: `${fs * 0.88}pt` }}>{aw.description}</div>}
                      </div>
                      {aw.date && <span style={{ fontSize: `${fs * 0.82}pt`, color: '#777' }}>{aw.date}</span>}
                    </div>
                  ))}
                </div>
              );
            case 'certifications':
              return sections.certifications.length === 0 ? null : (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {sections.certifications.map(cert => (
                    <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div><span style={{ fontWeight: 600 }}>{cert.name}</span>{cert.issuer && <span style={{ color: sc }}> · {cert.issuer}</span>}</div>
                      {cert.date && <span style={{ fontSize: `${fs * 0.85}pt`, color: '#777' }}>{cert.date}</span>}
                    </div>
                  ))}
                </div>
              );
            case 'custom': {
              const cs = sections.custom.find(c => c.id === section.id);
              return cs && cs.entries.length > 0 ? (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <SH />
                  {cs.entries.map(e => (
                    <div key={e.id} style={{ marginBottom: 4 }}>
                      {e.title && <div style={{ fontWeight: 600 }}>{e.title}</div>}
                      {e.content && <div style={{ fontSize: `${fs * 0.9}pt` }}>{e.content}</div>}
                    </div>
                  ))}
                </div>
              ) : null;
            }
            default: return null;
          }
        })}
      </div>
    </div>
  );
};

// ─── Main ResumePreview dispatcher ────────────────────────────────────────────

const ResumePreview: React.FC = () => {
  const resumeData = useAppSelector(state => state.resume.data);
  const template = resumeData.styling.template;

  const renderTemplate = () => {
    switch (template) {
      case 'modern':    return <ModernTemplate data={resumeData} />;
      case 'classic':   return <ClassicTemplate data={resumeData} />;
      case 'compact':   return <CompactTemplate data={resumeData} />;
      case 'executive': return <ExecutiveTemplate data={resumeData} />;
      default:          return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="bg-white shadow-lg mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: template === 'compact' ? 0 : '20mm 18mm',
        boxSizing: 'border-box',
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
