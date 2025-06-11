import React from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import type { AIAnalysisResult } from '../lib/aiFeatures';

interface AIFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
  result: Partial<AIAnalysisResult>;
  userImage: string | null;
}

export function AIFeatureModal({ isOpen, onClose, title, loading, result, userImage }: AIFeatureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            {userImage ? (
              <img
                src={userImage}
                alt="Analysis"
                className="w-full rounded-2xl object-cover mb-6"
              />
            ) : title !== 'Trend Fusion' ? (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Please upload a photo for analysis
                </p>
              </div>
            ) : null}

            {/* Results Section */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
              </div>
            ) : (
              <div className="space-y-6">
                {result.kBeauty && (
                  <>
                    <div className="bg-pink-50 dark:bg-pink-900/10 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold mb-3">Skin Analysis</h4>
                      <p className="text-pink-600 dark:text-pink-300 font-medium">
                        {result.kBeauty.skinType}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {result.kBeauty.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Recommended Products</h4>
                      <ul className="space-y-2">
                        {result.kBeauty.products.map((product, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {product}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {result.globalMatch && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Beauty Standard Matches</h4>
                    <div className="space-y-4">
                      {result.globalMatch.matches.map((match, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{match.culture}</span>
                            <span className="text-pink-500 font-semibold">
                              {match.score}% Match
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {match.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-sm px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.styleMatch && (
                  <>
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold mb-3">Your Style Profile</h4>
                      <p className="text-xl font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {result.styleMatch.primaryStyle}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Complementary Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.styleMatch.complementaryStyles.map((style, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-full bg-white dark:bg-gray-700 shadow-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Your Color Palette</h4>
                      <div className="flex gap-2">
                        {result.styleMatch.colorPalette.map((color, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {result.trendFusion && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Current Trends</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {result.trendFusion.currentTrends.map((trend, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm"
                          >
                            {trend}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Personalized Suggestions</h4>
                      <ul className="space-y-2">
                        {result.trendFusion.personalizedSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Seasonal Recommendations</h4>
                      <ul className="space-y-2">
                        {result.trendFusion.seasonalRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}