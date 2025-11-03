
import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const startScan = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute("playsinline", "true"); // required to work on iOS
          videoRef.current.play();
          tick();
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access is required to scan QR codes. Please enable it in your browser settings.");
      }
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              onScan(code.data);
              stopScan();
              return;
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    
    startScan();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopScan = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleClose = () => {
      stopScan();
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center text-slate-900">Scan QR Code</h2>
        <div className="relative w-full aspect-square bg-gray-200 rounded-md overflow-hidden">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">{error}</div>
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <p className="text-center text-slate-500 mt-4">Point your camera at the QR code.</p>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanner;