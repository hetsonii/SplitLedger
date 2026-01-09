export default function ItemInput({ 
  item, 
  people, 
  onUpdate, 
  onRemove, 
  onBlur,
  onAddOwner,
  onRemoveOwner,
  onSplitAll
}) {
  const handleOwnerInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (item.ownerInput) {
        onAddOwner(item.id, item.ownerInput);
      }
    }
  };

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '3px' }}>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
          onBlur={() => onBlur(item)}
          placeholder="Item name"
          style={{ 
            flex: '2', 
            padding: '6px', 
            fontSize: '11px', 
            border: '1px solid #999', 
            fontFamily: 'Courier New, monospace' 
          }}
        />
        <input
          type="number"
          step="0.01"
          value={item.price}
          onChange={(e) => onUpdate(item.id, 'price', e.target.value)}
          onBlur={() => onBlur(item)}
          placeholder="$"
          style={{ 
            width: '70px', 
            padding: '6px', 
            fontSize: '11px', 
            border: '1px solid #999', 
            fontFamily: 'Courier New, monospace' 
          }}
        />
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '3px', 
          fontSize: '10px', 
          whiteSpace: 'nowrap' 
        }}>
          <input
            type="checkbox"
            checked={item.taxable}
            onChange={(e) => onUpdate(item.id, 'taxable', e.target.checked)}
            style={{ margin: 0 }}
          />
          T
        </label>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '5px', 
        alignItems: 'center', 
        marginBottom: '5px' 
      }}>
        <input
          type="text"
          list={`people-list-${item.id}`}
          value={item.ownerInput}
          onChange={(e) => onUpdate(item.id, 'ownerInput', e.target.value)}
          onKeyDown={handleOwnerInputKeyDown}
          onBlur={(e) => {
            if (e.target.value.trim()) {
              onAddOwner(item.id, e.target.value);
            }
          }}
          placeholder="Add person (Enter to add)"
          style={{ 
            flex: 1, 
            padding: '6px', 
            fontSize: '11px', 
            border: '1px solid #999', 
            fontFamily: 'Courier New, monospace' 
          }}
        />
        <datalist id={`people-list-${item.id}`}>
          {people.map(person => (
            <option key={person} value={person} />
          ))}
        </datalist>
        
        {people.length > 0 && (
          <button
            onClick={() => onSplitAll(item.id)}
            title="Split among all"
            style={{ 
              padding: '6px 8px', 
              fontSize: '10px', 
              cursor: 'pointer', 
              backgroundColor: '#4CAF50', 
              color: '#fff', 
              border: 'none', 
              whiteSpace: 'nowrap' 
            }}
          >
            ✓ ALL
          </button>
        )}
        
        <button 
          onClick={() => onRemove(item.id)}
          style={{ 
            padding: '6px 8px', 
            fontSize: '10px', 
            cursor: 'pointer', 
            backgroundColor: '#f44336', 
            color: '#fff', 
            border: 'none' 
          }}
        >
          X
        </button>
      </div>

      {item.owners.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>
          {item.owners.map(owner => (
            <span
              key={owner}
              style={{
                fontSize: '10px',
                padding: '3px 6px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196F3',
                borderRadius: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {owner}
              <button
                onClick={() => onRemoveOwner(item.id, owner)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '12px',
                  color: '#f44336',
                  fontWeight: 'bold',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}