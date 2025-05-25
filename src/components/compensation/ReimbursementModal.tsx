
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ReimbursementModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ReimbursementModal({ isOpen, onClose }: ReimbursementModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: ""
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Submitting reimbursement:", formData, uploadedFile);
    onClose();
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl bg-white dark:bg-slate-800 border-0 shadow-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <Upload className="w-6 h-6 text-teal-500" />
            Submit Reimbursement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="rounded-xl border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Expense Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="rounded-xl border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </Label>
            <Input
              id="category"
              placeholder="e.g., Office Supplies, Travel, Meals"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="rounded-xl border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the expense..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Receipt/Invoice
            </Label>
            
            {!uploadedFile ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                  dragActive
                    ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Drop your file here, or{" "}
                  <label className="text-teal-500 hover:text-teal-600 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-sm text-slate-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-teal-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{uploadedFile.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-slate-200 dark:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
