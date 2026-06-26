import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './pages/checkout/page';
import OrderStatus from './pages/orders/page';

// Note: If you have home or product list components, import them here later.
// For now, we are establishing the main routes for your checkout flow.

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Checkout Flow Routes */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderStatus />} />
        
        {/* Fallback route if a page isn't found */}
        <Route 
          path="*" 
          value={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">GlowKraftee Storefront</h1>
                <p className="text-gray-600">Checkout system initialized securely.</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}
