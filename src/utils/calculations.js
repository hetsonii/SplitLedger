export const calculateBillTotals = (items, taxRate, discount) => {
  const validItems = items.filter(
    item => item.price && !isNaN(parseFloat(item.price)) && item.owners.length > 0
  );

  const subtotal = validItems.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 1;
    return sum + (parseFloat(item.price) * qty);
  }, 0);
  
  // Apply discount before tax
  const discountValue = parseFloat(discount) || 0;
  const discountAmount = (discountValue / 100) * subtotal;
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  // Calculate tax on discounted amount
  const taxableAmount = validItems
    .filter(i => i.taxable)
    .reduce((sum, item) => {
      const qty = parseInt(item.quantity) || 1;
      const itemPrice = parseFloat(item.price) * qty;
      const itemDiscount = (discountValue / 100) * itemPrice;
      return sum + (itemPrice - itemDiscount);
    }, 0);
  
  const taxAmount = taxableAmount * (taxRate / 100);
  const finalTotal = subtotalAfterDiscount + taxAmount;

  return { 
    subtotal, 
    discountAmount, 
    subtotalAfterDiscount, 
    taxAmount, 
    finalTotal 
  };
};

export const calculatePersonOwed = (items, people, taxRate, discount) => {
  const validItems = items.filter(
    item => item.price && !isNaN(parseFloat(item.price)) && item.owners.length > 0
  );
  
  const discountValue = parseFloat(discount) || 0;
  const owedByPerson = {};

  people.forEach(person => {
    let personTotal = 0;

    validItems.forEach(item => {
      if (item.owners.includes(person)) {
        const splitCount = item.owners.length;
        const qty = parseInt(item.quantity) || 1;
        const itemPrice = parseFloat(item.price) * qty;
        const itemShare = itemPrice / splitCount;
        
        // Apply discount before tax
        const itemDiscount = (discountValue / 100) * itemShare;
        const itemAfterDiscount = itemShare - itemDiscount;
        
        // Calculate tax on discounted amount
        const itemTax = item.taxable ? (itemAfterDiscount * (taxRate / 100)) : 0;
        
        personTotal += itemAfterDiscount + itemTax;
      }
    });

    owedByPerson[person] = personTotal;
  });

  return owedByPerson;
};

export const getPeopleFromItems = (items) => {
  const uniquePeople = new Set();
  items.forEach(item => {
    if (item.owners && Array.isArray(item.owners)) {
      item.owners.forEach(owner => {
        if (owner && owner.trim()) {
          uniquePeople.add(owner.trim());
        }
      });
    }
  });
  return Array.from(uniquePeople);
};