// Legal document generation service
export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  version: string;
}

export const generateLegalDocs = {
  getTermsOfService(): LegalDocument {
    return {
      id: 'terms-of-service',
      title: 'Terms of Service',
      content: `# Terms of Service

## 1. Acceptance of Terms
By using LemoTech cleaning services, you agree to these terms.

## 2. Service Description
We provide on-demand cleaning services for shoes, clothing, and other items.

## 3. Payment Terms
Payment is due upon service completion unless otherwise arranged.

## 4. Liability
We are not responsible for items damaged due to pre-existing conditions.

## 5. Privacy
We protect your personal information in accordance with our Privacy Policy.`,
      lastUpdated: new Date(),
      version: '1.0'
    };
  },

  getPrivacyPolicy(): LegalDocument {
    return {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      content: `# Privacy Policy

## Information We Collect
We collect information necessary to provide our cleaning services.

## How We Use Information
Your information is used to process orders and improve our services.

## Information Sharing
We do not sell or share your personal information with third parties.

## Data Security
We implement appropriate security measures to protect your information.`,
      lastUpdated: new Date(),
      version: '1.0'
    };
  }
};
