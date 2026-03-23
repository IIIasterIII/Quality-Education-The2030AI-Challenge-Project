"use client"
import React from 'react'
import { EditorContent, Editor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import { Button } from "@workspace/ui/components/button"
import { 
    Bold, Italic, List, ListOrdered, Heading1, Heading2, 
    ImageIcon, Highlighter, Underline as UnderlineIcon, 
    RotateCcw, Trash, AlignLeft, AlignCenter,    AlignRight,
    ExternalLink,
    FileText,
    Bookmark,
    Anchor,
    Pi
} from "lucide-react"

interface RichEditorProps {
    editor: Editor | null;
    openWizard: () => void;
    editImageByNode: () => void;
    updateImageStyle: (options: { rotateOffset?: number, scale?: number, align?: 'left'|'center'|'right' }) => void;
    localSliderScale: number;
    setLocalSliderScale: (val: number) => void;
    setAnchor: () => void;
    openMathLab?: () => void;
}

export const RichEditor = ({
    editor,
    openWizard,
    updateImageStyle,
    setLocalSliderScale,
    setAnchor,
    openMathLab
}: RichEditorProps) => {
    if (!editor) return null

    return (
        <>
            <FloatingMenu editor={editor}>
                <div className="flex items-center gap-1 bg-[#121212] border border-white/5 rounded-full p-1 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-2">
                    <button title="Image Wizard" className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/20 text-zinc-500" onClick={openWizard}>
                        <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    {openMathLab && (
                        <button title="Open Math Lab" className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary/60" onClick={openMathLab}>
                            <Pi className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <div className="w-px h-10 bg-white/5 mx-1" />
                    <button title="Heading 1" className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/20 text-zinc-500" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                        <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/20 text-zinc-500" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/20 text-zinc-500" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <List className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-white/5 mx-1" />
                    <button className={`h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-800 ${editor.isActive({ textAlign: 'left' }) ? 'text-primary' : 'text-zinc-600'}`} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                        <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className={`h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-800 ${editor.isActive({ textAlign: 'center' }) ? 'text-primary' : 'text-zinc-600'}`} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                        <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button className={`h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-800 ${editor.isActive({ textAlign: 'right' }) ? 'text-primary' : 'text-zinc-600'}`} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                        <AlignRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </FloatingMenu>

            <BubbleMenu 
                editor={editor} 
                updateDelay={500}
                shouldShow={({ editor }: { editor: Editor }) => editor.isActive('image')}
            >
                <div className="flex items-center gap-3 bg-zinc-950 border border-white/10 rounded-2xl p-2 px-4 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-200 min-w-[320px]">
                    <div className="flex items-center gap-1 pr-3 border-r border-zinc-900">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-zinc-900 text-zinc-400" onClick={() => updateImageStyle({ align: 'left' })}>
                            <AlignLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-zinc-900 text-zinc-400" onClick={() => updateImageStyle({ align: 'center' })}>
                            <AlignCenter className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-zinc-900 text-zinc-400" onClick={() => updateImageStyle({ align: 'right' })}>
                            <AlignRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-1 px-4 border-l border-r border-zinc-900 mx-2">
                        {[0.25, 0.5, 0.75, 1].map((p) => {
                            const currentScale = parseFloat(editor.getAttributes('image').style?.match(/width: ([\d.]+)%/)?.[1] || "100") / 100
                            const isActive = Math.abs(currentScale - p) < 0.05
                            return (
                                <button 
                                    key={p}
                                    className={`h-6 px-2 rounded-md text-[9px] font-black uppercase tracking-tighter transition-all ${
                                        isActive 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                                    }`}
                                    onClick={() => updateImageStyle({ scale: p })}
                                >
                                    {p === 1 ? 'Full' : `${p*100}%`}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-1 pl-3 border-l border-zinc-900">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-zinc-900 text-zinc-400" onClick={() => updateImageStyle({ rotateOffset: 90 })}>
                            <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-zinc-800 text-red-400" onClick={() => editor.chain().focus().deleteSelection().run()}>
                            <Trash className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </BubbleMenu>

            <BubbleMenu 
                editor={editor} 
                updateDelay={500}
                shouldShow={({ editor }: { editor: Editor }) => !editor.isActive('image') && !editor.state.selection.empty}
            >
                <div className="flex items-center gap-1 bg-[#121212]/90 border border-white/10 rounded-full p-1 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-200">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <Bold className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <Italic className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleHighlight().run()}>
                        <Highlighter className="w-3.5 h-3.5 text-yellow-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <List className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        <ListOrdered className="w-3.5 h-3.5" />
                    </Button>
                    <div className="w-px h-4 bg-white/5 mx-1" />
                    <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-full hover:bg-primary/20 ${editor.isActive({ textAlign: 'left' }) ? 'text-primary' : 'text-zinc-300'}`} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                        <AlignLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-full hover:bg-primary/20 ${editor.isActive({ textAlign: 'center' }) ? 'text-primary' : 'text-zinc-300'}`} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                        <AlignCenter className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-full hover:bg-primary/20 ${editor.isActive({ textAlign: 'right' }) ? 'text-primary' : 'text-zinc-300'}`} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                        <AlignRight className="w-3.5 h-3.5" />
                    </Button>
                    <div className="w-px h-4 bg-white/5 mx-1" />
                    <Button size="icon" variant="ghost" title="Set Bookmark" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={setAnchor}>
                        <Bookmark className="w-3.5 h-3.5 text-yellow-500" />
                    </Button>
                    <div className="w-px h-4 bg-white/5 mx-1" />
                    <Button size="icon" variant="ghost" title="Internal Link" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => {
                        const nodeId = window.prompt('Enter Subject ID / Path (e.g. 101)')
                        console.log("[EDITOR] Prompt result for internal link:", nodeId);
                        if (nodeId) {
                            console.log("[EDITOR] Setting internal link to:", `/app/subjects/${nodeId}`);
                            editor.chain().focus().setLink({ href: `/app/subjects/${nodeId}` }).run()
                        }
                    }}>
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    </Button>
                    <Button size="icon" variant="ghost" title="External Link" className="h-8 w-8 rounded-full hover:bg-primary/20 text-zinc-300" onClick={() => {
                        const url = window.prompt('External URL (e.g. https://google.com)')
                        console.log("[EDITOR] Prompt result for external link:", url);
                        if (url) {
                            console.log("[EDITOR] Setting external link to:", url);
                            editor.chain().focus().setLink({ href: url }).run()
                        }
                    }}>
                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    </Button>
                </div>
            </BubbleMenu>

            <div className="max-w-5xl mx-auto w-full">
                <EditorContent editor={editor} />
            </div>
        </>
    )
}
