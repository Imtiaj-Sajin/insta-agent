import styles from './tos.module.css';
import Head from 'next/head';

const TermsOfService = () => {
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

  const year = 2025;

  return (
    <div className={styles.container} style={theme as React.CSSProperties}>
     
      <Head>
        <title>Terms of Service - Commentzap</title>
        <meta name="description" content="Detailed Terms of Service for Commentzap, the Instagram automation platform tailored for efficiency and compliance with Meta's guidelines." />
        <meta name="keywords" content="Terms of Service, Instagram Automation, Commentzap, Meta APIs, User Agreement" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TermsofService",
              "url": "https://www.commentzap.com/tos",
              "name": "Terms of Service for Commentzap",
              "description": "Detailed information on how Commentzap collects, uses, and protects your data.",
            }),
          }}
        />
      </Head>

      {/* Skip Navigation Link for Accessibility */}
      <a href="#mainContent" className={styles.skipLink}>Skip to main content</a>

      <header className={styles.header}>
      <h1>Terms of Service for Commentzap</h1>
      <p className={styles.effectiveDate}>Effective Date: December 30, 2024</p>
      </header>

      <nav className={styles.nav} aria-label="Terms of Service Navigation">
  <ul>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#scope-of-services">Scope of Services</a></li>
    <li><a href="#description-of-services">Description of Services</a></li>
    <li><a href="#account-registration">Account Registration and Security</a></li>
    <li><a href="#user-conduct">User Conduct and Responsibilities</a></li>
    <li><a href="#automation-policies">Automation Policies</a></li>
    <li><a href="#notifications">Notification and Communication Policies</a></li>
    <li><a href="#not-allowed-uses">Not Allowed Uses</a></li>
    <li><a href="#user-responsibilities">User Responsibilities</a></li>
    <li><a href="#data">Data Collection and Privacy</a></li>
    <li><a href="#authorization">Authorization and Permissions</a></li>
    <li><a href="#compliance">Compliance with Meta Developer Policies</a></li>
    <li><a href="#ip">Intellectual Property</a></li>
    <li><a href="#liability">Limitations of Liability</a></li>
    <li><a href="#termination">Account Termination</a></li>
    <li><a href="#law">Governing Law and Dispute Resolution</a></li>
    <li><a href="#changes">Changes to These Terms</a></li>
    <li><a href="#contact">Contact Information</a></li>
  </ul>
