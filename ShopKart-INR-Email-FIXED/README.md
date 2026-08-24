# ShopKart — React + Redux Toolkit

A polished e-commerce demo built with React, Redux Toolkit, React Router and responsive CSS.

## Features

- Product catalogue
- Search, category filtering and sorting
- Product details
- Add to cart / quantity management
- Wishlist
- Persistent Redux state using localStorage
- Login demo
- Checkout and order confirmation
- Order history
- Responsive design
- No real payment processing

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown by Vite.

## Project structure

- `src/data` — product data
- `src/redux` — Redux Toolkit slices and store
- `src/App.jsx` — application pages/components
- `src/styles.css` — responsive UI


## Updates
- Product, cart, checkout and order prices now use Indian Rupees (INR).
- Free shipping applies to orders of ₹1,500 or more; otherwise ₹99 shipping is shown.
- Orders store the customer email and delivery details.
- After checkout, the confirmation page provides a button to prepare the complete order confirmation in the customer's email app using `mailto:`. A real automatic email service requires a backend/email provider.
