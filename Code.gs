/**
 * @file Code.gs
 * @description This script automates the management of Gmail's vacation responder.
 */

/**
 * --- CONFIGURATION ---
 * @description User-specific settings for the vacation responder.
 */
const CONFIG = {
  // The duration (in days) for which the vacation responder should be active.
  // This should be set to your vacation duration, up to and including your last day off.
  // The email will automatically show your back-to-work date (DAYS_ACTIVE + 1 day).
  // This can be a decimal value (e.g., 3.5 for 3 and a half days).
  DAYS_ACTIVE: 3.5,

  // The subject line of the vacation responder email.
  RESPONSE_SUBJECT: "I'm currently out of office",

  // If true, the auto-reply will only be sent to people in your contacts.
  RESTRICT_TO_CONTACTS: true,

  // If true, the auto-reply will only be sent to people in your domain.
  RESTRICT_TO_DOMAIN: false,

  // --- COMPANY BRANDING & CONTACT INFORMATION ---
  // Company logo URL - must be publicly accessible (e.g., from your website or CDN)
  // Leave empty ("") to disable logo display
  COMPANY_LOGO_URL: "",
  
  // Company name - displayed in the email template
  COMPANY_NAME: "Your Company Name",
  
  // Your name - displayed in the signature
  YOUR_NAME: "Your Name",
  
  // --- CONTACT INFORMATION (optional) ---
  // Leave empty ("") to hide specific contact information
  PHONE_NUMBER: "",
  WEBSITE_URL: "", // Used for logo clickable link
  
  // --- TEMPLATE CUSTOMIZATION ---
  // Custom out-of-office message (optional)
  CUSTOM_MESSAGE: "",
  
  // Logo display settings
  LOGO_MAX_WIDTH: "200px", // Maximum width for the logo
  LOGO_ALT_TEXT: "Company Logo" // Alt text for accessibility
};

/**
 * @description Turns on the Gmail vacation responder using the settings from the CONFIG object.
 */
function turnOnVacationResponder() {
  try {
    const gmail = Gmail.Users.Settings.getVacation("me");

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (CONFIG.DAYS_ACTIVE * 24 * 60 * 60 * 1000));
    
    // Calculate back-to-work date (one day after vacation responder ends)
    const backToWorkDate = new Date(endDate.getTime() + (24 * 60 * 60 * 1000));

    if (gmail.enableAutoReply) {
      const currentEndDate = new Date(parseInt(gmail.endTime)).getTime();
      const newEndDate = endDate.getTime();

      if (currentEndDate === newEndDate) {
        Logger.log("Vacation responder is already enabled and set to the correct end date.");
        return;
      }
    }
    const formattedBackToWorkDate = Utilities.formatDate(backToWorkDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    // Get the HTML template and replace all variables
    let responseBody = HtmlService.createHtmlOutputFromFile('gmail-response').getContent();
    
    // Create template variables object
    const templateVariables = {
      backToWorkDate: formattedBackToWorkDate,
      companyLogoUrl: CONFIG.COMPANY_LOGO_URL,
      companyName: CONFIG.COMPANY_NAME,
      yourName: CONFIG.YOUR_NAME,
      phoneNumber: CONFIG.PHONE_NUMBER,
      websiteUrl: CONFIG.WEBSITE_URL || "#", // Use website URL for logo link, fallback to #
      logoMaxWidth: CONFIG.LOGO_MAX_WIDTH,
      logoAltText: CONFIG.LOGO_ALT_TEXT,
      // Out of office message - use custom or default
      outOfOfficeMessage: CONFIG.CUSTOM_MESSAGE || "I'm currently out of office with limited access to email.",
      // Conditional display CSS
      logoDisplay: CONFIG.COMPANY_LOGO_URL ? "" : "display: none;",
      contactDisplay: CONFIG.PHONE_NUMBER ? "" : "display: none;",
      phoneDisplay: CONFIG.PHONE_NUMBER ? "" : "display: none;"
    };
    
    // Replace all template variables
    for (const [key, value] of Object.entries(templateVariables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      responseBody = responseBody.replace(regex, value);
    }

    const vacationSettings = {
      enableAutoReply: true,
      responseSubject: CONFIG.RESPONSE_SUBJECT,
      responseBodyHtml: responseBody,
      restrictToContacts: CONFIG.RESTRICT_TO_CONTACTS,
      restrictToDomain: CONFIG.RESTRICT_TO_DOMAIN,
      startTime: startDate.getTime().toString(),
      endTime: endDate.getTime().toString(),
    };

    Gmail.Users.Settings.updateVacation(vacationSettings, "me");
    Logger.log("Vacation responder has been turned on.");
  } catch (error) {
    Logger.log(`Error turning on vacation responder: ${error.toString()}`);
  }
}

/**
 * @description Turns off the Gmail vacation responder.
 */
function turnOffVacationResponder() {
  try {
    const vacationSettings = {
      enableAutoReply: false,
    };

    Gmail.Users.Settings.updateVacation(vacationSettings, "me");
    Logger.log("Vacation responder has been turned off.");
  } catch (error) {
    Logger.log(`Error turning off vacation responder: ${error.toString()}`);
  }
}