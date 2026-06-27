import React from 'react';

function App() {
  const handleCheckout = () => {
    const baseUrl = "https://sandbox.api.getsafepay.com/components";
    const clientKey = "sec_92e7c585-de47-40f7-b59b-83d350290c06";
    const orderId = `ORDER_${Date.now()}`;
    
    // Updated currency parameter to USD and amount to 15.00
    const checkoutUrl = `${baseUrl}?env=sandbox&client=${clientKey}&amount=15.00&currency=USD&order_id=${orderId}`;
    
    // Redirect securely to the Safepay checkout view
    window.location.href = checkoutUrl;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '450px',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#111827', fontSize: '22px', marginBottom: '10px', fontWeight: 'bold' }}>
          🛍️ GlowKraftee
        </h1>
        <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '30px', fontStyle: 'italic' }}>
          Where Artisans Glow Relations with Love & Care - Opening Soon
        </p>
        
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
            <span>Test Order Summary</span>
            {/* Updated UI text label to US Dollars */}
            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>$15.00</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          style={{
            width: '100%',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            padding: '14px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(0, 102, 204, 0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0052a3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
        >
          Proceed to Secure Checkout
        </button>
      </div>
    </div>
  );
}

export default App;
