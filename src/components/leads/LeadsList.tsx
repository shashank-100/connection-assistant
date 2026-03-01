import { useState, useRef } from 'react';
import { LeadList } from '@/types/lead';
import { mockLeadLists, mockLeadStats } from '@/data/mockLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ChevronDown, Plus, MoreVertical, Network, Users, Upload, FileSpreadsheet, X } from 'lucide-react';
import { toast } from 'sonner';

export function LeadsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('active');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stats = mockLeadStats;
  const lists = mockLeadLists;

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!uploadedFile) return;
    toast.success(`Successfully uploaded ${uploadedFile.name}`);
    setUploadedFile(null);
    setShowUploadDialog(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">Lists of Leads</h1>

        <Button 
          variant="outline" 
          onClick={() => setShowUploadDialog(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Leads
        </Button>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-8 px-6 py-3 border-b border-border bg-surface">
        <div className="text-sm">
          <span className="text-muted-foreground">Total imported lists: </span>
          <span className="font-medium">{stats.totalImportedLists}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Total imported leads: </span>
          <span className="font-medium">{stats.totalImportedLeads}</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-sm bg-accent/50 px-3 py-1 rounded">
            <span className="text-muted-foreground">Monthly imports: </span>
            <span className="font-medium">{stats.monthlyImports.used} / {stats.monthlyImports.total}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Email credits: </span>
            <span className="font-medium">{stats.emailCredits}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Daily quotas: </span>
            <span className="font-medium">{stats.dailyQuota.used} / {stats.dailyQuota.total}</span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center px-6 py-2 border-b border-border bg-surface text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Name</div>
        <div>Members</div>
        <div>Date</div>
        <div>Status</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {filteredLists.map((list) => (
          <LeadListRow key={list.id} list={list} />
        ))}

        {filteredLists.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No lists found
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Leads</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file containing your leads. The file should include columns for name, email, company, and other relevant information.
            </p>

            {!uploadedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports CSV files up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!uploadedFile}
                className="bg-primary hover:bg-primary/90"
              >
                Upload Leads
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LeadListRow({ list }: { list: LeadList }) {
  const isAllLeads = list.name === 'All leads';

  const getStatusBadge = () => {
    switch (list.status) {
      case 'sent':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">Sent</Badge>;
      case 'sending':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Sending</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">Paused</Badge>;
      case 'not_started':
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs">Not started</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center px-6 py-3 border-b border-border hover:bg-row-hover transition-colors">
      <div className="flex items-center gap-3">
        {isAllLeads ? (
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Network className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <span className="text-sm font-medium">{list.name}</span>
      </div>
      <div className="text-sm">
        {list.memberCount > 0 ? (
          <span className="text-primary">{list.memberCount} / {list.totalCapacity}</span>
        ) : null}
      </div>
      <div className="text-sm text-muted-foreground truncate">
        {list.importedAt || '-'}
      </div>
      <div>
        {getStatusBadge()}
      </div>
      <div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
