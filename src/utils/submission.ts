import { SurveyState, SubmissionPayload } from '../types';

const SUBMITTED_STORAGE_KEY = 'respondr_assam_has_submitted';
const OFFLINE_QUEUE_KEY = 'respondr_offline_queue';

/**
 * Generate a unique session and digital street pass ID
 */
export function generateSessionId(district?: string): string {
  const cleanDistrict = (district || 'ASSAM').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AS-2026-${cleanDistrict}-${randomSuffix}`;
}

/**
 * Check if the user already submitted on this browser (gentle warning, not hard block)
 */
export function checkHasAlreadySubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark submission completed in localStorage
 */
export function markAsSubmitted(): void {
  try {
    localStorage.setItem(SUBMITTED_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage issues
  }
}

/**
 * Convert internal SurveyState into the flat JSON payload specification
 */
export function formatSubmissionPayload(state: SurveyState): SubmissionPayload {
  const isMobile = typeof window !== 'undefined' && 
    (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  const formatAnswer = (val: string | string[] | undefined): string => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(' | ');
    return String(val);
  };

  const finalCollegeName = state.collegeIsCustom 
    ? (state.customCollegeText.trim() || 'Custom College (Unspecified)')
    : (state.college.trim() || 'Not specified');

  return {
    timestamp: new Date().toISOString(),
    sessionId: state.sessionId,
    district: state.district || 'Kamrup Metropolitan',
    college: finalCollegeName,
    collegeIsCustom: state.collegeIsCustom,
    studyYear: state.studyYear || '2nd',
    q1: formatAnswer(state.answers.q1),
    q2: formatAnswer(state.answers.q2),
    q3: formatAnswer(state.answers.q3),
    q4: formatAnswer(state.answers.q4),
    q5: formatAnswer(state.answers.q5),
    q6: formatAnswer(state.answers.q6),
    q7: formatAnswer(state.answers.q7),
    q8: formatAnswer(state.answers.q8),
    q9: formatAnswer(state.answers.q9),
    q10: formatAnswer(state.answers.q10),
    q11Text: state.q11Text?.trim() || '',
    q12: formatAnswer(state.answers.q12),
    q13: formatAnswer(state.answers.q13),
    q14: formatAnswer(state.answers.q14),
    q3Other: state.otherInputs.q3Other?.trim() || '',
    q4Other: state.otherInputs.q4Other?.trim() || '',
    q12Other: state.otherInputs.q12Other?.trim() || '',
    deviceType: isMobile ? 'mobile' : 'desktop',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    honeypot: state.honeypot || '',
  };
}

/**
 * Submit survey response payload to Google Apps Script Web App URL
 */
export async function submitSurveyResponse(
  state: SurveyState,
  customWebhookUrl?: string
): Promise<{ success: boolean; mode: 'webhook' | 'demo_local'; message: string }> {
  // Anti-spam Check 1: Honeypot field must be empty
  if (state.honeypot && state.honeypot.trim() !== '') {
    // Silently succeed to fool bots without writing to sheets
    return { success: true, mode: 'webhook', message: 'Response recorded' };
  }

  // Anti-spam Check 2: Minimum time on form (at least 4 seconds from start)
  const timeSpentMs = Date.now() - state.startTime;
  if (timeSpentMs < 4000) {
    throw new Error('Please take a moment to review your answers before submitting.');
  }

  const payload = formatSubmissionPayload(state);
  const webhookUrl = customWebhookUrl || import.meta.env.VITE_SHEETS_WEBHOOK_URL;

  // If no webhook URL configured yet, provide seamless local staging so users can preview the app
  if (!webhookUrl || webhookUrl.trim() === '' || webhookUrl.includes('MY_SHEETS_WEBHOOK_URL')) {
    saveToOfflineQueue(payload);
    markAsSubmitted();
    return {
      success: true,
      mode: 'demo_local',
      message: 'Recorded locally in offline queue! Connect your Google Sheet webhook in Settings to sync live.',
    };
  }

  try {
    // Using no-cors mode as Google Apps Script redirects across domains
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    markAsSubmitted();
    return {
      success: true,
      mode: 'webhook',
      message: 'Response successfully dispatched to Google Sheets!',
    };
  } catch (err: unknown) {
    // Save to offline queue on network failure so response is never lost
    saveToOfflineQueue(payload);
    throw new Error(err instanceof Error ? err.message : 'Network connection failed. Your votes are saved offline.');
  }
}

/**
 * Queue payload offline in localStorage
 */
function saveToOfflineQueue(payload: SubmissionPayload) {
  try {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    existing.push(payload);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
  } catch {
    // Storage quota or disabled
  }
}

export function getOfflineQueueCount(): number {
  try {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    return Array.isArray(existing) ? existing.length : 0;
  } catch {
    return 0;
  }
}

export function getOfflineQueue(): SubmissionPayload[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearOfflineQueue(): void {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch {
    // Ignore
  }
}
