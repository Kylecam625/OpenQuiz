"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { parseDocument, validateDocumentSize, truncateText } from "@/lib/utils/file-parser";

interface DocumentUploaderProps {
  onTextExtracted: (text: string) => void;
}

export function DocumentUploader({ onTextExtracted }: DocumentUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError("");
    setLoading(true);

    try {
      // Validate file size
      if (!validateDocumentSize(file)) {
        throw new Error("File size must be less than 10MB");
      }

      setSelectedFile(file);

      // Parse document
      const text = await parseDocument(file);
      const truncatedText = truncateText(text);

      onTextExtracted(truncatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse document");
      setSelectedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Upload Document</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a .txt or .md file (max 10MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.markdown"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      {!selectedFile ? (
        <Card
          className="border-dashed cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              .txt or .md files only
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Processing document...</p>
      )}
    </div>
  );
}

