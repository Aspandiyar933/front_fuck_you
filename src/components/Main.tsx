import React, { useCallback, useState } from "react";

const Main: React.FC = () => {
  const [animationRequest, setAnimationRequest] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");
    setVideoUrl("");
    try {
      // First, send the POST request to generate the animation
      const generateResponse = await fetch(
        "http://localhost:3000/api/v1/generate-and-run-manim/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userPrompt: animationRequest }),
        }
      );

      if (!generateResponse.ok) {
        throw new Error("Failed to generate animation");
      }

      // Then, send the GET request to retrieve the animation URL
      const getAnimationResponse = await fetch(
        "http://localhost:3000/api/v1/get-animation/"
      );

      if (!getAnimationResponse.ok) {
        throw new Error("Failed to retrieve animation");
      }

      const data = await getAnimationResponse.json();
      if (data.success && data.path) {
        setVideoUrl(data.path);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while generating the animation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  console.log(videoUrl);

  const VideoComponent = useCallback(() => {
    return videoUrl ? (
      <video src={videoUrl} controls style={{ width: "100%" }} />
    ) : (
      <p>{isLoading ? "Generating animation..." : "Place for video"}</p>
    );
  }, [videoUrl]);

  return (
    <main style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Do you know how to actually make math beautiful?</h1>
      <div style={{ margin: "2rem 0" }}>
        <input
          type="text"
          value={animationRequest}
          onChange={(e) => setAnimationRequest(e.target.value)}
          placeholder="Enter request for creating Manim animation"
          style={{ padding: "0.5rem", width: "60%", marginRight: "1rem" }}
        />
        <button
          onClick={handleGenerate}
          style={{ padding: "0.5rem 1rem" }}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{ border: "1px solid #ccc", padding: "2rem", marginTop: "2rem" }}
      >
        {VideoComponent()}
      </div>
    </main>
  );
};

export default Main;
