import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import TicketReplyForm from "./TicketReplyForm";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function TicketDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
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
  if (!context || !context.permissions.has("tickets:view")) {
    redirect({ href: '/dashboard', locale });
    return null;
  }

  // Fetch ticket ensuring TenantScope isolation!
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      tenantId: context.tenantId,
      userId: context.userId // End customer can only see their own tickets
    },
    include: {
      replies: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!ticket) {
    redirect({ href: '/dashboard/tickets' as any, locale });
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tickets" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            {ticket.subject}
          </h1>
          <div className="flex items-center mt-2 gap-3">
            <span className="text-sm font-medium text-gray-500">#{ticket.id.slice(-6).toUpperCase()}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
              ticket.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {ticket.status === 'CLOSED' && <CheckCircle className="w-3 h-3 mr-1" />}
              {ticket.status === 'WAITING' && <Clock className="w-3 h-3 mr-1" />}
              {ticket.status === 'OPEN' && <AlertCircle className="w-3 h-3 mr-1" />}
              {ticket.status}
            </span>
            <span className="text-sm text-gray-500">{ticket.createdAt.toLocaleDateString()} {ticket.createdAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[600px]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/20">
          
          {/* Initial Message */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">ME</span>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex-1">
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{ticket.message}</p>
              <span className="text-xs text-gray-400 mt-2 block">{ticket.createdAt.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Replies */}
          {ticket.replies.map((reply) => {
            const isSupport = reply.authorMembershipId !== context.membershipId;
            return (
              <div key={reply.id} className={`flex gap-4 ${isSupport ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSupport ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                  <span className={`font-bold text-xs ${isSupport ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {isSupport ? 'S' : 'ME'}
                  </span>
                </div>
                <div className={`${isSupport ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'} p-4 rounded-2xl shadow-sm max-w-[85%]`}>
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{reply.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{reply.createdAt.toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Reply Box */}
        {ticket.status !== 'CLOSED' ? (
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <TicketReplyForm ticketId={ticket.id} />
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-700">
            This ticket is closed. You cannot reply to a closed ticket.
          </div>
        )}
      </div>
    </div>
  );
}