</nav>



      <main className={styles.mainContent}>
        <section id="introduction" className={styles.section}>
          <h2>Introduction</h2>
          <p>CommentZap is a platform that seamlessly integrates with Instagram to optimize communication and engagement. Designed with advanced automation, intuitive tools, and real-time response capabilities, CommentZap empowers businesses and individuals to manage their social media presence efficiently and effectively. Built on Meta’s robust Instagram Graph API, the platform ensures compliance with all applicable guidelines and policies, providing users with a secure and reliable solution for their digital needs.</p>
          <p>At its core, CommentZap aims to simplify the complexities of social engagement. Users can set up automated responses to comments and Direct Messages (DMs), assign team members to manage interactions, and create keyword-driven workflows to optimize engagement strategies. By utilizing CommentZap, users agree to adhere to Meta’s policies and acknowledge their responsibility within the broader regulatory framework governing digital platforms. Whether managing a personal account or running a business profile, CommentZap ensures users can navigate their social interactions seamlessly and professionally.</p>
        </section>

        <section id="scope-of-services" className={styles.section}>
          <h2>Scope of Services</h2>
          <p>CommentZap provides a wide array of services that enhance Instagram account management and enable optimized engagement. These services are tailored to meet the diverse needs of individual users, businesses, and teams:</p>
          <h3>Chat Automation</h3>
          <p>With advanced automation tools, users can configure responses to comments and DMs, reducing response times and ensuring consistency in communication. By leveraging predefined keywords and triggers, CommentZap allows users to handle high volumes of interactions effortlessly, ensuring no engagement opportunity is missed.</p>
          <h3>Agent Management</h3>
          <p>CommentZap supports collaborative workflows by enabling users to assign roles to team members. This feature ensures that agents can respond to chats, manage automation settings, and address customer inquiries efficiently. The ability to distribute responsibilities fosters better teamwork and enhanced productivity within any organization.</p>
          <h3>Keyword-Based Automation</h3>
          <p>The keyword-driven automation feature empowers users to craft unique and personalized responses based on specific words or phrases detected in comments or DMs. This capability helps maintain relevance and enhances the user experience, ensuring each interaction feels tailored and meaningful.</p>
          <h3>Notifications</h3>
          <p>Real-time notifications keep users informed of key account activities, such as new comments, messages, or automation triggers. These alerts are customizable, ensuring users can focus on what matters most while staying updated on critical developments in their account interactions.</p>
          <h3>Secure Integration</h3>
          <p>Security and reliability are at the heart of CommentZap’s integration process. By utilizing Meta’s OAuth authorization system, the platform ensures that all connections to Instagram accounts are secure and compliant. Users retain control over their permissions, with clear definitions and no unauthorized actions performed on their behalf.</p>
        </section>
        <section id="description-of-services" className={styles.section}>
  <h2>Description of Services</h2>
  <p>Commentzap provides a wide range of automation and collaboration features tailored to help users maximize their Instagram engagement. The services offered by Commentzap include:</p>
  <ul>
    <li><strong>Automated Comments and DMs:</strong> Configure Commentzap to automatically respond to comments or direct messages on Instagram posts based on specific keywords.</li>
    <li><strong>Agent Role Assignment:</strong> Allow multiple team members to manage the same Instagram account by assigning them specific roles (admin, moderator, agent, etc.).</li>
    <li><strong>Campaign Analytics:</strong> Monitor the performance of your Instagram campaigns with detailed insights and analytics.</li>
    <li><strong>Automation Workflows:</strong> Set up custom workflows based on specific triggers to automatically engage with followers, potential customers, or users based on predefined rules.</li>
    <li><strong>Meta API Integration:</strong> Commentzap integrates with Meta’s official APIs, ensuring compliance with their platform policies while providing seamless automation functionalities.</li>
  </ul>
  <p>These services are intended to help you save time, increase engagement, and enhance customer service efficiency on Instagram. By using the service, you acknowledge that automation must always comply with Meta's platform policies and community standards.</p>
</section>

<section id="account-registration" className={styles.section}>
  <h2>Account Registration and Security</h2>
  <p>To use Commentzap, you must create an account by providing accurate and complete information during the registration process. You will need to:</p>
  <ul>
    <li><strong>Provide your email address:</strong> Use a valid email address and choose a secure password.</li>
    <li><strong>Connect with Meta/Instagram:</strong> Authenticate your account by logging in through Meta’s OAuth authentication (Meta Login) to enable Commentzap’s Instagram-related features. This allows Commentzap to interact with your Instagram account on your behalf in compliance with Meta’s API guidelines.</li>
    <li><strong>Maintain account security:</strong> You are responsible for maintaining the security of your account credentials. If your credentials are compromised, you must notify us immediately.</li>
    <li><strong>Use of Personal Data:</strong> By registering, you consent to our collection and use of personal data as described in our Privacy Policy. This includes information provided during registration, authentication, and usage data generated through interactions with the platform.</li>
  </ul>
  <p>Commentzap will take appropriate measures to safeguard your data, but you must also protect your login details. Any activity under your account is considered your responsibility.</p>
</section>

