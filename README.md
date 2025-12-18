# Oneira Image Generator

Oneira is a minimalist, high-performance AI image generator built with React and Vite. It leverages the Google Gemini API (Imagen model) to transform text descriptions into stunning visual art within a distraction-free, hyper-clean interface.

## ✨ Features

- **Hyper-Minimalist UI**: A pure, black-and-white aesthetic designed to focus entirely on creativity.
- **Real-Time Generation**: Powered by Google's latest generative models.
- **Customizable Controls**: Select from various artistic styles (Realistic, Anime, 3D, etc.) and aspect ratios.
- **History Gallery**: Automatically saves your session's creations in a sleek slide-down overlay.
- **"Inspire Me" Mode**: One-click random prompt generation to spark creativity.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Model**: Google Gemini API (Imagen 4.0)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mshivam017/oneira-image-generator.git
cd oneira-image-generator
```

2. **Install dependencies**

```bash
npm install
```

## 🔑 Configuration

To enable image generation, you need a Google Gemini API key.

### Get an API Key
Visit [Google AI Studio](https://aistudio.google.com/) and create a free API key.

### Set up Environment Variables
Create a file named `.env` in the root directory of the project.

### Add your Key
Paste the following into your `.env` file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

> **Note**: If you do not provide an API key, the app will automatically fallback to a mock generator mode, allowing you to test the UI interactions without using credits.

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

## 📂 Project Structure

```
oneira-image-generator/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Main application logic
│   └── index.css        # Tailwind directives
├── .env                 # API configuration
└── package.json         # Project metadata
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.