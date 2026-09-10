'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FileCode, Ticket, CreditCard, Activity, AlertCircle } from 'lucide-react';
import { DashboardOverview as DashboardOverviewType, DashboardWidgetState } from '@/types/dashboard';

export default function DashboardOverview({ data }: { data: DashboardOverviewType }) {
  const t = useTranslations('Dashboard');

  const renderMetric = (name: string, state: DashboardWidgetState<any>, getValue: (d: any) => string | number, Icon: any, color: string, bg: string) => {
    return (
      <div className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <dt>
          <div className={`absolute rounded-md p-3 ${bg}`}>
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
          </div>
          <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{name}</p>
        </dt>
        <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
          {state.status === "ready" ? (
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{getValue(state.data)}</p>
          ) : state.status === "empty" ? (
            <p className="text-2xl font-semibold text-gray-400">0</p>
          ) : (
            <p className="text-sm font-semibold text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> N/A</p>
          )}
        </dd>
      </div>
    );
  };

  return (
    <div data-testid="dashboard-overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Willkommen zurück, {data.profile.status === "ready" ? data.profile.data.name : "Kunde"}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {renderMetric('Verfügbare Credits', data.credits, d => d.available, CreditCard, 'text-indigo-600', 'bg-indigo-100')}
        {renderMetric('Offene Tickets', data.tickets, d => d.openCount, Ticket, 'text-blue-600', 'bg-blue-100')}
        {renderMetric('Aktive Files', data.files, d => d.activeCount, FileCode, 'text-green-600', 'bg-green-100')}
        {/* Placeholder System Status (Activity) for now */}
        {renderMetric('System Status', { status: "ready", data: { status: "Online" }, updatedAt: "" }, d => d.status, Activity, 'text-emerald-600', 'bg-emerald-100')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Tickets Widget */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Letzte Tickets</h3>
          </div>
          {data.tickets.status === "ready" ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.tickets.data.recentTickets.map((ticket) => (
                <li key={ticket.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">#{ticket.publicReference} - {ticket.subject}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : data.tickets.status === "empty" ? (
            <div className="p-6 text-center text-sm text-gray-500 italic">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{data.tickets.emptyState.title}</p>
              {data.tickets.emptyState.description}
            </div>
          ) : (
             <div className="p-6 text-center text-sm text-red-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Daten nicht verfügbar
             </div>
          )}
        </div>

        {/* Files Widget */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Letzte Tuning-Files</h3>
          </div>
          {data.files.status === "ready" ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.files.data.recentFiles.map((file) => (
                <li key={file.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">#{file.publicReference}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {file.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(file.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : data.files.status === "empty" ? (
            <div className="p-6 text-center text-sm text-gray-500 italic">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{data.files.emptyState.title}</p>
              {data.files.emptyState.description}
            </div>
          ) : (
             <div className="p-6 text-center text-sm text-red-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Daten nicht verfügbar
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
