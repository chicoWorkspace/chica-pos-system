import { useEffect, useState } from "react";

interface CameraStatus {
  hasCamera: boolean;
  cameraAccessible: boolean;
}

export function useCameraStatus(): CameraStatus {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraAccessible, setCameraAccessible] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    async function checkCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some((d) => d.kind === "videoinput");
        
        setHasCamera(hasVideoInput);

        if (!hasVideoInput) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraAccessible(true);

        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        setCameraAccessible(false);
      }
    }

    checkCamera();
  }, []);

  return { hasCamera, cameraAccessible };
}
