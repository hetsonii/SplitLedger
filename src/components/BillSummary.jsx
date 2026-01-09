export default function BillSummary({ 
  calculations, 
  taxRate, 
  discount, 
  onDiscountChange,
  people,
  owedByPerson 
}) {
  return (
    <>
      <div style={{ 
        marginTop: '15px', 
        fontSize: '11px', 
        paddingBottom: '10px', 
        borderBottom: '2px dashed #000' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '3px' 
        }}>
          <span>SUBTOTAL</span>
          <span>${calculations.subtotal.toFixed(2)}</span>
        </div>

        <div style={{ 
          marginTop: '10px', 
          marginBottom: '10px',
          padding: '8px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ddd' 
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontSize: '11px' 
          }}>
            DISCOUNT (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => onDiscountChange(e.target.value)}
            placeholder="0"
            style={{ 
              width: '100%', 
              padding: '6px', 
              fontSize: '12px', 
              border: '1px solid #333' 
            }}
          />
        </div>

        {discount && parseFloat(discount) > 0 && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '3px', 
              color: '#d32f2f' 
            }}>
              <span>DISCOUNT ({discount}%)</span>
              <span>-${calculations.discountAmount.toFixed(2)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #ddd'
            }}>
              <span>SUBTOTAL AFTER DISCOUNT</span>
              <span>${calculations.subtotalAfterDiscount.toFixed(2)}</span>
            </div>
          </>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '8px' 
        }}>
          <span>TAX ({taxRate}%)</span>
          <span>${calculations.taxAmount.toFixed(2)}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginTop: '10px', 
          paddingTop: '10px', 
          borderTop: '2px solid #000' 
        }}>
          <span>FINAL TOTAL</span>
          <span>${calculations.finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {people.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            marginBottom: '10px', 
            fontWeight: 'bold', 
            textAlign: 'center' 
          }}>
            WHO OWES WHAT
          </h3>
          {people.map(person => (
            <div 
              key={person} 
              style={{ 
                fontSize: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px', 
                padding: '5px', 
                backgroundColor: '#f5f5f5' 
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{person}</span>
              <span>${owedByPerson[person]?.toFixed(2) || '0.00'}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}