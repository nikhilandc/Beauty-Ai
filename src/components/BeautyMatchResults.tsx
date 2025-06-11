import React from 'react';
import type { BeautyMatch } from '../lib/beautyStandards';

interface BeautyMatchResultsProps {
  matches: BeautyMatch[];
}

export function BeautyMatchResults({ matches }: BeautyMatchResultsProps) {
  const topMatch = matches[0];
  const otherMatches = matches.slice(1);

  return (
    <div className="space-y-6">
      {/* Top Match */}
      <div className="bg-gradient-to-r from-pink-400/10 to-purple-400/10 p-6 rounded-2xl border border-pink-400/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold">Closest Beauty Match</h4>
          <span className="text-2xl font-bold text-pink-500">{topMatch.percentage}%</span>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">{topMatch.standard.culture} - {topMatch.standard.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{topMatch.standard.description}</p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h5 className="font-medium mb-3">Key Features</h5>
        <div className="flex flex-wrap gap-2">
          {topMatch.standard.key_features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-pink-400/10 text-pink-600 dark:text-pink-300 text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Style Recommendations */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h5 className="font-medium mb-3">Style Recommendations</h5>
        <ul className="space-y-2">
          {topMatch.standard.style_recommendations.map((rec, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Other Matches */}
      <div className="space-y-3">
        <h5 className="font-medium">Other Beauty Standard Matches</h5>
        {otherMatches.map((match, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{match.standard.culture}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{match.standard.name}</p>
            </div>
            <span className="text-lg font-semibold text-pink-500">{match.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}