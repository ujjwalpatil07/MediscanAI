// SymptomChecker.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Brain,
  AlertCircle,
  Shield,
  Save,
  History,
  Trash2,
  Eye,
  ChevronRight,
  Loader2,
  Stethoscope,
  Heart,
  Smile,
  Brain as BrainIcon,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { doctorsData } from '../../utils/data';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const resultRef = useRef(null);
  const textareaRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('symptomHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('symptomHistory', JSON.stringify(history));
  }, [history]);

  // Symptom chips for quick input
  const symptomChips = [
    { label: 'Fever', icon: Thermometer },
    { label: 'Headache', icon: BrainIcon },
    { label: 'Chest Pain', icon: Heart },
    { label: 'Tooth Pain', icon: Smile },
    { label: 'Cough', icon: Activity },
    { label: 'Fatigue', icon: Activity }
  ];

  // Mock AI Analysis Function with keyword mapping
  const analyzeSymptoms = async (symptomText) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = symptomText.toLowerCase();

    // Determine doctor specialty and conditions based on keywords
    let specialty = 'General Physician';
    let conditions = [];
    let recommendations = [];
    let severity = 'Low';

    // Chest pain related
    if (text.includes('chest') || text.includes('heart') || text.includes('palpitations')) {
      specialty = 'Cardiologist';
      conditions = [
        {
          name: 'Musculoskeletal Chest Pain',
          description: 'Pain from chest wall muscles or ribs, often worsens with movement.',
          severity: 'Low'
        },
        {
          name: 'Anxiety Related Chest Pain',
          description: 'Stress-induced chest discomfort, often伴有 shortness of breath.',
          severity: 'Medium'
        },
        {
          name: 'Angina',
          description: 'Reduced blood flow to the heart, often triggered by physical activity.',
          severity: 'High'
        }
      ];
      recommendations = [
        'Seek immediate medical attention if pain is severe or伴有 shortness of breath',
        'Avoid strenuous activities until evaluated by a doctor',
        'Keep a record of when the pain occurs and what triggers it'
      ];
      severity = 'Medium';
    }
    // Tooth related
    else if (text.includes('tooth') || text.includes('dental') || text.includes('gum')) {
      specialty = 'Dentist';
      conditions = [
        {
          name: 'Dental Caries (Cavity)',
          description: 'Tooth decay that can cause pain and sensitivity to hot/cold.',
          severity: 'Medium'
        },
        {
          name: 'Gingivitis',
          description: 'Gum inflammation causing redness, swelling, and bleeding.',
          severity: 'Low'
        },
        {
          name: 'Dental Abscess',
          description: 'Pocket of pus from bacterial infection, causing severe pain.',
          severity: 'High'
        }
      ];
      recommendations = [
        'Rinse mouth with warm salt water',
        'Avoid very hot or cold foods',
        'Schedule a dental appointment as soon as possible',
        'Use over-the-counter pain relievers if needed'
      ];
      severity = 'Medium';
    }
    // Headache related
    else if (text.includes('headache') || text.includes('migraine') || text.includes('head pain')) {
      specialty = 'Neurologist';
      conditions = [
        {
          name: 'Tension Headache',
          description: 'Mild to moderate pain described as a tight band around the head.',
          severity: 'Low'
        },
        {
          name: 'Migraine',
          description: 'Moderate to severe throbbing pain, often on one side of the head.',
          severity: 'Medium'
        },
        {
          name: 'Cluster Headache',
          description: 'Severe, recurring headaches that occur in cyclical patterns.',
          severity: 'High'
        }
      ];
      recommendations = [
        'Rest in a quiet, dark room',
        'Apply cold or warm compresses to head/neck',
        'Stay hydrated and avoid skipping meals',
        'Keep a headache diary to identify triggers'
      ];
      severity = 'Low to Medium';
    }
    // Fever related
    else if (text.includes('fever') || text.includes('temperature') || text.includes('chills')) {
      specialty = 'General Physician';
      conditions = [
        {
          name: 'Viral Infection',
          description: 'Common cause of fever, usually resolves within 3-7 days.',
          severity: 'Low to Medium'
        },
        {
          name: 'Bacterial Infection',
          description: 'May require antibiotics; Watch for persistent high fever.',
          severity: 'Medium'
        },
        {
          name: 'Urinary Tract Infection',
          description: 'Often accompanied by burning sensation during urination.',
          severity: 'Medium'
        }
      ];
      recommendations = [
        'Stay hydrated with water and electrolytes',
        'Rest and monitor temperature regularly',
        'Use fever reducers if needed (consult doctor for proper dosage)',
        'Seek care if fever exceeds 103°F (39.4°C) or lasts >3 days'
      ];
      severity = 'Variable';
    }
    // General/default response
    else {
      specialty = 'General Physician';
      conditions = [
        {
          name: 'Viral Syndrome',
          description: 'Common viral infection that typically resolves with rest.',
          severity: 'Low'
        },
        {
          name: 'Stress Related Symptoms',
          description: 'Physical manifestations of stress and anxiety.',
          severity: 'Low'
        }
      ];
      recommendations = [
        'Get adequate rest (7-9 hours of sleep)',
        'Stay hydrated and maintain a balanced diet',
        'Monitor symptoms for 24-48 hours',
        'Consult a doctor if symptoms worsen or persist'
      ];
      severity = 'Low';
    }

    // Find matching doctor from doctorsData
    const matchingDoctor = doctorsData.find(
      doc => doc.specialty.toLowerCase() === specialty.toLowerCase()
    );

    return {
      conditions,
      recommendedSpecialty: specialty,
      recommendedDoctor: matchingDoctor || {
        id: 0,
        name: 'Dr. Available Specialist',
        specialty: specialty,
        experience: '10+ years',
        image: 'https://via.placeholder.com/80'
      },
      recommendations,
      severity,
      analysisDate: new Date().toISOString()
    };
  };

  // Handle symptom analysis
  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save to history
  const handleSaveToHistory = () => {
    if (!analysis) return;

    const historyEntry = {
      id: Date.now(),
      symptoms: symptoms,
      conditions: analysis.conditions,
      recommendedSpecialty: analysis.recommendedSpecialty,
      topCondition: analysis.conditions[0]?.name || 'No conditions identified',
      date: new Date().toISOString(),
      analysis: analysis
    };

    setHistory(prev => [historyEntry, ...prev]);
    alert('Analysis saved to history!');
  };

  // Handle delete from history
  const handleDeleteHistory = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle view history details
  const handleViewHistory = (entry) => {
    setSelectedHistory(entry);
    setShowHistoryModal(true);
  };

  // Handle clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all history?')) {
      setHistory([]);
    }
  };

  // Handle chip click
  const handleChipClick = (chipLabel) => {
    setSymptoms(prev => prev ? `${prev}, ${chipLabel}` : chipLabel);
    textareaRef.current?.focus();
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Symptom Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Describe your symptoms and get AI-powered insights about possible conditions and recommended specialists
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Input Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe Your Symptoms
                </label>
                <textarea
                  ref={textareaRef}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: I've had a persistent headache for 3 days, accompanied by nausea and sensitivity to light..."
                  rows="5"
                  className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />

                {/* Symptom Chips */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Common symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptomChips.map((chip, index) => (
                      <button
                        key={index}
                        onClick={() => handleChipClick(chip.label)}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <chip.icon className="w-3 h-3 mr-1" />
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!symptoms.trim() || loading}
                  className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {analysis && (
              <div ref={resultRef} className="space-y-6">

                {/* Possible Conditions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Possible Conditions</h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on your symptoms, these are possible causes</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {analysis.conditions.map((condition, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{condition.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                            {getSeverityIcon(condition.severity)}
                            <span className="ml-1">{condition.severity} Severity</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Doctor */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Specialist</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={analysis.recommendedDoctor.image}
                        alt={analysis.recommendedDoctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{analysis.recommendedDoctor.name}</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">{analysis.recommendedSpecialty}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{analysis.recommendedDoctor.experience} experience</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.location.href = '/doctors'}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      Book Appointment with {analysis.recommendedSpecialty}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommendations</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Warning & Action Buttons */}
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 dark:text-red-300">
                        <strong>Disclaimer:</strong> This is not a medical diagnosis. The information provided is for educational purposes only.
                        Please consult a qualified healthcare professional for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveToHistory}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save to History
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-20">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Check History</h2>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearAllHistory}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No saved history yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your symptom checks will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {entry.symptoms}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {entry.topCondition}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewHistory(entry)}
                              className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHistory(entry.id)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Detail Modal */}
      {showHistoryModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Symptom Check Details</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Symptoms</label>
                <p className="text-gray-900 dark:text-white mt-1">{selectedHistory.symptoms}</p>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                <p className="text-gray-900 dark:text-white mt-1">
                  {new Date(selectedHistory.date).toLocaleString()}
                </p>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Doctor</label>
                <p className="text-green-600 dark:text-green-400 mt-1">{selectedHistory.recommendedSpecialty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Possible Conditions</label>
                <div className="mt-2 space-y-2">
                  {selectedHistory.conditions.map((condition, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 pl-3">
                      <p className="font-medium text-gray-900 dark:text-white">{condition.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}