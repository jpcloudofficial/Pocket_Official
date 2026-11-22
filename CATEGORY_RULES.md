# Managing automatic category rules

Automatic transaction categories are read from the Firestore document `config/categoryRules`. Create a `config` collection, then a `categoryRules` document with a `rules` field of type Array. Each array item is a map with:
  
- `category`: a transaction category name
- `words`: an array of matching words or phrases

The array order matters: the first rule whose word matches the transaction title wins. Changes are picked up by open app sessions automatically.

When creating the document, include all rules you want active. If the document is missing or unavailable, Pocket falls back to its built-in rules. Once the document exists, its `rules` array replaces those defaults.

Starter data:

```json
{
  "rules": [
    { "category": "Transportation", "words": ["jeepney", "jeep", "bus", "taxi", "grab", "uber", "train", "mrt", "lrt", "commute", "fare", "parking", "toll", "gasoline", "fuel", "tryc", "sidecar"] },
    { "category": "Food & Drinks", "words": ["jollibee", "mcdonald", "mcdo", "restaurant", "lunch", "dinner", "breakfast", "coffee", "cafe", "food", "meal", "eatery", "pizza", "kfc", "chowking"] },
    { "category": "Groceries", "words": ["grocery", "groceries", "supermarket", "palengke", "vegetable", "vegetables", "rice", "meat", "market"] },
    { "category": "Snacks", "words": ["snack", "milk tea", "milktea", "boba", "donut", "doughnut", "bakery", "pastry", "dessert", "cookie", "chips"] },
    { "category": "Personal Care", "words": ["haircut", "barber", "salon", "shampoo", "skincare", "skin care", "toiletries", "soap", "personal care", "nail"] },
    { "category": "Shopping", "words": ["shopee", "lazada", "clothes", "clothing", "shoes", "shirt", "dress", "online shopping", "mall"] },
    { "category": "Household Expenses", "words": ["household", "cleaning", "detergent", "furniture", "home supplies", "cleaning supplies"] },
    { "category": "Bills & Utilities", "words": ["electric bill", "electricity", "meralco", "water bill", "maynilad", "internet", "wifi", "broadband", "phone bill", "utility", "utilities"] },
    { "category": "Subscriptions", "words": ["spotify", "netflix", "youtube premium", "subscription", "disney plus", "icloud", "google one"] },
    { "category": "Entertainment", "words": ["movie", "cinema", "concert", "videogame", "video game", "game", "karaoke", "bowling", "entertainment"] },
    { "category": "Health & Wellness", "words": ["pharmacy", "medicine", "medication", "doctor", "clinic", "hospital", "vitamins", "dental", "checkup", "health"] },
    { "category": "Salary", "words": ["salary", "payroll", "paycheck", "wage"] },
    { "category": "Allowance", "words": ["allowance", "pocket money"] },
    { "category": "Freelance / Side Hustle", "words": ["freelance", "client payment", "side hustle", "gig", "commission"] },
    { "category": "Bonus", "words": ["bonus", "incentive"] },
    { "category": "Cashback", "words": ["cashback", "cash back", "cash-back", "cash reward"] },
    { "category": "Refund", "words": ["refund", "reimbursement"] }
  ]
}
```

Clients can read this document, but only project administrators can change it through Firebase Console. Deploy the app and Firestore rules with `firebase deploy --only hosting,firestore:rules`.
