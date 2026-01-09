export const generateBillText = (items, calculations, people, owedByPerson, taxRate, discount, storeName = "RETAIL STORE") => {
  const validItems = items.filter(
    item => item.price && !isNaN(parseFloat(item.price)) && item.owners.length > 0
  );

  let text = '';
  text += '═'.repeat(50) + '\n';
  text += `${storeName.toUpperCase()}\n`;
  text += 'Save Money. Live Better.\n';
  text += new Date().toLocaleString() + '\n';
  text += '═'.repeat(50) + '\n\n';

  text += 'ITEMS:\n';
  text += '─'.repeat(50) + '\n';
  
  validItems.forEach(item => {
    const owners = item.owners.join(', ');
    const taxIndicator = item.taxable ? ' T' : '';
    text += `${item.name}${taxIndicator}\n`;
    text += `  Price: $${parseFloat(item.price).toFixed(2)} [${owners}]\n`;
  });

  text += '─'.repeat(50) + '\n\n';
  text += `SUBTOTAL:                 $${calculations.subtotal.toFixed(2)}\n`;
  
  if (discount && parseFloat(discount) > 0) {
    text += `DISCOUNT (${discount}%):         -$${calculations.discountAmount.toFixed(2)}\n`;
    text += `SUBTOTAL AFTER DISCOUNT:  $${calculations.subtotalAfterDiscount.toFixed(2)}\n`;
  }
  
  text += `TAX (${taxRate}%):                $${calculations.taxAmount.toFixed(2)}\n`;
  text += '─'.repeat(50) + '\n';
  text += `TOTAL:                    $${calculations.finalTotal.toFixed(2)}\n`;
  text += '═'.repeat(50) + '\n\n';

  if (people.length > 0) {
    text += 'WHO OWES WHAT:\n';
    text += '─'.repeat(50) + '\n';
    people.forEach(person => {
      const amount = owedByPerson[person]?.toFixed(2) || '0.00';
      text += `${person.padEnd(30)} $${amount}\n`;
    });
    text += '═'.repeat(50) + '\n';
  }

  text += '\nTHANK YOU FOR YOUR PURCHASE!\n';
  
  return text;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const generatePDFContent = (items, calculations, people, owedByPerson, taxRate, discount, storeName = "RETAIL STORE") => {
  const validItems = items.filter(
    item => item.price && !isNaN(parseFloat(item.price)) && item.owners.length > 0
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.4;
      margin: 0;
      padding: 20px;
      max-width: 80mm;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #000;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 20px;
      margin: 5px 0;
      font-weight: bold;
    }
    .header p {
      font-size: 11px;
      margin: 2px 0;
    }
    .date {
      font-size: 10px;
    }
    .items {
      border-top: 2px dashed #000;
      border-bottom: 2px dashed #000;
      padding: 10px 0;
      margin: 15px 0;
    }
    .item {
      margin-bottom: 8px;
      font-size: 11px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .item-details {
      font-size: 10px;
      color: #333;
      margin-left: 10px;
    }
    .totals {
      margin-top: 15px;
      font-size: 11px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .discount-row {
      color: #d32f2f;
    }
    .final-total {
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #000;
    }
    .split-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px dashed #000;
    }
    .split-section h3 {
      font-size: 12px;
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .split-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 5px;
      background-color: #f5f5f5;
      font-size: 12px;
    }
    .split-row .name {
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      border-top: 2px dashed #000;
      padding-top: 15px;
    }
    .divider {
      border-bottom: 1px solid #000;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${storeName.toUpperCase()}</h1>
    <p>Save Money. Live Better.</p>
    <p class="date">${new Date().toLocaleString()}</p>
  </div>

  <div class="items">
    ${validItems.map(item => {
      const owners = item.owners.join(', ');
      const taxIndicator = item.taxable ? ' T' : '';
      return `
        <div class="item">
          <div class="item-header">
            <span>${item.name}${taxIndicator}</span>
            <span>$${parseFloat(item.price).toFixed(2)}</span>
          </div>
          <div class="item-details">[${owners}]</div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="totals">
    <div class="totals-row">
      <span>SUBTOTAL</span>
      <span>$${calculations.subtotal.toFixed(2)}</span>
    </div>
    ${discount && parseFloat(discount) > 0 ? `
      <div class="totals-row discount-row">
        <span>DISCOUNT (${discount}%)</span>
        <span>-$${calculations.discountAmount.toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="totals-row">
        <span>SUBTOTAL AFTER DISCOUNT</span>
        <span>$${calculations.subtotalAfterDiscount.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="totals-row">
      <span>TAX (${taxRate}%)</span>
      <span>$${calculations.taxAmount.toFixed(2)}</span>
    </div>
    <div class="totals-row final-total">
      <span>FINAL TOTAL</span>
      <span>$${calculations.finalTotal.toFixed(2)}</span>
    </div>
  </div>

  ${people.length > 0 ? `
    <div class="split-section">
      <h3>WHO OWES WHAT</h3>
      ${people.map(person => `
        <div class="split-row">
          <span class="name">${person}</span>
          <span>$${owedByPerson[person]?.toFixed(2) || '0.00'}</span>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="footer">
    <p>THANK YOU FOR YOUR PURCHASE!</p>
  </div>
</body>
</html>
  `;
};

export const exportToPDF = (items, calculations, people, owedByPerson, taxRate, discount, storeName) => {
  const htmlContent = generatePDFContent(items, calculations, people, owedByPerson, taxRate, discount, storeName);
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};