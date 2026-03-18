"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Terms & Conditions</h2>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">CleanFreaks by Henam — Effective 1st March, 2026</p>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 text-sm text-gray-700 leading-relaxed flex-1 overscroll-contain">

              <section>
                <p><strong>Company:</strong> Henam Facility Management Limited ("Henam", "we", "us", or "our")</p>
                <p className="mt-1"><strong>Service Brand:</strong> CleanFreaks by Henam</p>
              </section>

              <Section title="1. Introduction">
                <p>These Terms and Conditions govern the provision of residential and commercial cleaning services under the CleanFreaks by Henam brand.</p>
                <p className="mt-2">By booking, subscribing, or using our services, you ("Client", "you", or "your") agree to be bound by these Terms.</p>
              </Section>

              <Section title="2. Scope of Services">
                <p>2.1 CleanFreaks provides <strong>standard cleaning services</strong> including but not limited to:</p>
                <BulletList items={["Floor cleaning", "Surface wiping", "Kitchen and bathroom cleaning", "Dusting"]} />
                <p className="mt-3">2.2 Each session is strictly limited to:</p>
                <BulletList items={["One (1) cleaner per visit", "Maximum duration of three (3) hours"]} />
                <p className="mt-3">2.3 Services <strong>DO NOT include</strong>:</p>
                <BulletList items={["Post-construction cleaning", "Hazardous waste removal", "Industrial cleaning", "Biohazard cleaning", "Heavy stain restoration unless separately agreed"]} />
                <p className="mt-3">2.4 Any additional service outside scope shall:</p>
                <BulletList items={["Attract extra charges", "Be subject to availability"]} />
              </Section>

              <Section title="3. Bookings and Access">
                <p>3.1 Clients must:</p>
                <BulletList items={["Provide accurate address and contact details", "Ensure access to the premises at the scheduled time"]} />
                <p className="mt-3">3.2 If access is denied or delayed beyond <strong>30 minutes</strong>:</p>
                <BulletList items={["The session may be cancelled", "The session will be counted as used"]} />
              </Section>

              <Section title="4. Subscription Plans">
                <p>4.1 Subscription plans are:</p>
                <BulletList items={["Prepaid", "Valid only within the stated duration"]} />
                <p className="mt-3">4.2 Unused sessions:</p>
                <BulletList items={["Expire at the end of the subscription period", "Are non-refundable and non-transferable"]} />
                <p className="mt-3">4.3 CleanFreaks reserves the right to:</p>
                <BulletList items={["Reschedule sessions based on operational availability", "Optimize routes and timing"]} />
              </Section>

              <Section title="5. Pricing and Payment">
                <p>5.1 All services are payable <strong>in advance</strong>.</p>
                <p className="mt-2">5.2 Prices are subject to review without prior notice (for new customers only).</p>
                <p className="mt-2">5.3 Accepted payment methods:</p>
                <BulletList items={["Bank transfer to Henam Facility Management Limited or other approved accounts", "Approved digital channels"]} />
              </Section>

              <Section title="6. Client Responsibilities">
                <p>The Client shall:</p>
                <p className="mt-2">6.1 Provide:</p>
                <BulletList items={["Water supply", "Electricity"]} />
                <p className="mt-3">6.2 Ensure:</p>
                <BulletList items={["Safe working environment", "Removal of fragile, valuable, or sensitive items"]} />
                <p className="mt-3">6.3 Inform CleanFreaks in advance of:</p>
                <BulletList items={["Pets", "Special conditions", "Security protocols"]} />
              </Section>

              <Section title="7. Limitation of Liability">
                <p>7.1 CleanFreaks shall not be liable for:</p>
                <BulletList items={["Pre-existing damage", "Normal wear and tear", "Improper installations"]} />
                <p className="mt-3">7.2 Liability for damages (if proven) shall be limited to the <strong>cost of the service for that session</strong>.</p>
                <p className="mt-2">7.3 Claims must be reported within <strong>24 hours</strong> of service delivery.</p>
              </Section>

              <Section title="8. Staff Conduct and Protection">
                <p>8.1 All CleanFreaks personnel are employees or authorized contractors of Henam Facility Management Limited.</p>
                <p className="mt-2">8.2 Clients shall not harass, threaten, or mistreat staff.</p>
                <p className="mt-2">8.3 CleanFreaks reserves the right to withdraw services where staff safety is compromised.</p>
              </Section>

              <Section title="9. Cancellation and Rescheduling">
                <p>9.1 Clients may reschedule with at least <strong>24 hours notice</strong>.</p>
                <p className="mt-2">9.2 Late cancellations will result in <strong>loss of that session</strong>.</p>
              </Section>

              <Section title="10. Refunds Policy">
                <p>10.1 Payments are <strong>non-refundable</strong>.</p>
                <p className="mt-2">10.2 Exceptions may apply only at the sole discretion of CleanFreaks.</p>
              </Section>

              <Section title="11. Health and Safety">
                <p>CleanFreaks reserves the right to refuse service where conditions are unsafe or there is exposure to hazardous substances.</p>
              </Section>

              <Section title="12. Force Majeure">
                <p>CleanFreaks shall not be liable for failure or delay caused by:</p>
                <BulletList items={["Acts of God", "Government actions", "Civil unrest", "Transportation disruptions"]} />
              </Section>

              <Section title="13. Termination">
                <p>CleanFreaks may terminate services if:</p>
                <BulletList items={["Terms are violated", "Payments are not made", "There is abuse toward staff"]} />
              </Section>

              <Section title="14. Intellectual Property">
                <p>All branding, logos, and materials remain the property of <strong>Henam Facility Management Limited</strong>.</p>
              </Section>

              <Section title="15. Governing Law">
                <p>These Terms shall be governed by the laws of the <strong>Federal Republic of Nigeria</strong>.</p>
              </Section>

              <Section title="16. Dispute Resolution">
                <p>16.1 Parties shall first attempt amicable resolution.</p>
                <p className="mt-2">16.2 Failing which, disputes shall be resolved by a <strong>court of competent jurisdiction in Nigeria</strong>.</p>
              </Section>

              <Section title="17. Amendments">
                <p>CleanFreaks reserves the right to update these Terms at any time. Continued use of services constitutes acceptance.</p>
              </Section>

              <Section title="18. Service Limitation Policy">
                <p>CleanFreaks is a <strong>maintenance cleaning service</strong>, not a restoration service. Where a space requires excessive effort due to neglect or dirt accumulation beyond normal living conditions, CleanFreaks reserves the right to:</p>
                <BulletList items={["Decline the job, OR", "Convert it to a deep cleaning service at an additional fee"]} />
              </Section>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-brand-primary text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-100 pt-4">
      <h3 className="font-black text-gray-900 uppercase tracking-wide text-xs mb-2">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 space-y-1 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-brand-primary font-black mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
