import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';

function fileBase(data: ResumeData): string {
  return (data.personalInfo.name || 'resume').replace(/[/\\?%*:|"<>]/g, '-').trim() || 'resume';
}

function fmtDate(d: string): string {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] || m} ${y}`;
}

/**
 * Visual PDF: capture #resume-preview and paginate across A4 pages
 * so long resumes are not scaled into a single page.
 */
export async function exportVisualPDF(data: ResumeData): Promise<void> {
  const element = document.getElementById('resume-preview');
  if (!element) {
    throw new Error('Resume preview element not found.');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Full-bleed visual (matches on-screen A4 preview)
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Height of one PDF page in canvas pixels
  const pageHeightPx = (pageHeight * canvas.width) / imgWidth;

  let heightLeft = canvas.height;
  let srcY = 0;
  let page = 0;

  while (heightLeft > 0) {
    const sliceHeight = Math.min(pageHeightPx, heightLeft);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.ceil(sliceHeight);

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context for PDF page.');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      srcY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight
    );

    const pageData = pageCanvas.toDataURL('image/png');
    const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;

    if (page > 0) pdf.addPage();
    pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, sliceImgHeight);

    heightLeft -= sliceHeight;
    srcY += sliceHeight;
    page += 1;

    // Safety against infinite loops on tiny remainders
    if (page > 30) break;
  }

  pdf.save(`${fileBase(data)}.pdf`);
}

/**
 * ATS-oriented PDF: selectable text, Helvetica, simple linear layout.
 * Prefer this when submitting to applicant tracking systems.
 */
export function exportAtsPDF(data: ResumeData): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const writeWrapped = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal', color = '#111111') => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    const lineHeight = fontSize * 0.4;
    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      pdf.text(line, margin, y);
      y += lineHeight;
    }
  };

  const sectionTitle = (title: string) => {
    ensureSpace(10);
    y += 3;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor('#111111');
    pdf.text(title.toUpperCase(), margin, y);
    y += 2;
    pdf.setDrawColor(40);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const { personalInfo, sections, sectionOrder } = data;

  // Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor('#111111');
  const name = personalInfo.name || 'Your Name';
  const nameWidth = pdf.getTextWidth(name);
  pdf.text(name, (pageWidth - nameWidth) / 2, y);
  y += 7;

  // Contact
  const contact = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ]
    .filter(Boolean)
    .join('  |  ');
  if (contact) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor('#333333');
    const contactLines = pdf.splitTextToSize(contact, contentWidth) as string[];
    for (const line of contactLines) {
      const w = pdf.getTextWidth(line);
      pdf.text(line, (pageWidth - w) / 2, y);
      y += 4;
    }
  }
  y += 2;

  if (personalInfo.summary?.trim()) {
    sectionTitle('Summary');
    writeWrapped(personalInfo.summary.trim(), 10);
    y += 2;
  }

  for (const section of sectionOrder) {
    if (!section.visible) continue;

    switch (section.type) {
      case 'experience': {
        if (!sections.experience.length) break;
        sectionTitle(section.name);
        for (const exp of sections.experience) {
          ensureSpace(16);
          writeWrapped(`${exp.company}${exp.position ? ` — ${exp.position}` : ''}`, 11, 'bold');
          const dates = `${fmtDate(exp.startDate)} – ${exp.current ? 'Present' : fmtDate(exp.endDate)}`;
          const loc = exp.location ? `  |  ${exp.location}` : '';
          writeWrapped(dates + loc, 9, 'italic', '#444444');
          for (const ach of exp.achievements.filter((a) => a.trim())) {
            writeWrapped(`• ${ach.trim()}`, 10);
          }
          if (exp.technologies?.trim()) {
            writeWrapped(`Technologies: ${exp.technologies.trim()}`, 9, 'normal', '#333333');
          }
          y += 3;
        }
        break;
      }
      case 'education': {
        if (!sections.education.length) break;
        sectionTitle(section.name);
        for (const edu of sections.education) {
          ensureSpace(12);
          writeWrapped(edu.institution, 11, 'bold');
          const degreeLine = [edu.degree, edu.field ? `in ${edu.field}` : '', edu.gpa ? `GPA: ${edu.gpa}` : '']
            .filter(Boolean)
            .join(' · ');
          if (degreeLine) writeWrapped(degreeLine, 10);
          writeWrapped(`${fmtDate(edu.startDate)} – ${fmtDate(edu.endDate)}`, 9, 'italic', '#444444');
          if (edu.coursework?.trim()) writeWrapped(`Coursework: ${edu.coursework.trim()}`, 9);
          y += 2;
        }
        break;
      }
      case 'skills': {
        if (!sections.skills.length) break;
        sectionTitle(section.name);
        for (const s of sections.skills) {
          if (!s.skills?.trim()) continue;
          writeWrapped(s.category ? `${s.category}: ${s.skills}` : s.skills, 10);
        }
        y += 2;
        break;
      }
      case 'projects': {
        if (!sections.projects.length) break;
        sectionTitle(section.name);
        for (const proj of sections.projects) {
          ensureSpace(12);
          writeWrapped(`${proj.title}${proj.year ? ` (${proj.year})` : ''}`, 11, 'bold');
          if (proj.description?.trim()) writeWrapped(proj.description.trim(), 10);
          if (proj.technologies?.trim()) writeWrapped(`Technologies: ${proj.technologies.trim()}`, 9);
          if (proj.url?.trim()) writeWrapped(proj.url.trim(), 9, 'normal', '#333333');
          y += 2;
        }
        break;
      }
      case 'awards': {
        if (!sections.awards.length) break;
        sectionTitle(section.name);
        for (const aw of sections.awards) {
          writeWrapped(`${aw.title}${aw.issuer ? ` — ${aw.issuer}` : ''}${aw.date ? ` (${aw.date})` : ''}`, 10, 'bold');
          if (aw.description?.trim()) writeWrapped(aw.description.trim(), 10);
          y += 1;
        }
        break;
      }
      case 'certifications': {
        if (!sections.certifications.length) break;
        sectionTitle(section.name);
        for (const cert of sections.certifications) {
          writeWrapped(`${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}`, 10);
        }
        y += 2;
        break;
      }
      case 'custom': {
        const cs = sections.custom.find((c) => c.id === section.id);
        if (!cs || !cs.entries.length) break;
        sectionTitle(cs.name);
        for (const entry of cs.entries) {
          if (entry.title?.trim()) writeWrapped(entry.title.trim(), 10, 'bold');
          if (entry.content?.trim()) writeWrapped(entry.content.trim(), 10);
          y += 1;
        }
        break;
      }
      default:
        break;
    }
  }

  pdf.save(`${fileBase(data)}-ats.pdf`);
}
