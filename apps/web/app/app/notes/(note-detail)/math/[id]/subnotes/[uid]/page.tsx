"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react'
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
import { useNote } from "@/context/NoteContext"
import { ImageWizard } from "@/components/knowledge-node/ImageWizard"
import { RichEditor } from "@/components/knowledge-node/RichEditor"
import { MathWorkbench } from "@/components/knowledge-node/MathWorkbench"
import { Mark, mergeAttributes } from '@tiptap/core'
import { Anchor, Cloud, Loader2 } from "lucide-react"
import { editSubNote, getSingleSubNote, uploadNoteImage } from "@/app/api/notes"
import { compressImage, MAX_FILE_SIZE } from "@/app/utils/image"

const MathSubNoteDetailPage = () => {
    const params = useParams()
    const id = params.id as string
    const uid = params.uid as string
    const { subNodes, setSubNodes, isAddingSub, setIsAddingSub } = useNote()
    const [wizardOpen, setWizardOpen] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    const [imgRotation, setImgRotation] = useState(0)
    const [imgScale, setImgScale] = useState(1)
    const [imgAlign, setImgAlign] = useState<'left' | 'center' | 'right'>('center')
    const [localSliderScale, setLocalSliderScale] = useState(1)
    const [mathLabOpen, setMathLabOpen] = useState(false)
    const [anchors, setAnchors] = useState<{ id: string, text: string }[]>([])

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
                addAttributes() {
                    return { ...this.parent?.(), style: { default: '', renderHTML: a => ({ style: a.style }) } }
                },
            }).configure({ inline: true, allowBase64: true }),
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: 'Advanced math sub-note... Use the Lab for deeper insights.' }),
            Highlight, TaskList, TaskItem.configure({ nested: true }),
            BubbleMenuExtension, FloatingMenuExtension, Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle, Color, Anchor
        ],
        onUpdate: ({ editor }) => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
            saveTimer.current = setTimeout(() => { handleSave() }, 5000)
            const seen = new Set<string>()
            const list: any[] = []
            editor.state.doc.descendants((node) => {
                node.marks.forEach(m => {
                    if (m.type.name === 'anchor' && !seen.has(m.attrs.id)) {
                        seen.add(m.attrs.id); list.push({ id: m.attrs.id, text: node.textContent })
                    }
                })
            })
            setAnchors(list)
        },
        editorProps: {
            attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[80vh] text-2xl leading-relaxed' },
            handleDrop: (_, e) => { if (e.dataTransfer?.files?.[0]) { handleFile(e.dataTransfer.files[0]); return true } return false },
            handlePaste: (_, e) => { if (e.clipboardData?.files?.[0]) { handleFile(e.clipboardData.files[0]); return true } return false },
        },
    })

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const lastSavedContent = useRef<string>("")
    const saveTimer = useRef<NodeJS.Timeout | null>(null)

    const handleSave = useCallback(async () => {
        if (!editor || !id || !uid) return
        const currentContent = JSON.stringify(editor.getJSON())
        if (currentContent === lastSavedContent.current) return
        setSaveStatus('saving')
        try {
            const res = await editSubNote(id, uid, undefined, editor.getJSON())
            if (res) { lastSavedContent.current = currentContent; setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000) }
            else { setSaveStatus('error') }
        } catch { setSaveStatus('error') }
    }, [editor, id, uid])

    useEffect(() => {
        const fetchNote = async () => {
            if (!id || !uid) return
            const note = await getSingleSubNote(id, uid)
            if (note?.content && editor) {
                editor.commands.setContent(note.content); lastSavedContent.current = JSON.stringify(note.content)
            }
        }
        fetchNote()
    }, [id, uid, editor])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave() }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleSave])

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const currentContent = editor ? JSON.stringify(editor.getJSON()) : ""
            if (saveStatus === 'saving' || currentContent !== lastSavedContent.current) {
                e.preventDefault(); e.returnValue = ''
            }
        }
        const handleInternalNavigation = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a')
            if (target && target instanceof HTMLAnchorElement) {
                const href = target.getAttribute('href')
                const currentContent = editor ? JSON.stringify(editor.getJSON()) : ""
                const isDirty = saveStatus === 'saving' || currentContent !== lastSavedContent.current
                if (isDirty && href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
                    if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                        e.preventDefault()
                    }
                }
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('click', handleInternalNavigation, { capture: true })
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            document.removeEventListener('click', handleInternalNavigation, { capture: true })
        }
    }, [saveStatus, editor])

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) return
        if (file.size > MAX_FILE_SIZE) { alert("File too large (max 5MB)"); return }
        setSaveStatus('saving')
        try {
            const compressed = file.size > 1024 * 1024 ? await compressImage(file) : file
            const res = await uploadNoteImage(compressed)
            if (res?.url) { setImgUrl(res.url); setWizardOpen(true); setSaveStatus('idle') }
            else { setSaveStatus('error') }
        } catch { setSaveStatus('error') }
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

    const handleInsertImageFinal = useCallback(() => {
        if (!imgUrl || !editor) return
        const layoutStyle = imgAlign === 'left' ? 'float: left; margin-right: 2rem;' : imgAlign === 'right' ? 'float: right; margin-left: 2rem;' : 'display: block; margin: 0 auto;'
        const styleText = `${layoutStyle} width: ${imgScale * 100}%; transform: rotate(${imgRotation}deg); border-radius: 12px; transition: all 0.3s;`
        if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { src: imgUrl, style: styleText }).run()
        } else {
            editor.chain().focus().setImage({ src: imgUrl, style: styleText } as any).run()
        }
        setWizardOpen(false)
    }, [editor, imgUrl, imgAlign, imgScale, imgRotation])

    return (
        <main className="flex-1 flex bg-[#050505] overflow-hidden relative">
            <div className="absolute top-6 right-10 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {saveStatus === 'saving' && <><Loader2 className="w-3 h-3 animate-spin text-primary" /><span>Saving...</span></>}
                {saveStatus === 'saved' && <><Cloud className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">Saved</span></>}
                {saveStatus === 'idle' && <><Cloud className="w-3 h-3 opacity-20" /><span>Cloud Synced</span></>}
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pt-12 pb-24 px-10">
                <RichEditor 
                    editor={editor} openWizard={() => setWizardOpen(true)}
                    editImageByNode={editImageByNode} updateImageStyle={updateImageStyle}
                    localSliderScale={localSliderScale} setLocalSliderScale={setLocalSliderScale}
                    setAnchor={() => {}} openMathLab={() => setMathLabOpen(true)}
                />

                <ImageWizard 
                    isOpen={wizardOpen} onClose={() => setWizardOpen(false)} imgUrl={imgUrl} setImgUrl={setImgUrl}
                    imgRotation={imgRotation} setImgRotation={setImgRotation} imgScale={imgScale} setImgScale={setImgScale}
                    imgAlign={imgAlign} setImgAlign={setImgAlign} handleFile={handleFile} handleInsert={handleInsertImageFinal}
                />

                <MathWorkbench isOpen={mathLabOpen} onClose={() => setMathLabOpen(false)} onInjectImage={(url) => { setImgUrl(url); setWizardOpen(true) }} />
            </div>

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #3f3f46; pointer-events: none; height: 0; }
                .ProseMirror h1 { font-family: italic; font-weight: 900; font-size: 4rem; color: #fff; margin-bottom: 2rem; }
                .ProseMirror img { cursor: pointer; transition: all 0.3s; }
            `}</style>
        </main>
    )
}

export default MathSubNoteDetailPage