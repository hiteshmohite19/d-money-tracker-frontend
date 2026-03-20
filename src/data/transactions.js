export const TRANSACTION_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit',
}

export const ALL_TRANSACTIONS = [
  { id: 1, category: 'Food', subCategory: 'Groceries', description: 'Weekly grocery run', type: 'debit', amount: 52.40, date: '2026-01-05', proof: null },
  { id: 2, category: 'Food', subCategory: 'Dining Out', description: 'Dinner with family', type: 'debit', amount: 35.00, date: '2026-01-10', proof: null },
  { id: 3, category: 'Transport', subCategory: 'Bus Pass', description: 'Monthly bus pass', type: 'debit', amount: 45.00, date: '2026-01-12', proof: null },
  { id: 4, category: 'Salary', subCategory: 'Monthly Pay', description: 'January salary', type: 'credit', amount: 3500.00, date: '2026-01-31', proof: null },
  { id: 5, category: 'Utilities', subCategory: 'Electricity', description: 'Electricity bill', type: 'debit', amount: 120.00, date: '2026-02-03', proof: null },
  { id: 6, category: 'Health', subCategory: 'Pharmacy', description: 'Medicine', type: 'debit', amount: 30.00, date: '2026-02-07', proof: null },
  { id: 7, category: 'EMI', subCategory: 'Home Loan', description: 'Feb EMI deduction', type: 'debit', amount: 850.00, date: '2026-02-10', proof: null },
  { id: 8, category: 'Shopping', subCategory: 'Clothing', description: 'Winter jacket', type: 'debit', amount: 75.00, date: '2026-02-14', proof: null },
  { id: 9, category: 'Salary', subCategory: 'Monthly Pay', description: 'February salary', type: 'credit', amount: 3500.00, date: '2026-02-28', proof: null },
  { id: 10, category: 'Food', subCategory: 'Groceries', description: 'Weekly grocery run', type: 'debit', amount: 48.20, date: '2026-03-01', proof: null },
  { id: 11, category: 'Transport', subCategory: 'Fuel', description: 'Petrol refill', type: 'debit', amount: 60.00, date: '2026-03-03', proof: null },
  { id: 12, category: 'EMI', subCategory: 'Car Loan', description: 'March car EMI', type: 'debit', amount: 450.00, date: '2026-03-05', proof: null },
  { id: 13, category: 'Health', subCategory: 'Gym', description: 'Gym membership', type: 'debit', amount: 40.00, date: '2026-03-06', proof: null },
  { id: 14, category: 'Utilities', subCategory: 'Internet', description: 'Monthly internet bill', type: 'debit', amount: 55.00, date: '2026-03-08', proof: null },
  { id: 15, category: 'Salary', subCategory: 'Monthly Pay', description: 'March salary', type: 'credit', amount: 3500.00, date: '2026-03-31', proof: null },
  { id: 16, category: 'Shopping', subCategory: 'Electronics', description: 'Bluetooth headphones', type: 'debit', amount: 130.00, date: '2026-03-15', proof: null },
  { id: 17, category: 'Food', subCategory: 'Dining Out', description: 'Birthday dinner', type: 'debit', amount: 95.00, date: '2026-03-20', proof: null },
  { id: 18, category: 'EMI', subCategory: 'Home Loan', description: 'March EMI deduction', type: 'debit', amount: 850.00, date: '2026-03-10', proof: null },
  { id: 19, category: 'Entertainment', subCategory: 'Netflix', description: 'Monthly subscription', type: 'debit', amount: 15.99, date: '2026-03-07', proof: null },
  { id: 20, category: 'Entertainment', subCategory: 'Movies', description: 'Cinema tickets', type: 'debit', amount: 24.00, date: '2026-03-22', proof: null },
  { id: 21, category: 'Salary', subCategory: 'Bonus', description: 'Q1 performance bonus', type: 'credit', amount: 1200.00, date: '2026-03-28', proof: null },
  { id: 22, category: 'Food', subCategory: 'Groceries', description: 'Monthly stock-up', type: 'debit', amount: 110.00, date: '2026-03-25', proof: null },
  { id: 23, category: 'Health', subCategory: 'Checkup', description: 'Annual health checkup', type: 'debit', amount: 200.00, date: '2026-03-12', proof: null },
  { id: 24, category: 'Transport', subCategory: 'Cab', description: 'Airport cab', type: 'debit', amount: 38.00, date: '2026-03-18', proof: null },
  { id: 25, category: 'Utilities', subCategory: 'Water', description: 'Water bill', type: 'debit', amount: 22.00, date: '2026-03-02', proof: null },
  { id: 26, category: 'Utilities', subCategory: 'Water', description: 'Water bill', type: 'debit', amount: 22.00, date: '2026-04-02', proof: null },
]

// Grouped by category — used by SubCategories page as initial data
export const SUBCATEGORY_DATA = ALL_TRANSACTIONS.reduce((acc, t) => {
  if (!acc[t.category]) acc[t.category] = []
  acc[t.category].push(t)
  return acc
}, {})
