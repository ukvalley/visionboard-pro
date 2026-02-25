import { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import generatePDF from '../../utils/pdfGenerator';

const ExportOptions = ({ visionBoard }) => {
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await generatePDF(visionBoard);
    } catch (error) {
      alert('Failed to generate PDF');
    } finally {
      setExporting(false);
      setShowModal(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/visionboards/${visionBoard._id}/share`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Export Options"
        size="md"
      >
        <div className="space-y-4">
          {/* PDF Export */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Export as PDF</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Download a beautifully formatted PDF of your vision board.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  loading={exporting}
                  onClick={handleExportPDF}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Share Link</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Copy a shareable link to your vision board (read-only).
                </p>
                <Button variant="secondary" size="sm" onClick={handleShare}>
                  Copy Link
                </Button>
              </div>
            </div>
          </div>

          {/* Print */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Print</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Print your vision board directly from your browser.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    window.print();
                    setShowModal(false);
                  }}
                >
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportOptions;