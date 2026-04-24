"use client";

import { usePageView } from "@/hooks/usePageView";
import Link from "next/link";

export default function PrivacyPolicyClient() {
  usePageView();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest text-[#00AEEF] uppercase mb-4">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: April 2026</p>
        </div>

        <div className="space-y-12 text-[15px] leading-relaxed text-gray-300">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <p>
              NAVITECS d.o.o. (&ldquo;NAVITECS&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a BIM-focused
              engineering and architecture consulting company headquartered in
              Sarajevo, Bosnia and Herzegovina. We are committed to protecting
              your personal information and your right to privacy.
            </p>
            <p className="mt-3">
              This Privacy Policy describes how we collect, use, and safeguard
              information when you visit{" "}
              <span className="text-white">navitecs.ba</span> (the
              &ldquo;Site&rdquo;), submit a contact inquiry, or apply for a
              position with us. Please read it carefully. If you disagree with
              its terms, please discontinue use of the Site.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-base font-semibold text-white mb-2">
              2.1 Contact Inquiries
            </h3>
            <p className="mb-3">
              When you submit a message through our Contact page we collect:
            </p>
            <ul className="list-none space-y-1 pl-4 border-l border-white/10">
              <li>Full name</li>
              <li>Email address</li>
              <li>
                Company name <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                Phone number <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                Project type and services of interest{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
              <li>Your message</li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.2 Job Applications
            </h3>
            <p className="mb-3">
              When you apply for a position through our Careers page we collect:
            </p>
            <ul className="list-none space-y-1 pl-4 border-l border-white/10">
              <li>First and last name</li>
              <li>Email address</li>
              <li>
                Phone number <span className="text-gray-500">(optional)</span>
              </li>
              <li>Role applied for</li>
              <li>
                LinkedIn profile URL{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                Portfolio or website URL{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                Cover letter / message{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                Current employment status, notice period, years of experience,
                and location <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                BIM software proficiency{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
              <li>
                CV / résumé in PDF format{" "}
                <span className="text-gray-500">(optional)</span>
              </li>
            </ul>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.3 Automatically Collected Information
            </h3>
            <p>
              We collect anonymous page-view data — specifically the URL path of
              pages visited on the Site (for example{" "}
              <code className="text-[#00AEEF] text-sm bg-white/5 px-1 rounded">
                /services
              </code>{" "}
              or{" "}
              <code className="text-[#00AEEF] text-sm bg-white/5 px-1 rounded">
                /projects
              </code>
              ). This data contains{" "}
              <strong className="text-white">no personal information</strong>,
              is stored on our own servers, and is not shared with any third
              party. We do not use Google Analytics, Meta Pixel, or any other
              third-party tracking or advertising platform.
            </p>
            <p className="mt-3">
              We do <strong className="text-white">not</strong> collect IP
              addresses, device fingerprints, or browser information from
              regular site visitors.
            </p>

            <h3 className="text-base font-semibold text-white mt-6 mb-2">
              2.4 Cookies
            </h3>
            <p>
              The Site does <strong className="text-white">not</strong> use
              cookies for regular visitors. A single session cookie is set
              exclusively when an authorised administrator logs into the private
              admin panel. This cookie is essential for authentication, contains
              no personal data beyond a cryptographic session token, and is
              automatically deleted when the session expires or the
              administrator logs out.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Legal Basis for Processing
            </h2>
            <p className="mb-3">
              We process your personal data under the following legal bases:
            </p>
            <div className="space-y-3">
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">
                  Consent (Art. 6(1)(a) GDPR)
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  You voluntarily submit your information through our contact or
                  application forms.
                </p>
              </div>
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">
                  Legitimate Interests (Art. 6(1)(f) GDPR)
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Responding to business inquiries, evaluating candidates for
                  open positions, and understanding which pages visitors find
                  useful (via anonymous analytics).
                </p>
              </div>
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">
                  Pre-contractual Steps (Art. 6(1)(b) GDPR)
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Processing job applications as part of a potential employment
                  relationship.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              We also process data in accordance with the Law on Protection of
              Personal Data of Bosnia and Herzegovina (
              <em>
                Zakon o zaštiti ličnih podataka, Sl. gl. BiH 49/06, 76/11, 89/11
              </em>
              ).
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              4. How We Use Your Information
            </h2>
            <ul className="space-y-2 pl-4 border-l border-white/10">
              <li>
                To respond to contact inquiries and provide requested
                information about our services
              </li>
              <li>
                To review and process job applications and contact candidates
              </li>
              <li>To maintain internal records of business communications</li>
              <li>
                To understand overall site usage through anonymous page-view
                analytics
              </li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraud and abuse</li>
            </ul>
            <p className="mt-4">
              We will never use your information for automated decision-making
              or profiling that produces legal or similarly significant effects.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Information Sharing
            </h2>
            <p>
              We{" "}
              <strong className="text-white">
                do not sell, rent, or trade
              </strong>{" "}
              your personal information to third parties. Your data may be
              shared only in the following limited circumstances:
            </p>
            <ul className="mt-3 space-y-2 pl-4 border-l border-white/10">
              <li>
                With our internal team members involved in handling your inquiry
                or application
              </li>
              <li>
                With hosting or infrastructure providers who process data on our
                behalf under strict data processing agreements
              </li>
              <li>
                When required by law, court order, or governmental authority
              </li>
              <li>
                To protect the rights, property, or safety of NAVITECS, our
                employees, or others
              </li>
              <li>
                In connection with a merger, acquisition, or sale of assets — in
                which case you will be notified
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Data Retention
            </h2>
            <div className="space-y-3">
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">Contact inquiries</p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Retained for as long as necessary to handle your inquiry and
                  for up to 3 years thereafter for legitimate business records
                  purposes.
                </p>
              </div>
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">Job applications</p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Retained for up to 2 years from the date of submission. CVs
                  and supporting documents are retained for the same period to
                  allow us to contact you about future suitable positions unless
                  you request earlier deletion.
                </p>
              </div>
              <div className="pl-4 border-l border-white/10">
                <p className="text-white font-medium">
                  Anonymous page-view data
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Retained indefinitely for analytics purposes. As this data
                  contains no personal information, it is not subject to erasure
                  rights.
                </p>
              </div>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Data Security
            </h2>
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal information against unauthorised access,
              alteration, disclosure, or destruction. These include secure
              server infrastructure, access controls, and encrypted data
              transmission (HTTPS).
            </p>
            <p className="mt-3">
              No method of transmission over the internet is completely secure.
              While we strive to use commercially acceptable means to protect
              your personal information, we cannot guarantee its absolute
              security.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              8. Your Rights
            </h2>
            <p className="mb-4">
              If you are located in the European Economic Area or a jurisdiction
              with similar data protection laws, you have the following rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Right of Access",
                  desc: "Request a copy of the personal data we hold about you.",
                },
                {
                  title: "Right to Rectification",
                  desc: "Request correction of inaccurate or incomplete data.",
                },
                {
                  title: "Right to Erasure",
                  desc: 'Request deletion of your personal data ("right to be forgotten").',
                },
                {
                  title: "Right to Restriction",
                  desc: "Request that we limit the processing of your data.",
                },
                {
                  title: "Right to Portability",
                  desc: "Receive your data in a structured, machine-readable format.",
                },
                {
                  title: "Right to Object",
                  desc: "Object to processing based on legitimate interests.",
                },
                {
                  title: "Right to Withdraw Consent",
                  desc: "Withdraw consent at any time where processing is based on consent.",
                },
                {
                  title: "Right to Complain",
                  desc: "Lodge a complaint with a supervisory authority.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-white/3 rounded-xl p-4 border border-white/5"
                >
                  <p className="text-white text-sm font-semibold mb-1">
                    {title}
                  </p>
                  <p className="text-gray-400 text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              To exercise any of these rights, please contact us at the address
              below. We will respond within 30 days.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Third-Party Links
            </h2>
            <p>
              Our Site may contain links to third-party websites (such as
              LinkedIn or project reference pages). We are not responsible for
              the privacy practices of those sites and encourage you to review
              their privacy policies independently.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable law. When we do, we will
              update the &ldquo;Last updated&rdquo; date at the top of this
              page. We encourage you to review this policy periodically.
              Continued use of the Site after changes are posted constitutes
              your acceptance of the revised policy.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              11. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, wish to
              exercise your rights, or have a concern about how we handle your
              data, please contact us:
            </p>
            <div className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-1 text-sm">
              <p className="text-white font-semibold">NAVITECS d.o.o.</p>
              <p>Sarajevo, Bosnia and Herzegovina</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@navitecs.ba"
                  className="text-[#00AEEF] hover:underline"
                >
                  info@navitecs.ba
                </a>
              </p>
              <p>
                Or use our{" "}
                <Link
                  href="/contact"
                  className="text-[#00AEEF] hover:underline"
                >
                  Contact page
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
