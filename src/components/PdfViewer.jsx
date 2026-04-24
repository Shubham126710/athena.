import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ fileUrl, className='' }) {
  const [numPages, setNumPages] = React.useState(null);
  const [pageWidth, setPageWidth] = React.useState(600);

  React.useEffect(() => {
    function updateWidth() {
      const containerWidth = window.innerWidth < 768 ? window.innerWidth - 48 : Math.min(window.innerWidth * 0.8, 800);
      setPageWidth(containerWidth);
    }

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-2 px-4 flex items-center justify-between w-full max-w-[800px] mb-4 sticky top-0 z-20">
        <span className="text-sm font-medium font-mono text-neutral-300">
            PDF Document {numPages ? `(${numPages} Pages)` : ''}
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

      <div className="w-full relative bg-neutral-900/50 rounded-xl overflow-hidden mx-auto border border-neutral-800 max-h-[80vh] overflow-y-auto custom-scrollbar p-4">
        <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-10 text-center text-neutral-400 animate-pulse font-mono flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               Initialize Reader...
            </div>}
            error={<div className="p-10 text-center text-red-400 font-mono">Failed to load PDF. Please download it natively.</div>}
            className="flex flex-col items-center gap-6"
        >
            {numPages && Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="relative group">
                    <div className="absolute -left-12 top-0 mt-4 px-2 py-1 bg-neutral-800 text-neutral-400 font-mono text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        {index + 1}
                    </div>
                    <Page 
                        pageNumber={index + 1} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        width={pageWidth} 
                        className="shadow-2xl shadow-black/50 border border-neutral-800 bg-white"
                    />
                </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
