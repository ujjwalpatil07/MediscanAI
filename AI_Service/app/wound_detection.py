# app/wound_detection.py
import cv2
import numpy as np
from fastapi import UploadFile

async def analyze_wound_image(image: UploadFile) -> dict:
    """
    Analyze a wound image to estimate severity based on redness percentage.
    """
    try:
        contents = await image.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image. Ensure it's a valid image file.")

        h, w = img.shape[:2]
        max_dim = 800
        if max(h, w) > max_dim:
            scale = max_dim / float(max(h, w))
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        lower_red1 = np.array([0, 60, 40])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 60, 40])
        upper_red2 = np.array([179, 255, 255])

        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask = cv2.bitwise_or(mask1, mask2)

        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

        red_pixels = int(np.count_nonzero(mask))
        total_pixels = img.shape[0] * img.shape[1]
        red_pct = (100.0 * red_pixels / total_pixels) if total_pixels else 0.0

        if red_pixels > 20000 or red_pct > 12.0:
            severity = "high"
        elif red_pixels > 5000 or red_pct > 4.0:
            severity = "moderate"
        else:
            severity = "low"

        return {
            "status": "success",
            "wound_area": red_pixels,
            "red_pct": round(red_pct, 2),
            "severity": severity
        }

    except Exception as e:
        return {
            "status": "error",
            "wound_area": 0,
            "red_pct": 0,
            "severity": "unknown",
            "error": str(e)
        }
