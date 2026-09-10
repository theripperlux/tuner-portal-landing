import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileCode, Plus, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function TuningFilesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect({ href: '/login', locale });
    return null;
  }

  const context = await getServerAuthContext();
  if (context === "REQUIRE_TENANT_SELECTION") {
    redirect({ href: '/select-tenant' as any, locale });
    return null;
  }
  if (!context || !context.permissions.has("files:view")) {
    redirect({ href: '/dashboard', locale });
    return null;
  }

  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  // STRICT TenantScope isolation
  const jobs = await prisma.tuningJob.findMany({
    where: {
      tenantId: context.tenantId,
      userId: context.userId
    },
    include: {
      originalFile: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FileCode className="w-6 h-6 mr-3 text-indigo-500" />
            Tuning Files
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your uploaded files and tuning jobs.</p>
        </div>
        <Link href="/dashboard/files/upload" className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Tuning Job
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Original File</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{job.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.originalFile?.originalFilename || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        job.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {job.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {job.status === 'FAILED' && <XCircle className="w-3 h-3 mr-1" />}
                        {(job.status === 'PENDING' || job.status === 'PROCESSING') && <Clock className="w-3 h-3 mr-1" />}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.calculatedCreditCost} {job.calculatedCreditCost === 1 ? 'Credit' : 'Credits'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.createdAt.toLocaleDateString()} {job.createdAt.toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/files/${job.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileCode className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No files</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading a new tuning file.</p>
            <div className="mt-6">
              <Link href="/dashboard/files/upload" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Upload File
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
