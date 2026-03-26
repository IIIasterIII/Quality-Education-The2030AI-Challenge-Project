'use client'
import React from 'react'
import { MathJaxContext } from 'better-react-mathjax'

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    enableMenu: false,
  }
};

export const MathJaxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MathJaxContext config={config}>
            {children}
        </MathJaxContext>
    )
}
