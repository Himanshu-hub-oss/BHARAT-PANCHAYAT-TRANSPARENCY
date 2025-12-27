import React, { useEffect, useState, useCallback } from "react";
import { fetchProjectDetail, listFeedback, submitFeedbackWithFile } from "../api";

export default function ProjectDetail({ projectId }) {
  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const load = useCallback(async () => {
    const p = await fetchProjectDetail(projectId);
    setProject(p);
    const fb = await listFeedback(projectId);
    setFeedbacks(Array.isArray(fb) ? fb : []);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
        console.warn
      );
    }
  }, []);

  useEffect(() => {
    let stream = null;
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera fail:", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [showCamera]);

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        setImage(file);
        setShowCamera(false);
      }, "image/jpeg");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("latitude", location.lat || "");
    formData.append("longitude", location.lng || "");
    if (image) formData.append("image", image);

    await submitFeedbackWithFile(projectId, formData);
    setComment("");
    setImage(null);
    load();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold">{project.name}</h2>

      <h3 className="mt-4 font-semibold text-gray-700">Submit Feedback / शिकायत दर्ज करें</h3>

      <div className="space-y-4 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="font-bold">Rating:</span>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2 rounded-lg bg-white">
            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
          </select>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-3 rounded-xl w-full h-24"
          placeholder="Describe the issue or progress..."
        />

        {image ? (
          <div className="relative w-40 h-40 group">
            <img src={URL.createObjectURL(image)} className="w-full h-full object-cover rounded-xl border-2 border-teal-500 shadow-md" alt="preview" />
            <button
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 px-4 py-3 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all text-gray-600"
            >
              📁 Choose File
            </label>
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-all shadow-md font-semibold"
            >
              📷 Take Live Photo
            </button>
          </div>
        )}

        {showCamera && (
          <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[999] p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg aspect-[3/4] overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-mono">
                Live Feed
              </div>
            </div>
            <div className="mt-8 flex gap-6">
              <button
                onClick={capture}
                className="bg-white text-teal-600 w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-teal-600 active:scale-90 transition-transform"
              >
                <div className="w-14 h-14 bg-teal-600 rounded-full" />
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all self-center"
              >
                CANCEL
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" width="1080" height="1440" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${image ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          disabled={!image}
        >
          Submit Verified Feedback
        </button>
      </div>

      <hr className="my-8 border-gray-200" />

      <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Feedbacks</h3>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-center py-8 italic border-2 border-dashed rounded-xl">No feedback yet. Be the first!</p>
        ) : (
          feedbacks.map(fb => (
            <div key={fb.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-bold text-lg">★ {fb.rating}</span>
                  <span className="text-gray-400">/ 5</span>
                </div>
                {fb.is_flagged ? (
                  <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold border border-red-200">
                    ⚠ FLAG: {fb.flag_reason}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-bold border border-green-200">
                    ✓ VERIFIED LOCATION
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{fb.comment || "No comment provided."}</p>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                {fb.image_path && (
                  <div className="w-full md:w-48 overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={`http://127.0.0.1:8000/uploads/${fb.image_path}`}
                      className="w-full h-auto object-cover"
                      alt="Proof"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  {fb.latitude && fb.longitude && (
                    <button
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm underline group"
                      onClick={() => window.open(`https://www.google.com/maps/?q=${fb.latitude},${fb.longitude}`)}
                    >
                      <span className="group-hover:scale-110 transition-transform">📍</span>
                      View Exact Location on Map
                    </button>
                  )}
                  <p className="text-[10px] text-gray-400">Feedback ID: {fb.id}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
