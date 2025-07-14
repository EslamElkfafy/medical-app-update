"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { ArrowUpCircle, Loader2 } from "lucide-react";
import Head from "next/head";
import axios from "axios";

interface PneumoniaResult {
  condition: string;
}

interface BrainTumorResult {
  description: string;
  image_base64: string;
}

type Model = "pneumonia" | "brain-tumor";

const ImageUploadPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model>("pneumonia");
  const [pneumoniaResult, setPneumoniaResult] = useState<PneumoniaResult | null>(null);
  const [brainResult, setBrainResult] = useState<BrainTumorResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setPneumoniaResult(null);
    setBrainResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const endpoint =
        selectedModel === "pneumonia"
          ? "/ai-xray-detection/pneumonia"
          : "/ai-xray-detection/brain-tumor";

      const response = await axios.post(
        process.env.NEXT_PUBLIC_XRAY_URL + endpoint,
        formData
      );

      if (selectedModel === "pneumonia") {
        const result: PneumoniaResult = {
          condition: response.data.result,
        };
        setPneumoniaResult(result);
      } else {
        const result: BrainTumorResult = {
          description: response.data.description,
          image_base64: response.data.image_base64,
        };
        setBrainResult(result);
      }
    } catch (err) {
      setError("Failed to process the image. Please try again.");
      console.error("Error processing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setPneumoniaResult(null);
    setBrainResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Head>
        <title>Medical Image Analysis | Upload</title>
        <meta name="description" content="Upload medical images for analysis" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical Image Analysis</h1>
            <p className="text-gray-600">Upload an image for medical analysis</p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Dropdown to choose model */}
              <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Select Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as Model)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="pneumonia">Pneumonia Detection</option>
                  <option value="brain-tumor">Brain Tumor Detection</option>
                </select>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload image from camera or files"
              />

              {/* Upload button or preview */}
              {!preview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileInput}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      triggerFileInput();
                    }
                  }}
                  aria-label="Click to upload an image"
                >
                  <ArrowUpCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Click to upload an image</p>
                  <p className="mt-1 text-xs text-gray-500">or use camera to take a photo</p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview of uploaded image"
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 truncate">{image?.name}</p>
                </div>
              )}

              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!image || isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${!image || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"} 
                    transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </button>
              </div>
            </form>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Pneumonia Results */}
            {pneumoniaResult && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div>
                    <span className="font-medium text-gray-700">Diagnosis:</span>
                    <span className="ml-2">{pneumoniaResult.condition}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Brain Tumor Results */}
            {brainResult && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Brain Tumor Detection</h2>
                <p className="text-sm mb-4 text-gray-700">{brainResult.description}</p>
                <img
                  src={`data:image/jpeg;base64,${brainResult.image_base64}`}
                  alt="Brain tumor result"
                  className="w-full object-contain border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            This tool is for educational purposes only. Always consult with a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </>
  );
};

export default ImageUploadPage;
