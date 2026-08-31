import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function PdfViewer({ fileUrl, className='' }) {
  const isSupabase = fileUrl?.includes('supabase.co');

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

      <div className="w-full h-full relative bg-neutral-900/50 rounded-xl overflow-hidden mx-auto border border-neutral-800 max-w-[800px] flex-1 flex flex-col items-center justify-center">
        {isSupabase ? (
            <iframe
                src={`${fileUrl}#toolbar=0`}
                title="PDF Viewer"
                className="w-full h-full border-0"
                loading="lazy"
            />
        ) : (
            <div className="text-center p-8">
                <FileText size={48} className="mx-auto text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">External Note</h3>
                <p className="text-neutral-400 mb-6 max-w-md">
                    This note is hosted on an external drive. Please open it in a new tab to view the contents.
                </p>
                <a 
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                >
                    <Download size={18} />
                    Open Note
                </a>
            </div>
        )}
      </div>
    </div>
  );
}
