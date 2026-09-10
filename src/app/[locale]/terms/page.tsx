export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service (AGB) – DEEPXCLUSIVE SARLS</h1>
        
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. General Information</h2>
            <p>The company DEEPXCLUSIVE SARLS, represented by Tom ROSSLER, Daniel CONRARDY, and Antonio AMARAL, registered under RCS Luxembourg No. B249026, located at 20, Rue d&apos;Arlon, L-9155 Grosbous, Luxembourg, VAT-ID: LU32633157, Tel: +352 838072201, Email: info@deepxclusive.com, (hereinafter referred to as COMPANY), offers and sells automotive tuning software, hardware, and related digital services via its online platform.</p>
            <p>Unless otherwise agreed in writing, these Terms and Conditions apply to all orders and services provided by COMPANY.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Offers and Contract Conclusion</h2>
            <p>All offers on the COMPANY&apos;s website are non-binding and subject to change. A contract is concluded when an order is placed by the buyer and accepted by COMPANY, either automatically through the website or by written confirmation. COMPANY reserves the right to refuse any order without giving reasons. All prices and information on the website are created with great care; however, errors and omissions are excepted. COMPANY is entitled to correct obvious mistakes without liability.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Prices and Payment</h2>
            <p>All prices are stated in Euro (EUR) and include VAT where applicable. Payment can be made via PayPal, bank transfer, or via Credits purchased in advance through the online platform. Credits are non-transferable and non-refundable, except in cases where COMPANY cancels or cannot fulfill an order. COMPANY may adjust prices annually to reflect market conditions or inflation. Updated prices are always displayed in the online shop.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Refund Policy</h2>
            <p>Since COMPANY provides digital goods (software, tuning files) that are immediately available for download, the right of withdrawal (revocation) under EU consumer law does not apply once the digital delivery or download has begun. Refunds are therefore only possible in the form of credits (not cash) and only if: the ordered file or service was not delivered, or the delivered file was technically faulty and could not be repaired.</p>
            <p>Once a file has been downloaded or accessed, the sale is final and non-refundable. By placing an order, the buyer expressly agrees to this refund policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Delivery of Digital Products (Tuning Files)</h2>
            <p>COMPANY processes only unencrypted ECU files from supported master devices or from its own slave structure. After the order and payment via credits, COMPANY will process and provide the requested tuning file within approximately 1 hour to 1 business day. Delivery times are indicative only. A delay does not entitle the buyer to withdraw from the contract or claim compensation.</p>
          </section>

          {/* ... Add other sections similarly ... */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Delivery of Hardware or Physical Goods</h2>
            <p>Hardware is shipped to the buyer&apos;s address provided at checkout. Once the product is handed over to the shipping carrier, the risk passes to the buyer. The buyer must inspect the goods immediately upon receipt and report any visible defects within 5 days.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Intellectual Property</h2>
            <p>All delivered software, tuning files, and other digital products remain the intellectual property of COMPANY. The buyer receives a non-exclusive, non-transferable license to use the files solely for their intended purpose. Resale, duplication, sharing, or public distribution of COMPANY&apos;s products is strictly prohibited. In the event of a violation, the buyer agrees to pay a contractual penalty of €3,000.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. Liability and Warranty</h2>
            <p>COMPANY guarantees that defective or non-functional files will be corrected or replaced free of charge. However, COMPANY assumes no liability for incorrect installation, damages caused by improper modifications, data loss, performance issues, vehicle malfunction, or legal consequences.</p>
          </section>

          <section>
             <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-100 dark:border-red-800 mt-8">
               <h3 className="font-bold text-red-900 dark:text-red-100 flex items-center gap-2 mb-3">
                 <span>✅</span> Summary of Key Buyer Obligations
               </h3>
               <ul className="list-disc pl-5 space-y-2 text-red-800 dark:text-red-200">
                 <li>Refunds are provided only in credits, not as cash refunds.</li>
                 <li>Once a digital file is downloaded, the sale is final and non-refundable.</li>
                 <li>The buyer is responsible for legality and correct installation of any tuning files.</li>
                 <li>COMPANY&apos;s liability is limited to direct damages up to the value of the product.</li>
               </ul>
             </div>
             <p className="text-sm mt-8 opacity-60">📘 Last updated: [10/2025] © 2025 DEEPXCLUSIVE SARLS – All rights reserved.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
