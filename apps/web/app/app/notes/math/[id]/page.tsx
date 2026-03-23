"use client"
import React, { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
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
import { Mark, mergeAttributes } from '@tiptap/core'
import { useNote } from "@/context/NoteContext"
import { ImageWizard } from "@/components/knowledge-node/ImageWizard"
import { RichEditor } from "@/components/knowledge-node/RichEditor"
import { MathWorkbench } from "@/components/knowledge-node/MathWorkbench"

const MathSubjectNodePage = () => {
    const params = useParams()
    const id = params.id as string
    const { subNodes, setSubNodes, isAddingSub, setIsAddingSub } = useNote()
    const [wizardOpen, setWizardOpen] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    const [imgRotation, setImgRotation] = useState(0)
    const [imgScale, setImgScale] = useState(1)
    const [imgAlign, setImgAlign] = useState<'left' | 'center' | 'right'>('center')
    const [localSliderScale, setLocalSliderScale] = useState(1)
    const [mathLabOpen, setMathLabOpen] = useState(false)
    const [anchors, setAnchors] = useState<{ id: string, text: string }[]>([])

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (e) => {
            setImgUrl(e.target?.result as string)
            setWizardOpen(true)
        }
        reader.readAsDataURL(file)
    }

    const Anchor = Mark.create({
        name: 'anchor',
        addAttributes() { return { id: { default: null } } },
        parseHTML() { return [{ tag: 'span[data-anchor-id]' }] },
        renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
            return ['span', mergeAttributes(HTMLAttributes, { 'data-anchor-id': HTMLAttributes.id, class: 'bg-primary/20 border-b-2 border-primary/50' }), 0]
        },
    })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Image.extend({
                addAttributes() { return { ...this.parent?.(), style: { default: '', renderHTML: a => ({ style: a.style }) }, } },
            }).configure({ inline: true, allowBase64: true }),
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: 'Dive into advanced mathematics... Use the Math Lab for visualizations.' }),
            Highlight, TaskList, TaskItem.configure({ nested: true }),
            BubbleMenuExtension, FloatingMenuExtension, Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle, Color, Anchor
        ],
        content: `<h1>Mathematical Laboratory: ${id}</h1><p>Here you can combine deep theoretical notes with interactive 2D and 3D visualizations. Use the <b>Pi</b> icon in the floating menu to launch the workbench.</p>`,
        onUpdate: ({ editor }) => {
            console.log("[EDITOR] Writing/Typing:", editor.getText());
            const seen = new Set<string>()
            const list: any[] = []
            editor.state.doc.descendants((node) => {
                node.marks.forEach(m => {
                    if (m.type.name === 'anchor' && !seen.has(m.attrs.id)) {
                        seen.add(m.attrs.id)
                        list.push({ id: m.attrs.id, text: node.textContent })
                    }
                })
            })
            setAnchors(list)
        },
        editorProps: {
            attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[80vh] text-2xl leading-relaxed' },
            handleDrop: (_, e) => { if (e.dataTransfer?.files?.[0]) { handleFile(e.dataTransfer.files[0]); return true } return false },
            handlePaste: (_, e) => { if (e.clipboardData?.files?.[0]) { handleFile(e.clipboardData.files[0]); return true } return false },
            handleDOMEvents: { dblclick: (v, e) => { if ((e.target as HTMLElement).tagName === 'IMG') { setTimeout(() => editImageByNode(), 10); return true } return false } }
        },
    })

    const handleInsertImageFinal = () => {
        if (!imgUrl) return
        const layoutStyle = imgAlign === 'left' ? 'float: left; margin-right: 2rem;' : imgAlign === 'right' ? 'float: right; margin-left: 2rem;' : 'display: block; margin: 0 auto;'
        const style = `${layoutStyle} width: ${imgScale * 100}%; transform: rotate(${imgRotation}deg); border-radius: 12px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);`
        editor?.chain().focus().setImage({ src: imgUrl, style } as any).run()
        setWizardOpen(false)
    }

    const editImageByNode = useCallback(() => {
        if (!editor) return
        const { src, style } = editor.getAttributes('image')
        if (!src) return
        setImgUrl(src)
        const rot = style?.match(/rotate\((-?\d+)deg\)/)
        const wid = style?.match(/width: ([\d.]+)%/)
        setImgRotation(rot ? parseInt(rot[1]) : 0)
        setImgScale(wid ? parseFloat(wid[1]) / 100 : 1)
        setWizardOpen(true)
    }, [editor])

    const updateImageStyle = useCallback((o: any) => {
        if (!editor) return
        const { style } = editor.getAttributes('image')
        const rot = (parseInt(style?.match(/rotate\((-?\d+)deg\)/)?.[1] || "0") + (o.rotateOffset || 0)) % 360
        const wid = o.scale !== undefined ? (o.scale * 100) : parseFloat(style?.match(/width: ([\d.]+)%/)?.[1] || "100")
        const align = o.align || (style?.includes('float: left') ? 'left' : style?.includes('float: right') ? 'right' : 'center')
        const layout = align === 'left' ? 'float: left; margin-right: 2rem;' : align === 'right' ? 'float: right; margin-left: 2rem;' : 'display: block; margin: 0 auto;'
        const newStyle = `${layout} width: ${wid}%; transform: rotate(${rot}deg); border-radius: 12px; transition: all 0.3s;`
        editor.chain().focus().updateAttributes('image', { style: newStyle }).run()
    }, [editor])

    const setAnchor = useCallback(() => {
        const name = window.prompt("Bookmark Name:")
        if (name) editor?.chain().focus().setMark('anchor', { id: `math-anchor-${Date.now()}` }).run()
    }, [editor])

    return (
        <main className="flex-1 flex bg-[#050505] overflow-hidden relative">
                 {anchors.length > 0 && (
                    <aside className="w-12 hover:w-64 border-r border-zinc-900 bg-[#050505]/50 backdrop-blur-xl flex flex-col pt-12 transition-all duration-500 group overflow-hidden z-20">
                        <div className="flex flex-col items-center group-hover:items-start px-3 gap-6">
                            <div className="flex flex-col gap-2 w-full">
                                {anchors.map((a) => (
                                    <button key={a.id} onClick={() => document.querySelector(`[data-anchor-id="${a.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                        className="w-full h-8 rounded-lg hover:bg-zinc-900 group transition-all"
                                    ><div className="w-2 h-2 mx-auto rounded-full bg-primary/40 group-hover:bg-primary" /></button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pt-12 pb-24 px-10">
                    <RichEditor 
                        editor={editor} openWizard={() => setWizardOpen(true)}
                        editImageByNode={editImageByNode} updateImageStyle={updateImageStyle}
                        localSliderScale={localSliderScale} setLocalSliderScale={setLocalSliderScale}
                        setAnchor={setAnchor} openMathLab={() => setMathLabOpen(true)}
                    />

                    <ImageWizard 
                        isOpen={wizardOpen} onClose={() => setWizardOpen(false)}
                        imgUrl={imgUrl} setImgUrl={setImgUrl} imgRotation={imgRotation} setImgRotation={setImgRotation}
                        imgScale={imgScale} setImgScale={setImgScale} imgAlign={imgAlign} setImgAlign={setImgAlign}
                        handleFile={handleFile} handleInsert={handleInsertImageFinal}
                    />

                    <MathWorkbench 
                        isOpen={mathLabOpen} 
                        onClose={() => setMathLabOpen(false)} 
                        onInjectImage={(url) => {
                            setImgUrl(url)
                            setWizardOpen(true)
                        }}
                    />
                </div>

                <style jsx global>{`
                    .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #3f3f46; pointer-events: none; height: 0; }
                    .ProseMirror h1 { font-family: italic; font-weight: 900; font-size: 4rem; color: #fff; margin-bottom: 2rem; }
                    .ProseMirror h2 { font-style: italic; font-weight: 800; font-size: 2.5rem; color: #f4f4f5; margin-bottom: 1.5rem; border-bottom: 1px solid #18181b; padding-bottom: 1rem; }
                    .ProseMirror img { cursor: pointer; transition: all 0.3s; }
                    .ProseMirror a { color: #3b82f6; text-decoration: underline; }
                    .ProseMirror ul, .ProseMirror ol { padding-left: 2rem; margin: 1.5rem 0; }
                `}</style>
            </main>
    )
}

export default MathSubjectNodePage