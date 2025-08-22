export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Policies</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>
              By using Gazzola.dev and its services, you agree to be bound by these Terms and Conditions. 
              These terms govern your use of our web development consultation platform and chat application.
            </p>
            
            <h3 className="text-lg font-semibold">Service Usage</h3>
            <p>
              Our platform provides web development consultation services through a chat-based interface. 
              You may use our services for legitimate business purposes and must comply with all applicable laws.
            </p>
            
            <h3 className="text-lg font-semibold">User Responsibilities</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all 
              activities that occur under your account. You agree to provide accurate information and to update 
              your profile as necessary.
            </p>
            
            <h3 className="text-lg font-semibold">Intellectual Property</h3>
            <p>
              All content, features, and functionality of our platform are owned by Gazzola.dev and are 
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h3 className="text-lg font-semibold">Limitation of Liability</h3>
            <p>
              Our services are provided &quot;as is&quot; without warranties of any kind. We shall not be liable for 
              any indirect, incidental, or consequential damages arising from your use of our services.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect 
              your personal information when you use our services.
            </p>
            
            <h3 className="text-lg font-semibold">Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as your name, email address, phone number, 
              and company information. We also collect information about your usage of our platform and 
              communication preferences.
            </p>
            
            <h3 className="text-lg font-semibold">How We Use Your Information</h3>
            <p>
              We use your information to provide and improve our services, communicate with you about your 
              projects, process payments, and send you important service updates. We may also use your 
              information for analytics to improve our platform.
            </p>
            
            <h3 className="text-lg font-semibold">Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted in 
              transit and at rest.
            </p>
            
            <h3 className="text-lg font-semibold">Data Sharing</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only with your consent, to comply with legal obligations, or as necessary to provide 
              our services.
            </p>
            
            <h3 className="text-lg font-semibold">Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal information. You may also opt out 
              of certain communications and request a copy of your data at any time.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Share Content on Live Streams</h2>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>
              This optional feature allows us to share content from your projects during live streams, 
              educational content, or promotional materials to help demonstrate our services and educate others.
            </p>
            
            <h3 className="text-lg font-semibold">What We May Share</h3>
            <p>
              If you opt in to content sharing, we may include screenshots, code snippets, project outcomes, 
              or general project descriptions in our live streams, tutorials, or marketing materials. We will 
              always anonymize your personal information unless you specifically request attribution.
            </p>
            
            <h3 className="text-lg font-semibold">Content Protection</h3>
            <p>
              We will never share sensitive information such as passwords, API keys, personal data, or 
              proprietary business information. Only general development concepts, design patterns, and 
              non-sensitive code examples may be shared.
            </p>
            
            <h3 className="text-lg font-semibold">Opt-Out Anytime</h3>
            <p>
              You can opt out of content sharing at any time by updating your preferences in your profile 
              settings. This change will apply to all future content, though previously shared content 
              may remain in published materials.
            </p>
            
            <h3 className="text-lg font-semibold">Educational Purpose</h3>
            <p>
              The primary purpose of content sharing is educational - to help other developers learn from 
              real-world examples and to showcase best practices in web development. Your participation 
              helps contribute to the developer community.
            </p>
          </div>
        </section>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          If you have any questions about these terms or policies, please contact us through our platform.
        </p>
      </div>
    </div>
  );
}