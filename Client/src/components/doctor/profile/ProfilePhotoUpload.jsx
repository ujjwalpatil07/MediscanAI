import { useState, useRef, useContext } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import { useSnackbar } from "notistack";
import api from "../../../api/api";

export default function ProfilePhotoUpload() {
  const { loginUser, setLoginUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = () => {
    return `${loginUser?.firstName?.[0] || ""}${loginUser?.lastName?.[0] || ""}`;
  };

  const getFullName = () => {
    return `Dr. ${loginUser?.firstName || ""} ${loginUser?.lastName || ""}`;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar("Please upload a JPG, PNG, or WebP image", {
        variant: "error",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image size should be less than 5MB", {
        variant: "error",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await api.post("/upload/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoginUser(response.data.user);
      enqueueSnackbar("Profile photo updated successfully!", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Failed to upload photo",
        { variant: "error" }
      );
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!loginUser?.profilePhoto) return;

    setUploading(true);

    try {
      const response = await api.delete("/upload/profile-photo");
      setLoginUser(response.data.user);
      enqueueSnackbar("Profile photo removed successfully!", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Failed to remove photo",
        { variant: "error" }
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="profile-photo-input"
      />

      {loginUser?.profilePhoto ? (
        <img
          src={loginUser.profilePhoto}
          alt={getFullName()}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
        />
      ) : (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-4 border-white dark:border-neutral-800 shadow-lg">
          <span className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
            {getInitials()}
          </span>
        </div>
      )}

      {uploading ? (
        <div className="absolute bottom-0 right-0 p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md">
          <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
        </div>
      ) : (
        <div className="absolute bottom-0 right-0 flex gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md hover:shadow-lg transition"
            title="Upload photo"
          >
            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {loginUser?.profilePhoto && (
            <button
              onClick={handleDelete}
              className="p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md hover:shadow-lg transition"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}