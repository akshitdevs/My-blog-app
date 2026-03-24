// pages/Terms.jsx
import React, { useEffect } from "react";

function Terms() {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        By using this blog app, you agree to follow our rules and guidelines. You must not post any content that is unlawful, offensive, harmful, or violates the rights of others.
      </p>

      <p className="mb-4">
        You are responsible for the content you create, including blogs, comments, or interactions with other users. We reserve the right to remove content that violates our terms without notice.
      </p>

      <p className="mb-4">
        This app and its content are provided "as is" without warranties of any kind. We are not liable for any loss or damage resulting from your use of the app.
      </p>

      <p className="mb-4">
        Accounts are for individual use only. You agree not to share your login credentials. If unauthorized access occurs, you must notify us immediately.
      </p>

      <p className="mb-4">
        We may update these terms periodically. Continued use of the app constitutes acceptance of the updated terms. It is your responsibility to review these terms regularly.
      </p>

      <p className="mb-4">
        By using this blog app, you agree to abide by these Terms & Conditions. If you do not agree, please refrain from using the app.
      </p>
    </div>
  );
}

export default Terms;