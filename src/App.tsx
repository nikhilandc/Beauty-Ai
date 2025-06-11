import React, { useState, useCallback, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  Cherry, 
  Shirt, 
  Calendar,
  MessageCircle,
  Sun,
  Moon,
  Heart,
  Flower2,
  X,
  UserCircle,
  Globe,
  ShoppingCart
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthModal } from './components/AuthModal';
import { BeautyMatchResults } from './components/BeautyMatchResults';
import { BeautyShop } from './components/BeautyShop';
import { Cart } from './components/Cart';
import { AIFeatureModal } from './components/AIFeatureModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { supabase } from './lib/supabase';
import { analyzeBeautyStandards, saveBeautyMatches, type BeautyMatch } from './lib/beautyStandards';
import { useCartStore } from './lib/store';
import {
  analyzeKBeauty,
  analyzeGlobalMatch,
  analyzeStyleMatch,
  analyzeTrendFusion,
  type AIAnalysisResult
} from './lib/aiFeatures';

// Types
interface AIFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TrendingStyle {
  image: string;
  title: string;
  tags: string[];
  liked?: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

interface AnalysisResults {
  faceShape: string;
  skinTone: string;
  recommendedStyle: string;
  colorPalette: string;
  facialFeatures: string[];
}

interface BeautyStandardCard {
  title: string;
  description: string;
  image: string;
}

function App() {
  // Auth state
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useCartStore(state => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);

  // Beauty standards cards
  const beautyStandards: BeautyStandardCard[] = [
    {
      title: "Glass Skin",
      description: "Korean beauty standard emphasizing clear, luminous skin",
      image: "https://images.unsplash.com/photo-1614007672279-1dc703e5c9c6?auto=format&fit=crop&w=800"
    },
    {
      title: "Soft & Natural",
      description: "Japanese approach to natural beauty",
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800"
    },
    {
      title: "Sharp Features",
      description: "Chinese beauty emphasizing defined features",
      image: "https://images.unsplash.com/photo-1600600423621-70c9f4416ae9?auto=format&fit=crop&w=800"
    },
    {
      title: "Contoured & Defined",
      description: "Western beauty focusing on sculpted features",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800"
    },
    {
      title: "Bold & Radiant",
      description: "African beauty celebrating rich features",
      image: "https://images.unsplash.com/photo-1613876215075-276438c6681f?auto=format&fit=crop&w=800"
    }
  ];

  // Other state
  const [darkMode, setDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [beautyMatches, setBeautyMatches] = useState<BeautyMatch[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedBeautyStandard, setSelectedBeautyStandard] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [featureResult, setFeatureResult] = useState<Partial<AIAnalysisResult>>({});
  const [trendingStylesData, setTrendingStylesData] = useState<TrendingStyle[]>([
    { 
      image: 'https://images.unsplash.com/photo-1616627052149-22c4f8a6316c?auto=format&fit=crop&w=600', 
      title: 'Korean Street Style',
      tags: ['#K-Fashion', '#Seoul'],
      liked: false
    },
    { 
      image: 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?auto=format&fit=crop&w=600', 
      title: 'Harajuku Fusion',
      tags: ['#JFashion', '#Tokyo'],
      liked: false
    },
    { 
      image: 'https://images.unsplash.com/photo-1619164816991-22d393238d8f?auto=format&fit=crop&w=600', 
      title: 'Minimal Elegance',
      tags: ['#Minimalism', '#Clean'],
      liked: false
    },
  ]);

  const handleImageSelect = (imageUrl: string) => {
    setUserImage(imageUrl);
    setIsImageModalOpen(false);
  };

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFeatureClick = async (feature: string) => {
    if (!userImage && feature !== 'Trend Fusion') {
      setIsImageModalOpen(true);
      return;
    }

    setActiveFeature(feature);
    setFeatureLoading(true);
    setFeatureResult({});

    try {
      let result: Partial<AIAnalysisResult> = {};

      switch (feature) {
        case 'K-Beauty Analysis':
          result = { kBeauty: await analyzeKBeauty(userImage || '') };
          break;
        case 'Global Beauty Match':
          result = { globalMatch: await analyzeGlobalMatch(['Oval face', 'Clear skin']) };
          break;
        case 'Style Matching':
          result = { styleMatch: await analyzeStyleMatch(['Modern', 'Natural']) };
          break;
        case 'Trend Fusion':
          result = { trendFusion: await analyzeTrendFusion() };
          break;
      }

      setFeatureResult(result);
    } catch (error) {
      console.error('Error analyzing feature:', error);
      toast.error('Failed to analyze feature. Please try again.');
    } finally {
      setFeatureLoading(false);
    }
  };

  const aiFeatures: AIFeature[] = [
    { 
      icon: <Camera className="w-6 h-6" />, 
      title: 'K-Beauty Analysis', 
      description: 'AI-powered facial analysis based on Korean beauty standards' 
    },
    { 
      icon: <Globe className="w-6 h-6" />, 
      title: 'Global Beauty Match', 
      description: 'Find your closest match among worldwide beauty standards' 
    },
    { 
      icon: <Shirt className="w-6 h-6" />, 
      title: 'Style Matching', 
      description: 'Discover your perfect style blend of East meets West' 
    },
    { 
      icon: <Cherry className="w-6 h-6" />, 
      title: 'Trend Fusion', 
      description: 'Latest trends from Tokyo, Seoul, and global fashion weeks' 
    }
  ];

  // Handlers
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: AnalysisResults = {
      faceShape: 'Oval',
      skinTone: 'Warm',
      recommendedStyle: 'Modern Minimalist',
      colorPalette: 'Spring Warm',
      facialFeatures: [
        'Clear, dewy complexion',
        'High cheekbones',
        'Almond eyes',
        'Defined nose bridge',
        'Full lips'
      ]
    };
    
    setAnalysisResults(results);

    const matches = await analyzeBeautyStandards(results.facialFeatures);
    setBeautyMatches(matches);

    if (session?.user) {
      try {
        await supabase
          .from('user_analysis')
          .insert([
            {
              user_id: session.user.id,
              ...results,
              beauty_matches: matches
            }
          ]);

        await saveBeautyMatches(session.user.id, matches);
      } catch (error) {
        console.error('Error saving analysis:', error);
      }
    }

    setIsAnalyzing(false);
  };

  const toggleLike = (index: number) => {
    setTrendingStylesData(prev => 
      prev.map((style, i) => 
        i === index ? { ...style, liked: !style.liked } : style
      )
    );
  };

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageInput,
      isUser: true
    };

    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm analyzing your style preferences and will provide personalized recommendations shortly.",
        isUser: false
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }, [messageInput]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-cherry-50 via-sakura-50 to-lavender-50'}`}>
      <Toaster position="top-center" />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flower2 className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              BeautyAI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {session ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <UserCircle className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:opacity-90 transition-opacity"
              >
                <UserCircle className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-float">
            <span className="text-sm font-medium px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-pink-500 dark:text-pink-300">
              ✨ AI-Powered Beauty Analysis
            </span>
          </div>
          <h2 className="text-6xl font-bold mt-8 mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
            Discover Your Perfect
            <br />Global Beauty Style
          </h2>
          <p className="text-xl mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Blend the best of Korean and Japanese beauty standards with your unique style using our AI-powered analysis
          </p>
          <label className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-10 py-5 rounded-full font-medium inline-flex items-center mx-auto hover:opacity-90 transition-all hover:scale-105 shadow-xl hover:shadow-pink-200/50 cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Start Your Beauty Journey
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {!session && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Sign in to save your analysis results
            </p>
          )}
        </div>
      </section>

      {/* Beauty Standards Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Global Beauty Standards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beautyStandards.map((standard, index) => (
              <div
                key={index}
                onClick={() => setSelectedBeautyStandard(standard.title)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl"
              >
                <img
                  src={standard.image}
                  alt={standard.title}
                  className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white text-2xl font-semibold mb-2">{standard.title}</h3>
                  <p className="text-white/90">{standard.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beauty Shop Section */}
      {selectedBeautyStandard && (
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <BeautyShop initialStandard={selectedBeautyStandard} />
        </section>
      )}

      {/* Analysis Results Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">AI Analysis Results</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full rounded-xl object-cover mb-6"
                />
                {analysisResults && (
                  <div className="grid gap-4">
                    {Object.entries(analysisResults).map(([key, value]) => {
                      if (key === 'facialFeatures') return null;
                      return (
                        <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-semibold">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
                  </div>
                ) : beautyMatches.length > 0 ? (
                  <BeautyMatchResults matches={beautyMatches} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">AI-Powered Beauty Features</h3>
          {userImage ? (
            <div className="flex items-center justify-center mb-12">
              <div className="relative inline-block">
                <img
                  src={userImage}
                  alt="Your photo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
              Upload your photo to get personalized beauty analysis
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.title)}
                className="p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:transform hover:-translate-y-2 transition-all group cursor-pointer"
              >
                <div className="text-pink-400 dark:text-pink-300 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImage={userImage}
      />

      {/* AI Feature Modal */}
      <AIFeatureModal
        isOpen={!!activeFeature}
        onClose={() => setActiveFeature(null)}
        title={activeFeature || ''}
        loading={featureLoading}
        result={featureResult}
        userImage={userImage}
      />

      {/* Trending Styles */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16">Global Beauty Trends</h3>
          <div className="grid md:grid-cols-3 gap-10">
            {trendingStylesData.map((style, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl">
                <img 
                  src={style.image} 
                  alt={style.title}
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-white text-2xl font-semibold mb-3">{style.title}</h4>
                  <div className="flex gap-2">
                    {style.tags.map((tag, idx) => (
                      <span key={idx} className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => toggleLike(index)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all
                    ${style.liked 
                      ? 'bg-pink-500 text-white opacity-100' 
                      : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'}`}
                >
                  <Heart className={`w-5 h-5 ${style.liked ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-40">
          <div className="p-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">AI Style Assistant</h4>
              <button onClick={() => setIsChatOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="h-96 overflow-y-auto p-4">
            {chatMessages.map(message => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isUser
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your style..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

export default App;