# 📚 AI Quiz Generator

A powerful, AI-powered quiz generator web app built with **Next.js** and **Gemini Pro API**. Upload any PDF or TXT file — and instantly get a structured quiz with multiple-choice questions, options, correct answers, and explanations. Perfect for students, teachers, and self-learners!

![AI Quiz Generator Demo](https://your-demo-image-or-gif-url)

---

## 🚀 Features

✅ Upload `.pdf` or `.txt` documents  
✅ Automatically extracts key content using `pdf-parse`  
✅ Uses **Google Gemini API** to generate high-quality quiz questions  
✅ Quiz output includes:
- Title
- 10 MCQs with options (A–D)
- Correct answers
- Explanations  
✅ JSON-based response – easily integrable with any frontend  
✅ Built with **Next.js App Router** + API routes  
✅ Responsive and fast ⏱️

---

## 🧠 Tech Stack

| Tech        | Usage                      |
|-------------|----------------------------|
| **Next.js** | Full-stack framework       |
| **TypeScript** | Type safety and DX improvement |
| **Gemini API** | AI-generated questions    |
| **pdf-parse** | Text extraction from PDFs |
| **Tailwind CSS** *(optional)* | UI styling |

---

## ✨ How It Works

1. 📤 Upload a file via the UI
2. 📑 Backend reads and extracts text
3. 🤖 Gemini Pro is prompted with:
   > "Generate a 10-question MCQ quiz from the content..."
4. 🧠 Gemini returns a JSON structure with quiz details
5. 🖼️ Frontend displays the quiz beautifully

---

---

## 🔐 Setup Locally

```bash
git clone https://github.com/your-username/ai-quiz-generator.git
cd ai-quiz-generator
npm install

