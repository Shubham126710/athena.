import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, RotateCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup PDF worker using unpkg CDN for foolproof cross-browser support
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ fileUrl, className='' }) {

  const containerRef = useRef();

  useGSAP(() => {
      gsap.fromTo('.pdf-controls',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      
      gsap.fromTo('.pdf-document',
          { y: 20, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
  }, { scope: containerRef });

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageWidth, setPageWidth] = React.useState(600);
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    function updateWidth() {
      // Adjust width based on modal container sizing
      const containerWidth = window.innerWidth < 768 ? window.innerWidth - 32 : Math.min(window.innerWidth * 0.7, 750);
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
      <div ref={containerRef} className={`flex flex-col items-center w-full h-full ${className}`}>
      <div className="pdf-controls bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-2 px-4 flex items-center justify-between w-full max-w-[800px] mb-4 shrink-0">
        
        <div className="flex items-center gap-4">
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
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="p-1.5 hover:bg-neutral-800 text-white rounded transition-colors flex items-center gap-2 text-sm pdf-rotate-btn"
                title="Rotate PDF"
            >
                <RotateCw size={16} />
                <span className="hidden sm:inline">Rotate</span>
            </button>
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-neutral-800 text-white rounded transition-colors flex items-center gap-2 text-sm pdf-download-btn"
                title="Download PDF"
            >
                <Download size={16} />
                <span className="hidden sm:inline">Save</span>
            </a>
        </div>
      </div>

      <div className="pdf-document relative bg-neutral-900/50 w-full flex-1 rounded-xl overflow-hidden overflow-y-auto flex items-start justify-center border border-neutral-800 max-w-[800px] custom-scrollbar" data-lenis-prevent="true">
        <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-10 text-neutral-400 animate-pulse font-mono">Loading PDF...</div>}
            error={<div className="p-10 text-red-500 font-mono">Failed to load PDF. Cloudinary CORS issue or invalid URL.</div>}
            className="flex flex-col items-center py-4"
        >
            <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={pageWidth}
                rotate={rotation}
                className="shadow-2xl border border-neutral-800 bg-white"
            />
        </Document>
      </div>
    </div>
  );
}
