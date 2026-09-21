/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SurveyState } from './types';
import { SURVEY_QUESTIONS } from './data/questions';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { Step0CampusSetup } from './components/Step0CampusSetup';
import { QuestionCard } from './components/QuestionCard';
import { ReviewModalOrView } from './components/ReviewModalOrView';
import { ThankYouView } from './components/ThankYouView';
import { DistrictModal } from './components/DistrictModal';
import { SheetsGuideModal } from './components/SheetsGuideModal';
import {
  generateSessionId,
  checkHasAlreadySubmitted,
  submitSurveyResponse,
} from './utils/submission';

const LOCAL_WEBHOOK_KEY = 'respondr_custom_sheets_webhook';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 = Landing, 0 = Campus Setup, 1-14 = Questions, 15 = Review, 16 = Thank You
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState<boolean>(false);
  const [isSheetsGuideOpen, setIsSheetsGuideOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState<boolean>(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState<string>('');

  // Initial Survey State
  const [surveyState, setSurveyState] = useState<SurveyState>({
    district: 'Kamrup Metropolitan',
    college: 'Cotton University, Panbazar',
    collegeIsCustom: false,
    customCollegeText: '',
    studyYear: '2nd',
    answers: {},
    otherInputs: {
      q3Other: '',
      q4Other: '',
      q12Other: '',
    },
    q11Text: '',
    startTime: Date.now(),
    sessionId: generateSessionId('KAMRUP'),
    honeypot: '',
  });

  // Check online status and previous submissions on mount
  useEffect(() => {
    setHasAlreadySubmitted(checkHasAlreadySubmitted());

    try {
      const storedUrl = localStorage.getItem(LOCAL_WEBHOOK_KEY);
      if (storedUrl) setCustomWebhookUrl(storedUrl);
    } catch {
      // Ignore
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update session ID when district changes if on early steps
  const handleUpdateCampusState = (updates: Partial<SurveyState>) => {
    setSurveyState((prev) => {
      const next = { ...prev, ...updates };
      if (updates.district && updates.district !== prev.district) {
        next.sessionId = generateSessionId(updates.district);
      }
      return next;
    });
  };

  // Single-select question handler
  const handleSelectSingle = (questionId: string, value: string) => {
    setSurveyState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  // Multi-select question handler with optional limit
  const handleToggleMulti = (questionId: string, value: string, maxSelect?: number) => {
    setSurveyState((prev) => {
      const currentList = Array.isArray(prev.answers[questionId])
        ? (prev.answers[questionId] as string[])
        : prev.answers[questionId]
        ? [prev.answers[questionId] as string]
        : [];

      const exists = currentList.includes(value);

      if (exists) {
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: currentList.filter((item) => item !== value),
          },
        };
      } else {
        if (maxSelect && currentList.length >= maxSelect) {
          return prev; // limit reached
        }
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: [...currentList, value],
          },
        };
      }
    });
  };

  // Update custom other fields
  const handleUpdateOtherText = (key: 'q3Other' | 'q4Other' | 'q12Other', value: string) => {
    setSurveyState((prev) => ({
      ...prev,
      otherInputs: {
        ...prev.otherInputs,
        [key]: value,
      },
    }));
  };

  // Update Q11 long text
  const handleUpdateLongText = (value: string) => {
    setSurveyState((prev) => ({
      ...prev,
      q11Text: value,
    }));
  };

  // Navigation handlers
  const handleStartSurvey = () => {
    setSurveyState((prev) => ({ ...prev, startTime: Date.now() }));
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStep < 14) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 14) {
      setCurrentStep(15); // Review
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    if (currentStep === 0) {
      setCurrentStep(-1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit survey response
  const handleSubmitSurvey = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitSurveyResponse(surveyState, customWebhookUrl);
      setCurrentStep(16); // Thank you screen
      setHasAlreadySubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit survey response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset survey for a friend
  const handleResetForFriend = () => {
    setSurveyState((prev) => ({
      district: prev.district,
      college: '',
      collegeIsCustom: false,
      customCollegeText: '',
      studyYear: '1st',
      answers: {},
      otherInputs: {
        q3Other: '',
        q4Other: '',
        q12Other: '',
      },
      q11Text: '',
      startTime: Date.now(),
      sessionId: generateSessionId(prev.district),
      honeypot: '',
    }));
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save custom webhook url in local storage
  const handleSaveWebhookUrl = (url: string) => {
    setCustomWebhookUrl(url);
    try {
      localStorage.setItem(LOCAL_WEBHOOK_KEY, url);
    } catch {
      // Ignore
    }
  };

  // Get current question config
  const currentQuestionConfig =
    currentStep >= 1 && currentStep <= 14 ? SURVEY_QUESTIONS[currentStep - 1] : null;

  return (
    <div className={`min-h-screen font-body selection:bg-[#dc2626] selection:text-white ${isDarkMode ? 'dark bg-[#131b2e] text-[#faf8ff]' : 'bg-[#faf8ff] text-[#131b2e]'}`}>
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        totalSteps={14}
        showBack={currentStep >= 0 && currentStep <= 15}
        onBack={handleBackStep}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        title={
          currentStep === -1
            ? 'Assam Campus Merch'
            : currentStep === 0
            ? 'Campus Calibration'
            : currentStep >= 1 && currentStep <= 14
            ? currentQuestionConfig?.categoryTag || 'Streetwear Ballot'
            : currentStep === 15
            ? 'Review & Lock'
            : 'Drop Pass Unlocked'
        }
        subtitle={
          currentStep >= 1 && currentStep <= 14
            ? `Question ${currentStep} of 14`
            : '[respondr] Drop 01'
        }
      />

      {/* Main Content View Container */}
      <main className="pt-20 transition-all duration-300">
        {/* Screen -1: Landing Page */}
        {currentStep === -1 && (
          <LandingView
            onStart={handleStartSurvey}
            onOpenSheetsGuide={() => setIsSheetsGuideOpen(true)}
            hasAlreadySubmitted={hasAlreadySubmitted}
          />
        )}

        {/* Screen 0: Step 0 Campus Setup */}
        {currentStep === 0 && (
          <Step0CampusSetup
            district={surveyState.district}
            college={surveyState.college}
            collegeIsCustom={surveyState.collegeIsCustom}
            customCollegeText={surveyState.customCollegeText}
            studyYear={surveyState.studyYear}
            onUpdateState={handleUpdateCampusState}
            onNext={handleNextStep}
            onBack={handleBackStep}
            onOpenDistrictModal={() => setIsDistrictModalOpen(true)}
          />
        )}

        {/* Screen 1-14: Survey Questions */}
        {currentStep >= 1 && currentStep <= 14 && currentQuestionConfig && (
          <QuestionCard
            key={currentQuestionConfig.id}
            question={currentQuestionConfig}
            totalQuestions={14}
            currentAnswer={surveyState.answers[currentQuestionConfig.id]}
            otherText={
              currentQuestionConfig.otherKey
                ? surveyState.otherInputs[currentQuestionConfig.otherKey] || ''
                : ''
            }
            longText={surveyState.q11Text}
            district={surveyState.district}
            college={
              surveyState.collegeIsCustom
                ? surveyState.customCollegeText
                : surveyState.college
            }
            onSelectSingle={handleSelectSingle}
            onToggleMulti={handleToggleMulti}
            onUpdateOtherText={handleUpdateOtherText}
            onUpdateLongText={handleUpdateLongText}
            onNext={handleNextStep}
            onBack={handleBackStep}
            isLastQuestion={currentStep === 14}
          />
        )}

        {/* Screen 15: Review and Confirm Screen */}
        {currentStep === 15 && (
          <ReviewModalOrView
            state={surveyState}
            onEditStep={handleEditStep}
            onSubmit={handleSubmitSurvey}
            onBack={handleBackStep}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}

        {/* Screen 16: Thank You & Digital Street Pass Screen */}
        {currentStep === 16 && (
          <ThankYouView
            sessionId={surveyState.sessionId}
            district={surveyState.district}
            college={
              surveyState.collegeIsCustom
                ? surveyState.customCollegeText
                : surveyState.college
            }
            onResetForFriend={handleResetForFriend}
          />
        )}
      </main>

      {/* District Selection Bottom Sheet Modal (35 Assam Districts) */}
      <DistrictModal
        isOpen={isDistrictModalOpen}
        selectedDistrict={surveyState.district}
        onSelect={(districtName) => {
          handleUpdateCampusState({ district: districtName, college: '' });
        }}
        onClose={() => setIsDistrictModalOpen(false)}
      />

      {/* Google Sheets Apps Script Backend Setup Guide Modal */}
      <SheetsGuideModal
        isOpen={isSheetsGuideOpen}
        onClose={() => setIsSheetsGuideOpen(false)}
        currentWebhookUrl={
          customWebhookUrl || import.meta.env.VITE_SHEETS_WEBHOOK_URL || ''
        }
        onSaveWebhookUrl={handleSaveWebhookUrl}
      />
    </div>
  );
}
