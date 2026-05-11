// Client/src/pages/patient/SymptomAnalysis.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Stethoscope,
  Brain,
  Clock,
  Loader,
  Sparkles,
  Zap,
  Microscope,
  Ambulance,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  RefreshCw,
  History,
  ShieldCheck,
  HandHeart,
  Flower2,
  Target,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Camera,
  AlertTriangle,
  Copy,
  Save,
  ListChecks,
  HeartPulse,
  Pill,
  CalendarDays,
  User,
  Activity,
  Shield,
  Syringe,
  Stethoscope as StethoscopeIcon,
} from "lucide-react";
import { aiService } from "../../services/ai.service";
import MedicalBackground from "../../components/common/MedicalBackground";

const SymptomAnalysis = () => {
  // State declarations
  const [activeMode, setActiveMode] = useState("symptom");
  const [symptoms, setSymptoms] = useState("");
  const [woundImage, setWoundImage] = useState(null);
  const [woundDescription, setWoundDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const resultsRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamingTextRef = useRef('');
  const streamingDataRef = useRef({
    analysis: "",
    conditions: [],
    urgency: null,
    redFlags: [],
    homeRemedies: [],
    recommendedActions: [],
    disclaimer: ""
  });

  const severityColors = {
    low: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800", icon: ShieldCheck },
    moderate: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", icon: AlertTriangle },
    high: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", icon: Ambulance },
    critical: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", icon: AlertTriangle }
  };

  // Fetch analysis history
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const response = await aiService.getAnalysisHistory(historyPage, 10, "all");
      if (response?.success) {
        setHistory(response?.data);
        setHistoryTotal(response?.pagination.totalItems);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [historyPage]);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, historyPage, fetchHistory]);

  // Parse structured analysis data
  const parseStructuredAnalysis = (data) => {
    if (data?.data) {
      return {
        analysis: data.data?.analysis || "",
        conditions: data.data?.possible_conditions || [],
        urgency: data.data?.urgency || { level: "low", message: "", timeframe: "" },
        redFlags: data.data?.red_flags || [],
        homeRemedies: data.data?.home_remedies || [],
        recommendedActions: data.data?.recommended_actions || [],
        disclaimer: data.data?.disclaimer || ""
      };
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setStreamingText("");

    try {
      const response = await aiService.analyzeSymptoms(symptoms);
      console.log("Full response:", response);

      if (response.success) {
        // Navigate through the nested data structure
        // response.data.data.data contains the actual analysis
        let analysisData;

        if (response.data && response.data.data && response.data.data.data) {
          // Case: response.data.data.data
          analysisData = response.data.data.data;
        } else if (response.data && response.data.data) {
          // Case: response.data.data
          analysisData = response.data.data;
        } else if (response.data) {
          // Case: response.data
          analysisData = response.data;
        } else {
          analysisData = response;
        }

        console.log("Extracted analysis data:", analysisData);

        // Now parse the analysis data
        const parsedAnalysis = {
          analysis: analysisData.analysis || "",
          conditions: analysisData.possible_conditions || [],
          urgency: analysisData.urgency || { level: "low", message: "", timeframe: "" },
          redFlags: analysisData.red_flags || [],
          homeRemedies: analysisData.home_remedies || [],
          recommendedActions: analysisData.recommended_actions || [],
          disclaimer: analysisData.disclaimer || ""
        };

        console.log("Parsed analysis:", parsedAnalysis);
        setAnalysis(parsedAnalysis);

        // Save to history
        await aiService.saveAnalysis({
          type: "symptom",
          input: symptoms,
          result: parsedAnalysis
        });
        fetchHistory();
      } else {
        setError(response.message || "Analysis failed");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Handle streaming analysis
  const handleStreamAnalyze = async () => {
    if (!symptoms.trim()) return;

    setStreaming(true);
    setError(null);
    setAnalysis(null);
    setStreamingText("");
    streamingTextRef.current = "";
    streamingDataRef.current = {
      analysis: "",
      conditions: [],
      urgency: null,
      redFlags: [],
      homeRemedies: [],
      recommendedActions: [],
      disclaimer: ""
    };

    await aiService.streamSymptomAnalysis(
      symptoms,
      (data) => {
        if (data.type === 'section') {
          switch (data.section) {
            case 'analysis':
              streamingDataRef.current.analysis = data.content;
              break;
            case 'conditions':
              streamingDataRef.current.conditions = data.content;
              break;
            case 'urgency':
              streamingDataRef.current.urgency = data.content;
              break;
            case 'red_flags':
              streamingDataRef.current.redFlags = data.content;
              break;
            case 'remedies':
              streamingDataRef.current.homeRemedies = data.content;
              break;
            case 'actions':
              streamingDataRef.current.recommendedActions = data.content;
              break;
            case 'disclaimer':
              streamingDataRef.current.disclaimer = data.content;
              break;
          }
          setAnalysis({ ...streamingDataRef.current });
        }
      },
      async () => {
        setStreaming(false);
        try {
          await aiService.saveAnalysis({
            type: "symptom",
            input: symptoms,
            result: streamingDataRef.current
          });
          fetchHistory();
        } catch (err) {
          console.error("Failed to save streaming analysis:", err);
        }
      },
      (err) => {
        console.error("Stream error:", err);
        setError(err);
        setStreaming(false);
      }
    );
  };

  // Handle wound analysis
  const handleWoundAnalysis = async () => {
    if (!woundImage) {
      setError("Please upload an image of the wound");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await aiService.analyzeWound(woundImage, woundDescription);
      console.log("Full wound response:", response); // Debug log

      if (response?.success) {
        // Navigate through the nested response structure
        let woundData;
        let woundResultData;

        // Check where the data is located
        if (response.data?.analysis) {
          // Data is in response.data.analysis
          woundData = response.data.analysis;
          woundResultData = response.data.wound_result;
        } else if (response.analysis) {
          // Data is directly in response.analysis
          woundData = response.analysis;
          woundResultData = response.wound_result;
        } else {
          // Fallback
          woundData = response;
        }

        console.log("Extracted wound data:", woundData);
        console.log("Wound result:", woundResultData);

        // Set the analysis state with proper structure
        setAnalysis({
          diagnosis: woundData?.diagnosis || "",
          severityAssessment: woundData?.severity_assessment || "",
          immediateCare: Array.isArray(woundData?.immediate_care) ? woundData.immediate_care : [],
          medications: Array.isArray(woundData?.medications) ? woundData.medications : [],
          whenToSeekHelp: Array.isArray(woundData?.when_to_seek_help) ? woundData.when_to_seek_help : [],
          followUpCare: Array.isArray(woundData?.follow_up_care) ? woundData.follow_up_care : [],
          woundResult: woundResultData || {
            severity: woundData?.severity || "unknown",
            wound_area: woundData?.wound_area || 0,
            red_pct: woundData?.red_pct || 0
          },
          analysisType: "wound"
        });

        // Save to history
        await aiService.saveAnalysis({
          type: "wound",
          input: woundDescription || "Wound image analysis",
          result: response.data,
          imageUrl: imagePreview
        });
        fetchHistory();
      } else {
        setError(response?.message || "Wound analysis failed");
      }
    } catch (err) {
      console.error("Wound analysis error:", err);
      setError(err.response?.data?.message || "Failed to analyze wound image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWoundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setWoundImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAnalysis = async () => {
    if (analysis) {
      try {
        await aiService.saveAnalysis({
          type: activeMode,
          input: activeMode === "symptom" ? symptoms : woundDescription,
          result: analysis,
          imageUrl: imagePreview
        });
        setFeedback({ type: "success", message: "Analysis saved to history!" });
        setTimeout(() => setFeedback(null), 3000);
        fetchHistory();
      } catch (err) {
        setFeedback({ type: "error", message: "Failed to save analysis" });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  const handleCopyResults = () => {
    if (analysis) {
      const textToCopy = `
${activeMode === "symptom" ? "Symptom Analysis Results" : "Wound Analysis Results"}
Date: ${new Date().toLocaleString()}
${activeMode === "symptom" ? `Symptoms: ${symptoms}` : `Wound Description: ${woundDescription || "Image analysis"}`}

${analysis.analysis || analysis.diagnosis || ""}

Urgency Level: ${analysis.urgency?.level?.toUpperCase() || "Unknown"}

Recommended Actions:
${analysis.recommendedActions?.map(a => `- ${a}`).join('\n') || analysis.immediateCare?.map(a => `- ${a}`).join('\n')}

Disclaimer: This is AI-generated analysis for informational purposes only. Not a medical diagnosis.
      `;
      navigator.clipboard.writeText(textToCopy);
      setFeedback({ type: "success", message: "Results copied to clipboard!" });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const loadHistoryAnalysis = (item) => {
    setAnalysis(item.result);
    if (item.type === "symptom") {
      setSymptoms(item.input);
      setActiveMode("symptom");
    } else {
      setWoundDescription(item.input);
      if (item.imageUrl) setImagePreview(item.imageUrl);
      setActiveMode("wound");
    }
    setShowHistory(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const deleteHistoryItem = async (id) => {
    try {
      await aiService.deleteAnalysis(id);
      fetchHistory();
      setFeedback({ type: "success", message: "Analysis deleted from history" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to delete analysis" });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const clearForm = () => {
    setSymptoms("");
    setWoundImage(null);
    setWoundDescription("");
    setImagePreview(null);
    setAnalysis(null);
    setStreamingText("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Render Symptom Analysis Results
  const renderSymptomResults = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-neutral-700 pb-2">
        {[
          { id: "analysis", label: "Analysis", icon: Brain },
          { id: "conditions", label: "Conditions", icon: ListChecks },
          { id: "actions", label: "Actions", icon: Target },
          { id: "remedies", label: "Remedies", icon: HandHeart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === tab.id
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analysis Tab */}
      {activeTab === "analysis" && (
        <div className="space-y-5">
          {/* Main Analysis */}
          {analysis?.analysis && (
            <div className="p-4 bg-gray-50 dark:bg-neutral-700/30 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysis.analysis}
              </p>
            </div>
          )}

          {/* Urgency Level */}
          {analysis?.urgency && (
            <div className={`p-4 rounded-xl border-2 ${severityColors[analysis.urgency.level]?.bg || severityColors.low.bg} ${severityColors[analysis.urgency.level]?.border || severityColors.low.border}`}>
              <div className="flex items-center gap-3 mb-2">
                {analysis.urgency.level === "low" && <ShieldCheck className="w-6 h-6 text-green-600" />}
                {analysis.urgency.level === "moderate" && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                {analysis.urgency.level === "high" && <Ambulance className="w-6 h-6 text-orange-600" />}
                {analysis.urgency.level === "critical" && <AlertTriangle className="w-6 h-6 text-red-600" />}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {analysis.urgency.level?.toUpperCase()} Urgency
                  </h4>
                  {analysis.urgency.timeframe && (
                    <p className="text-xs text-gray-500">⏱️ {analysis.urgency.timeframe}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.urgency.message}</p>
            </div>
          )}

          {/* Red Flags */}
          {analysis?.redFlags?.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ⚠️ Red Flags - Seek Medical Attention
              </h4>
              <ul className="space-y-2">
                {analysis.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-sm text-red-600 dark:text-red-300 flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          {analysis?.disclaimer && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {analysis.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === "conditions" && analysis?.conditions?.length > 0 && (
        <div className="space-y-3">
          {analysis.conditions.map((condition, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-neutral-700/30 dark:to-neutral-700/20 rounded-xl border border-gray-100 dark:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <HeartPulse className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{condition}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === "actions" && analysis?.recommendedActions?.length > 0 && (
        <div className="space-y-3">
          {analysis.recommendedActions.map((action, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{action}</p>
            </div>
          ))}
        </div>
      )}

      {/* Remedies Tab */}
      {activeTab === "remedies" && analysis?.homeRemedies?.length > 0 && (
        <div className="grid sm:grid-cols-1 gap-3">
          {analysis.homeRemedies.map((remedy, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <Flower2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{remedy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Wound Analysis Results
  // Update renderWoundResults function
  const renderWoundResults = () => (
    <div className="space-y-6">
      {/* Wound Result Summary */}
      {analysis?.woundResult && (
        <div className={`p-4 rounded-xl border-2 ${severityColors[analysis.woundResult.severity]?.bg || severityColors.low.bg}`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Wound Analysis Summary
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Severity</p>
              <p className="text-lg font-bold capitalize">{analysis.woundResult.severity || "Unknown"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Area (px)</p>
              <p className="text-lg font-bold">{Math.round(analysis.woundResult.wound_area || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Red Area %</p>
              <p className="text-lg font-bold">{analysis.woundResult.red_pct || 0}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis */}
      {analysis?.diagnosis && (
        <div className="p-4 bg-gray-50 dark:bg-neutral-700/30 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <StethoscopeIcon className="w-4 h-4 text-green-600" />
            Diagnosis
          </h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.diagnosis}</p>
        </div>
      )}

      {/* Severity Assessment */}
      {analysis?.severityAssessment && (
        <div className={`p-4 rounded-xl border-2 ${severityColors[analysis.woundResult?.severity]?.bg || severityColors.low.bg}`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Severity Assessment
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.severityAssessment}</p>
        </div>
      )}

      {/* Immediate Care */}
      {analysis?.immediateCare && analysis.immediateCare.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
            <HandHeart className="w-4 h-4" />
            Immediate Care Instructions
          </h4>
          <ul className="space-y-2">
            {analysis.immediateCare.map((care, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{care}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medications */}
      {analysis?.medications && analysis.medications.length > 0 && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4" />
            Medication Guidance
          </h4>
          <ul className="space-y-2">
            {analysis.medications.map((med, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <Syringe className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{med}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* When to Seek Help */}
      {analysis?.whenToSeekHelp && analysis.whenToSeekHelp.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            <Ambulance className="w-4 h-4" />
            When to Seek Medical Help
          </h4>
          <ul className="space-y-2">
            {analysis.whenToSeekHelp.map((help, idx) => (
              <li key={idx} className="text-sm text-red-600 dark:text-red-300 flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <span className="flex-1">{help}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up Care */}
      {analysis?.followUpCare && analysis.followUpCare.length > 0 && (
        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
          <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Follow-up Care
          </h4>
          <ul className="space-y-2">
            {analysis.followUpCare.map((care, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{care}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          This analysis is based on AI interpretation of the uploaded image. Please consult a healthcare professional for proper medical advice.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
      <MedicalBackground />

      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 text-center py-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">AI-Powered Medical Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 dark:from-white dark:via-green-400 dark:to-white bg-clip-text text-transparent">
            Symptom & Wound Analysis
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
            Describe your symptoms or upload a wound image for AI-powered analysis
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex-shrink-0 flex justify-center gap-2 mb-4 px-4">
          <button
            onClick={() => setActiveMode("symptom")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeMode === "symptom"
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Symptom Analysis
          </button>
          <button
            onClick={() => setActiveMode("wound")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeMode === "wound"
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Wound Analysis
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-2 rounded-lg font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all"
          >
            <History className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>

        {/* Main Content - Two Column Scrollable Layout */}
        <div className="flex-1 flex overflow-hidden px-4 pb-4 gap-6">
          {/* Left Column - Input Area */}
          <div className="w-1/2 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {/* Input Card */}
            <div className="bg-white dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    {activeMode === "symptom" ? (
                      <Stethoscope className="w-5 h-5 text-white" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeMode === "symptom" ? "Describe Your Symptoms" : "Upload Wound Image"}
                  </h2>
                </div>
                <button
                  onClick={clearForm}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  title="Clear"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {activeMode === "symptom" ? (
                <>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Example: I have been experiencing fever up to 101°F for the past 2 days, along with cough, sore throat, and body aches..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900 dark:text-white"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || streaming}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 font-medium"
                    >
                      {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      Analyze
                    </button>
                    <button
                      onClick={handleStreamAnalyze}
                      disabled={loading || streaming}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-700 border-2 border-gray-200 dark:border-neutral-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 font-medium"
                    >
                      {streaming ? <Loader className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                      Real-time
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition"
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">Click or drag to upload wound image</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <textarea
                    value={woundDescription}
                    onChange={(e) => setWoundDescription(e.target.value)}
                    placeholder="Optional: Describe the wound (how it happened, when, any symptoms like pain, swelling, discharge...)"
                    rows={3}
                    className="w-full mt-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900 dark:text-white"
                  />

                  <button
                    onClick={handleWoundAnalysis}
                    disabled={loading || !woundImage}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 font-medium"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Microscope className="w-5 h-5" />}
                    Analyze Wound
                  </button>
                </>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-green-600" />
                    Analysis History
                  </h3>
                  <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {loadingHistory ? (
                  <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-green-600" /></div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No analysis history yet</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item._id} className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
                        <div onClick={() => loadHistoryAnalysis(item)} className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {item.type === "symptom" ? <Brain className="w-4 h-4 text-green-600" /> : <Camera className="w-4 h-4 text-blue-600" />}
                              <span className="text-xs font-medium text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{item.input}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item._id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {historyTotal > 10 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm">Page {historyPage}</span>
                    <button
                      onClick={() => setHistoryPage(p => p + 1)}
                      disabled={historyPage * 10 >= historyTotal}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Results Area */}
          <div ref={resultsRef} className="w-1/2 overflow-y-auto pl-2 custom-scrollbar">
            {(analysis || loading || streaming) && (
              <div className="space-y-4">
                {/* Loading State */}
                {loading && !analysis && (
                  <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-12 text-center">
                    <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Analyzing your {activeMode}...</p>
                    <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
                  </div>
                )}

                {/* Results Card */}
                {(analysis || streaming) && (
                  <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-neutral-700 p-5">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          {activeMode === "symptom" ? (
                            <Brain className="w-5 h-5 text-green-600" />
                          ) : (
                            <Microscope className="w-5 h-5 text-green-600" />
                          )}
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {activeMode === "symptom" ? "Symptom Analysis Results" : "Wound Analysis Results"}
                          </h2>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleCopyResults} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Copy">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={handleSaveAnalysis} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Save">
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      {activeMode === "symptom" ? renderSymptomResults() : renderWoundResults()}
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {analysis && (
                  <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      Was this analysis helpful?
                    </h3>
                    <div className="flex gap-3">
                      <button onClick={() => setFeedback({ type: "positive", message: "Thanks for your feedback!" })}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition">
                        <ThumbsUp className="w-4 h-4 text-green-600" /> Helpful
                      </button>
                      <button onClick={() => setFeedback({ type: "negative", message: "Sorry it wasn't helpful. We'll improve!" })}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition">
                        <ThumbsDown className="w-4 h-4 text-red-600" /> Not Helpful
                      </button>
                      <button onClick={() => setFeedback({ type: "report", message: "Issue reported. Thank you!" })}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <Flag className="w-4 h-4" /> Report Issue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!analysis && !loading && !streaming && (
              <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to Analyze</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeMode === "symptom"
                    ? "Enter your symptoms above and click Analyze to see AI-powered analysis here"
                    : "Upload a wound image above and click Analyze Wound to see AI-powered analysis here"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Toast */}
        {feedback && (
          <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg animate-slide-up ${feedback.type === "success" || feedback.type === "positive"
              ? "bg-green-100 dark:bg-green-900/80 text-green-800"
              : feedback.type === "error" || feedback.type === "negative"
                ? "bg-red-100 dark:bg-red-900/80 text-red-800"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800"
            }`}>
            <div className="flex items-center gap-2">
              {feedback.type === "success" && <CheckCircle className="w-5 h-5" />}
              {feedback.type === "positive" && <ThumbsUp className="w-5 h-5" />}
              {feedback.type === "negative" && <ThumbsDown className="w-5 h-5" />}
              {feedback.type === "report" && <Flag className="w-5 h-5" />}
              {feedback.type === "error" && <AlertTriangle className="w-5 h-5" />}
              <span>{feedback.message}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: #2d2d2d; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a4a4a; }
      `}</style>
    </div>
  );
};

export default SymptomAnalysis;