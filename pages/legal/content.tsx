import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '@/lib/siteConfig';

// Owner / business facts used on the policy pages. Edit here if they change.
export const OWNER_NAME = 'Altaf Iqbal';
export const BUSINESS_NAME = 'GlowKraftee';
export const BUSINESS_TYPE = 'sole proprietorship';
export const BUSINESS_ADDRESS = 'Gulberg III, Lahore, Punjab 54660, Pakistan';
export const LAST_UPDATED = '25 October 2026';

const Mail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-700 underline underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

export interface LegalDoc {
  path: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  ownership: {
    path: '/ownership',
    title: 'Ownership Statement',
    intro: (
      <>
        www.glowkraftee.com and the GlowKraftee brand are owned and operated by{' '}
        <strong>{OWNER_NAME}</strong>, trading as <strong>{BUSINESS_NAME}</strong>, a {BUSINESS_TYPE}{' '}
        registered in Pakistan.
      </>
    ),
    sections: [
      {
        heading: 'Business details',
        body: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Owner: {OWNER_NAME}</li>
            <li>Trading name: {BUSINESS_NAME}</li>
            <li>Business type: Sole proprietorship</li>
            <li>Address: {BUSINESS_ADDRESS}</li>
            <li>Email: <Mail /></li>
            <li>Website: www.glowkraftee.com</li>
          </ul>
        ),
      },
      {
        heading: 'What we sell',
        body: (
          <p>
            Handmade Pakistani home decor, Himalayan salt products, leather goods, personalised gifts and
            digital downloads, sold online through this website.
          </p>
        ),
      },
      {
        heading: 'Payments',
        body: (
          <p>
            Card payments on this website are processed securely by Safepay. GlowKraftee does not see or
            store your full card details. Charges appear on your statement under the GlowKraftee name.
          </p>
        ),
      },
    ],
  },

  refund: {
    path: '/refund-policy',
    title: 'Cancellation, Return & Refund Policy',
    intro: <>We want you to love every piece. This policy explains how cancellations, returns and refunds work.</>,
    sections: [
      {
        heading: 'Cancelling an order',
        body: (
          <p>
            You can cancel an order for a full refund any time before it is dispatched. Email <Mail /> with
            your order number as soon as possible. Once an order has been dispatched it can no longer be
            cancelled, but the return rules below still apply.
          </p>
        ),
      },
      {
        heading: 'Damaged, defective or wrong items',
        body: (
          <p>
            If your item arrives damaged, defective or significantly different from its description, contact
            us within <strong>7 days of delivery</strong> with your order number and photos of the problem. We
            will send a replacement or give you a full refund, including shipping. We may ask you to return the
            item; if so, we pay the return postage.
          </p>
        ),
      },
      {
        heading: 'Change of mind',
        body: (
          <p>
            Because our products are handcrafted and many are made to order or personalised, we cannot accept
            returns for change of mind. Please read the product description carefully and contact us before
            ordering if you have any questions.
          </p>
        ),
      },
      {
        heading: 'Digital downloads',
        body: (
          <p>
            Digital products are delivered instantly after payment, so they are non-refundable once the
            download link has been issued. If a file is faulty or will not open, contact us and we will send
            a working copy or refund you.
          </p>
        ),
      },
      {
        heading: 'How refunds are paid',
        body: (
          <p>
            Approved refunds are returned to the card you paid with, normally within 5–7 business days. Your
            bank may take a few extra days to show it. We will email you when the refund is made.
          </p>
        ),
      },
      {
        heading: 'Contact',
        body: <p>For any cancellation, return or refund, email <Mail /> with your order number.</p>,
      },
    ],
  },

  shipping: {
    path: '/shipping-policy',
    title: 'Shipping Policy',
    intro: <>We ship our handcrafted pieces from Pakistan to customers in the United States and other countries.</>,
    sections: [
      {
        heading: 'Delivery times',
        body: (
          <p>
            Orders are normally dispatched within a few business days. Standard delivery to the United States
            usually takes <strong>7–14 business days</strong> after dispatch. Other countries may take longer,
            depending on the destination and customs.
          </p>
        ),
      },
      {
        heading: 'Shipping cost',
        body: (
          <p>
            Shipping is shown at checkout before you pay. Orders of $800 or more ship free. Digital downloads
            have no shipping charge.
          </p>
        ),
      },
      {
        heading: 'Tracking',
        body: <p>When your order is dispatched we email you a tracking number.</p>,
      },
      {
        heading: 'Customs and import charges',
        body: (
          <p>
            Some countries charge import duties or taxes on arrival. Any such charges are set by the
            destination country and are the buyer's responsibility.
          </p>
        ),
      },
      {
        heading: 'Problems with delivery',
        body: (
          <p>
            If your parcel is lost or arrives damaged, email <Mail />. See our{' '}
            <Link to="/refund-policy" className="text-accent-700 underline underline-offset-4">
              Return & Refund Policy
            </Link>{' '}
            for what happens next.
          </p>
        ),
      },
    ],
  },

  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    intro: (
      <>
        This policy explains what personal information {BUSINESS_NAME} collects when you use
        www.glowkraftee.com, why we collect it and how we protect it.
      </>
    ),
    sections: [
      {
        heading: 'Information we collect',
        body: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Order details: your name, email, phone number and delivery address.</li>
            <li>Messages you send through our contact form.</li>
            <li>Your email address if you join our newsletter.</li>
            <li>
              Payment details are entered on Safepay's secure page. We do not see or store your full card
              number.
            </li>
          </ul>
        ),
      },
      {
        heading: 'How we use it',
        body: (
          <ul className="list-disc pl-5 space-y-1">
            <li>To process, deliver and support your order, and to send order and download emails.</li>
            <li>To reply to your messages.</li>
            <li>To send newsletters, only if you signed up. You can unsubscribe at any time.</li>
            <li>To meet legal, tax and fraud-prevention obligations.</li>
          </ul>
        ),
      },
      {
        heading: 'Who we share it with',
        body: (
          <p>
            We never sell your information. We share only what is needed with the services that run our shop:
            Safepay (payments), Supabase (secure database and file storage), Resend (order emails), Vercel
            (website hosting) and the courier that delivers your order.
          </p>
        ),
      },
      {
        heading: 'Cookies and browser storage',
        body: (
          <p>
            We use your browser's storage to remember your shopping cart. We do not use advertising cookies.
          </p>
        ),
      },
      {
        heading: 'How long we keep it',
        body: (
          <p>
            Order records are kept for as long as required for accounting and tax purposes. Newsletter
            addresses are kept until you unsubscribe.
          </p>
        ),
      },
      {
        heading: 'Your rights',
        body: (
          <p>
            You can ask to see, correct or delete the personal information we hold about you by emailing{' '}
            <Mail />.
          </p>
        ),
      },
      {
        heading: 'Changes to this policy',
        body: <p>We may update this policy. The date at the top shows when it last changed.</p>,
      },
    ],
  },

  terms: {
    path: '/terms',
    title: 'Terms and Conditions',
    intro: (
      <>
        These terms apply when you use www.glowkraftee.com or buy from us. The website is operated by{' '}
        {OWNER_NAME}, trading as {BUSINESS_NAME} ({BUSINESS_ADDRESS}). By placing an order you agree to these
        terms.
      </>
    ),
    sections: [
      {
        heading: 'Products',
        body: (
          <p>
            Our products are handmade, so colour, size, pattern and finish can vary slightly from the photos.
            These natural variations are part of each piece's character and are not defects.
          </p>
        ),
      },
      {
        heading: 'Prices and payment',
        body: (
          <p>
            Prices are shown in US dollars. Shipping and tax are added at checkout before you pay. Payment is
            taken by card through Safepay. Your order is confirmed once payment succeeds and you receive our
            confirmation email.
          </p>
        ),
      },
      {
        heading: 'Order acceptance',
        body: (
          <p>
            We may refuse or cancel an order, for example if an item is out of stock or a price was shown in
            error. If we cancel, we refund you in full.
          </p>
        ),
      },
      {
        heading: 'Shipping, returns and refunds',
        body: (
          <p>
            See our{' '}
            <Link to="/shipping-policy" className="text-accent-700 underline underline-offset-4">
              Shipping Policy
            </Link>{' '}
            and{' '}
            <Link to="/refund-policy" className="text-accent-700 underline underline-offset-4">
              Cancellation, Return & Refund Policy
            </Link>
            .
          </p>
        ),
      },
      {
        heading: 'Digital products',
        body: (
          <p>
            Digital downloads are licensed for your personal, non-commercial use. You may not resell, share or
            redistribute the files.
          </p>
        ),
      },
      {
        heading: 'Intellectual property',
        body: (
          <p>
            All text, photos, designs and logos on this website belong to {BUSINESS_NAME} and may not be
            copied without permission.
          </p>
        ),
      },
      {
        heading: 'Liability',
        body: (
          <p>
            Products should be used as described. Our liability for any order is limited to the amount you paid
            for it, except where the law does not allow such a limit.
          </p>
        ),
      },
      {
        heading: 'Governing law',
        body: <p>These terms are governed by the laws of Pakistan.</p>,
      },
      {
        heading: 'Contact',
        body: <p>Questions about these terms? Email <Mail />.</p>,
      },
    ],
  },
};
