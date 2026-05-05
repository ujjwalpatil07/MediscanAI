import api from "./api";

export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("profilePhoto", file);
  return api.post("/upload/profile-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProfilePhoto = () => {
  return api.delete("/upload/profile-photo");
};

export const uploadDocuments = (degreeCertificate, idProof) => {
  const formData = new FormData();
  if (degreeCertificate) {
    formData.append("degreeCertificate", degreeCertificate);
  }
  if (idProof) {
    formData.append("idProof", idProof);
  }
  return api.post("/upload/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
