/**
 * Certificate Generation Utility
 * Generates downloadable certificates for course completion
 */

export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: Date;
  courseId: string;
  grade?: string;
  instructorName?: string;
  certificateId: string;
}

/**
 * Generate a certificate as HTML that can be printed or saved as PDF
 */
export function generateCertificateHTML(data: CertificateData): string {
  const formattedDate = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate of Completion - ${data.courseName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        
        .certificate {
          width: 1000px;
          background: white;
          padding: 60px 80px;
          border: 20px solid #667eea;
          border-radius: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.1;
          z-index: 0;
        }
        
        .content {
          position: relative;
          z-index: 1;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .logo {
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #666;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        
        .certificate-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #333;
          text-align: center;
          margin: 40px 0;
        }
        
        .presented-to {
          text-align: center;
          color: #666;
          font-size: 18px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 700;
          color: #667eea;
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
          display: inline-block;
          width: 100%;
        }
        
        .description {
          text-align: center;
          color: #555;
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 40px;
        }
        
        .course-name {
          font-weight: 600;
          color: #764ba2;
          font-size: 24px;
          display: block;
          margin: 15px 0;
        }
        
        .details {
          display: flex;
          justify-content: space-around;
          margin-top: 60px;
          padding-top: 40px;
          border-top: 2px solid #eee;
        }
        
        .detail-item {
          text-align: center;
        }
        
        .detail-label {
          color: #999;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .detail-value {
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }
        
        .signature-line {
          width: 200px;
          border-top: 2px solid #333;
          margin: 10px auto 5px;
        }
        
        .certificate-id {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 40px;
          font-family: monospace;
        }
        
        .decorative-corner {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 3px solid #667eea;
          opacity: 0.3;
        }
        
        .corner-tl {
          top: 40px;
          left: 40px;
          border-right: none;
          border-bottom: none;
        }
        
        .corner-tr {
          top: 40px;
          right: 40px;
          border-left: none;
          border-bottom: none;
        }
        
        .corner-bl {
          bottom: 40px;
          left: 40px;
          border-right: none;
          border-top: none;
        }
        
        .corner-br {
          bottom: 40px;
          right: 40px;
          border-left: none;
          border-top: none;
        }
        
        @media print {
          body {
            background: white;
          }
          
          .certificate {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="decorative-corner corner-tl"></div>
        <div class="decorative-corner corner-tr"></div>
        <div class="decorative-corner corner-bl"></div>
        <div class="decorative-corner corner-br"></div>
        
        <div class="content">
          <div class="header">
            <div class="logo">AI Learning Platform</div>
            <div class="subtitle">Certificate of Completion</div>
          </div>
          
          <div class="presented-to">This certificate is proudly presented to</div>
          
          <div class="recipient-name">${data.userName}</div>
          
          <div class="description">
            For successfully completing the course
            <span class="course-name">${data.courseName}</span>
            demonstrating dedication, skill, and commitment to continuous learning.
          </div>
          
          <div class="details">
            <div class="detail-item">
              <div class="detail-label">Completion Date</div>
              <div class="detail-value">${formattedDate}</div>
            </div>
            
            ${data.grade ? `
            <div class="detail-item">
              <div class="detail-label">Grade</div>
              <div class="detail-value">${data.grade}</div>
            </div>
            ` : ''}
            
            ${data.instructorName ? `
            <div class="detail-item">
              <div class="detail-label">Instructor</div>
              <div class="detail-value">${data.instructorName}</div>
              <div class="signature-line"></div>
            </div>
            ` : ''}
          </div>
          
          <div class="certificate-id">
            Certificate ID: ${data.certificateId}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Download certificate as HTML file
 */
export function downloadCertificateAsHTML(data: CertificateData): void {
  const html = generateCertificateHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `certificate-${data.courseName.replace(/\s+/g, '-').toLowerCase()}-${data.certificateId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open certificate in new window for printing
 */
export function printCertificate(data: CertificateData): void {
  const html = generateCertificateHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * Generate a unique certificate ID
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Save certificate data to Firestore
 */
export async function saveCertificateToFirestore(
  userId: string,
  certificateData: CertificateData,
  db: any
): Promise<void> {
  const { doc, setDoc } = await import('firebase/firestore');
  
  const certificateRef = doc(db, 'certificates', certificateData.certificateId);
  await setDoc(certificateRef, {
    userId,
    courseName: certificateData.courseName,
    courseId: certificateData.courseId,
    userName: certificateData.userName,
    completionDate: certificateData.completionDate,
    grade: certificateData.grade,
    instructorName: certificateData.instructorName,
    certificateId: certificateData.certificateId,
    createdAt: new Date(),
  });
}
