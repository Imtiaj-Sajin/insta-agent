import styles from './PrivacyPolicy.module.css';
import Head from 'next/head';





const PrivacyPolicy = () => {
  // Define CSS variables for easy customization
  const theme = {
    '--font-primary': `'Quicksand', sans-serif`,
    '--font-secondary': `'Poppins', sans-serif`,
    '--color-primary': '#2C3E50',
    '--color-secondary': '#34495E',
    '--color-background': '#fff',
    '--color-text': '#2C3E50',
    '--color-header': '#E4405F',
    '--color-link': '#2980B9',
    '--color-link-hover': '#ff6883b0',
    '--max-width': '1000px',
  };

  // State to manage the current year to prevent hydration mismatch
  // const [year, setYear] = useState<number>(new Date().getFullYear());
  const year =2024;
  // useEffect(() => {
  //   setYear(new Date().getFullYear());
  // }, []);

  return (
    <div className={styles.container} style={theme as React.CSSProperties}>
      <Head>
        <title>Privacy Policy - Commentzap</title>
        <meta name="description" content="Comprehensive Privacy Policy for Commentzap, your trusted Instagram automation platform." />
        <meta name="keywords" content="Privacy Policy, Instagram Automation, Commentzap, Data Protection, Meta APIs" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PrivacyPolicy",
              "url": "https://www.commentzap.com/privacy-policy",
              "name": "Privacy Policy for Commentzap",
              "description": "Detailed information on how Commentzap collects, uses, and protects your data.",
            }),
          }}
        />
      </Head>

      {/* Skip Navigation Link for Accessibility */}
      <a href="#mainContent" className={styles.skipLink}>Skip to main content</a>

      <header className={styles.header}>
        <h1>Privacy Policy for Commentzap</h1>
        <p className={styles.effectiveDate}>Effective Date: December 30, 2024</p>
      </header>

      <nav className={styles.nav} aria-label="Privacy Policy Navigation">
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#information">Information We Collect</a></li>
          <li><a href="#use">How We Use Your Information</a></li>
          <li><a href="#sharing">Data Sharing and Disclosure</a></li>
          <li><a href="#security">Data Security</a></li>
          <li><a href="#rights">Your Rights</a></li>
          <li><a href="#cookies">Cookies and Tracking Technologies</a></li>
          <li><a href="#retention">Data Retention</a></li>
          <li><a href="#children">Children’s Privacy</a></li>
          <li><a href="#compliance">Compliance with Meta’s Policies</a></li>
          <li><a href="#international">International Data Transfers</a></li>
          <li><a href="#changes">Changes to This Policy</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>

      <main className={styles.mainContent} id="mainContent">
        {/* Introduction Section */}
        <section id="introduction" className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Commentzap</strong>! Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our Instagram automation services, including features like auto DMs, auto replies, and auto posting, powered by Meta APIs.
          </p>
          <p>
            By accessing or using Commentzap, you agree to the terms of this Privacy Policy. If you do not agree with our policies, please do not use our services.
          </p>
        </section>

        {/* Information We Collect Section */}
        <section id="information" className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We collect various types of information to provide and enhance our services:</p>
          <ul className={styles.list}>
            <li>
              <strong>Personal Identification Information:</strong> Name, email address, phone number, and Instagram profile details.
            </li>
            <li>
              <strong>Account Information:</strong> Social media account usernames, profile photos, and connected account details.
            </li>
            <li>
              <strong>Customer Interaction Data:</strong> Messages, chat history, comments, and engagement metrics from Instagram interactions.
            </li>
            <li>
              <strong>Technical Data:</strong> Device information, IP addresses, browser types, operating systems, and session data.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you use our services, including feature usage and preferences.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> Data collected via cookies, web beacons, and similar technologies to enhance user experience and analyze usage patterns.
            </li>
            <li>
              <strong>Third-Party Integrations:</strong> Information from integrations with third-party services, including Meta APIs for Instagram automation.
            </li>
            <li>
              <strong>Feedback and Support:</strong> Information you provide when you contact us for support or provide feedback.
            </li>
          </ul>
        </section>

        {/* How We Use Your Information Section */}
        <section id="use" className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We utilize your data for the following purposes:</p>
          <ul className={styles.list}>
            <li><strong>Service Provision:</strong> To deliver and maintain our services, ensuring they operate smoothly and efficiently.</li>
            <li><strong>Personalization:</strong> To tailor content, recommendations, and communications based on your usage patterns and preferences.</li>
            <li><strong>Automation Services:</strong> To enable Instagram automation tasks such as auto replies, direct messaging, and content scheduling using Meta’s APIs.</li>
            <li><strong>Analytics and Improvement:</strong> To analyze user behavior and platform performance, helping us to enhance functionality and user experience.</li>
            <li><strong>Communication:</strong> To send you updates, newsletters, and promotional materials related to our services, if you have opted in.</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations, respond to legal processes, and protect against fraud and other illegal activities.</li>
            <li><strong>Research and Development:</strong> To conduct research and development to improve our services and develop new features.</li>
            <li><strong>Customer Support:</strong> To provide support and resolve issues you may encounter while using our services.</li>
            <li><strong>Business Operations:</strong> To manage our business operations, including hiring, training, and improving our services.</li>
            <li><strong>Marketing:</strong> To promote our services and products to you, subject to your consent.</li>
          </ul>
        </section>

        {/* Data Sharing and Disclosure Section */}
        <section id="sharing" className={styles.section}>
          <h2>4. Data Sharing and Disclosure</h2>
          <p>We respect your privacy and do not sell or rent your personal information. We only share your data in the following circumstances:</p>
          <ul className={styles.list}>
            <li>
              <strong>Service Providers:</strong> We engage trusted third-party vendors for services like hosting, analytics, payment processing, and technical support. These providers are contractually obligated to protect your data.
            </li>
            <li>
              <strong>Meta Platforms (Instagram):</strong> To provide Instagram automation features, certain data is transmitted to Meta’s APIs. Meta’s use of your data is governed by Meta's own privacy policy and platform terms. We do not share your data with Meta for advertising purposes.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may disclose your information if required by law, such as to comply with a subpoena, legal process, or government request.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction, subject to this Privacy Policy.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information with other parties if you provide explicit consent.
            </li>
            <li>
              <strong>Affiliates:</strong> We may share information with our affiliates and subsidiaries for purposes consistent with this Privacy Policy.
            </li>
          </ul>
        </section>

        {/* Data Security Section */}
        <section id="security" className={styles.section}>
          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and regular security assessments. However, no system is entirely secure, and we cannot guarantee absolute security.
          </p>
          <p>
            We also ensure that our third-party service providers adhere to strict security protocols to safeguard your information.
          </p>
        </section>

        {/* Your Rights Section */}
        <section id="rights" className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>As a user, you have the following rights regarding your personal data:</p>
          <ul className={styles.list}>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request that we update or correct inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request the deletion of your account and associated personal data.</li>
            <li><strong>Restriction of Processing:</strong> Request that we limit the processing of your data under certain circumstances.</li>
            <li><strong>Data Portability:</strong> Request the transfer of your data to another service provider.</li>
            <li><strong>Objection:</strong> Object to the processing of your data for specific purposes, such as direct marketing.</li>
            <li><strong>Withdrawal of Consent:</strong> Withdraw your consent for us to process your data where we have relied on your consent to do so.</li>
          </ul>
          <p>
            To exercise these rights, please contact us at <a href="mailto:privacy@commentzap.com" className={styles.link}>privacy@commentzap.com</a>.
          </p>
        </section>

        {/* Cookies and Tracking Technologies Section */}
        <section id="cookies" className={styles.section}>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device. They help us understand how you use our services, remember your preferences, and improve your user experience.
          </p>
          <p>
            You can manage or disable cookies through your browser settings. However, disabling cookies may affect the functionality of our services.
          </p>
          <p>
            For more information, please refer to our <a href="/cookie-policy" className={styles.link}>Cookie Policy</a>.
          </p>
        </section>

        {/* Data Retention Section */}
        <section id="retention" className={styles.section}>
          <h2>8. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include:
          </p>
          <ul className={styles.list}>
            <li>Legal obligations to retain data.</li>
            <li>The length of time needed to provide services to you.</li>
            <li>Resolution of disputes and enforcement of agreements.</li>
          </ul>
          <p>
            Once your data is no longer needed, we securely delete or anonymize it.
          </p>
        </section>

        {/* Children’s Privacy Section */}
        <section id="children" className={styles.section}>
          <h2>9. Children’s Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently received personal information from a child under 13, we will delete such information promptly.
          </p>
        </section>

        {/* Compliance with Meta’s Policies Section */}
        <section id="compliance" className={styles.section}>
          <h2>10. Compliance with Meta’s Policies</h2>
          <p>
            We adhere to Meta’s <a href="https://developers.facebook.com/policy/" className={styles.link}>Platform Policies</a> and <a href="https://www.facebook.com/policy.php" className={styles.link}>Privacy Policy</a> to ensure responsible use of Meta’s APIs and data. Our integration with Meta’s services complies with all applicable guidelines and requirements, including data usage, security, and user consent.
          </p>
          <p>
            We regularly review our practices to remain compliant with Meta’s policies and any updates thereto.
          </p>
        </section>

        {/* International Data Transfers Section */}
        <section id="international" className={styles.section}>
          <h2>11. International Data Transfers</h2>
          <p>
            Your information, including personal data, may be transferred to and maintained on servers located outside your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
          </p>
          <p>
            If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including personal data, to the United States and process it there.
          </p>
          <p>
            By using our services, you consent to the transfer of your information to the United States and other countries in which we may be located.
          </p>
        </section>

        {/* Changes to This Policy Section */}
        <section id="changes" className={styles.section}>
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
          </p>
          <p>
            We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
          </p>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className={styles.section}>
          <h2>13. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:privacy@commentzap.com" className={styles.link}>privacy@commentzap.com</a><br />
            <strong>Address:</strong> 123 Commentzap Lane, Tech City, USA<br />
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {year} Commentzap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;