"use client"
import React, { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

import { KnowledgeSidebar } from "@/components/knowledge-node/KnowledgeSidebar"
import { ImageWizard } from "@/components/knowledge-node/ImageWizard"
import { RichEditor } from "@/components/knowledge-node/RichEditor"
import { SubNode } from "@/components/knowledge-node/types"
import { Mark, mergeAttributes } from '@tiptap/core'
import { Anchor as AnchorIcon } from "lucide-react"

const SubjectNodePage = () => {
    const params = useParams()
    const id = params.id as string

    /* --- Nodes State --- */
    const [subNodes, setSubNodes] = useState<SubNode[]>([
        { id: '101', title: 'Algebra' },
        { id: '102', title: 'Calculus' },
        { id: '103', title: 'Geometry' }
    ])
    const [newSubTitle, setNewSubTitle] = useState("")
    const [isAddingSub, setIsAddingSub] = useState(false)
    
    /* --- Wizard State --- */
    const [wizardOpen, setWizardOpen] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    const [imgRotation, setImgRotation] = useState(0)
    const [imgScale, setImgScale] = useState(1)
    const [imgAlign, setImgAlign] = useState<'left' | 'center' | 'right'>('center')
    const [localSliderScale, setLocalSliderScale] = useState(1)
    
    /* --- Anchors State --- */
    const [anchors, setAnchors] = useState<{ id: string, text: string }[]>([])

    /* --- File Handling --- */
    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setImgUrl(result)
            setWizardOpen(true)
        }
        reader.readAsDataURL(file)
    }

    /* --- Extension: Anchor --- */
    const Anchor = Mark.create({
        name: 'anchor',
        addAttributes() {
            return {
                id: { default: null },
            }
        },
        parseHTML() { return [{ tag: 'span[data-anchor-id]' }] },
        renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
            return ['span', mergeAttributes(HTMLAttributes, { 'data-anchor-id': HTMLAttributes.id, class: 'bg-primary/20 border-b-2 border-primary/50' }), 0]
        },
    })

    /* --- Editor Instance --- */
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Image.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        style: {
                            default: '',
                            renderHTML: attributes => ({ style: attributes.style }),
                        },
                    }
                },
            }).configure({ inline: true, allowBase64: true }),
            Link.configure({ openOnClick: false }),
            Placeholder.configure({
                placeholder: 'Start writing your knowledge... Type # for headers, - for lists.',
            }),
            Highlight,
            TaskList,
            TaskItem.configure({ nested: true }),
            BubbleMenuExtension,
            FloatingMenuExtension,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Anchor
        ],
        onUpdate: ({ editor }) => {
            const seen = new Set<string>()
            const uniqueAnchors: { id: string, text: string }[] = []
            
            editor.state.doc.descendants((node) => {
                node.marks.forEach(mark => {
                    if (mark.type.name === 'anchor' && !seen.has(mark.attrs.id)) {
                        seen.add(mark.attrs.id)
                        uniqueAnchors.push({ id: mark.attrs.id, text: node.textContent || 'Anchor' })
                    }
                })
            })
            setAnchors(uniqueAnchors)
        },
        content: `<h1>Brain Node: ${id}</h1><p>Capture your thoughts with real-time Markdown conversion. Type # followed by a space to create a heading, or - for a list entry.</p>`,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[80vh] text-2xl leading-relaxed selection:bg-primary/20',
            },
            handleDrop: (view, event) => {
                if (event.dataTransfer?.files?.[0]) {
                    handleFile(event.dataTransfer.files[0])
                    return true 
                }
                return false
            },
            handlePaste: (view, event) => {
                if (event.clipboardData?.files?.[0]) {
                    handleFile(event.clipboardData.files[0])
                    return true
                }
                return false
            },
            handleDOMEvents: {
                dblclick: (view, event) => {
                    const target = event.target as HTMLElement
                    if (target.tagName === 'IMG') {
                        setTimeout(() => editImageByNode(), 10)
                        return true
                    }
                    return false
                }
            }
        },
    })

    /* --- Business Logic --- */
    const handleInsertImageFinal = () => {
        if (!imgUrl) return
        const layoutStyle = imgAlign === 'left' ? 'float: left; margin-right: 2rem; margin-bottom: 1.5rem; display: inline-block;' : 
                            imgAlign === 'right' ? 'float: right; margin-left: 2rem; margin-bottom: 1.5rem; display: inline-block;' : 
                            'display: block; margin-left: auto; margin-right: auto; float: none; margin-bottom: 2rem;'
                            
        const widthVal = (imgScale * 100).toFixed(0)
        const transitionStyle = 'transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);'
        const style = `${layoutStyle} width: ${widthVal}%; transform: rotate(${imgRotation}deg); border-radius: 12px; max-width: 100%; ${transitionStyle}`
        
        if (editor?.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { src: imgUrl, style }).run()
        } else {
            editor?.chain().focus().setImage({ src: imgUrl, style } as any).run()
        }
        
        setImgUrl("")
        setImgRotation(0)
        setImgScale(1)
        setImgAlign('center')
        setWizardOpen(false)
    }

    const editImageByNode = useCallback(() => {
        if (!editor) return
        const { src, style } = editor.getAttributes('image')
        if (!src) return

        setImgUrl(src)
        const rotateMatch = style?.match(/rotate\((-?\d+)deg\)/)
        const widthMatch = style?.match(/width: ([\d.]+)%/)
        
        const align = style?.includes('float: left;') ? 'left' :
                     style?.includes('float: right;') ? 'right' : 
                     'center'

        setImgRotation(rotateMatch ? parseInt(rotateMatch[1]) : 0)
        setImgScale(widthMatch ? parseFloat(widthMatch[1]) / 100 : 1)
        setLocalSliderScale(widthMatch ? parseFloat(widthMatch[1]) / 100 : 1)
        setImgAlign(align)
        setWizardOpen(true)
    }, [editor])

    const setAnchor = useCallback(() => {
        if (!editor) return
        const anchorName = window.prompt("Bookmark Name:")
        if (!anchorName) return
        const id = `anchor-${Date.now()}`
        editor.chain().focus().setMark('anchor', { id }).run()
    }, [editor])

    const scrollToAnchor = (id: string) => {
        const el = document.querySelector(`[data-anchor-id="${id}"]`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Highlight it briefly
            el.classList.add('ring-4', 'ring-primary', 'transition-all', 'duration-500')
            setTimeout(() => el.classList.remove('ring-4', 'ring-primary'), 1000)
        }
    }

    const updateImageStyle = useCallback((options: { rotateOffset?: number, scale?: number, align?: 'left'|'center'|'right' }) => {
        if (!editor) return
        const { style } = editor.getAttributes('image')
        
        const rotateMatch = style?.match(/rotate\((-?\d+)deg\)/)
        const widthMatch = style?.match(/width: ([\d.]+)%/)
        
        let currentRotate = rotateMatch ? parseInt(rotateMatch[1]) : 0
        let currentWidth = widthMatch ? parseFloat(widthMatch[1]) : 100
        
        const newRotate = options.rotateOffset !== undefined ? (currentRotate + options.rotateOffset) % 360 : currentRotate
        const newWidth = options.scale !== undefined ? (options.scale * 100).toFixed(0) : currentWidth
        const newAlign = options.align !== undefined ? options.align : (style?.includes('float: left;') ? 'left' : style?.includes('float: right;') ? 'right' : 'center')

        const layoutStyle = newAlign === 'left' ? 'float: left; margin-right: 2rem; margin-bottom: 1.5rem; display: inline-block;' : 
                            newAlign === 'right' ? 'float: right; margin-left: 2rem; margin-bottom: 1.5rem; display: inline-block;' : 
                            'display: block; margin-left: auto; margin-right: auto; float: none; margin-bottom: 2rem;'
                            
        const transitionStyle = 'transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);'
        const newStyle = `${layoutStyle} width: ${newWidth}%; transform: rotate(${newRotate}deg); border-radius: 12px; max-width: 100%; ${transitionStyle}`
        editor.chain().focus().updateAttributes('image', { style: newStyle }).run()
    }, [editor])

    const handleAddSubNode = () => {
        if (!newSubTitle) return
        const newNode = { id: Date.now().toString(), title: newSubTitle }
        setSubNodes([...subNodes, newNode])
        setNewSubTitle("")
        setIsAddingSub(false)
    }

    return (
        <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
            <KnowledgeSidebar 
                subNodes={subNodes}
                isAddingSub={isAddingSub}
                newSubTitle={newSubTitle}
                setIsAddingSub={setIsAddingSub}
                setNewSubTitle={setNewSubTitle}
                handleAddSubNode={handleAddSubNode}
            />

            <main className="flex-1 flex bg-[#050505] overflow-hidden relative">
                
                {/* Anchor Rail (Left side of main area) */}
                {anchors.length > 0 && (
                    <aside className="w-12 hover:w-64 border-r border-zinc-900 bg-[#050505]/50 backdrop-blur-xl flex flex-col pt-12 transition-all duration-500 group overflow-hidden z-20">
                        <div className="flex flex-col items-center group-hover:items-start px-3 gap-6">
                            <div className="flex items-center gap-3 px-1 text-zinc-600">
                                <AnchorIcon className="w-5 h-5 shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block whitespace-nowrap">Bookmarks</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 w-full">
                                {anchors.map((anchor) => (
                                    <button 
                                        key={anchor.id}
                                        onClick={() => scrollToAnchor(anchor.id)}
                                        className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-600 hover:text-primary transition-all overflow-hidden"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-zinc-800 shrink-0 group-hover:bg-primary/40" />
                                        <span className="text-[10px] font-bold truncate hidden group-hover:block">{anchor.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pt-12 pb-24 px-10">
                    <RichEditor 
                        editor={editor}
                        openWizard={() => setWizardOpen(true)}
                        editImageByNode={editImageByNode}
                        updateImageStyle={updateImageStyle}
                        localSliderScale={localSliderScale}
                        setLocalSliderScale={setLocalSliderScale}
                        setAnchor={setAnchor}
                    />

                    <ImageWizard 
                        isOpen={wizardOpen}
                        onClose={() => setWizardOpen(false)}
                        imgUrl={imgUrl}
                        setImgUrl={setImgUrl}
                        imgRotation={imgRotation}
                        setImgRotation={setImgRotation}
                        imgScale={imgScale}
                        setImgScale={setImgScale}
                        imgAlign={imgAlign}
                        setImgAlign={setImgAlign}
                        handleFile={handleFile}
                        handleInsert={handleInsertImageFinal}
                    />
                </div>

                <style jsx global>{`
                    @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    .scale-in-center { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                    .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #27272a; pointer-events: none; height: 0; }
                    .ProseMirror h1 { font-family: italic; font-weight: 900; font-size: 4rem; color: #fff; margin-bottom: 2rem; margin-top: 3rem; }
                    .ProseMirror h2 { font-style: italic; font-weight: 800; font-size: 2.8rem; color: #f4f4f5; margin-bottom: 1.5rem; margin-top: 3rem; border-bottom: 1px solid #18181b; padding-bottom: 1rem; }
                    .ProseMirror blockquote { border-left: 3px solid #3b82f6; padding-left: 1.5rem; color: #71717a; font-style: italic; }
                    .ProseMirror img { cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                    .ProseMirror a { color: #3b82f6; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
                    .ProseMirror a:hover { color: #93c5fd; text-decoration-thickness: 2px; }
                    .ProseMirror ul { list-style-type: disc; padding-left: 2rem; margin: 1.5rem 0; }
                    .ProseMirror ol { list-style-type: decimal; padding-left: 2rem; margin: 1.5rem 0; }
                    .ProseMirror li { margin: 0.5rem 0; }
                    .ProseMirror li::marker { color: #3b82f6; font-weight: 900; }
                    .ProseMirror li p { margin: 0; }
                `}</style>
            </main>
        </div>
    )
}

export default SubjectNodePage