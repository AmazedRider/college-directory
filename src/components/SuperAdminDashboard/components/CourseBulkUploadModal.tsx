import React, { useState } from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { parseCSVCourses } from '../utils/courseCSV';

export interface CSVCourse {
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee?: string;
  duration?: string;
  degree_type?: string;
  description?: string;
}

interface UploadStatus {
  total: number;
  processed: number;
  success: number;
  failed: number;
}

interface CourseBulkUploadModalProps {
  onClose: () => void;
  onUpload: (courses: CSVCourse[]) => Promise<void>;
  uploadStatus: UploadStatus;
}

export function CourseBulkUploadModal({ onClose, onUpload, uploadStatus }: CourseBulkUploadModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const content = await file.text();
      const courses = parseCSVCourses(content);
      await onUpload(courses);
    } catch (error) {
      console.error('Failed to process CSV file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Upload Courses</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800 mb-2">CSV Format Requirements:</h3>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Required columns: course_name, university_name, location</li>
              <li>Optional columns: tuition_fee, duration, degree_type, description</li>
              <li>First row must be column headers</li>
              <li>Default degree_type will be 'Bachelor' if not specified</li>
              <li>Download a <a href="#" className="underline" onClick={(e) => {
                e.preventDefault();
                const headers = "course_name,university_name,location,tuition_fee,duration,degree_type,description";
                const example = "Computer Science,University of Toronto,Canada,12000 CAD per year,4 years,Bachelor,A comprehensive program covering algorithms and software engineering";
                const example2 = "Business Administration,Harvard University,USA,50000 USD per year,2 years,Master,MBA program with focus on leadership and strategy";
                const csvContent = `${headers}\n${example}\n${example2}`;
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'courses_template.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>template</a></li>
            </ul>

            <div className="mt-3 p-2 bg-blue-100 rounded text-xs font-mono overflow-x-auto">
              <p className="text-blue-800 font-semibold mb-1">Sample CSV Format:</p>
              <pre className="text-blue-700">
                course_name,university_name,location,tuition_fee,duration,degree_type,description<br/>
                Computer Science,University of Toronto,Canada,12000 CAD per year,4 years,Bachelor,A comprehensive program<br/>
                Business Administration,Harvard University,USA,50000 USD per year,2 years,Master,MBA program
              </pre>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}
        </div>

        {uploadStatus.total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Processing: {uploadStatus.processed}/{uploadStatus.total}</span>
              <span className="text-green-600">Success: {uploadStatus.success}</span>
              <span className="text-red-600">Failed: {uploadStatus.failed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadStatus.processed / uploadStatus.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Maximum file size: 5MB
        </div>
      </div>
    </div>
  );
} 