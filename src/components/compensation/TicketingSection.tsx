
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Ticket = {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  createdDate: string;
  lastUpdate: string;
  category: string;
};

const tickets: Ticket[] = [
  {
    id: "PAY-001",
    title: "Missing overtime pay for December",
    status: "In Progress",
    priority: "High",
    createdDate: "2024-01-15",
    lastUpdate: "2024-01-16",
    category: "Payroll Issue"
  },
  {
    id: "PAY-002",
    title: "Tax deduction clarification",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2024-01-10",
    lastUpdate: "2024-01-14",
    category: "Tax Question"
  }
];

export function TicketingSection() {
  const [openTicketsCount] = useState(tickets.filter(t => t.status !== "Resolved").length);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in animation-delay-400">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-teal-500" />
            Payroll Support
            {openTicketsCount > 0 && (
              <Badge className="bg-red-500 text-white px-2 py-1 text-xs animate-bounce">
                {openTicketsCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-2 transition-all duration-200 hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask Payroll Team
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className={cn(
                  "border rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]",
                  "border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50",
                  "dark:from-slate-800 dark:to-slate-900 animate-scale-in"
                )}
                style={{ animationDelay: `${(index + 6) * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">
                        {ticket.title}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs px-2 py-1", getStatusColor(ticket.status))}>
                          {ticket.status}
                        </Badge>
                        <Badge className={cn("text-xs px-2 py-1", getPriorityColor(ticket.priority))}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {ticket.category} • #{ticket.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p>Created: {new Date(ticket.createdDate).toLocaleDateString()}</p>
                    <p>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    View Ticket
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">No support tickets yet</p>
              <p className="text-sm text-slate-500">Click "Ask Payroll Team" to create your first ticket</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
