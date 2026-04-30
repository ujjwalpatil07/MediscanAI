import api from "../api/api";

export const fetchCurrentUser = () => {
  return api.get("/auth/patient/me");
};
