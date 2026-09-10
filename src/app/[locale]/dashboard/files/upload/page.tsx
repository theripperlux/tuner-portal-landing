'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Upload, FileCode, CheckCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function UploadTuningFilePage() {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [file, setFile] = useState<File | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicleInfo', vehicleInfo);

    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError('Insufficient credits. Please purchase more credits to upload a tuning file.');
        } else {
          setError(data.error || 'Upload failed.');
        }
        setSubmitting(false);
        return;
      }

      router.push('/dashboard/files');
      router.refresh();
    } catch (err) {
      setError('An error occurred during upload.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Upload className="w-6 h-6 mr-3 text-indigo-500" />
            Upload Tuning File
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload your original readout to request a tuning service.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original File (.bin, .hex, .zip)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <div className="space-y-1 text-center">
                <FileCode className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Up to 20MB</p>
              </div>
            </div>
            {file && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">{file.name}</span>
                <span className="text-xs text-green-600 dark:text-green-500 ml-auto">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Information (Optional)</label>
            <textarea 
              rows={4}
              value={vehicleInfo}
              onChange={(e) => setVehicleInfo(e.target.value)}
              placeholder="E.g. BMW M3 F80, Bosch MEVD17.2.G, please apply Stage 1 and Vmax off."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
          </div>

          {/* Cost Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Cost: 1 Credit</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">1 Credit will be deducted from your balance upon successful upload.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center border border-red-100 dark:border-red-800">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/dashboard/files" className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={!file || submitting}
              className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {submitting ? 'Uploading...' : 'Upload & Deduct Credit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
