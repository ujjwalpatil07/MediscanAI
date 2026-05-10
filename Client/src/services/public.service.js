import api from "../api/api";

// doctors
export const getFeaturedDoctors = () => {
  return api.get("/doctor", {
    params: {
      limit: 4,
      verified: true,
      sortBy: "rating",
    },
  });
};

// blogs
export const getLatestBlogs = () => {
  return api.get("/blogs", {
    params: {
      limit: 3,
    },
  });
};

// stats
export const getLandingStats = () => {
  return api.get("/public/stats");
};
