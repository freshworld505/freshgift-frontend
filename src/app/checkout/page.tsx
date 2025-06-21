import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
