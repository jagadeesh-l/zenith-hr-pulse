import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Link, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEmployees } from '@/hooks/use-employees';

interface ImportEmployeesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportEmployees({ isOpen, onClose }: ImportEmployeesProps) {
  const [file, setFile] = useState<File | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("csv");
  const { toast } = useToast();
  const { importEmployeesFromCsv } = useEmployees();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };
  
  const handleCsvImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }

    const success = await importEmployeesFromCsv(file);
    if (success) {
      onClose();
    }
  };

  const handleLinkedInImport = async () => {
    // This would be implemented in the future
    toast({
      title: "LinkedIn import",
      description: "LinkedIn import functionality will be available in a future update.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Employees</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="csv" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV/Excel File</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB - {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <button 
                    onClick={clearFile}
                    className="p-1 rounded-full hover:bg-muted"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your CSV or Excel file here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    or
                  </p>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Requirements:</h3>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                <li>CSV or Excel file with headers</li>
                <li>Required columns: name, position, department</li>
                <li>Optional: email, phone, start_date, manager, bio</li>
                <li>Maximum 500 records per import</li>
              </ul>
              
              <a href="#" className="text-xs text-primary inline-block mt-2">
                Download template
              </a>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleCsvImport} disabled={!file}>Import</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="linkedin" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                <Input 
                  id="linkedin-url" 
                  placeholder="https://www.linkedin.com/in/username"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Link className="h-5 w-5 text-primary" />
                <p className="text-xs">
                  Import employee profiles directly from LinkedIn (Coming Soon)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleLinkedInImport} disabled={!linkedInUrl.includes('linkedin.com/')}>
                Import
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 