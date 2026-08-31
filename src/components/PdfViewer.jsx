import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function PdfViewer({ fileUrl, className='' }) {
  let finalUrl = fileUrl;
  
  // Convert standard Google Drive view links to embeddable preview links
  if (fileUrl?.includes('drive.google.com')) {
      const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
          finalUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      }
  }

  return (
    <div className={`flex flex-col items-center w-full h-full ${className}`}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-2 px-4 flex items-center justify-between w-full max-w-[800px] mb-4 shrink-0">
        <span className="text-sm font-medium font-mono text-neutral-300">
            PDF Document
        </span>

        <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-neutral-800 text-white rounded transition-colors flex items-center gap-2 text-sm"
            title="Download PDF"
        >
            <Download size={16} />
            <span className="hidden sm:inline">Save</span>
        </a>
      </div>

      <div className="w-full h-full relative bg-neutral-900/50 rounded-xl overflow-hidden mx-auto border border-neutral-800 max-w-[800px] flex-1">
        <iframe
            src={finalUrl.includes('drive.google.com') ? finalUrl : `${finalUrl}#toolbar=0`}
            title="PDF Viewer"
            className="w-full h-full border-0 bg-white"
            loading="lazy"
            allow="autoplay"
        />
      </div>
    </div>
  );
}
