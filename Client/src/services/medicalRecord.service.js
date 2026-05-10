import api from "../api/api.js";

const MEDICAL_RECORDS_URL = "/p/medical-record";

// Upload
export const uploadMedicalRecord = (formData) => {
  return api.post(`${MEDICAL_RECORDS_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all
export const getMyMedicalRecords = (params = {}) => {
  return api.get(`${MEDICAL_RECORDS_URL}/my`, { params });
};

// Get one
export const getMedicalRecordById = (recordId) => {
  return api.get(`${MEDICAL_RECORDS_URL}/${recordId}`);
};

// Update
export const updateMedicalRecord = (recordId, data) => {
  return api.put(`${MEDICAL_RECORDS_URL}/${recordId}`, data);
};

// Delete
export const deleteMedicalRecord = (recordId) => {
  return api.delete(`${MEDICAL_RECORDS_URL}/${recordId}`);
};
