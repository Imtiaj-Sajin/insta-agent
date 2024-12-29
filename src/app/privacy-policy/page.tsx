import React from 'react';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy for Commentzap</h1>
      <p>Effective Date: December 30, 2024</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          At Commentzap, your privacy is our priority. This Privacy Policy explains
          how we collect, use, and protect your information when you use our platform. 
          By accessing or using our services, you agree to the terms outlined in this policy.
        </p>
        <p>
          Commentzap is designed to help you streamline Instagram messaging, content management, and customer interactions while adhering to the highest standards of data privacy and security.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect various types of information to provide and improve our services:</p>
        <ul>
          <li>
            <strong>Personal Identification Information:</strong> Including but not limited to name, email address, phone number, and profile details.
          </li>
          <li>
            <strong>Account Information:</strong> Social media account usernames, profile photos, and connected account details.
          </li>
          <li>
            <strong>Customer Interaction Data:</strong> Chat history, comments, messages, and customer engagement metrics.
          </li>
          <li>
            <strong>Technical Data:</strong> Device information, IP addresses, browser types, and operating system details.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> Usage data collected via cookies to enhance the user experience.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including:</p>
        <ul>
          <li>Providing, maintaining, and improving our services.</li>
          <li>Personalizing the user experience and delivering tailored content.</li>
          <li>Facilitating communication between businesses and their customers on Instagram.</li>
          <li>Analyzing user behavior to enhance platform functionality.</li>
          <li>Ensuring compliance with legal requirements and preventing fraudulent activities.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing and Disclosure</h2>
        <p>We take your privacy seriously and share your data only under the following circumstances:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Trusted third-party vendors who assist in hosting, analytics, and other services.
          </li>
          <li>
            <strong>Compliance with Laws:</strong> Disclosure required by law or valid legal processes.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the case of mergers, acquisitions, or business sales.
          </li>
          <li>
            <strong>Consent:</strong> When you explicitly agree to data sharing.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard encryption and access control to protect your data. 
          However, no system is completely secure, and we encourage you to take precautions to safeguard your information.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>As a user of Commentzap, you have the following rights:</p>
        <ul>
          <li>The right to access and request a copy of your data.</li>
          <li>The right to request corrections to inaccurate information.</li>
          <li>The right to delete your account and associated data.</li>
          <li>The right to opt out of data processing for marketing purposes.</li>
        </ul>
        <p>
          To exercise these rights, please contact our support team at 
          <a href="mailto:privacy@commentzap.com">privacy@commentzap.com</a>.
        </p>
      </section>

      <section>
        <h2>7. Cookie Policy</h2>
        <p>
          Commentzap uses cookies to enhance your experience. By using our site, 
          you consent to our cookie usage as outlined in our separate <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to our practices or 
          legal requirements. We encourage you to review this page periodically for updates.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have questions or concerns about our Privacy Policy, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:privacy@commentzap.com">privacy@commentzap.com</a><br />
          <strong>Address:</strong> 123 Commentzap Lane, Tech City, USA
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
