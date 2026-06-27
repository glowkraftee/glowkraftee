import React, { useState } from 'react';

function App() {
const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

const handleCheckout = () => {
    const baseUrl = "https://sandbox.api.atsafepay.com/components";
    const clientKey = "sec_92e7c585-de47-40f7-b59b-83d350290c06";
    const orderId = `ORDER_${Date.now()}`;
  const checkoutUrl = `${baseUrl}?env=sandbox&client=${clientKey}&amount=15.00&currency=USD&order_id=${orderId}`;
    
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
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#ffffff',
        padding: '35px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#111827', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
          🛍️ GlowKraftee
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '30px', fontStyle: 'italic' }}>
          Where Artisans Glow Relations with Love & Care - Storefront
        </p>
        
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', color: '#374151' }}>
            <span style={{ fontWeight: '500' }}>Handcrafted Premium Item</span>
            <span style={{ fontWeight: 'bold', color: '#111827' }}>$15.00</span>
          </div>
          <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
            <span>Shipping (USA Base)</span>
            <span style={{ color: '#111827', fontWeight: '500' }}>Calculated at cart</span>
          </div>
        </div>

        {paymentStatus === 'idle' && (
          <button 
        onClick={handleCheckout}
            style={{
              width: '100%',
              backgroundColor: '#0066cc',
              color: '#ffffff',
              padding: '15px 24px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 102, 204, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0052a3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
          >
            Proceed to Secure Checkout
          </button>
        )}

        {paymentStatus === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0066cc',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              animation: 'spin 1s linear infinite',
              marginBottom: '15px'
            }}></div>
            <span style={{ color: '#4b5563', fontSize: '15px', fontWeight: '500' }}>Connecting to Safepay Sandbox...</span>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div style={{ 
            backgroundColor: '#ecfdf5', 
            border: '1px solid #a7f3d0', 
            borderRadius: '10px', 
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ color: '#065f46', fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              Payment Link Verified
            </h3>
            <p style={{ color: '#047857', fontSize: '13px', margin: '0 0 15px 0' }}>
              Safepay gateway component ready to link item total data into live checkout.
            </p>
            <button 
              onClick={() => setPaymentStatus('idle')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#374151'
              }}
            >
              Reset Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
