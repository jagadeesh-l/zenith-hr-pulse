
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DollarSign, 
  Download, 
  FileText, 
  Upload, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Ticket
} from "lucide-react";

interface PayChange {
  id: string;
  date: string;
  oldSalary: number;
  newSalary: number;
  reason: string;
  approver: string;
  percentChange: number;
}

interface Reimbursement {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export function CompensationModule() {
  const [selectedPayChange, setSelectedPayChange] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchMonth, setSearchMonth] = useState("");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [openTickets] = useState(2);

  // Sample data
  const payHistory: PayChange[] = [
    {
      id: "1",
      date: "2024-01-15",
      oldSalary: 120000,
      newSalary: 135000,
      reason: "Annual Performance Review",
      approver: "Sarah Johnson",
      percentChange: 12.5
    },
    {
      id: "2",
      date: "2023-07-01",
      oldSalary: 110000,
      newSalary: 120000,
      reason: "Promotion to Senior Developer",
      approver: "Mike Chen",
      percentChange: 9.1
    },
    {
      id: "3",
      date: "2023-01-15",
      oldSalary: 100000,
      newSalary: 110000,
      reason: "Annual Increment",
      approver: "Sarah Johnson",
      percentChange: 10.0
    }
  ];

  const reimbursements: Reimbursement[] = [
    {
      id: "1",
      date: "2024-05-15",
      amount: 1250,
      description: "Conference Travel Expenses",
      status: "Approved",
      submittedDate: "2024-05-10"
    },
    {
      id: "2",
      date: "2024-04-20",
      amount: 450,
      description: "Office Supplies",
      status: "Pending",
      submittedDate: "2024-04-18"
    },
    {
      id: "3",
      date: "2024-03-12",
      amount: 890,
      description: "Client Dinner",
      status: "Rejected",
      submittedDate: "2024-03-10"
    }
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Compensation</h2>
          <p className="text-muted-foreground">Manage your pay, benefits, and reimbursements</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <DollarSign className="w-5 h-5 mr-2" />
            Current: $135,000
          </Badge>
          {openTickets > 0 && (
            <Badge className="animate-bounce bg-primary">
              {openTickets} Open Tickets
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="pay-history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pay-history">Pay History</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Pay History Tab */}
        <TabsContent value="pay-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Increment & Pay Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex gap-6 pb-4 min-w-max">
                  {payHistory.map((change, index) => (
                    <div key={change.id} className="flex flex-col items-center min-w-[300px]">
                      {/* Timeline dot with pop-in animation */}
                      <div 
                        className="w-6 h-6 rounded-full bg-primary animate-scale-in flex items-center justify-center mb-4"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      
                      {/* Pay change card */}
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                          selectedPayChange === change.id ? 'border-primary' : 'border-border'
                        }`}
                        onClick={() => setSelectedPayChange(selectedPayChange === change.id ? null : change.id)}
                      >
                        <CardContent className="p-4">
                          <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">{change.date}</p>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-lg font-semibold text-red-600">
                                ${change.oldSalary.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-lg font-semibold text-green-600">
                                ${change.newSalary.toLocaleString()}
                              </span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              +{change.percentChange}%
                            </Badge>
                          </div>
                          
                          {/* Expandable details with smooth transition */}
                          <div className={`overflow-hidden transition-all duration-300 ${
                            selectedPayChange === change.id ? 'max-h-40 mt-4' : 'max-h-0'
                          }`}>
                            <div className="border-t pt-3 space-y-2">
                              <div>
                                <Label className="text-xs font-medium">Reason</Label>
                                <p className="text-sm">{change.reason}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium">Approved by</Label>
                                <p className="text-sm">{change.approver}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium">Increase</Label>
                                <p className="text-sm font-semibold text-green-600">
                                  ${(change.newSalary - change.oldSalary).toLocaleString()} (+{change.percentChange}%)
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Timeline line */}
                      {index < payHistory.length - 1 && (
                        <div className="w-full h-px bg-border mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payslips Tab */}
        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Payslip Archive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search bar */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by month/year (e.g., May 2024)"
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {/* Month navigation */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-xl font-semibold min-w-[200px] text-center">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Month cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(currentMonth.getFullYear(), i);
                  const isCurrentMonth = monthDate.getMonth() === new Date().getMonth() && 
                                        monthDate.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <Card 
                      key={i}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'rotateY(10deg) scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'rotateY(0deg) scale(1)';
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold">{months[i]}</h4>
                            <p className="text-sm text-muted-foreground">{currentMonth.getFullYear()}</p>
                          </div>
                          {isCurrentMonth && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            <Download className="w-4 h-4 mr-2 animate-pulse" />
                            Download PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reimbursements Tab */}
        <TabsContent value="reimbursements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  Reimbursements
                </div>
                <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Submit Invoice</Button>
                  </DialogTrigger>
                  <DialogContent className="animate-fade-in">
                    <DialogHeader>
                      <DialogTitle>Submit Reimbursement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Upload Invoice</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your invoice or click to browse
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input placeholder="Brief description of the expense" />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsInvoiceModalOpen(false)}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reimbursements.map((claim, index) => (
                  <Card key={claim.id} className="transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold">{claim.description}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Submitted: {claim.submittedDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-lg">${claim.amount}</p>
                            <Badge 
                              className={`animate-scale-in ${getStatusColor(claim.status)}`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(claim.status)}
                                {claim.status}
                              </div>
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Payroll Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Need Help with Payroll?</h3>
                  <p className="text-muted-foreground">
                    Our payroll team is here to help with any questions or issues you may have.
                  </p>
                </div>
                
                <Button size="lg" className="w-full max-w-md">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ask Payroll Team
                </Button>
                
                {openTickets > 0 && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Your Open Tickets</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-background rounded border">
                        <div>
                          <p className="font-medium">Payroll Query - March Overtime</p>
                          <p className="text-sm text-muted-foreground">Ticket #PAY-2024-001</p>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background rounded border">
                        <div>
                          <p className="font-medium">Benefits Enrollment Question</p>
                          <p className="text-sm text-muted-foreground">Ticket #PAY-2024-002</p>
                        </div>
                        <Badge variant="outline">Waiting for Response</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
