/**
 * @file Code.gs
 * @description This script automates the management of Gmail's vacation responder.
 */

/**
 * --- CONFIGURATION ---
 * @description User-specific settings for the vacation responder.
 */
const CONFIG = {
  // The duration (in days) from when this script runs until the vacation responder ends.
  // Example: Script runs Thursday 6pm, you want Monday return → set DAYS_ACTIVE: 3
  // (Thu 6pm + 3 days = Sun 6pm end, shows Mon return in email)
  // This can be a decimal value (e.g., 3.5 for Tuesday return).
  DAYS_ACTIVE: 3.5,

  // The subject line of the vacation responder email.
  RESPONSE_SUBJECT: "I'm currently out of office",

  // If true, the auto-reply will only be sent to people in your contacts.
  RESTRICT_TO_CONTACTS: true,

  // If true, the auto-reply will only be sent to people in your domain.
  RESTRICT_TO_DOMAIN: false,
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

    const responseBody = HtmlService.createHtmlOutputFromFile('gmail-response').getContent().replace('{{backToWorkDate}}', formattedBackToWorkDate);

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