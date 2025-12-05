import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ fileUrl, className='' }) {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
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
    setPageNumber(1);
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-1 flex items-center gap-4 mb-4 sticky top-0 z-10">
        <button 
            disabled={pageNumber <= 1} 
            onClick={() => setPageNumber(prev => prev - 1)}
            className="p-1 hover:bg-neutral-800 text-white rounded disabled:opacity-30 transition-colors"
        >
            <ChevronLeft size={20} />
        </button>
        
        <span className="text-sm font-medium font-mono text-white">
            {pageNumber} / {numPages || '--'}
        </span>

        <button 
            disabled={pageNumber >= numPages} 
            onClick={() => setPageNumber(prev => prev + 1)}
            className="p-1 hover:bg-neutral-800 text-white rounded disabled:opacity-30 transition-colors"
        >
            <ChevronRight size={20} />
        </button>

        <div className="w-px h-4 bg-neutral-700 mx-1"></div>

        <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-neutral-800 text-white rounded transition-colors"
            title="Download PDF"
        >
            <Download size={20} />
        </a>
      </div>

      <div className="relative bg-neutral-900 min-h-[200px] mx-auto">
        <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-10 text-neutral-400 animate-pulse">Loading PDF...</div>}
            error={<div className="p-10 text-red-500">Failed to load PDF.</div>}
            className="flex flex-col items-center"
        >
            <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                width={pageWidth} 
                className="shadow-lg border border-neutral-800"
            />
        </Document>
      </div>
    </div>
  );
}
