"use client";
import { useState, useRef, useEffect } from 'react';
import { LeadList } from '@/types/lead';
import { mockLeadStats } from '@/data/mockLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ChevronDown, Plus, MoreVertical, Linkedin, Users, Upload, FileSpreadsheet, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { LeadDetailList } from './LeadDetailList';

export function LeadsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('active');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lists, setLists] = useState<LeadList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<{source: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stats = mockLeadStats;

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://courteous-empathy-production-9e68.up.railway.app/api/leads?action=lists&userId=shashank');
      if (!response.ok) throw new Error(`Failed to fetch lists: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Map API response to LeadList type
        const mappedLists: LeadList[] = data.data.map((item: any, index: number) => ({
          id: item.source || `list-${index}`,
          name: item.source_name || item.source || 'Unknown List',
          source: 'linkedin', // Default or derived if available
          memberCount: parseInt(item.count || '0'),
          totalCapacity: parseInt(item.count || '0'), // Assuming total capacity matches count for now
          importedAt: new Date().toLocaleDateString(), // API doesn't return this yet
          status: 'not_started' // Default status
        }));
        setLists(mappedLists);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
      toast.error('Failed to load lead lists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

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

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Simple CSV parser
    return lines.slice(1).filter(line => line.trim()).map((line, index) => {
      // Handle quoted values simplistically if needed, but for now simple split
      const values = line.split(','); 
      const lead: any = {
        id: `lead-${Date.now()}-${index}`,
        source: uploadedFile?.name.replace('.csv', '') || 'import',
        sourceName: uploadedFile?.name.replace('.csv', '') || 'import',
        status: 'not_started'
      };

      headers.forEach((header, i) => {
        const value = values[i]?.trim();
        if (header.includes('name')) lead.name = value;
        else if (header.includes('url') || header.includes('profile')) lead.profileUrl = value;
        else if (header.includes('company')) lead.company = value;
        else if (header.includes('title') || header.includes('position') || header.includes('role')) lead.title = value;
        else if (header.includes('email')) lead.email = value;
      });

      // Fallback for ID if profile URL exists
      if (lead.profileUrl) {
         // Create a simple hash or use the URL as part of ID
         lead.id = btoa(lead.profileUrl).slice(0, 20);
      }

      return lead;
    });
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      const text = await uploadedFile.text();
      const leads = parseCSV(text);

      if (leads.length === 0) {
        toast.error('No leads found in CSV');
        return;
      }

      const response = await fetch('https://courteous-empathy-production-9e68.up.railway.app/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'shashank',
          leads: leads
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Successfully uploaded ${leads.length} leads`);
        setUploadedFile(null);
        setShowUploadDialog(false);
        fetchLists(); // Refresh the list
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload leads');
    }
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
        {selectedList && (
          <Button variant="ghost" size="icon" onClick={() => setSelectedList(null)} className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">
          {selectedList ? selectedList.name : 'Lists of Leads'}
        </h1>

        {!selectedList && (
          <>
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
          </>
        )}
      </div>

      {/* Stats Bar */}
      {!selectedList && (
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
              <span className="text-muted-foreground">Daily quotas - LinkedIn: </span>
              <span className="font-medium">{stats.dailyQuotaLinkedIn.used} / {stats.dailyQuotaLinkedIn.total}</span>
            </div>
          </div>
        </div>
      )}

      {selectedList ? (
        <LeadDetailList source={selectedList.source} sourceName={selectedList.name} />
      ) : (
        <>
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
              <div key={list.id} onClick={() => setSelectedList({ source: list.id, name: list.name })} className="cursor-pointer">
                <LeadListRow list={list} />
              </div>
            ))}

            {filteredLists.length === 0 && (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                No lists found
              </div>
            )}
          </div>
        </>
      )}

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
            <Linkedin className="w-4 h-4 text-muted-foreground" />
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