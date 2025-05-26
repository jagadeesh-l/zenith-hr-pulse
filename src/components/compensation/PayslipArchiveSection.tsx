
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PayslipData = {
  month: string;
  year: number;
  gross: number;
  net: number;
  available: boolean;
};

const payslips: PayslipData[] = [
  { month: "December", year: 2024, gross: 7916, net: 6333, available: true },
  { month: "November", year: 2024, gross: 7916, net: 6333, available: true },
  { month: "October", year: 2024, gross: 7916, net: 6333, available: true },
  { month: "September", year: 2024, gross: 7916, net: 6333, available: true },
  { month: "August", year: 2024, gross: 7916, net: 6333, available: true },
  { month: "July", year: 2024, gross: 7916, net: 6333, available: true },
];

export function PayslipArchiveSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const filteredPayslips = payslips.filter(payslip =>
    `${payslip.month} ${payslip.year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPayslips = filteredPayslips.slice(currentIndex, currentIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(filteredPayslips.length - itemsPerPage, currentIndex + itemsPerPage));
  };

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in animation-delay-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-500" />
            Payslip Archive
          </CardTitle>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by month/year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, filteredPayslips.length)} of {filteredPayslips.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= filteredPayslips.length}
            className="rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPayslips.map((payslip, index) => (
            <div
              key={`${payslip.month}-${payslip.year}`}
              className={cn(
                "border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105",
                "border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50",
                "dark:from-slate-800 dark:to-slate-900 animate-scale-in cursor-pointer",
                "hover:border-teal-200 dark:hover:border-teal-700"
              )}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {payslip.month} {payslip.year}
                </h3>
                <FileText className="w-5 h-5 text-teal-500 animate-pulse-slow" />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Gross:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(payslip.gross)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Net:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(payslip.net)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                size="sm"
                disabled={!payslip.available}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
