import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  Header as DocxHeader,
} from 'docx';
import { ResumeData } from '../types/resume';

function sep(): Paragraph {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' } },
    spacing: { after: 100 },
  });
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, color: '1C033C' })],
    spacing: { before: 200, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1C033C' } },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

function kv(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label + ': ', bold: true, size: 20 }),
      new TextRun({ text: value, size: 20 }),
    ],
    spacing: { after: 40 },
  });
}

export async function exportDOCX(data: ResumeData): Promise<void> {
  const { personalInfo, sections, sectionOrder } = data;

  const children: Paragraph[] = [];

  // Name
  children.push(
    new Paragraph({
      children: [new TextRun({ text: personalInfo.name || 'Your Name', bold: true, size: 36, color: '1C033C' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  // Contact row
  const contact = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.github,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean).join('  |  ');

  children.push(
    new Paragraph({
      children: [new TextRun({ text: contact, size: 18, color: '555555' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  if (personalInfo.summary) {
    children.push(sectionHeading('Summary'));
    children.push(new Paragraph({ children: [new TextRun({ text: personalInfo.summary, size: 20 })], spacing: { after: 100 } }));
  }

  // Dynamic sections
  for (const section of sectionOrder) {
    if (!section.visible) continue;

    switch (section.type) {
      case 'experience':
        if (sections.experience.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const exp of sections.experience) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: exp.company, bold: true, size: 22 }),
              new TextRun({ text: `  |  ${exp.position}`, size: 22, color: '371e77' }),
            ],
            spacing: { after: 20 },
          }));
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`, size: 18, color: '666666', italics: true }),
              exp.location ? new TextRun({ text: `  |  ${exp.location}`, size: 18, color: '666666', italics: true }) : new TextRun(''),
            ],
            spacing: { after: 40 },
          }));
          for (const ach of exp.achievements.filter(a => a.trim())) {
            children.push(bullet(ach));
          }
          if (exp.technologies) children.push(kv('Technologies', exp.technologies));
          children.push(new Paragraph({ spacing: { after: 80 } }));
        }
        break;

      case 'education':
        if (sections.education.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const edu of sections.education) {
          children.push(new Paragraph({
            children: [new TextRun({ text: edu.institution, bold: true, size: 22 })],
            spacing: { after: 20 },
          }));
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} in ${edu.field}`, size: 20, color: '371e77' }),
              edu.gpa ? new TextRun({ text: `  |  GPA: ${edu.gpa}`, size: 20 }) : new TextRun(''),
            ],
            spacing: { after: 20 },
          }));
          children.push(new Paragraph({
            children: [new TextRun({ text: `${edu.startDate} – ${edu.endDate}`, size: 18, color: '666666', italics: true })],
            spacing: { after: edu.coursework ? 20 : 80 },
          }));
          if (edu.coursework) children.push(kv('Coursework', edu.coursework));
          children.push(new Paragraph({ spacing: { after: 60 } }));
        }
        break;

      case 'skills':
        if (sections.skills.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const s of sections.skills) {
          if (s.category && s.skills) children.push(kv(s.category, s.skills));
        }
        children.push(new Paragraph({ spacing: { after: 60 } }));
        break;

      case 'projects':
        if (sections.projects.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const proj of sections.projects) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: proj.title, bold: true, size: 22 }),
              proj.year ? new TextRun({ text: `  (${proj.year})`, size: 20, color: '666666' }) : new TextRun(''),
            ],
            spacing: { after: 20 },
          }));
          if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20 })], spacing: { after: 20 } }));
          if (proj.technologies) children.push(kv('Technologies', proj.technologies));
          if (proj.url) children.push(kv('URL', proj.url));
          children.push(new Paragraph({ spacing: { after: 60 } }));
        }
        break;

      case 'awards':
        if (sections.awards.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const aw of sections.awards) {
          children.push(new Paragraph({
            children: [new TextRun({ text: aw.title, bold: true, size: 20 })],
            spacing: { after: 20 },
          }));
          if (aw.description) children.push(new Paragraph({ children: [new TextRun({ text: aw.description, size: 20 })], spacing: { after: 60 } }));
        }
        break;

      case 'certifications':
        if (sections.certifications.length === 0) break;
        children.push(sectionHeading(section.name));
        for (const cert of sections.certifications) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: cert.name, bold: true, size: 20 }),
              new TextRun({ text: `  –  ${cert.issuer}`, size: 20, color: '555555' }),
            ],
            spacing: { after: 20 },
          }));
          if (cert.date) children.push(new Paragraph({ children: [new TextRun({ text: cert.date, size: 18, italics: true, color: '777777' })], spacing: { after: 60 } }));
        }
        break;

      case 'custom': {
        const cs = sections.custom.find(c => c.id === section.id);
        if (!cs || cs.entries.length === 0) break;
        children.push(sectionHeading(cs.name));
        for (const entry of cs.entries) {
          if (entry.title) children.push(new Paragraph({ children: [new TextRun({ text: entry.title, bold: true, size: 20 })], spacing: { after: 20 } }));
          if (entry.content) children.push(new Paragraph({ children: [new TextRun({ text: entry.content, size: 20 })], spacing: { after: 60 } }));
        }
        break;
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { font: data.styling.fontFamily || 'Calibri', size: 20 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personalInfo.name || 'resume'}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTXT(data: ResumeData): void {
  const { personalInfo, sections, sectionOrder } = data;
  const lines: string[] = [];

  lines.push(personalInfo.name || 'Your Name');
  lines.push('='.repeat(60));

  const contact = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.github, personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' | ');
  if (contact) lines.push(contact);
  lines.push('');

  if (personalInfo.summary) {
    lines.push('SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(personalInfo.summary);
    lines.push('');
  }

  for (const section of sectionOrder) {
    if (!section.visible) continue;

    switch (section.type) {
      case 'experience':
        if (sections.experience.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const exp of sections.experience) {
          lines.push(`${exp.company} | ${exp.position}`);
          lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}  |  ${exp.location}`);
          for (const ach of exp.achievements.filter(a => a.trim())) lines.push(`• ${ach}`);
          if (exp.technologies) lines.push(`Technologies: ${exp.technologies}`);
          lines.push('');
        }
        break;
      case 'education':
        if (sections.education.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const edu of sections.education) {
          lines.push(edu.institution);
          lines.push(`${edu.degree} in ${edu.field}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`);
          lines.push(`${edu.startDate} - ${edu.endDate}`);
          if (edu.coursework) lines.push(`Coursework: ${edu.coursework}`);
          lines.push('');
        }
        break;
      case 'skills':
        if (sections.skills.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const s of sections.skills) {
          if (s.category && s.skills) lines.push(`${s.category}: ${s.skills}`);
        }
        lines.push('');
        break;
      case 'projects':
        if (sections.projects.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const proj of sections.projects) {
          lines.push(`${proj.title}${proj.year ? ' (' + proj.year + ')' : ''}`);
          if (proj.description) lines.push(proj.description);
          if (proj.technologies) lines.push(`Technologies: ${proj.technologies}`);
          lines.push('');
        }
        break;
      case 'awards':
        if (sections.awards.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const aw of sections.awards) {
          lines.push(aw.title);
          if (aw.description) lines.push(aw.description);
          lines.push('');
        }
        break;
      case 'certifications':
        if (sections.certifications.length === 0) break;
        lines.push(section.name.toUpperCase());
        lines.push('-'.repeat(40));
        for (const cert of sections.certifications) {
          lines.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
        }
        lines.push('');
        break;
    }
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personalInfo.name || 'resume'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
