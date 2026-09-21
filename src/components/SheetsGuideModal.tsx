import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  X,
  Copy,
  Check,
  ExternalLink,
  Code,
  Zap,
  ShieldCheck,
  Terminal,
  Database,
  RefreshCw,
  Send,
  Loader2,
} from 'lucide-react';
import { getOfflineQueueCount, getOfflineQueue, clearOfflineQueue } from '../utils/submission';

interface SheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

const APPS_SCRIPT_CODE = `/**
 * [respondr] – Assam Campus Merch Survey Google Apps Script Backend (Code.gs)
 * Deploy as Web App: Execute as "Me", Access: "Anyone"
 */
var HEADERS = [
  "Timestamp", "Session ID", "District", "College Name", "Custom College?",
  "Study Year", "Q1 Would Buy Merch", "Q2 Past Merch Exp", "Q3 Apparel Types",
  "Q3 Other Detail", "Q4 Design Aesthetics", "Q4 Other Detail", "Q5 Preferred Fit",
  "Q6 Price Comfort Range", "Q7 Decision Factors (Max 3)", "Q8 Fabric GSM & Weight",
  "Q9 Colorway Palette", "Q10 Delivery Preference", "Q11 Design Thoughts (Long Text)",
  "Q12 Special Drops Interest", "Q12 Other Detail", "Q13 Recommend Likelihood",
  "Q14 VIP Early Access", "Device Type", "User Agent"
];

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", message: "Survey endpoint is live!" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = lock.tryLock(30000);
  if (!lockAcquired) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Server busy. Try again." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var data = JSON.parse(e.postData.contents);
    if (data.honeypot && String(data.honeypot).trim() !== "") {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", message: "Filtered" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses");
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#DC2626");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

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

    sheet.appendRow(row);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", row: sheet.getLastRow() })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

export const SheetsGuideModal: React.FC<SheetsGuideModalProps> = ({
  isOpen,
  onClose,
  currentWebhookUrl,
  onSaveWebhookUrl,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentWebhookUrl);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setInputUrl(currentWebhookUrl);
    setOfflineCount(getOfflineQueueCount());
  }, [currentWebhookUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveUrl = () => {
    onSaveWebhookUrl(inputUrl.trim());
    setTestResult('Saved to app session!');
    setTimeout(() => setTestResult(null), 2500);
  };

  const handleTestPing = async () => {
    if (!inputUrl.trim()) {
      setTestResult('Please enter a Webhook URL first.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test with sample POST
      await fetch(inputUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          sessionId: 'TEST-PING-001',
          district: 'Kamrup Metropolitan',
          college: 'Cotton University (Connectivity Test)',
          collegeIsCustom: false,
          studyYear: '2nd',
          q1: 'Definitely yes',
          deviceType: 'desktop',
          honeypot: '',
        }),
      });

      setTestResult('✅ Ping successful! Dispatched sample test row to your Google Sheet.');
    } catch (err: unknown) {
      setTestResult(`❌ Ping failed: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearOffline = () => {
    clearOfflineQueue();
    setOfflineCount(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#faf8ff] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#eaedff] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#85f8c4]/40 text-[#006646] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline text-[17px] font-bold text-[#131b2e]">
                Google Sheets Integration &amp; Setup Guide
              </h2>
              <p className="text-[12px] text-[#5c403c]">
                Zero-backend architecture via Google Apps Script Web App
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#dae2fd]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-[13px] text-[#131b2e]">
          {/* Active Webhook Configuration */}
          <div className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#131b2e] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#dc2626]" />
                <span>Google Apps Script Webhook URL</span>
              </label>
              <span className="text-[10px] uppercase font-bold text-[#00825a] bg-[#85f8c4]/40 px-2 py-0.5 rounded">
                Live Receiver
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] font-mono text-[12px] text-[#131b2e] focus:outline-none focus:border-[#dc2626]"
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                className="px-4 h-11 rounded-xl bg-[#dc2626] text-white font-bold text-[12px] hover:bg-[#b70011] active:scale-95 transition-all"
              >
                Save
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestPing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-[11px] font-bold transition-colors"
              >
                {isTesting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-[#dc2626]" />
                )}
                <span>Send Test Row to Sheets</span>
              </button>

              <span className="text-[11px] text-[#5c403c]">
                Configured via <code className="bg-[#eaedff] px-1 py-0.5 rounded">VITE_SHEETS_WEBHOOK_URL</code>
              </span>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-xl bg-[#ffdcc3]/60 text-[#904d00] text-[12px] font-medium border border-[#fe932c]/30">
                {testResult}
              </div>
            )}
          </div>

          {/* Offline Queue Status */}
          <div className="bg-[#f2f3ff] rounded-2xl p-4 border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[#904d00]" />
              <div>
                <span className="font-bold block text-[13px]">Offline Staged Responses</span>
                <span className="text-[11px] text-[#5c403c]">
                  {offlineCount} responses stored locally in browser queue
                </span>
              </div>
            </div>
            {offlineCount > 0 && (
              <button
                type="button"
                onClick={handleClearOffline}
                className="px-3 py-1 text-[11px] rounded-lg bg-white text-[#ba1a1a] font-bold border border-[#ffdad6] hover:bg-[#ffdad6]/40"
              >
                Clear Queue
              </button>
            )}
          </div>

          {/* 3-Step Setup Instructions */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold text-[15px] text-[#131b2e] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Deploy in Google Sheets (3-Minute Setup)</span>
            </h3>

            <ol className="space-y-2.5 pl-2 text-[12.5px] text-[#5c403c] list-decimal list-inside">
              <li>
                Open <strong className="text-[#131b2e]">Google Sheets</strong> and create a new blank sheet.
              </li>
              <li>
                In the menu, click <strong className="text-[#131b2e]">Extensions &gt; Apps Script</strong>.
              </li>
              <li>
                Delete existing code in the editor, and paste the <code className="bg-[#eaedff] px-1 rounded text-[#131b2e]">Code.gs</code> below.
              </li>
              <li>
                Click <strong className="text-[#131b2e]">Deploy &gt; New deployment</strong>.
              </li>
              <li>
                Select type <strong className="text-[#131b2e]">Web app</strong>. Set:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5">
                  <li><strong>Execute as:</strong> "Me (your email)"</li>
                  <li><strong>Who has access:</strong> <span className="text-[#dc2626] font-bold">"Anyone"</span> (Crucial so students can submit without sign-in!)</li>
                </ul>
              </li>
              <li>
                Authorize permissions, copy the generated Web App URL, and paste it in the field above or in your <code className="bg-[#eaedff] px-1 rounded text-[#131b2e]">.env</code>!
              </li>
            </ol>
          </div>

          {/* Apps Script Code Box with 1-Click Copy */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[13px] text-[#131b2e] flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#00825a]" />
                <span>Code.gs (Ready to paste)</span>
              </h4>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#dc2626] hover:bg-[#b70011] text-white text-[11px] font-bold shadow-sm transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code.gs'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#131b2e] p-4 text-[#e2e7ff] font-mono text-[11px] max-h-52 overflow-y-auto border border-[#283044]">
              <pre className="whitespace-pre-wrap">{APPS_SCRIPT_CODE}</pre>
            </div>
          </div>

          {/* Analytics Formulas for "Summary" Tab */}
          <div className="bg-[#ffdcc3]/30 rounded-2xl p-4 border border-[#fe932c]/30 flex flex-col gap-2">
            <h4 className="font-bold text-[13px] text-[#904d00] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#fe932c]" />
              <span>Recommended "Summary" Tab Formulas for Live Metrics:</span>
            </h4>
            <div className="space-y-1.5 text-[11.5px] font-mono text-[#6e3900]">
              <p>• Total Votes: <code className="bg-white/80 px-1.5 py-0.5 rounded">=COUNTA(Responses!A2:A)</code></p>
              <p>• Top Districts: <code className="bg-white/80 px-1.5 py-0.5 rounded">=QUERY(Responses!A2:E, "SELECT C, count(A) GROUP BY C ORDER BY count(A) desc")</code></p>
              <p>• Price Breakdown: <code className="bg-white/80 px-1.5 py-0.5 rounded">=QUERY(Responses!N2:N, "SELECT N, count(N) GROUP BY N")</code></p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#eaedff] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-[13px] font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
