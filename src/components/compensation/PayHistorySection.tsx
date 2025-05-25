
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PayChange = {
  id: string;
  date: string;
  oldSalary: number;
  newSalary: number;
  reason: string;
  approver: string;
  percentage: number;
};

const payHistory: PayChange[] = [
  {
    id: "1",
    date: "2024-01-15",
    oldSalary: 85000,
    newSalary: 95000,
    reason: "Annual Performance Review",
    approver: "Sarah Johnson",
    percentage: 11.8
  },
  {
    id: "2",
    date: "2023-07-01",
    oldSalary: 75000,
    newSalary: 85000,
    reason: "Promotion to Senior Developer",
    approver: "Mike Chen",
    percentage: 13.3
  },
  {
    id: "3",
    date: "2023-01-15",
    oldSalary: 70000,
    newSalary: 75000,
    reason: "Annual Increment",
    approver: "Sarah Johnson",
    percentage: 7.1
  }
];

export function PayHistorySection() {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const currentSalary = payHistory[0]?.newSalary || 95000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-teal-500" />
            Increment & Pay Changes
          </CardTitle>
          <Badge className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-sm font-medium">
            Current: {formatCurrency(currentSalary)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payHistory.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "border rounded-xl p-4 transition-all duration-300 cursor-pointer",
                "hover:shadow-md hover:scale-[1.01] border-slate-200 dark:border-slate-700",
                "animate-scale-in",
                expandedEntry === entry.id && "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse-slow" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatCurrency(entry.oldSalary)} → {formatCurrency(entry.newSalary)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                    +{entry.percentage}%
                  </Badge>
                  {expandedEntry === entry.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
              
              {expandedEntry === entry.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Reason</p>
                      <p className="text-slate-600 dark:text-slate-400">{entry.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Approved by</p>
                      <p className="text-slate-600 dark:text-slate-400">{entry.approver}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
