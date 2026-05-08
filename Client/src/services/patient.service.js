import api from "../api/api.js";

export const getProfile = async () => {
  return api.get("/p/profile");
};

export const updateProfile = async (data) => {
  return api.put("/p/profile/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = async (data) => {
  return api.put("/p/profile/change-password", data);
};

export const sendOtp = async () => {
  return api.post("/p/profile/send-otp");
};

export const verifyEmail = async (data) => {
  return api.post("/p/profile/verify-email", data);
};
