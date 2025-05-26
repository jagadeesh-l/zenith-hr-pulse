
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt, Eye, Upload, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReimbursementModal } from "./ReimbursementModal";

type ReimbursementClaim = {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
  category: string;
  submittedDate: string;
};

const reimbursements: ReimbursementClaim[] = [
  {
    id: "R-001",
    date: "2024-01-15",
    amount: 250,
    description: "Office Supplies - Laptop Stand",
    status: "Approved",
    category: "Office Equipment",
    submittedDate: "2024-01-16"
  },
  {
    id: "R-002",
    date: "2024-01-10",
    amount: 45,
    description: "Business Lunch - Client Meeting",
    status: "Pending",
    category: "Meals & Entertainment",
    submittedDate: "2024-01-11"
  },
  {
    id: "R-003",
    date: "2024-01-05",
    amount: 120,
    description: "Internet Bill - Home Office",
    status: "Rejected",
    category: "Internet & Phone",
    submittedDate: "2024-01-06"
  }
];

export function ReimbursementsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in animation-delay-400">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
              <Receipt className="w-6 h-6 text-teal-500" />
              Reimbursements
            </CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-2 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reimbursements.map((claim, index) => (
              <div
                key={claim.id}
                className={cn(
                  "border rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]",
                  "border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50",
                  "dark:from-slate-800 dark:to-slate-900 animate-scale-in"
                )}
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{claim.description}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {claim.category} • {new Date(claim.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {formatCurrency(claim.amount)}
                    </p>
                    <Badge className={cn("text-xs px-2 py-1 animate-fade-in", getStatusColor(claim.status))}>
                      {claim.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ReimbursementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
