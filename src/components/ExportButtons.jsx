import { useState } from 'react';
import { generateBillText, copyToClipboard, exportToPDF } from '../utils/export';

export default function ExportButtons({ 
  items, 
  calculations, 
  people, 
  owedByPerson, 
  taxRate, 
  discount,
  storeName 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = generateBillText(
      items, 
      calculations, 
      people, 
      owedByPerson, 
      taxRate, 
      discount,
      storeName
    );
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(
      items, 
      calculations, 
      people, 
      owedByPerson, 
      taxRate, 
      discount,
      storeName
    );
  };

  const hasValidItems = items.some(
    item => item.price && !isNaN(parseFloat(item.price)) && item.owners.length > 0
  );

  if (!hasValidItems) {
    return null;
  }

  return (
    <div style={{ 
      marginTop: '20px', 
      display: 'flex', 
      gap: '10px',
      borderTop: '2px dashed #000',
      paddingTop: '20px'
    }}>
      <button
        onClick={handleCopy}
        style={{
          flex: 1,
          padding: '12px',
          fontSize: '12px',
          backgroundColor: copied ? '#4CAF50' : '#2196F3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold'
        }}
      >
        {copied ? '✓ COPIED!' : '📋 COPY TEXT'}
      </button>
      <button
        onClick={handleExportPDF}
        style={{
          flex: 1,
          padding: '12px',
          fontSize: '12px',
          backgroundColor: '#FF5722',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold'
        }}
      >
        📄 EXPORT PDF
      </button>
    </div>
  );
}