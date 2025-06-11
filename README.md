# 💖 BeautyAI – Global Beauty Standards Analysis Platform

**BeautyAI** is an elegant, AI-powered beauty analysis platform that blends **Korean**, **Japanese**, and **global** beauty standards with personalized recommendations. Built with modern web technologies, it delivers a seamless and stunning experience.

---

## 🌐 Live Demo

🔗 [**Try BeautyAI Live**](https://beauty-ai-dusky.vercel.app/)
*Experience the full platform with all features enabled.*

---

## 🌟 Key Features

### 🔍 AI-Powered Beauty Analysis

* Upload a photo and receive AI-driven facial analysis.
* Get matched with global beauty standards: Korean, Japanese, Chinese, Western, African, and Middle Eastern.

### 💄 Personalized Recommendations

* Discover curated skincare and beauty products based on your unique analysis.
* Style suggestions tailored to your look and preferences.

### 🛍️ E-Commerce Ready

* Full shopping experience with **cart**, **checkout**, and **Stripe integration**.
* Product filtering by beauty standard and trend.

### 👥 User Experience

* Drag-and-drop image upload with preview.
* AI Style Assistant via interactive chat.
* Personalized dashboard to save and track analysis results.
* Discover and like trending beauty styles.

---


## 🛠️ Tech Stack

| Layer             | Technologies Used                    |
| ----------------- | ------------------------------------ |
| **Frontend**      | React 18, TypeScript, Vite           |
| **Styling**       | Tailwind CSS, custom animations      |
| **Backend**       | Supabase (PostgreSQL), Supabase Auth |
| **State**         | Zustand                              |
| **Payments**      | Stripe Integration                   |
| **Icons**         | Lucide React                         |
| **Notifications** | React Hot Toast                      |
| **Deploy**        | Vercel                               |

---

## ⚙️ Installation

### 🔧 Prerequisites

* Node.js 18+
* npm or yarn
* Supabase account

### 🧭 Setup Guide

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/beautyai.git
   cd beautyai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🗄️ Database Schema

| Table Name            | Description                      |
| --------------------- | -------------------------------- |
| `profiles`            | Stores user profile information  |
| `user_analysis`       | AI analysis results              |
| `beauty_standards`    | Global beauty data               |
| `beauty_products`     | Product catalog                  |
| `user_beauty_matches` | Beauty standard matches per user |

* ✅ **Row Level Security** enabled
* 🔐 Secure and optimized queries
* 🔄 Automatic profile creation

---

## 🎨 Design System

### 🎨 Colors

* **Primary**: Gradient from `pink-400` to `purple-400`
* **Secondary**: Cherry blossom, lavender, sakura tones
* **Neutral**: Grayscale with full dark mode support

### ✍️ Typography

* **Headings**: Bold, with gradient text
* **Body**: Clean, legible font with excellent contrast

### 🧩 Components

* Fully **responsive**, mobile-first
* Accessible and WCAG-compliant
* Reusable modular architecture

---

## 💳 Stripe Integration

To enable payments, add the following to your `.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📷 Image Upload

* Supported formats: **JPG, PNG, GIF**
* Max size: **5MB**
* Features: **Drag & drop**, live preview, and image management

---

## 📱 Feature Workflow

### 🧑‍💻 Authentication

1. Sign up/log in with email/password
2. Auto-profile creation in DB
3. Track beauty analysis & history

### 🤖 AI Beauty Analysis

1. Upload facial photo
2. Get real-time facial feature analysis
3. Receive matches across global beauty standards
4. Personalized product and style suggestions

### 🛒 Shopping Experience

1. Filter products by standard
2. Add to cart with quantity management
3. Seamless, secure checkout
4. Track order history

---

## 🚀 Deployment

### ⚙️ Deploy to Netlify

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy settings:

   * **Build command**: `npm run build`
   * **Publish directory**: `dist`

    
---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push your branch:

   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request!

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* 🎨 **Tailwind CSS** – beautiful styling system
* 💡 **Lucide Icons** – for sleek iconography
* 📷 **Unsplash** – high-quality stock images
* 🌐 **React Community** – for powering the frontend ecosystem

---

## 📞 Support

Need help?
📧 Email: [support@beautyai.com](mailto:support@beautyai.com)
💬 Join our community on **Discord**

---

**Built with ❤️ by the BeautyAI Team**
*Discover your global beauty match with the power of AI.*
