// Client/src/services/ai.service.js
import api from "../api/api";

export const aiService = {
  // Check AI service health
  checkHealth: async () => {
    const response = await api.get(`/ai/health`);
    return response.data;
  },

  // Analyze symptoms
  analyzeSymptoms: async (symptoms) => {
    const response = await api.post(`/ai/analyze-symptoms`, {
      symptoms,
    });
    return response.data;
  },

  streamSymptomAnalysis: async (symptoms, onChunk, onComplete, onError) => {
    const token = localStorage.getItem("token");
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "http://localhost:9001";

    console.log(
      "🚀 Starting stream request to:",
      `${API_BASE_URL}/ai/stream-analyze`,
    );
    console.log("📝 Symptoms:", symptoms);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/stream-analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms }),
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("✅ Stream completed, total chunks:", chunkCount);
          onComplete();
          break;
        }

        chunkCount++;
        const decodedChunk = decoder.decode(value, { stream: true });
        console.log(`📦 Chunk ${chunkCount} received:`, decodedChunk);

        buffer += decodedChunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          console.log("📄 Processing line:", line);

          if (line.trim().startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();
              console.log("🔍 JSON string:", jsonStr);

              if (jsonStr) {
                const data = JSON.parse(jsonStr);
                console.log("✅ Parsed data:", data);

                if (data.type === "chunk") {
                  console.log("💬 Calling onChunk with:", data.chunk);
                  onChunk(data.chunk);
                } else if (data.type === "meta") {
                  console.log("ℹ️ Meta data:", data);
                  if (data.status === "done") {
                    onComplete();
                  }
                } else if (data.type === "error") {
                  console.log("❌ Error from server:", data.message);
                  onError(data.message);
                }
              }
            } catch (e) {
              console.warn("⚠️ Failed to parse JSON:", line, e.message);
              // If it's not JSON, send as is
              if (line.trim() && !line.includes("data: ")) {
                onChunk(line);
              }
            }
          } else if (line.trim() && !line.includes("data: ")) {
            console.log("📝 Non-SSE line:", line);
            onChunk(line);
          }
        }
      }
    } catch (error) {
      console.error("❌ Stream error:", error);
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
