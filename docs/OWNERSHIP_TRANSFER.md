# HearBridge AI Corporate Handover Guide

This document describes the step-by-step procedure to migrate the HearBridge AI turnkey business to a buyer.

## Transfer Checklist

### 1. Execute Database Backup
1. Navigate to the **Super Admin Portal** -> **Buyer Transfer Panel**.
2. Click **Download JSON Backup**.
3. Securely store the output JSON file. This file contains the complete system state including translation libraries, clinics, and progress records.

### 2. Configure Live Infrastructure Mappings
- **DNS Records**: Map your custom domain (e.g. `rehab.hearbridge-ai.com`) to point to the new hosting servers using A-name or CNAME records.
- **Email Server (SMTP)**: Prepare SMTP credentials (e.g. Mailgun, SendGrid) to route client messages.

### 3. Trigger the Handover Panel
1. Access the **Buyer Transfer Panel**.
2. Fill out the target buyer details:
   - **Buyer Admin Email**: The email address of the new platform owner.
   - **Temp Password**: Initial credentials for the new owner.
   - **Stripe Secret Key**: The buyer's payment gateway api key.
   - **Custom Domain**: Target domain.
   - **SMTP Relay Host**: SMTP credentials for email templates.
3. Click **Execute Corporate Ownership Handover**.
4. The system immediately:
   - Sets the new email as the primary owner.
   - Rotates all Stripe and SMTP secrets in the database config.
   - Overwrites default administrator hash values.

### 4. Restore on Target Infrastructure
1. Boot the HearBridge containers on the new server.
2. Log in using the buyer temp password.
3. Go to the **Buyer Transfer Panel** -> **1-Click System Restore**.
4. Upload the JSON backup file generated in Step 1.
5. All clinic records, configurations, and progress data are instantly restored.
