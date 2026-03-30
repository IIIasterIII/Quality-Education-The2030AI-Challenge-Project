"use client"
import React from 'react'
import { Plus, ImageIcon, RotateCcw, MoreHorizontal, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Slider } from "@workspace/ui/components/slider"

interface ImageWizardProps {
    isOpen: boolean;
    onClose: () => void;
    imgUrl: string;
    setImgUrl: (url: string) => void;
    imgRotation: number;
    setImgRotation: React.Dispatch<React.SetStateAction<number>>;
    imgScale: number;
    setImgScale: (s: number) => void;
    imgAlign: 'left' | 'center' | 'right';
    setImgAlign: (a: 'left' | 'center' | 'right') => void;
    handleFile: (file: File) => void;
    handleInsert: () => void;
}

export const ImageWizard = ({
    isOpen,
    onClose,
    imgUrl,
    imgRotation,
    setImgRotation,
    imgScale,
    setImgScale,
    imgAlign,
    setImgAlign,
    handleFile,
    handleInsert
}: ImageWizardProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-[800px] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col scale-in-center">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">Image Wizard</h2>
                    <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 flex gap-12">
                    <div
                        className="flex-1 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden min-h-[400px] cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => document.getElementById('file-upload-wizard')?.click()}
                    >
                        {imgUrl ? (
                            <img src={imgUrl} className="transition-all duration-300 object-contain max-h-full" style={{ transform: `rotate(${imgRotation}deg) scale(${imgScale})`, borderRadius: '8px' }} />
                        ) : (
                            <div className="text-zinc-800 text-center space-y-3">
                                <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.2em]">Drop Image Here</p>
                            </div>
                        )}
                        <input type="file" id="file-upload-wizard" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    </div>

                    <div className="w-72 space-y-8 flex flex-col">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-zinc-950 border-zinc-800" onClick={() => setImgRotation(imgRotation - 90)}><RotateCcw className="w-4 h-4 mr-2" /> -90°</Button>
                                <Button variant="outline" className="flex-1 bg-zinc-950 border-zinc-800" onClick={() => setImgRotation(imgRotation + 90)}><MoreHorizontal className="w-4 h-4 mr-2 rotate-90" /> +90°</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600">Alignment</label>
                            <div className="flex gap-2">
                                <Button variant="outline" className={`flex-1 bg-zinc-950 border-zinc-800 ${imgAlign === 'left' ? 'border-primary border' : ''}`} onClick={() => setImgAlign('left')}><AlignLeft className="w-4 h-4" /></Button>
                                <Button variant="outline" className={`flex-1 bg-zinc-950 border-zinc-800 ${imgAlign === 'center' ? 'border-primary border' : ''}`} onClick={() => setImgAlign('center')}><AlignCenter className="w-4 h-4" /></Button>
                                <Button variant="outline" className={`flex-1 bg-zinc-950 border-zinc-800 ${imgAlign === 'right' ? 'border-primary border' : ''}`} onClick={() => setImgAlign('right')}><AlignRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600">Scaling • {(imgScale * 100).toFixed(0)}%</label>
                            <Slider 
                                min={0.1} max={1} step={0.01} 
                                value={[imgScale]} 
                                onValueChange={([v]) => setImgScale(v ?? 1)} 
                            />
                        </div>
                        <Button className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] rounded-xl text-xs mt-auto" disabled={!imgUrl} onClick={handleInsert}>Infect Into Node</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
