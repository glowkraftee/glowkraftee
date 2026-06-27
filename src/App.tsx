import React, { useEffect, useState } from 'react';

interface Window {
  safepay?: {
    Button: {
      render: (config: any, containerSelector: string) => void;
    };
  };
}

declare const window: Window;

function App() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://storage.googleapis.com/safepayobjects/api/safepay-checkout.min.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.safepay) {
      window.safepay.Button.render({
        env: 'sandbox',
        amount: 1500.00,
        currency: 'PKR',
        client: {
          sandbox: "sec_92e7c585-de47-40f7-b59b-83d350290c06",
          production: "<YOUR_PRODUCTION_KEY>"
        },
        payment: function (data: any, actions: any) {
          return actions.payment.create({
            transaction: {
              amount: 1500.00,
              currency: 'PKR'
            }
          });
        },
        onCheckout: function(data: any, actions: any) {
          alert("🎉 Thank you! Your GlowKraftee payment was processed successfully.");
        },
        onCancel: function(data: any, actions: any) {
          console.log("Payment cancelled.");
        }
      }, '#safepay-button-container');
    }
  }, [scriptLoaded]);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span>Test Order Summary</span>
            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>Rs. 1,500.00</span>
          </div>
        </div>

        <div id="safepay-button-container" style={{ minHeight: '50px', marginTop: '20px' }}>
          {!scriptLoaded && <p style={{ color: '#9ca3af' }}>Loading secure payment gateway...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
