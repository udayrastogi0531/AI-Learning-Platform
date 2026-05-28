import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Certificate,
  Course,
  UserProfile,
  COLLECTIONS,
  generateCredentialId
} from '@/types/firestore';

/**
 * Certificate Generation Service
 * Handles certificate creation, PDF generation, and email delivery
 */
export class CertificateService {
  
  /**
   * Generate certificate for completed course
   */
  static async generateCertificate(
    userId: string,
    courseId: string,
    finalScore: number
  ): Promise<Certificate> {
    // Fetch user and course data
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const courseRef = doc(db, COLLECTIONS.COURSES, courseId);
    
    const [userSnap, courseSnap] = await Promise.all([
      getDoc(userRef),
      getDoc(courseRef)
    ]);
    
    if (!userSnap.exists() || !courseSnap.exists()) {
      throw new Error('User or course not found');
    }
    
    const user = userSnap.data() as UserProfile;
    const course = courseSnap.data() as Course;
    
    const now = new Date();
    const credentialId = generateCredentialId(courseId, userId, now);
    
    const certificate: Omit<Certificate, 'id'> = {
      userId,
      courseId,
      credentialId,
      title: `${course.title} Completion Certificate`,
      courseName: course.title,
      instructor: course.instructor.name,
      finalScore,
      completionDate: now,
      issueDate: now,
      skills: course.learningOutcomes || [],
      emailSent: false,
      createdAt: now
    };
    
    // Save certificate to Firestore
    const certificateRef = doc(collection(db, COLLECTIONS.CERTIFICATES));
    await setDoc(certificateRef, {
      ...certificate,
      completionDate: serverTimestamp(),
      issueDate: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    
    const certificateId = certificateRef.id;
    
    // Generate PDF (this would call a Cloud Function or external service)
    const pdfUrl = await this.generateCertificatePDF({
      ...certificate,
      id: certificateId
    } as Certificate, user);
    
    // Update certificate with PDF URL
    await setDoc(certificateRef, {
      pdfUrl,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certificateId}`
    }, { merge: true });
    
    // Send email
    await this.sendCertificateEmail(user.email, {
      ...certificate,
      id: certificateId,
      pdfUrl
    } as Certificate);
    
    return {
      ...certificate,
      id: certificateId,
      pdfUrl
    } as Certificate;
  }
  
  /**
   * Generate certificate PDF
   * In production, this would call a Cloud Function with a PDF generation library
   */
  private static async generateCertificatePDF(
    certificate: Certificate,
    user: UserProfile
  ): Promise<string> {
    // TODO: Implement PDF generation using Cloud Functions + pdf-lib or similar
    // For now, return a mock URL
    
    // This would typically:
    // 1. Create a canvas or use a PDF library
    // 2. Add certificate template background
    // 3. Add user name, course name, date, credential ID
    // 4. Add instructor signature
    // 5. Upload to Firebase Storage
    // 6. Return the download URL
    
    console.log('Generating certificate PDF for:', certificate.credentialId);
    
    // Mock PDF URL - in production, this would be a real Storage URL
    return `https://storage.googleapis.com/certificates/${certificate.id}.pdf`;
  }
  
  /**
   * Send certificate via email
   */
  private static async sendCertificateEmail(
    email: string,
    certificate: Certificate
  ): Promise<void> {
    // TODO: Implement email sending using Cloud Functions + SendGrid/Mailgun
    
    // This would typically call a Cloud Function that:
    // 1. Uses an email service (SendGrid, AWS SES, etc.)
    // 2. Sends HTML email with certificate attached
    // 3. Includes download link and share link
    
    console.log('Sending certificate email to:', email);
    console.log('Certificate:', certificate.credentialId);
    
    // Update certificate to mark email as sent
    const certificateRef = doc(db, COLLECTIONS.CERTIFICATES, certificate.id);
    await setDoc(certificateRef, {
      emailSent: true
    }, { merge: true });
  }
  
  /**
   * Download certificate PDF
   */
  static downloadCertificate(pdfUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Share certificate on social media
   */
  static shareCertificate(certificate: Certificate, platform: 'linkedin' | 'twitter' | 'facebook'): void {
    const shareText = `I just completed ${certificate.courseName} with a score of ${certificate.finalScore}%! 🎓`;
    const shareUrl = certificate.shareUrl || `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certificate.id}`;
    
    let url = '';
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  }
  
  /**
   * Verify certificate by credential ID
   */
  static async verifyCertificate(credentialId: string): Promise<Certificate | null> {
    const certificatesRef = collection(db, COLLECTIONS.CERTIFICATES);
    const q = query(certificatesRef, where('credentialId', '==', credentialId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Certificate;
  }
  
  /**
   * Get all certificates for a user
   */
  static async getUserCertificates(userId: string): Promise<Certificate[]> {
    const certificatesRef = collection(db, COLLECTIONS.CERTIFICATES);
    const q = query(certificatesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Certificate));
  }
}

// Client-side helper to generate certificate HTML preview
export function generateCertificateHTML(
  certificate: Certificate,
  userName: string
): string {
  const formattedDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .certificate {
          background: white;
          width: 800px;
          padding: 60px;
          border: 20px solid #f0f0f0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        .certificate-header {
          color: #667eea;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
        .certificate-subtitle {
          color: #666;
          font-size: 18px;
          margin-bottom: 40px;
        }
        .recipient {
          font-size: 36px;
          color: #333;
          margin: 30px 0;
          font-weight: bold;
        }
        .course-name {
          font-size: 24px;
          color: #667eea;
          margin: 20px 0;
          font-style: italic;
        }
        .details {
          margin: 40px 0;
          color: #666;
        }
        .credential-id {
          font-family: 'Courier New', monospace;
          background: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          display: inline-block;
          margin: 20px 0;
        }
        .signature-section {
          margin-top: 60px;
          display: flex;
          justify-content: space-around;
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          border-top: 2px solid #333;
          width: 200px;
          margin: 0 auto 10px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="certificate-header">Certificate of Completion</div>
        <div class="certificate-subtitle">This is to certify that</div>
        <div class="recipient">${userName}</div>
        <div class="certificate-subtitle">has successfully completed the course</div>
        <div class="course-name">${certificate.courseName}</div>
        <div class="details">
          <p>with a final score of <strong>${certificate.finalScore}%</strong></p>
          <p>Completed on ${formattedDate}</p>
        </div>
        <div class="credential-id">
          Credential ID: ${certificate.credentialId}
        </div>
        <div class="signature-section">
          <div class="signature">
            <div class="signature-line"></div>
            <div>${certificate.instructor}</div>
            <div style="color: #999; font-size: 14px;">Instructor</div>
          </div>
          <div class="signature">
            <div class="signature-line"></div>
            <div>AI Learning Platform</div>
            <div style="color: #999; font-size: 14px;">Platform</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
