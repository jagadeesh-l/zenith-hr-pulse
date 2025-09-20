
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, AlertCircle, InfoIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  leaveType: z.string().min(1, { message: "Please select a leave type" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  reason: z.string().min(5, { message: "Please provide a reason with at least 5 characters" }),
  document: z.instanceof(FileList).optional(),
  halfDay: z.boolean().optional(),
  contactNumber: z.string().optional(),
});

type LeaveApplicationFormProps = {
  onCancel: () => void;
};

export const LeaveApplicationForm = ({ onCancel }: LeaveApplicationFormProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: "",
      reason: "",
      halfDay: false,
    }
  });

  const leaveType = form.watch("leaveType");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    
    // Calculate the difference in days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    return diffDays;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      form.setValue("document", files);
    }
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("document", undefined);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This would typically send the data to an API
    
    toast({
      title: "Leave application submitted",
      description: "Your leave request has been submitted successfully.",
    });
    
    // Close the form
    onCancel();
  };
  
  const getAISuggestion = () => {
    // This would integrate with AI for suggestions
    // For now, we'll simulate an AI suggestion
    if (startDate && endDate) {
      const day = startDate.getDay();
      
      if (day === 1 || day === 2) { // Monday or Tuesday
        return {
          show: true,
          message: "Consider extending your leave through the weekend for a longer break.",
          icon: "🏖️",
        };
      } else if (day === 4 || day === 3) { // Thursday or Wednesday
        return {
          show: true,
          message: "Taking Friday off would give you a long weekend!",
          icon: "🎉",
        };
      }
    }
    
    return { show: false };
  };
  
  const aiSuggestion = getAISuggestion();
  const leaveDuration = calculateDuration();

  return (
    <>
      <Card className="border-2 border-primary/30 shadow-lg animate-fade-in">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">Apply for Leave</h2>
              <p className="text-muted-foreground">Fill out the form below to submit your leave request</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => setShowPreview(true))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                          <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                          <SelectItem value="study">Study Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of leave you're requesting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="halfDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 space-y-0 mt-8">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-2 border-primary h-5 w-5"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Half day</FormLabel>
                        <FormDescription>
                          Check if you're applying for half-day leave
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                              (startDate && date < startDate)
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {startDate && endDate && (
                <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                    <span>Duration: <strong>{leaveDuration} day{leaveDuration !== 1 ? 's' : ''}</strong></span>
                  </div>
                  
                  {leaveDuration > 5 && (
                    <span className="text-amber-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Long duration leave
                    </span>
                  )}
                </div>
              )}

              {aiSuggestion.show && (
                <div className="bg-accent/70 p-3 rounded-md flex items-center">
                  <div className="text-xl mr-2">{aiSuggestion.icon}</div>
                  <div>
                    <p className="text-sm font-medium">AI Suggestion</p>
                    <p className="text-xs">{aiSuggestion.message}</p>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leave</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details about your leave request..." 
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your request will be reviewed by your manager
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {leaveType === "sick" && (
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Medical Certificate</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          {selectedFile ? (
                            <div className="flex items-center justify-between w-full bg-muted p-2 rounded-md">
                              <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                              <Button variant="ghost" size="icon" onClick={removeFile}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-muted-foreground/30 p-6 rounded-md w-full text-center">
                              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                              <Input 
                                id="document" 
                                type="file" 
                                className="mt-2"
                                onChange={handleFileChange} 
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Required for sick leave exceeding 2 days
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a contact number where you can be reached during leave
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onCancel} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-hr-primary">
                  Preview & Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Request Summary</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your leave request before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">
                <strong className="text-muted-foreground">Leave Type:</strong>
                <p className="capitalize">{leaveType}</p>
              </div>
              <div className="text-sm">
                <strong className="text-muted-foreground">Duration:</strong>
                <p>{leaveDuration} day{leaveDuration !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-sm">
                <strong className="text-muted-foreground">Start Date:</strong>
                <p>{startDate ? format(startDate, 'PPP') : 'Not selected'}</p>
              </div>
              <div className="text-sm">
                <strong className="text-muted-foreground">End Date:</strong>
                <p>{endDate ? format(endDate, 'PPP') : 'Not selected'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-sm">
              <strong className="text-muted-foreground">Reason:</strong>
              <p>{form.watch("reason")}</p>
            </div>
            
            {selectedFile && (
              <div className="text-sm">
                <strong className="text-muted-foreground">Attached Document:</strong>
                <p>{selectedFile.name}</p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Edit Request</AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
