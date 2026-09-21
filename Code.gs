/**
 * ============================================================================
 * [respondr] – Assam Campus Merch Survey
 * Google Apps Script Web App Backend (Code.gs)
 * ============================================================================
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Name your sheet: "[respondr] Assam Campus Merch Survey Responses"
 * 3. In the top menu, click Extensions > Apps Script
 * 4. Delete any existing code in the editor, and paste the entire contents of this file
 * 5. Click "Save" (disk icon)
 * 6. Click "Deploy" > "New deployment"
 * 7. Click the gear icon next to "Select type" and select "Web app"
 * 8. Set Description: "RespondR Survey Endpoint v1"
 * 9. Set "Execute as": "Me" (your email)
 * 10. Set "Who has access": "Anyone"  <-- CRITICAL for frontend fetch without login
 * 11. Click "Deploy", review permissions, and authorize with your Google account
 * 12. Copy the "Web app URL" (ends in /exec)
 * 13. Put it in your frontend .env file as:
 *     VITE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
 * ============================================================================
 */

// Define the human-readable headers matching frontend payload
var HEADERS = [
  "Timestamp",
  "Session ID",
  "District",
  "College Name",
  "Custom College?",
  "Study Year",
  "Q1 Would Buy Merch",
  "Q2 Past Merch Exp",
  "Q3 Apparel Types",
  "Q3 Other Detail",
  "Q4 Design Aesthetics",
  "Q4 Other Detail",
  "Q5 Preferred Fit",
  "Q6 Price Comfort Range",
  "Q7 Decision Factors (Max 3)",
  "Q8 Fabric GSM & Weight",
  "Q9 Colorway Palette",
  "Q10 Delivery Preference",
  "Q11 Design Thoughts (Long Text)",
  "Q12 Special Drops Interest",
  "Q12 Other Detail",
  "Q13 Recommend Likelihood",
  "Q14 VIP Early Access",
  "Device Type",
  "User Agent"
];

/**
 * Health check GET endpoint
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Survey endpoint is live! Ready to receive Assam campus drop votes."
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST endpoint to append survey responses to Google Sheets
 */
function doPost(e) {
  // Concurrency lock to prevent race conditions during viral campus drop voting
  var lock = LockService.getScriptLock();
  var lockAcquired = lock.tryLock(30000); // wait up to 30 seconds

  if (!lockAcquired) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Server busy under high drop traffic. Please retry." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 1. Parse incoming payload
    var postData = "";
    if (e && e.postData && e.postData.contents) {
      postData = e.postData.contents;
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Empty payload received" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(postData);

    // 2. Anti-spam honeypot verification
    // If the hidden honeypot field is filled, silently discard spam submission
    if (data.honeypot && String(data.honeypot).trim() !== "") {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", message: "Filtered" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Open spreadsheet and "Responses" sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses");

    // Auto-create "Responses" sheet if not present
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      sheet.appendRow(HEADERS);
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#DC2626"); // Gamosa Red
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#DC2626");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // 4. Construct response row corresponding exactly to HEADERS
    var row = [
      data.timestamp || new Date().toISOString(),
      data.sessionId || "",
      data.district || "",
      data.college || "",
      data.collegeIsCustom ? "Yes (Custom)" : "No (Verified)",
      data.studyYear || "",
      data.q1 || "",
      data.q2 || "",
      data.q3 || "",
      data.q3Other || "",
      data.q4 || "",
      data.q4Other || "",
      data.q5 || "",
      data.q6 || "",
      data.q7 || "",
      data.q8 || "",
      data.q9 || "",
      data.q10 || "",
      data.q11Text || "",
      data.q12 || "",
      data.q12Other || "",
      data.q13 || "",
      data.q14 || "",
      data.deviceType || "mobile",
      data.userAgent || ""
    ];

    // Append response row safely
    sheet.appendRow(row);

    // Ensure auto-width for key columns on initial rows
    if (sheet.getLastRow() <= 5) {
      sheet.autoResizeColumns(1, 6);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Response successfully recorded in Google Sheets!", row: sheet.getLastRow() })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * SUGGESTED FORMULAS FOR "Summary" SHEET ANALYTICS:
 * Create a second tab named "Summary" and paste these formulas for live metrics:
 * 
 * 1. Total Submissions:
 *    =COUNTA(Responses!A2:A)
 * 
 * 2. Responses per District (Top 10 Districts):
 *    =QUERY(Responses!A2:E, "SELECT C, count(A) WHERE C is not null GROUP BY C ORDER BY count(A) desc LABEL count(A) 'Total Votes'")
 * 
 * 3. Top Colleges Voted:
 *    =QUERY(Responses!A2:E, "SELECT D, count(A) WHERE D is not null GROUP BY D ORDER BY count(A) desc LIMIT 15 LABEL count(A) 'Votes'")
 * 
 * 4. Q1 Would Buy Breakdown:
 *    =QUERY(Responses!G2:G, "SELECT G, count(G) WHERE G is not null GROUP BY G LABEL count(G) 'Count'")
 * 
 * 5. Preferred T-Shirt Fit (Q5):
 *    =QUERY(Responses!M2:M, "SELECT M, count(M) WHERE M is not null GROUP BY M LABEL count(M) 'Votes'")
 * 
 * 6. Price Sensitivity (Q6):
 *    =QUERY(Responses!N2:N, "SELECT N, count(N) WHERE N is not null GROUP BY N LABEL count(N) 'Votes'")
 * ============================================================================
 */
