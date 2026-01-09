import { useState, useMemo, useEffect } from 'react';
import ItemInput from './components/ItemInput';
import BillSummary from './components/BillSummary';
import ExportButtons from './components/ExportButtons';
import { calculateBillTotals, calculatePersonOwed, getPeopleFromItems } from './utils/calculations';
import { toTitleCase } from './utils/stringUtils';

export default function App() {
  const [items, setItems] = useState([]);
  const [taxRate, setTaxRate] = useState(8.25);
  const [discount, setDiscount] = useState('');
  const [storeName, setStoreName] = useState('BILL');

  const people = useMemo(() => getPeopleFromItems(items), [items]);

  const calculations = useMemo(
    () => calculateBillTotals(items, taxRate, discount),
    [items, taxRate, discount]
  );

  const owedByPerson = useMemo(
    () => calculatePersonOwed(items, people, taxRate, discount),
    [items, people, taxRate, discount]
  );

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      price: '',
      quantity: '1',
      taxable: true,
      owners: [],
      ownerInput: ''
    };
    setItems([...items, newItem]);
  };

  useEffect(() => {
    if (items.length === 0) {
      addNewItem();
    }
  }, []);

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addOwnerToItem = (itemId, ownerName) => {
    if (!ownerName.trim()) return;
    
    setItems(items.map(item => {
      if (item.id === itemId) {
        // Convert to title case for consistency
        const trimmedName = toTitleCase(ownerName.trim());
        if (!item.owners.includes(trimmedName)) {
          return {
            ...item,
            owners: [...item.owners, trimmedName],
            ownerInput: ''
          };
        }
      }
      return item;
    }));
  };

  const removeOwnerFromItem = (itemId, ownerName) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, owners: item.owners.filter(o => o !== ownerName) }
        : item
    ));
  };

  const splitAmongAll = (itemId) => {
    if (people.length === 0) return;
    
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, owners: [...people] }
        : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    if (items.length === 1) {
      addNewItem();
    }
  };

  const handleItemBlur = (item) => {
    if (!item.name && !item.price && item.owners.length === 0) {
      if (items.length > 1) {
        removeItem(item.id);
      }
    }
  };

  return (
    <div style={{
      fontFamily: 'Courier New, monospace',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px 10px',
      backgroundColor: '#fff',
      minHeight: '100vh'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        borderBottom: '2px dashed #000', 
        paddingBottom: '15px' 
      }}>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Bill Name"
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: 'none',
            borderBottom: '1px solid #ddd',
            fontFamily: 'Courier New, monospace',
            width: '100%',
            marginBottom: '5px'
          }}
        />
        <p style={{ fontSize: '10px', margin: '2px 0' }}>{new Date().toLocaleString()}</p>
      </div>

      <div style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        border: '1px solid #ddd' 
      }}>
        <label style={{ 
          fontSize: '11px', 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold' 
        }}>
          TAX RATE (%)
        </label>
        <input
          type="number"
          step="0.01"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          style={{ 
            width: '100%', 
            padding: '6px', 
            fontSize: '12px', 
            border: '1px solid #333' 
          }}
        />
      </div>

      <div style={{ 
        borderTop: '2px dashed #000', 
        borderBottom: '2px dashed #000', 
        paddingTop: '10px' 
      }}>
        {items.map((item, index) => (
          <div key={item.id}>
            <ItemInput
              item={item}
              people={people}
              onUpdate={updateItem}
              onRemove={removeItem}
              onBlur={handleItemBlur}
              onAddOwner={addOwnerToItem}
              onRemoveOwner={removeOwnerFromItem}
              onSplitAll={splitAmongAll}
            />
            {index < items.length - 1 && (
              <div style={{ 
                height: '1px', 
                backgroundColor: '#ddd', 
                margin: '8px 0' 
              }} />
            )}
          </div>
        ))}
        
        <button 
          onClick={addNewItem}
          style={{ 
            width: '100%', 
            padding: '8px', 
            fontSize: '11px', 
            backgroundColor: '#0071ce', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer', 
            marginTop: '10px' 
          }}
        >
          + ADD ITEM
        </button>
      </div>

      <BillSummary
        calculations={calculations}
        taxRate={taxRate}
        discount={discount}
        onDiscountChange={setDiscount}
        people={people}
        owedByPerson={owedByPerson}
      />

      <ExportButtons
        items={items}
        calculations={calculations}
        people={people}
        owedByPerson={owedByPerson}
        taxRate={taxRate}
        discount={discount}
        storeName={storeName}
      />

      <div style={{
        marginTop: '30px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
      }}>
        <a
          href="https://github.com/hetsonii/SplitLedger"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span>💜</span>
          <span>by hetsonii</span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span>⭐</span>
        </a>
      </div>
    </div>
  );
}