<section id="user-conduct" className={styles.section}>
  <h2>User Conduct and Responsibilities</h2>
  <p>As a user of Commentzap, you agree to the following responsibilities and conduct guidelines:</p>
  <ul>
    <li><strong>Compliance with Meta’s Terms:</strong> You must comply with all applicable laws, regulations, and Meta’s <a href="https://developers.facebook.com/policy/">Platform Policies</a>. Ensure that your use of Commentzap does not violate <a href="https://www.facebook.com/communitystandards/">Meta’s Community Standards</a> or result in account penalties.</li>
    <li><strong>Legitimate Use Only:</strong> Use Commentzap for legitimate business, engagement, or personal purposes only. You are prohibited from using Commentzap for spamming, fraud, harassment, or any illegal activity.</li>
    <li><strong>Automation Ethics:</strong> Ensure that any automation implemented is ethical and complies with Meta’s terms. Avoid using automation in a manner that misleads or manipulates users.</li>
    <li><strong>Authorization:</strong> Connect only Instagram accounts that you own or have explicit authorization to manage. Commentzap does not allow access to accounts without permission.</li>
    <li><strong>Platform Abuse:</strong> Refrain from activities that disrupt Commentzap or Instagram, such as exploiting bugs, attempting unauthorized access, or bypassing security mechanisms.</li>
    <li><strong>Modification of Features:</strong> Ensure that any implemented automation features comply with <a href="https://developers.facebook.com/policy/">Meta’s Platform Policies</a>. Failure to do so may result in account suspensions or terminations.</li>
  </ul>
</section>


    

<section id="automation-policies" className={styles.section}>
  <h2>Automation Policies</h2>
  <p>Commentzap provides powerful automation features that allow you to create automated workflows for Instagram interactions. To ensure responsible usage and compliance with Meta’s guidelines, you agree to:</p>
  <ul>
    <li><strong>Automation Compliance:</strong> Ensure that all automated actions (e.g., comment replies, direct messages) align with <a href="https://developers.facebook.com/policy/">Meta’s Platform Policies</a>. Avoid using automation in ways that could be seen as spammy, deceptive, or violating <a href="https://www.facebook.com/communitystandards/">Instagram’s Community Standards</a>.</li>
    <li><strong>Keyword Triggered Automation:</strong> Define appropriate keywords and triggers for automated interactions that respect the Instagram user experience and adhere to Meta's guidelines.</li>
    <li><strong>Regular Monitoring:</strong> Regularly review your automation settings to ensure compliance with the latest Meta policies and guidelines.</li>
    <li><strong>Non-Deceptive Practices:</strong> Avoid using automation for practices that may deceive or mislead Instagram users, such as pretending to be a human account, spamming, or manipulating engagement.</li>
    <li><strong>Automation Limits:</strong> Do not set up excessive or intrusive automated interactions that could harm the platform’s integrity. Any perceived violation of Meta’s usage limits will be subject to review and termination.</li>
  </ul>
</section>

<section id="notifications" className={styles.section}>
  <h2>Notification and Communication Policies</h2>
  <p>Commentzap may send notifications to users for the following reasons:</p>
  <ul>
    <li><strong>Platform Updates:</strong> Notifications about platform changes, feature updates, or policy changes to keep you informed of the latest developments.</li>
    <li><strong>Security Alerts:</strong> Immediate notifications in case of suspicious activity on your account or security-related issues.</li>
    <li><strong>Account and Activity Updates:</strong> Notifications about important account activities, including login attempts, password changes, and other significant actions.</li>
    <li><strong>Marketing and Promotional Notifications:</strong> If you opt into marketing communications, you may receive promotional offers, product news, or updates about Commentzap.</li>
  </ul>
  <p>You can manage your notification preferences through your account settings. Some notifications, such as security alerts, are mandatory for legal and security purposes and cannot be turned off.</p>
