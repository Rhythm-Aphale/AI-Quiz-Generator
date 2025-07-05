import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Dynamic import for pdf-parse to avoid import-time file system access
async function parsePdf(buffer: Buffer) {
  const pdfParse = await import('pdf-parse');
  return pdfParse.default(buffer);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Extract text from file
    let text = '';
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'application/pdf') {
      try {
        const pdfData = await parsePdf(fileBuffer);
        text = pdfData.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json({ error: 'Failed to parse PDF file' }, { status: 400 });
      }
    } 
    else if (file.type === 'text/plain') {
      text = fileBuffer.toString('utf-8');
    }
    else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
      } catch (docError) {
        console.error('Document parsing error:', docError);
        return NextResponse.json({ error: 'Failed to parse document file' }, { status: 400 });
      }
    } 
    else {
      return NextResponse.json({ 
        error: 'Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.' 
      }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'No text content found in file' }, { status: 400 });
    }

    // Generate quiz using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
      Based on the following text, generate a comprehensive quiz with 10 multiple-choice questions. 
      Each question should have 4 options (A, B, C, D) and test understanding of the key concepts.
      
      Return the response in the following JSON format:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Correct option text",
            "explanation": "Brief explanation of the answer"
          }
        ]
      }
      
      Text content:
      ${text.substring(0, 4000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Parse the JSON response
    let quiz;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      return NextResponse.json({ error: 'Failed to parse quiz data' }, { status: 500 });
    }

    // Validate quiz structure
    if (!quiz.questions || quiz.questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate quiz questions' }, { status: 500 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}