import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../../services/supabaseClient';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const BulkUpload = () => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Helper to normalize headers to DB columns
  const normalizeKey = (header) => {
      const lower = header.toLowerCase().trim();
      
      if (lower.includes('team')) return 'team_name';
      if (lower.includes('playing')) return 'games_playing';
      if (lower.includes('ice') || lower.includes('cream')) return 'ice_cream';
      if (lower.includes('dart')) return 'dart';
      if (lower.includes('balloon')) return 'balloon';
      if (lower.includes('face') || lower.includes('painting')) return 'face_painting';
      if (lower.includes('member')) return 'members';
      
      return null;
  };

  const processFile = async (file) => {
    try {
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Get raw data: array of arrays to handle headers manually
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        throw new Error("File appears to be empty or missing headers");
      }

      // Parse Headers
      const headers = rawData[0];
      const columnMap = {};
      
      headers.forEach((h, index) => {
          if (h) {
              const key = normalizeKey(String(h));
              if (key) columnMap[index] = key;
          }
      });

      if (!Object.values(columnMap).includes('team_name')) {
          throw new Error("Could not find a 'Team Name' column");
      }

      // Parse Rows
      const validRows = [];
      
      // Start from row 1 (index 1)
      for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          const rowData = {};
          let hasTeam = false;

          // Fill default 0s
          rowData.games_playing = 4;
          rowData.ice_cream = 0;
          rowData.dart = 0;
          rowData.balloon = 0;
          rowData.face_painting = 0;

          Object.keys(columnMap).forEach(colIndex => {
              const key = columnMap[colIndex];
              const value = row[colIndex];
              
              if (key === 'team_name') {
                  if (value && String(value).trim()) {
                      rowData.team_name = String(value).trim();
                      hasTeam = true;
                  }
              } else if (key === 'members') {
                  rowData.members = String(value || '').trim();
              } else {
                  // Scores
                  rowData[key] = Number(value) || 0;
              }
          });
          
          if (hasTeam) {
              // Add updated_at for upsert to trigger change
              rowData.updated_at = new Date();
              validRows.push(rowData);
          }
      }

      console.table(validRows.slice(0, 5)); // Debug Log

      if (validRows.length === 0) {
          throw new Error("No valid teams found in the file");
      }

      // Upsert to Supabase
      const { error } = await supabase
        .from('teams')
        .upsert(validRows, { onConflict: 'team_name' });

      if (error) throw error;

      setMessage(`Successfully processed ${validRows.length} teams`);
      setIsError(false);
      
      // Reset after 3 seconds
      setTimeout(() => {
          setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.message || "Failed to parse file");
      setIsError(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="glass-panel p-6 rounded-xl border border-border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-text-main">
        <FileSpreadsheet size={20} className="text-primary" />
        Bulk Upload Scores
      </h2>
      
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-bg-card-hover",
          isError ? "border-red-500/50 bg-red-500/5" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center shadow-sm">
             <Upload size={24} className="text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-main">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-text-muted">
            Excel files only (.xlsx, .xls)
          </p>
          <p className="text-xs text-text-dim mt-2">
            Required Columns: Team Name, Games Playing, Ice Cream Fight, Dart Game, Balloon Between Us, Face Painting
          </p>
        </div>

        {message && (
          <div className={cn(
             "absolute inset-0 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm bg-bg-card/80 transition-opacity duration-300",
             isError ? "text-red-500" : "text-green-500"
          )}>
              {isError ? <AlertCircle size={32} className="mb-2" /> : <CheckCircle size={32} className="mb-2" />}
              <span className="font-semibold">{message}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BulkUpload;