</section>

      <section id="not-allowed-uses" className={styles.section}>
        <h2>Not Allowed Uses</h2>
        <p>While CommentZap provides extensive tools to enhance user engagement, the following activities are prohibited as they violate <a href="https://help.instagram.com/477434105621119">Instagram's Community Guidelines</a> and 
        <a href="https://help.instagram.com/581066165581870/"> Instagram Terms</a>:</p>
        <ul>
          <li><strong>Spamming:</strong> Sending repetitive, unsolicited messages or comments, creating an excessive volume of interactions that overwhelm other users.</li>
          <li><strong>Misrepresentation:</strong> Using automation to impersonate other users, mislead audiences, or distribute false information.</li>
          <li><strong>Harassment:</strong> Engaging in abusive, offensive, or inappropriate communication that targets individuals or groups.</li>
          <li><strong>Bot-Driven Manipulation:</strong> Creating fake engagement, such as artificially inflating likes, comments, or follower counts.</li>
          <li><strong>Data Scraping:</strong> Collecting user data or content without explicit consent, violating privacy standards and <a href="https://developers.facebook.com/policy/">Meta’s guidelines</a>.</li>
          <li><strong>Unauthorized Promotions:</strong> Using the platform for unauthorized advertisements, affiliate marketing, or other commercial purposes without consent.</li>
          <li><strong>Illegal Activities:</strong> Facilitating or promoting activities that are unlawful under applicable local, national, or international laws.</li>
        </ul>
        <p>Engaging in these prohibited activities can result in account suspension, termination of services, or legal action to ensure compliance and protect the integrity of the platform and its users.</p>
      </section>


        <section id="user-responsibilities" className={styles.section}>
          <h2>User Responsibilities</h2>
          <p>Users of CommentZap are expected to uphold certain responsibilities to maintain the integrity and effectiveness of the platform. These responsibilities include:</p>
          <ul>
            <li>Providing accurate, up-to-date information during the registration process to ensure account validity and operational reliability.</li>
            <li>Maintaining the confidentiality of login credentials, access tokens, and account settings. Users must report any unauthorized access promptly to prevent misuse.</li>
            <li>Adhering to Meta’s Developer Policies and Instagram’s Community Guidelines, particularly in avoiding prohibited activities such as spamming, harassment, or distributing inappropriate content.</li>
            <li>Ensuring that automated responses and workflows comply with ethical standards, fostering genuine engagement rather than manipulative practices.</li>
          </ul>
          <p>Users bear full responsibility for the content they create, automate, and distribute via CommentZap. Any violations of these responsibilities may result in the suspension or termination of services to protect the platform’s integrity and other users.</p>
        </section>

        <section id="data" className={styles.section}>
          <h2>Data Collection and Privacy</h2>
          <p>At CommentZap, safeguarding user data is paramount. The platform adheres to rigorous privacy standards aligned with Meta’s policies and international regulations such as the General Data Protection Regulation (GDPR). Below are key aspects of our data practices:</p>
          <h3>Data We Collect</h3>
          <ul>
            <li><strong>Account Data:</strong> Includes details such as name, email address, and Instagram username to facilitate account management.</li>
            <li><strong>Content Data:</strong> Covers comments, messages, and other user interactions accessed via Meta’s API temporarily during session usage.</li>
            <li><strong>Usage Data:</strong> Encompasses logs, configuration details, and analytics related to platform usage to enhance functionality and performance.</li>
          </ul>
          <p><strong>Note:</strong> CommentZap does not store Instagram chats, comments, or other account-specific data. These data points are accessed directly through Meta’s API during active sessions and are not retained on our servers. We only store user account information and features created on the platform, such as automation settings, to deliver and maintain our services.</p>
          <h3>How We Use Your Data</h3>
          <p>Data collected is utilized for:</p>
          <ul>
            <li>Providing and optimizing the services offered by CommentZap.</li>
            <li>Ensuring compliance with Meta’s developer requirements and regulatory obligations.</li>
            <li>Enhancing user experience through tailored features and actionable insights derived from usage patterns.</li>
          </ul>
          <h3>Data Retention and Sharing</h3>
          <p>CommentZap retains user data only as long as necessary to provide services or comply with legal mandates. Users have the right to request account deletion, resulting in the permanent removal of their data from our systems. Data is not sold or shared with third parties, except with authorized service providers essential to platform operations.</p>
          <p>Further details can be found in our comprehensive Privacy Policy, which underscores our commitment to transparency and security in data handling.</p>
        </section>


        <section id="authorization" className={styles.section}>
          <h2>Authorization and Permissions</h2>
          <p>To unlock the full suite of features, CommentZap requires users to authorize access to their Instagram accounts through Meta’s OAuth system. This secure process ensures that users maintain control over their account permissions. By granting authorization, users enable the platform to:</p>
          <ul>
            <li>Access and manage comments and DMs to facilitate automation and engagement workflows.</li>
            <li>Retrieve analytics and account details for data-driven optimizations.</li>
            <li>Send notifications and updates about account activities.</li>
          </ul>
          <p>Users retain the ability to revoke these permissions at any time via their Meta account settings. While revocation may limit functionality, it underscores the platform’s respect for user autonomy and security.</p>
        </section>

        <section id="compliance" className={styles.section}>
          <h2>Compliance with Meta Developer Policies</h2>
          <p>CommentZap’s adherence to Meta’s Developer Platform Initiatives is unwavering. The platform operates with transparency and ethical practices, ensuring compliance through:</p>
          <ul>
            <li>Responsible and limited use of user data strictly within defined purposes.</li>
            <li>Implementing secure storage mechanisms for sensitive information such as access tokens.</li>
            <li>Regular audits and updates to align with policy changes and developer best practices.</li>
            <li>Proactively addressing and preventing misuse, such as spammy automation behaviors.</li>
          </ul>
        </section>

        <section id="ip" className={styles.section}>
          <h2>Intellectual Property</h2>
          <p>All intellectual property associated with CommentZap, including content, trademarks, logos, and software, is protected under applicable laws. Users are prohibited from reproducing, distributing, or creating derivative works without explicit authorization. This ensures the integrity and originality of the platform’s offerings, safeguarding its value for all stakeholders.</p>
        </section>

        <section id="liability" className={styles.section}>
          <h2>Limitations of Liability</h2>
          <p>CommentZap is provided on an "as is" and "as available" basis. While we strive for excellence, certain limitations apply:</p>
          <ul>
            <li>We are not liable for actions or restrictions imposed by Meta, including account bans or suspensions.</li>
            <li>Losses resulting from misuse of the platform or unauthorized account access fall outside our liability scope.</li>
            <li>Service interruptions or errors due to third-party integrations are not covered under our guarantees.</li>
          </ul>
        </section>

        <section id="termination" className={styles.section}>
          <h2>Account Termination</h2>
          <p>CommentZap reserves the right to suspend or terminate accounts that:</p>
          <ul>
            <li>Violate the Terms of Service or Meta’s policies.</li>
            <li>Engage in harmful, fraudulent, or abusive activities.</li>
            <li>Exploit or misuse platform features.</li>
          </ul>
          <p>Users may also terminate their accounts at their discretion. Upon termination, all associated data is deleted in compliance with our privacy and data retention policies.</p>
        </section>

        <section id="law" className={styles.section}>
          <h2>Governing Law and Dispute Resolution</h2>
          <p>These Terms are governed by the laws of [Your Jurisdiction]. Disputes arising from these Terms will be resolved through binding arbitration or in courts located within the jurisdiction, depending on the nature of the issue. Users are encouraged to contact support to resolve concerns amicably prior to pursuing formal dispute resolution mechanisms.</p>
        </section>

        <section id="changes" className={styles.section}>
          <h2>Changes to These Terms</h2>
          <p>CommentZap reserves the right to amend these Terms as needed to reflect changes in services, legal requirements, or operational policies. Users will receive advance notification of significant updates and are encouraged to review changes promptly. Continued use of the platform constitutes acceptance of revised terms.</p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact Information</h2>
          <p>For inquiries, support, or to report violations, please reach out via the following channels:</p>
          <ul>
            <li>Email: <a href="mailto:support@commentzap.com">support@commentzap.com</a></li>
            <li>Website: <a href="https://commentzap.com/">https://commentzap.com/</a></li>
          </ul>
        </section>

        {/* <section id="acknowledgment" className={styles.section}>
          <h2>Acknowledgment</h2>
          <p>By utilizing CommentZap, you confirm that you have read, understood, and agreed to these Terms of Service. Your continued use of the platform reflects your commitment to adhere to these terms and to participate responsibly within the community.</p>
        </section> */}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {year} CommentZap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsOfService;

