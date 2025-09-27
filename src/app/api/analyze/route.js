import { NextResponse } from "next/server";
import nlp from "compromise";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "File not uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Image = buffer.toString("base64");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const visionRes = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }),
    }
  );

  if (!visionRes.ok) {
    return NextResponse.json(
      { error: "Error calling Google Vision API" },
      { status: visionRes.status }
    );
  }

  const visionResult = await visionRes.json();
  const extractedText =
    visionResult.responses?.[0]?.fullTextAnnotation?.text || "";

  if (!extractedText.trim()) {
    return NextResponse.json(
      { error: "No text detected in the uploaded file" },
      { status: 400 }
    );
  }

  // Use compromise to do simple entity extraction
  const doc = nlp(extractedText);
  const people = doc.people().out("array");
  const places = doc.places().out("array");
  const dates = doc.dates().out("array");

  return NextResponse.json({
    extractedText,
    entities: { people, places, dates },
  });
}

