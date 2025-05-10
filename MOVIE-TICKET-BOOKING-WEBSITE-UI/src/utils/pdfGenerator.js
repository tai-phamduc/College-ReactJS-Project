/**
 * PDF Generator Utility
 *
 * This utility provides functions to generate PDF tickets using jsPDF and html2canvas.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The name of the PDF file to save
 * @param {string} bookingId - The booking ID to include in the QR code
 */
export const generatePDF = async (element, filename, bookingId) => {
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  // Generate QR code for the booking ID
  let qrCodeDataURL;
  try {
    qrCodeDataURL = await QRCode.toDataURL(bookingId, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 150,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    qrCodeDataURL = null;
  }

  // Use html2canvas to capture the element as an image
  html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true, // Enable CORS for images
    logging: false, // Disable logging
    backgroundColor: '#ffffff' // White background
  }).then(canvas => {
    // Create a new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions
    const imgWidth = 190; // A4 width with margins
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Add header
    pdf.setFontSize(22);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Movie Ticket', 105, 15, { align: 'center' });
    
    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    // Add the captured image to the PDF with margins
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
    
    // Add QR code if available
    if (qrCodeDataURL) {
      // Position the QR code in the top right corner
      const qrSize = 40; // Size of QR code in mm
      pdf.addImage(qrCodeDataURL, 'PNG', 160, 10, qrSize, qrSize);
      
      // Add label for QR code
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Scan for verification', 180, 55, { align: 'center' });
      pdf.text(`Booking #${bookingId}`, 180, 59, { align: 'center' });
    }
    
    // Add footer
    const footerY = Math.min(30 + imgHeight + 10, 280);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This is an official ticket. Please present it at the cinema entrance.', 105, footerY, { align: 'center' });
    pdf.text('© MovieTicket Booking System', 105, footerY + 5, { align: 'center' });
    
    // Save the PDF with the provided filename
    pdf.save(filename);
  }).catch(error => {
    console.error('Error generating PDF:', error);
  });
};

export default {
  generatePDF
};
