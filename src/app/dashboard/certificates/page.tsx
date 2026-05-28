'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Award, Download, Share2, Eye, Calendar, CheckCircle, 
  Trophy, Star, TrendingUp, Filter, Search, Grid, List, Printer 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  downloadCertificateAsHTML, 
  printCertificate, 
  generateCertificateId,
  type CertificateData 
} from '@/lib/certificate';

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  completedAt: Date;
  certificateUrl?: string;
  grade: string;
  mastery: number;
  skills: string[];
  instructor: string;
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'high-score'>('all');

  useEffect(() => {
    loadCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCertificates = async () => {
    if (!user) return;

    try {
      // Mock data - replace with actual Firestore query
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          courseId: 'ai-fundamentals',
          courseName: 'AI Fundamentals',
          userId: user.uid,
          userName: user.displayName || 'Student',
          completedAt: new Date('2024-11-01'),
          grade: 'A+',
          mastery: 95,
          skills: ['Machine Learning', 'Neural Networks', 'Deep Learning'],
          instructor: 'Dr. Sarah Chen',
        },
        {
          id: '2',
          courseId: 'python-data-science',
          courseName: 'Python for Data Science',
          userId: user.uid,
          userName: user.displayName || 'Student',
          completedAt: new Date('2024-10-15'),
          grade: 'A',
          mastery: 92,
          skills: ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
          instructor: 'Emma Rodriguez',
        },
        {
          id: '3',
          courseId: 'ml-essentials',
          courseName: 'Machine Learning Essentials',
          userId: user.uid,
          userName: user.displayName || 'Student',
          completedAt: new Date('2024-09-20'),
          grade: 'A',
          mastery: 88,
          skills: ['Supervised Learning', 'Classification', 'Regression'],
          instructor: 'Prof. Michael Zhang',
        },
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates
    .filter(cert => 
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (filterBy === 'recent') {
        return b.completedAt.getTime() - a.completedAt.getTime();
      }
      if (filterBy === 'high-score') {
        return b.mastery - a.mastery;
      }
      return 0;
    });

  const handleDownload = (cert: Certificate) => {
    const certificateData: CertificateData = {
      userName: cert.userName,
      courseName: cert.courseName,
      completionDate: cert.completedAt,
      courseId: cert.courseId,
      grade: cert.grade,
      instructorName: cert.instructor,
      certificateId: cert.id,
    };
    downloadCertificateAsHTML(certificateData);
  };

  const handlePrint = (cert: Certificate) => {
    const certificateData: CertificateData = {
      userName: cert.userName,
      courseName: cert.courseName,
      completionDate: cert.completedAt,
      courseId: cert.courseId,
      grade: cert.grade,
      instructorName: cert.instructor,
      certificateId: cert.id,
    };
    printCertificate(certificateData);
  };

  const handleShare = async (cert: Certificate) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${cert.courseName}`,
          text: `I completed ${cert.courseName} with a ${cert.grade} grade!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`I completed ${cert.courseName} with a ${cert.grade} grade! Certificate ID: ${cert.id}`);
      alert('Certificate details copied to clipboard!');
    }
  };

  const handleView = (cert: Certificate) => {
    const certificateData: CertificateData = {
      userName: cert.userName,
      courseName: cert.courseName,
      completionDate: cert.completedAt,
      courseId: cert.courseId,
      grade: cert.grade,
      instructorName: cert.instructor,
      certificateId: cert.id,
    };
    printCertificate(certificateData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
                <Trophy className="h-10 w-10" />
                <span>My Certificates</span>
              </h1>
              <p className="text-lg text-white/90">
                Your achievements and accomplishments
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{certificates.length}</div>
              <div className="text-sm text-white/80">Certificates Earned</div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Average Score</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(certificates.reduce((acc, cert) => acc + cert.mastery, 0) / certificates.length)}%
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Skills Mastered</span>
              </div>
              <div className="text-2xl font-bold">
                {new Set(certificates.flatMap(cert => cert.skills)).size}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <div className="text-2xl font-bold">
                {certificates.filter(c => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return c.completedAt > monthAgo;
                }).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Certificates</option>
              <option value="recent">Most Recent</option>
              <option value="high-score">Highest Score</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Certificates Grid/List */}
      {filteredCertificates.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No certificates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete courses to earn your certificates!
          </p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} variant="glass" className="group hover:shadow-2xl transition-all duration-300">
              {viewMode === 'grid' ? (
                <div className="p-6">
                  {/* Certificate Badge */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-8 border-2 border-amber-300 dark:border-amber-700">
                      <div className="text-center">
                        <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {certificate.grade}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {certificate.mastery}% Mastery
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {certificate.courseName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Instructor: {certificate.instructor}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {certificate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {certificate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        +{certificate.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Completed {certificate.completedAt.toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleView(certificate)}
                      icon={<Eye className="h-4 w-4" />}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePrint(certificate)}
                      icon={<Printer className="h-4 w-4" />}
                    >
                      Print
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleShare(certificate)}
                      icon={<Share2 className="h-4 w-4" />}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center space-x-6">
                  {/* Certificate Icon */}
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center">
                      <Trophy className="h-10 w-10 text-amber-500" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {certificate.courseName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {certificate.instructor} • Completed {certificate.completedAt.toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full font-semibold">
                        Grade: {certificate.grade}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {certificate.mastery}% Mastery
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleView(certificate)}
                      icon={<Eye className="h-4 w-4" />}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                      icon={<Download className="h-4 w-4" />}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePrint(certificate)}
                      icon={<Printer className="h-4 w-4" />}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleShare(certificate)}
                      icon={<Share2 className="h-4 w-4" />}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
