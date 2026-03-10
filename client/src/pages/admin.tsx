import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Clock,
  User,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { TFLogoWithText } from "@/components/TFLogo";
import type { QuoteRequest } from "@shared/schema";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

const allStatuses = ["new", "contacted", "in-progress", "completed", "archived"];

export default function AdminPage() {
  const { data: requests, isLoading } = useQuery<QuoteRequest[]>({
    queryKey: ["/api/quote-requests"],
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/quote-requests/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quote-requests"] });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <TFLogoWithText size={36} scrolled={true} />
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
                Quote Requests
              </span>
              <a href="/">
                <Button variant="outline" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Site
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-admin-title">
            Quote Requests
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            All submitted quote requests from your website
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!requests || requests.length === 0) && (
          <Card className="p-12 text-center" data-testid="text-no-requests">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No requests yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Quote requests submitted through your website will appear here.
            </p>
          </Card>
        )}

        {requests && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card
                key={req.id}
                className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                data-testid={`card-request-${req.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white" data-testid={`text-request-name-${req.id}`}>
                        {req.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[req.status] || statusColors.new}`}
                      data-testid={`badge-status-${req.id}`}
                    >
                      {statusLabels[req.status] || req.status}
                    </span>
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus.mutate({ id: req.id, status: e.target.value })}
                      className="text-xs px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      data-testid={`select-status-${req.id}`}
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <a href={`mailto:${req.email}`} className="underline" data-testid={`text-request-email-${req.id}`}>
                      {req.email}
                    </a>
                  </div>
                  {req.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a href={`tel:${req.phone}`} className="underline" data-testid={`text-request-phone-${req.id}`}>
                        {req.phone}
                      </a>
                    </div>
                  )}
                  {req.company && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span data-testid={`text-request-company-${req.id}`}>{req.company}</span>
                    </div>
                  )}
                  {req.service && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span data-testid={`text-request-service-${req.id}`}>{req.service}</span>
                    </div>
                  )}
                </div>

                {req.message && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-md p-4 text-sm text-slate-700 dark:text-slate-300" data-testid={`text-request-message-${req.id}`}>
                    {req.message}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
