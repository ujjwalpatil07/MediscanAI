// Client/src/services/ai.service.js
import api from "../api/api";

export const aiService = {
  // Check AI service health
  checkHealth: async () => {
    const response = await api.get(`/ai/health`);
    return response.data;
  },

  analyzeSymptoms: async (symptoms) => {
    try {
      const response = await api.post("/ai/analyze-symptoms", { symptoms });
      console.log("Raw API response:", response.data);
      // Return the entire response data
      return response.data;
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    }
  },

  // Update streamSymptomAnalysis in ai.service.js
  streamSymptomAnalysis: async (symptoms, onData, onComplete, onError) => {
    const token = localStorage.getItem("token");
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "https://mediscanai-uoiz.onrender.com";

    try {
      const response = await fetch(`${API_BASE_URL}/ai/stream-analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const data = JSON.parse(jsonStr);
                onData(data);
              }
            } catch (e) {
              console.warn("Failed to parse SSE data:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      onError(error.message);
    }
  },

  // Analyze wound image
  analyzeWound: async (imageFile, description = "") => {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (description) formData.append("description", description);

    const response = await api.post(`/ai/analyze-wound`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Get analysis history
  getAnalysisHistory: async (page = 1, limit = 10, type = "all") => {
    const response = await api.get(`/ai/history`, {
      params: { page, limit, type },
    });
    return response.data;
  },

  // ==================== SAVE ANALYSIS ====================
  /**
   * Save analysis to database
   * @param {Object} analysisData - Analysis data to save
   * @param {string} analysisData.type - Type of analysis ('symptom' or 'wound')
   * @param {string} analysisData.input - User input (symptoms or description)
   * @param {Object} analysisData.result - Analysis result object
   * @param {string} [analysisData.imageUrl] - Optional image URL for wound analysis
   * @returns {Promise} Saved analysis data
   */
  saveAnalysis: async (analysisData) => {
    try {
      const response = await api.post("/ai/save-analysis", analysisData);
      return response.data;
    } catch (error) {
      console.error(
        "Save analysis error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // ==================== DELETE ANALYSIS ====================
  /**
   * Delete analysis from database
   * @param {string} analysisId - ID of the analysis to delete
   * @returns {Promise} Deletion confirmation
   */
  deleteAnalysis: async (analysisId) => {
    try {
      const response = await api.delete(`/ai/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete analysis error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
