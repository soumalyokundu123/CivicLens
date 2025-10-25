// This line MUST be at the top
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Clock, AlertCircle, CheckCircle } from "lucide-react";

// --- NEW: Define a type for our results ---
interface ReportResult {
  timestamp: string;
  category: string;
  issue_type_image: string;
  confidence: string;
  issue_type_text: string;
  severity: string;
  description: string;
}

export default function CitizenPage() {
  // --- State Variables ---
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  
  // --- NEW: State to hold the JSON results ---
  const [results, setResults] = useState<ReportResult | null>(null);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text || !file) {
      setStatus("Please fill out both fields.");
      setStatusType("error");
      return;
    }

    // --- NEW: Clear old results on new submission ---
    setResults(null); 
    setStatus("Analyzing your report...");
    setStatusType("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    formData.append("file", file);

    try {
      // --- API CALL (CHANGED) ---
      // Call the new JSON endpoint
      const response = await fetch("http://127.0.0.1:8000/predict/analysis", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // --- UPDATED SUCCESS LOGIC ---
        setStatus("Analysis Complete!");
        setStatusType("success");
        
        // Get the JSON data
        const data: ReportResult = await response.json();
        
        // Store it in our state
        setResults(data); 

        // --- REMOVED ALL DOWNLOAD LOGIC ---

        // Reset form
        setText("");
        setFile(null);
        const fileInput = document.getElementById("file_input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

      } else {
        // Handle server errors
        const errorData = await response.json();
        setStatus(`Error: ${errorData.detail || "An unknown error occurred"}`);
        setStatusType("error");
      }
    } catch (error) {
      // Handle network errors
      setStatus("Failed to connect to the API. Is it running?");
      setStatusType("error");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-3xl text-center">
                Submit a New Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- Text Input --- */}
                <div className="space-y-2">
                  <Label htmlFor="text_input" className="text-lg font-semibold">
                    Describe the Issue
                  </Label>
                  <Textarea
                    id="text_input"
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., A deep pothole near the market is causing traffic..."
                    disabled={isLoading}
                    required
                    className="text-base"
                  />
                </div>
                
                {/* --- File Input --- */}
                <div className="space-y-2">
                  <Label htmlFor="file_input" className="text-lg font-semibold">
                    Upload an Image
                  </Label>
                  <Input
                    id="file_input"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    required
                    className="file:text-base file:font-medium text-muted-foreground"
                  />
                </div>
                
                {/* --- Submit Button --- */}
                <Button type="submit" size="lg" className="w-full text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Analyzing..." : "Submit Report"}
                </Button>
              </form>
              
              {/* --- Status Message --- */}
              {status && (
                <div className="mt-4 flex items-center justify-center">
                  {statusType === "error" && (
                    <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                  )}
                  {statusType === "success" && (
                     <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  )}
                  <p className={`text-center font-medium ${
                    statusType === "error" ? "text-destructive" : "text-primary"
                  }`}>
                    {status}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- NEW: RESULTS CARD --- */}
          {/* This section only appears when 'results' is not null */}
          {results && (
            <Card className="animate-in fade-in-0 duration-500">
              <CardHeader>
                <CardTitle className="font-serif text-3xl text-center">
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-center">
                  Report submitted on {results.timestamp}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Result Row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <Label className="text-muted-foreground">Category</Label>
                  <span className="font-semibold text-lg">{results.category}</span>
                </div>
                
                {/* Result Row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <Label className="text-muted-foreground">Severity</Label>
                  <span className="font-semibold text-lg">{results.severity}</span>
                </div>
                
                {/* Result Row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <Label className="text-muted-foreground">Issue (from Text)</Label>
                  <span className="font-semibold text-lg">{results.issue_type_text}</span>
                </div>

                {/* Result Row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <Label className="text-muted-foreground">Issue (from Image)</Label>
                  <span className="font-semibold text-lg">{results.issue_type_image}</span>
                </div>

                {/* Result Row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <Label className="text-muted-foreground">Image Confidence</Label>
                  <span className="font-semibold text-lg text-primary">{results.confidence}</span>
                </div>
                
                {/* Description */}
                <div className="space-y-2 pt-2">
                  <Label className="text-muted-foreground">Full Description</Label>
                  <p className="text-base p-3 bg-muted/50 rounded-md">
                    {results.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}