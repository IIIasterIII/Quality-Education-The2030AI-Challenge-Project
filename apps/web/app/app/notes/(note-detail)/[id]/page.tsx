"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Mark, mergeAttributes } from '@tiptap/core'
import { useNote } from "@/context/NoteContext"
import { ImageWizard } from "@/components/knowledge-node/ImageWizard"
import { RichEditor } from "@/components/knowledge-node/RichEditor"
import { UnifiedActionsSidebar } from "@/components/knowledge-node/UnifiedActionsSidebar"
import { Cloud, CloudOff, Loader2, Sparkles, X, Check, Eye, Edit3, FileText } from "lucide-react"
import { editNote, getSingleNote, uploadNoteImage, uploadPDF, refineNoteContent } from "@/app/api/notes"
import { compressImage, MAX_FILE_SIZE } from "@/app/utils/image"
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const SubjectNodePage = () => {
    const pdfInputRef = useRef<HTMLInputElement>(null)
    const [pdfWizardOpen, setPdfWizardOpen] = useState(false)
    const [extractedText, setExtractedText] = useState("")
    const [editedText, setEditedText] = useState("")
    const [isRefining, setIsRefining] = useState(false)
    const [hasSelection, setHasSelection] = useState(false)
    const [selectionLength, setSelectionLength] = useState(0)
    const [pdfViewMode, setPdfViewMode] = useState<'edit' | 'preview'>('edit')
    const [refinedRange, setRefinedRange] = useState<{ start: number, end: number } | null>(null)
    
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    
    const { subNodes, setSubNodes, isAddingSub, setIsAddingSub } = useNote()
    const [wizardOpen, setWizardOpen] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    const [imgRotation, setImgRotation] = useState(0)
    const [imgScale, setImgScale] = useState(1)
    const [imgAlign, setImgAlign] = useState<'left' | 'center' | 'right'>('center')
    const [localSliderScale, setLocalSliderScale] = useState(1)
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
            StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: { openOnClick: false } }),
            Image.extend({
                addAttributes() { return { ...this.parent?.(), style: { default: '', renderHTML: a => ({ style: a.style }) } } },
            }).configure({ inline: true, allowBase64: true }),
            Placeholder.configure({ placeholder: 'Start writing your knowledge... Type # for headers, - for lists.' }),
            Highlight, TaskList, TaskItem.configure({ nested: true }),
            BubbleMenuExtension, FloatingMenuExtension,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle, Color, Anchor
        ],
        onUpdate: ({ editor }) => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
            saveTimer.current = setTimeout(() => { handleSave() }, 5000)

            const seen = new Set<string>()
            const list: { id: string, text: string }[] = []
            editor.state.doc.descendants((node) => {
                node.marks.forEach(m => {
                    if (m.type.name === 'anchor' && !seen.has(m.attrs.id)) {
                        seen.add(m.attrs.id)
                        list.push({ id: m.attrs.id, text: node.textContent || 'Anchor' })
                    }
                })
            })
            setAnchors(list)
        },
        editorProps: {
            attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[80vh] text-2xl leading-relaxed selection:bg-primary/20 pb-20' },
            handleDrop: (_, e) => { if (e.dataTransfer?.files?.[0]) { handleFile(e.dataTransfer.files[0]); return true } return false },
            handlePaste: (_, e) => { if (e.clipboardData?.files?.[0]) { handleFile(e.clipboardData.files[0]); return true } return false },
            handleDOMEvents: { dblclick: (_, e) => { if ((e.target as HTMLElement).tagName === 'IMG') { setTimeout(() => editImageByNode(), 10); return true } return false } }
        },
    })

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const lastSavedContent = useRef<string>("")
    const saveTimer = useRef<NodeJS.Timeout | null>(null)

    const handleSave = useCallback(async () => {
        if (!editor || !id) return
        const currentContent = JSON.stringify(editor.getJSON())
        if (currentContent === lastSavedContent.current) return
        setSaveStatus('saving')
        try {
            const res = await editNote(parseInt(id), { content: editor.getJSON() })
            if (res) {
                lastSavedContent.current = currentContent
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 2000)
            } else { setSaveStatus('error') }
        } catch (err) { setSaveStatus('error') }
    }, [editor, id])

    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return
            const note = await getSingleNote(id)
            if (note?.content && editor) {
                editor.commands.setContent(note.content)
                lastSavedContent.current = JSON.stringify(note.content)
            }
        }
        fetchNote()
    }, [id, editor])

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
                const isDirty = saveStatus === 'saving' || (editor && JSON.stringify(editor.getJSON()) !== lastSavedContent.current)
                if (isDirty && href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
                    if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) e.preventDefault()
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
        if (file.type === 'application/pdf') {
            setSaveStatus('saving')
            try {
                const res = await uploadPDF(file)
                if (res?.content) {
                    setExtractedText(res.content); setEditedText(res.content); setPdfWizardOpen(true); setSaveStatus('idle')
                } else { setSaveStatus('error') }
            } catch (err) { setSaveStatus('error') }
            return
        }
        if (!file.type.startsWith('image/')) return
        if (file.size > MAX_FILE_SIZE) { alert("File too big!"); return }
        setSaveStatus('saving')
        try {
            const compressed = file.size > 1024 * 1024 ? await compressImage(file) : file
            const res = await uploadNoteImage(compressed)
            if (res?.url) { setImgUrl(res.url); setWizardOpen(true); setSaveStatus('idle') }
            else { setSaveStatus('error') }
        } catch (err) { setSaveStatus('error') }
    }

    const mdToHtml = (md: string) => {
        return md.replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>').replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>').replace(/\n\n/g, '<br/><br/>').replace(/<\/ul><ul>/g, '')
    }

    const handleRefine = async () => {
        const textarea = document.getElementById('pdf-vault-textarea') as HTMLTextAreaElement
        if (!textarea) return
        const start = textarea.selectionStart; const end = textarea.selectionEnd
        const isPartial = start !== end; const textToRefine = isPartial ? editedText.substring(start, end) : editedText
        if (!textToRefine) return
        if (textToRefine.length > 12000) { alert("Selection too large!"); return }
        setIsRefining(true)
        if (isPartial) setRefinedRange({ start, end })
        let result = ""
        await refineNoteContent(textToRefine, (chunk) => {
            result += chunk
            if (isPartial) {
                const newText = editedText.substring(0, start) + result + editedText.substring(end)
                setEditedText(newText)
                setRefinedRange({ start, end: start + result.length })
                setTimeout(() => {
                    const ta = document.getElementById('pdf-vault-textarea') as HTMLTextAreaElement
                    if (ta) { ta.focus(); ta.setSelectionRange(start, start + result.length) }
                }, 0)
            } else { setEditedText(result) }
        })
        setIsRefining(false)
        setTimeout(() => setRefinedRange(null), 3000)
    }

    const handleInsertPdfFinal = () => {
        if (!editedText || !editor) return
        editor.commands.focus('end')
        editor.commands.insertContent(`\n\n${mdToHtml(editedText)}`)
        setPdfWizardOpen(false); setEditedText(""); setExtractedText(""); setRefinedRange(null)
    }

    const handleInsertImageFinal = () => {
        if (!imgUrl) return
        const layoutStyle = imgAlign === 'left' ? 'float: left; margin-right: 2rem;' : imgAlign === 'right' ? 'float: right; margin-left: 2rem;' : 'display: block; margin: 0 auto;'
        const style = `${layoutStyle} width: ${(imgScale * 100).toFixed(0)}%; transform: rotate(${imgRotation}deg); border-radius: 12px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);`
        if (editor?.isActive('image')) { editor.chain().focus().updateAttributes('image', { src: imgUrl, style }).run() }
        else { editor?.chain().focus().setImage({ src: imgUrl, style } as any).run() }
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

    const scrollToAnchor = (id: string) => {
        const el = document.querySelector(`[data-anchor-id="${id}"]`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.classList.add('ring-4', 'ring-primary')
            setTimeout(() => el.classList.remove('ring-4', 'ring-primary'), 1000)
        }
    }

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
        if (name) editor?.chain().focus().setMark('anchor', { id: `anchor-${Date.now()}` }).run()
    }, [editor])

    return (
        <main className="flex-1 flex bg-[#050505] overflow-hidden relative">
            {/* Status Indicator */}
            <div className="absolute top-6 right-80 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {saveStatus === 'saving' ? <><Loader2 className="w-3 h-3 animate-spin text-primary" /> <span>Saving...</span></> :
                 saveStatus === 'saved' ? <><Cloud className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-500">Saved</span></> :
                 saveStatus === 'error' ? <><CloudOff className="w-3 h-3 text-red-500" /> <span className="text-red-500">Error</span></> :
                 <><Cloud className="w-3 h-3 opacity-20" /> <span>Synced</span></>}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pt-12 pb-24 px-10">
                <RichEditor 
                    editor={editor} openWizard={() => setWizardOpen(true)}
                    editImageByNode={editImageByNode} updateImageStyle={updateImageStyle}
                    localSliderScale={localSliderScale} setLocalSliderScale={setLocalSliderScale}
                    setAnchor={setAnchor}
                />

                <ImageWizard 
                    isOpen={wizardOpen} onClose={() => setWizardOpen(false)}
                    imgUrl={imgUrl} setImgUrl={setImgUrl} imgRotation={imgRotation} setImgRotation={setImgRotation}
                    imgScale={imgScale} setImgScale={setImgScale} imgAlign={imgAlign} setImgAlign={setImgAlign}
                    handleFile={handleFile} handleInsert={handleInsertImageFinal}
                />

                <input type="file" accept=".pdf" className="hidden" ref={pdfInputRef} onChange={(e) => {
                    const file = e.target.files?.[0]; if (file) handleFile(file)
                }} />

                {pdfWizardOpen && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[85vh] shadow-2xl scale-in-center">
                            <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800"><FileText className="w-4 h-4 text-zinc-400" /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-100">PDF Intelligence Vault</h3>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">AI Assisted Extraction</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPdfViewMode('edit')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${pdfViewMode === 'edit' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}><Edit3 className="w-3 h-3 mr-2 inline" /> Edit</button>
                                    <button onClick={() => setPdfViewMode('preview')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${pdfViewMode === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}><Eye className="w-3 h-3 mr-2 inline" /> Preview</button>
                                    <div className="w-px h-6 bg-zinc-800 mx-2" />
                                    <button onClick={handleRefine} disabled={isRefining || !hasSelection} className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 transition-all">
                                        {isRefining ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />} Refine
                                    </button>
                                    <button onClick={() => setPdfWizardOpen(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                {pdfViewMode === 'edit' ? (
                                    <textarea id="pdf-vault-textarea" value={editedText} 
                                        onChange={(e) => { setEditedText(e.target.value); setHasSelection(false) }} 
                                        onSelect={(e) => { 
                                            const ta = e.target as HTMLTextAreaElement; 
                                            const len = ta.selectionEnd - ta.selectionStart;
                                            setSelectionLength(len); 
                                            setHasSelection(len > 0);
                                        }}
                                        onKeyUp={(e) => {
                                            const ta = e.target as HTMLTextAreaElement;
                                            setSelectionLength(ta.selectionEnd - ta.selectionStart);
                                        }}
                                        className="w-full h-full bg-transparent p-10 text-zinc-300 text-lg leading-relaxed focus:outline-none resize-none selection:bg-primary/30"
                                        placeholder="Extracted text..." />
                                ) : (
                                    <div className="w-full h-full p-10 overflow-y-auto scrollbar-hide prose prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{editedText}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            <div className="px-8 py-5 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectionLength > 12000 ? 'text-red-500 animate-pulse' : selectionLength > 0 ? 'text-primary' : 'text-zinc-600'}`}>
                                                Selected: {selectionLength.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-800">/</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Limit: 12,000</span>
                                        </div>
                                        <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${selectionLength > 12000 ? 'bg-red-500' : 'bg-primary'}`} 
                                                style={{ width: `${Math.min((selectionLength / 12000) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => setEditedText(extractedText)} className="text-[9px] font-bold text-zinc-600 hover:text-zinc-300 uppercase tracking-widest transition-colors border-b border-zinc-800 hover:border-zinc-500 pb-0.5">Reset Source</button>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setPdfWizardOpen(false)} className="px-4 py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Discard</button>
                                    <button onClick={handleInsertPdfFinal} className="px-10 py-3 bg-zinc-100 text-zinc-950 font-black rounded-lg uppercase text-[11px] hover:bg-white shadow-2xl flex items-center gap-3 transition-all active:scale-95">
                                        <Check className="w-4 h-4" /> Add to Knowledge base
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Shared Right Sidebar */}
            <UnifiedActionsSidebar 
                anchors={anchors}
                onScrollToAnchor={scrollToAnchor}
                onRunExercise={() => router.push(`/app/exercise/${id}`)}
                onAppendPdf={() => pdfInputRef.current?.click()}
            />

            <style jsx global>{`
                .scale-in-center { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #27272a; pointer-events: none; height: 0; }
                .ProseMirror h1 { font-weight: 900; font-size: 4rem; color: #fff; margin-bottom: 2rem; }
                .ProseMirror h2 { font-weight: 800; font-size: 2.8rem; color: #f4f4f5; margin-bottom: 1.5rem; border-bottom: 1px solid #18181b; padding-bottom: 1rem; }
                .ProseMirror img { cursor: pointer; transition: all 0.3s; border-radius: 12px; }
            `}</style>
        </main>
    )
}

export default SubjectNodePage