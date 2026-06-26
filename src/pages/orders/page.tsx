import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import supabase from '@/lib/supabase';

type OrderDetails = {
  id: string;
  total_amount: number;
  customer_name: string;
  status: string;
};

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const statusParam = searchParams.get('status');
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    async function verifyAndUpdaterOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // If coming back from a successful payment portal session
        if (statusParam === 'success') {
          await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId);
        }

        const { data } = await supabase
          .from('orders')
          .select('id, total_amount, customer_name, status')
          .eq('id', orderId)
          .single();

        if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyAndUpdaterOrder();
  }, [orderId, statusParam]);

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-background-100 text-center">
          {loading ? (
            <div className="text-text-600 animate-pulse">Verifying payment status...</div>
          ) : statusParam === 'success' || order?.status === 'paid' ? (
            <>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl text-text-900 mb-2">Thank you, {order?.customer_name || 'Customer'}!</h2>
              <p className="text-sm text-text-600 mb-6">Your order has been safely placed. We are processing it for shipment right away.</p>
              
              <div className="bg-background-50 p-4 rounded mb-6 text-left font-mono text-xs text-text-700 space-y-1">
                <div><span className="font-semibold text-text-900">Order ID:</span> {order?.id}</div>
                <div><span className="font-semibold text-text-900">Total Paid:</span> ${(order?.total_amount ?? 0).toFixed(2)} USD</div>
                <div><span className="font-semibold text-text-900">Status:</span> Securely Confirmed</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl text-text-900 mb-2">Payment Cancelled</h2>
              <p className="text-sm text-text-600 mb-6">The transaction was cancelled or could not be finalized. No charges were made.</p>
            </>
          )}

          <Link to="/" className="inline-block bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-2.5 rounded text-sm transition">
            Return to Storefront
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
