# 📧 Scheduled 'Out of Office' messages for Gmail

This Google Apps Script can be used to automatically set your Gmail vacation responder. This is for example useful if you have a fixed day off, and would like schedule an automatic 'out of office' message.

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Usage](#-usage)
- [Configuration](#️-configuration)
- [For Developers](#-for-developers)
- [Contributing](#-contributing)
- [License](#-license)

---

## About the Project
This script was created to automate the process of enabling and disabling the Gmail vacation responder, which is particularly useful for recurring events like a fixed day off.

***

## ✨ Features
* Automates the configuration of the Gmail Vacation responder.
* Easy to configure settings for the vacation responder.

***

## 📋 Prerequisites
Before you begin, ensure you have the following:
* A **Google Account** with **Gmail** access (personal Google account or licensed Google Workspace account)

***

## 🛠️ Setup & Installation
Below you'll find two installation procedures: one for [non-technical users](#for-non-technical-users-web-ui) and one for [developers](#for-developers-clasp).

### For Non-Technical Users (Web UI)
Follow these steps to set up the script in your Google Account using the web interface:

1.  **Create the Script File:**
    *   Go to [script.google.com](https://script.google.com/home) to create a standalone script.
    *   Click on **New project**.

2.  **Add the Code:**
    *   Delete any placeholder code in the `Code.gs` file.
    *   Copy the entire content of the `Code.gs` file from this repository and paste it into the script editor.
    *   Create a new HTML file by clicking the **+** icon next to **Files** and selecting **HTML**. Name the file `gmail-response.html`.
    *   Copy the content of the `gmail-response.html` file from this repository and paste it into the new file.
    *   Click the **Save project** icon (💾).
    
3.  **Configure the Manifest File:**
    *   In the Apps Script editor, click the **Project Settings** icon (⚙️) on the left sidebar.
    *   Check the box for **Show "appsscript.json" manifest file in editor**.
    *   Return to the editor and click on the `appsscript.json` file.
    *   Copy the entire content of the `appsscript.json` file from this repository and paste it into the manifest file.
    *   Click the **Save project** icon (💾).

4.  **Authorize the Script:**
    *   The first time you run a function, Google will prompt you to authorize the script.
*   Select a function to run from the toolbar (e.g., `turnOnVacationResponder`).
*   Click **Run**.
*   Follow the on-screen prompts. You will see a "Google hasn't verified this app" warning. Click **Advanced**, then **Go to [Your Script Name] (unsafe)**.
*   Review the permissions and click **Allow**. This is necessary for the script to access your Google services.

### For Developers (clasp)
This project can be developed locally using `clasp`, the command-line tool for Google Apps Script.

#### Prerequisites
* [Node.js](https://nodejs.org/) (which includes `npm`)

#### Setup
1.  Clone this repository:
    ```bash
    git clone https://github.com/t-ben/gmail-out-of-office-gas.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd gmail-out-of-office-gas
    ```
3.  Initialize a `package.json` file:
    ```bash
    npm init -y
    ```
4.  Install `clasp` locally:
    ```bash
    npm install @google/clasp
    ```
5.  Log in to your Google account:
    ```bash
    npx clasp login
    ```
6.  Create a new Apps Script project:
    ```bash
    npx clasp create --title "Gmail Vacation Responder"
    ```
    This will create a `.clasp.json` file with the script ID.
7.  **Configure the Manifest File:**
    *   The previous step created a default `appsscript.json` file. Overwrite its contents with the contents of `appsscript.json.template`. This ensures the Gmail API is enabled.
    *   You can do this manually, or by running the following command:
        *   **Windows (Command Prompt):** `copy appsscript.json.template appsscript.json`
        *   **Windows (PowerShell):** `Copy-Item appsscript.json.template appsscript.json`
        *   **macOS/Linux:** `cp appsscript.json.template appsscript.json`
8.  **Push the Manifest to Google Apps Script:**
    *   Run the following command to push all the files to your Google Apps Script project:
        ```bash
        npx clasp push
        ```
    *   When prompted with `✔ Manifest file has been updated. Do you want to push and overwrite?`, confirm by typing `y` and pressing Enter.

#### Pushing and Pulling Code
*   Push code to your Apps Script project:
    ```bash
    npx clasp push
    ```
*   Pull code from your Apps Script project:
    ```bash
    npx clasp pull
    ```

***

## 🚀 Usage
* **Manual Execution:**
    *   Select the function you want to run (`turnOnVacationResponder` or `turnOffVacationResponder`) from the dropdown menu in the toolbar.
    *   Click **Run**.
* **Automatic Execution:** If you want the script to run automatically, you can set up a trigger.
    * In the Apps Script editor, click the **Triggers** icon (⏰) on the left sidebar.
    * Click **+ Add Trigger** and configure it as needed (e.g., to run `turnOnVacationResponder` on a time-based schedule).
        * **Note:** When the script is run on a schedule, it will check the end date of the current vacation responder. If the end date is different from what the script is configured to set, it will update the vacation responder. This ensures that your vacation responder is always set for the correct duration.

The script will configure and activate your [Gmail Vacation responder](https://support.google.com/mail/answer/25922?hl=en&co=GENIE.Platform%3DDesktop).

***

## ⚙️ Configuration
To customize the script for your needs, modify the configuration variables in the `CONFIG` object at the top of the `Code.gs` file.

```javascript
const CONFIG = {
  // The duration (in days) for which the vacation responder should be active.
  DAYS_ACTIVE: 3.5,

  // The subject line of the vacation responder email.
  RESPONSE_SUBJECT: "I'm currently out of office",

  // If true, the auto-reply will only be sent to people in your contacts.
  RESTRICT_TO_CONTACTS: true,

  // If true, the auto-reply will only be sent to people in your domain.
  RESTRICT_TO_DOMAIN: false,
};
```

## 🤝 Contributing & Credits
Contributions are welcome! Please feel free to submit a pull request.

### 🙏 Credits
- [Jan van Unnik](https://jan.marketing/) for making this happen
- Our friends at [Kilo Code](https://github.com/Kilo-Org/kilocode) for their awesome coding assistant

## 📜 License
This project is licensed by [Marketing Engineers B.V.](https://marketingengineers.nl) under the CC BY-SA 4.0 License - see the [LICENSE](LICENSE) file for details.