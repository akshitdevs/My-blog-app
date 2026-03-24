// pages/Privacy.jsx
import React, { useEffect } from "react";

function Privacy() {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This blog app collects only the necessary information to provide and improve our services. This may include your account information, blog content, and interactions within the app.
      </p>

      <p className="mb-4">
        We do not share your personal data with third parties without your consent. All information is securely stored using industry-standard security measures.
      </p>

      <p className="mb-4">
        When you publish content, your username (or display name) may be visible to other users. You have the right to update your account information or request deletion of your account and content at any time.
      </p>

      <p className="mb-4">
        Cookies or similar technologies may be used to enhance your experience, such as remembering login sessions. You can clear cookies via your browser settings, but some features may not function without them.
      </p>

      <p className="mb-4">
        By using this blog app, you agree to the collection and use of your information as described in this policy. We may update this Privacy Policy from time to time; any changes will be posted on this page.
      </p>

      <p className="mb-4">
        If you have questions or concerns about our privacy practices, you can contact us at <strong>support@blogapp.com</strong>.
      </p>
    </div>
  );
}

export default Privacy;