import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * Component to generate and display a QR code
 * @param {Object} props - Component props
 * @param {string} props.value - The value to encode in the QR code
 * @param {number} props.size - The size of the QR code in pixels (default: 128)
 * @param {string} props.level - Error correction level (default: 'H')
 * @param {string} props.bgColor - Background color (default: '#ffffff')
 * @param {string} props.fgColor - Foreground color (default: '#000000')
 * @param {string} props.className - Additional CSS classes
 */
const QRCodeGenerator = ({ 
  value, 
  size = 128, 
  level = 'H', 
  bgColor = '#ffffff', 
  fgColor = '#000000',
  className = ''
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!value) {
      setError('No value provided for QR code');
      return;
    }

    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(value, {
          errorCorrectionLevel: level,
          width: size,
          margin: 1,
          color: {
            dark: fgColor,
            light: bgColor
          }
        });
        setQrCodeUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      }
    };

    generateQRCode();
  }, [value, size, level, bgColor, fgColor]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className={`qr-code-container ${className}`}>
      {qrCodeUrl ? (
        <img 
          src={qrCodeUrl} 
          alt={`QR Code for ${value}`} 
          className="img-fluid"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ) : (
        <div className="text-center p-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
