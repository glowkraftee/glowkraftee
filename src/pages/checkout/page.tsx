import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useCart } from '@/hooks/useCart';
import supabase from '@/lib/supabase';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const CHECKOUT_SEO = {
  title: 'Checkout - GlowKraftee | Secure Order for Handcrafted Artisan Goods',
  description: 'Complete your order with GlowKraftee. Secure checkout for premium handcrafted artisan goods. Ships from Pakistan to the USA.',
  keywords: 'checkout GlowKraftee, secure artisan order, handcrafted goods order, Pakistani crafts shipping',
  canonical: 'https://glowkraftee.com/checkout',
};

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'United_Arab_Emirates', 'Saudi_Arabia', 'Other'];

export default function Checkout() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    honeypot: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMessage('');

    if (formData.honeypot.trim() !== '') {
      setSubmitStatus('success');
      clearCart();
      return;
    }

    try {
      // 1. Save pending order details in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
          phone: formData.phone,
          total_amount: subtotal,
          status: 'pending_payment',
          items: items
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Determine environment based on Vercel variables
      const publicKey = import.meta.env.VITE_SAFEPAY_PUBLIC_KEY;
      const isSandbox = !publicKey || publicKey.startsWith('sec_sandbox');
      const safepayBaseUrl = isSandbox 
        ? 'https://sandbox.api.safepaypay.com/checkout/pay'
        : 'https://api.safepaypay.com/checkout/pay';

      // 3. Compile Safepay Parameters
      const checkoutParams = new URLSearchParams({
        environment: isSandbox ? 'sandbox' : 'production',
        clientkey: publicKey || '',
        amount: subtotal.toFixed(2),
        currency: 'USD',
        intent: 'CYBERSOURCE',
        source: 'custom_store',
        order_id: order.id,
        redirect_url: `${window.location.origin}/orders?id=${order.id}&status=success`,
        cancel_url: `${window.location.origin}/checkout?status=cancelled`
      });

      // 4. Redirect user to secure payment portal
      window.location.href = `${safepayBaseUrl}?${checkoutParams.toString()}`;

    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment redirection failed. Please try again.');
      setSubmitStatus('error');
    }
  };

  if (items.length === 0 && submitStatus !== 'submitting') {
    return (
      <div className="min-h-screen bg-background-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="font-heading text-2xl text-text-800 mb-4">Your cart is empty</h2>
          <Link to="/products" className="bg-accent-600 text-white px-6 py-2 rounded-md hover:bg-accent-700 transition">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-background-100">
          <h2 className="font-heading text-xl text-text-900 mb-6">Shipping Details</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} className="hidden" autoComplete="off" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">First Name</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">Last Name</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-600 mb-1">Street Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">State / Province</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-600 mb-1">ZIP / Postal Code</label>
                <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-2 text-sm focus:outline-accent-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-600 mb-1">Country</label>
              <select name="country" value={formData.country} onChange={handleInputChange} className="w-full border border-background-200 rounded px-3 py-3 text-sm bg-white focus:outline-accent-500">
                {COUNTRIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>

            <button type="submit" disabled={submitStatus === 'submitting'} className="w-full mt-6 bg-accent-600 hover:bg-accent-700 text-white font-medium py-3 rounded transition disabled:opacity-50">
              {submitStatus === 'submitting' ? 'Redirecting to Safepay Secure Portal...' : `Pay Safely with Credit Card ($${subtotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        <div className="bg-background-100 p-6 rounded-lg h-fit sticky top-6">
          <h2 className="font-heading text-xl text-text-900 mb-4">Order Summary ({totalItems} items)</h2>
          <div className="divide-y divide-background-200 max-h-64 overflow-y-auto mb-4 pr-2">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between text-sm text-text-800">
                <div>
                  <span className="font-medium text-text-900">{item.name}</span>
                  <span className="text-xs block text-text-500">Qty: {item.quantity}</span>
                </div>
                <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-background-300 pt-4 flex justify-between font-medium text-text-900">
            <span>Subtotal Amount</span>
            <span className="font-mono text-lg">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
