import axios from "axios"
import FormData from "form-data";
import AIAnalysis from "../models/AIAnalysis.js";

// AI Service URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Helper function to get proper userType
const getUserType = (user) => {
  if (user.role) {
    return user.role === "patient" ? "Patient" : "Doctor";
  }
  if (user.userType) {
    return user.userType === "patient" ? "Patient" : "Doctor";
  }
  return "Patient";
};

// ==================== HEALTH CHECK ====================
export const healthCheck = async (req, res) => {
  const response = await axios.get(`${AI_SERVICE_URL}/`);
  res.json({
    success: true,
    status: "AI service running",
    data: response.data,
  });
};

// ==================== SYMPTOM ANALYSIS ====================
export const analyzeSymptoms = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Symptoms are required",
    });
  }

  // Call Python AI service
  const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
    symptoms: symptoms,
  });

  // Save analysis to database
  const analysis = await AIAnalysis.create({
    userId: req.user.id,
    userType: getUserType(req.user),
    type: "symptom",
    input: symptoms,
    result: response.data,
    createdAt: new Date(),
  });

  res.json({
    success: true,
    data: response.data,
    analysisId: analysis._id,
  });
};

// ==================== STREAMING SYMPTOM ANALYSIS ====================
export const streamAnalyze = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Symptoms are required",
    });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Send initial connection message
  res.write(
    `data: ${JSON.stringify({ type: "meta", status: "connected" })}\n\n`,
  );

  // Check if Python AI service is available
  let pythonServiceAvailable = false;
  try {
    await axios.get(`${AI_SERVICE_URL}/`, { timeout: 3000 });
    pythonServiceAvailable = true;
    console.log("✅ Python AI service is available");
  } catch (healthError) {
    console.log("⚠️ Python AI service not available, using mock data");
  }

  if (!pythonServiceAvailable) {
    // Use mock streaming response
    const mockResponse = `Based on your symptoms: ${symptoms}

Here's my analysis:

Possible Conditions:
1. Common Cold (65% probability) - Viral infection of upper respiratory tract
2. Influenza (25% probability) - Seasonal flu with systemic symptoms
3. COVID-19 (10% probability) - Viral infection requiring testing

Urgency Level: LOW
Monitor symptoms at home. Seek care if fever exceeds 103°F or difficulty breathing develops.

Recommended Actions:
• Monitor temperature every 6 hours
• Take plenty of rest and stay hydrated
• Contact doctor if symptoms worsen after 3 days
• Get tested for COVID-19 if exposure suspected

Home Remedies:
• Rest and stay hydrated with warm fluids
• Use over-the-counter fever reducers
• Gargle with warm salt water for sore throat
• Use humidifier for congestion

Prevention Tips:
• Wash hands frequently
• Avoid close contact with others
• Cover mouth when coughing
• Stay home if feeling unwell

Disclaimer: This is AI-generated analysis for informational purposes only. Not a medical diagnosis.`;

    const words = mockResponse.split(" ");
    let index = 0;

    const sendChunk = () => {
      if (index < words.length) {
        const chunk = words.slice(index, index + 8).join(" ") + " ";
        res.write(
          `data: ${JSON.stringify({ type: "chunk", chunk: chunk })}\n\n`,
        );
        index += 8;
        setTimeout(sendChunk, 80);
      } else {
        res.write(
          `data: ${JSON.stringify({ type: "meta", status: "done" })}\n\n`,
        );
        res.end();
      }
    };

    sendChunk();
    return;
  }

  // Call Python AI streaming service
  const response = await axios({
    method: "post",
    url: `${AI_SERVICE_URL}/stream-analyze`,
    data: { symptoms },
    responseType: "stream",
    timeout: 120000,
  });

  let fullResponse = "";

  response.data.on("data", (chunk) => {
    const chunkStr = chunk.toString();
    res.write(chunkStr);

    const lines = chunkStr.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const jsonStr = line.slice(6).trim();
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            if (data.type === "chunk" && data.chunk) {
              fullResponse += data.chunk;
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  });

  response.data.on("end", async () => {
    console.log("✅ Streaming completed");
    if (fullResponse) {
      await AIAnalysis.create({
        userId: req.user.id,
        userType: getUserType(req.user),
        type: "symptom",
        input: symptoms,
        result: { analysis: fullResponse },
        createdAt: new Date(),
      });
      console.log("✅ Analysis saved to database");
    }
    res.end();
  });

  response.data.on("error", (error) => {
    console.error("Stream error:", error);
    res.write(
      `data: ${JSON.stringify({ type: "error", message: "Stream failed" })}\n\n`,
    );
    res.end();
  });
};

// ==================== WOUND ANALYSIS ====================
export const analyzeWound = async (req, res) => {
  const { description } = req.body;
  const image = req.file;  

  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Image is required",
    });
  }

  // Prepare form data for Python service
  const formData = new FormData();
  formData.append("image", image.buffer, {
    filename: image.originalname,
    contentType: image.mimetype,
  });
  if (description) formData.append("description", description);

  // Call Python wound analysis service
  const response = await axios.post(
    `${AI_SERVICE_URL}/wound-analysis`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    },
  );


  // Save analysis to database
  const analysis = await AIAnalysis.create({
    userId: req.user.id,
    userType: getUserType(req.user),
    type: "wound",
    input: description || "Wound image analysis",
    result: response.data,
    imageUrl: null,
    createdAt: new Date(),
  });

  res.json({
    success: true,
    data: response.data,
    analysisId: analysis._id,
  });
};
 
// ==================== GET ANALYSIS HISTORY ====================
export const getAnalysisHistory = async (req, res) => {
  const { page = 1, limit = 10, type = "all" } = req.query;

  const query = { userId: req.user.id };
  if (type !== "all") query.type = type;

  const analyses = await AIAnalysis.find(query)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  const total = await AIAnalysis.countDocuments(query);

  res.json({
    success: true,
    data: analyses,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
};

// ==================== SAVE ANALYSIS ====================
export const saveAnalysis = async (req, res) => {
  const { type, input, result, imageUrl } = req.body;

  const analysis = await AIAnalysis.create({
    userId: req.user.id,
    userType: getUserType(req.user),
    type,
    input,
    result,
    imageUrl: imageUrl || null,
    createdAt: new Date(),
  });

  res.json({
    success: true,
    message: "Analysis saved successfully",
    data: analysis,
  });
};

// ==================== DELETE ANALYSIS ====================
export const deleteAnalysis = async (req, res) => {
  const { analysisId } = req.params;

  const analysis = await AIAnalysis.findOneAndDelete({
    _id: analysisId,
    userId: req.user.id,
  });

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: "Analysis not found",
    });
  }

  res.json({
    success: true,
    message: "Analysis deleted successfully",
  }); 
};
