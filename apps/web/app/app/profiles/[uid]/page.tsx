"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User, Mail, BookOpen, Settings, Check, X, Layout } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar'
import { getUserProfile, updateMyProfile, uploadAvatar } from '@/app/api/users'
import { logoutFromBackend } from '@/app/api/router'
import { Camera, Loader2, LogOut } from 'lucide-react'
import { useToast } from '@/components/toast'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setUser, logout as clearUser } from '@/app/store/userSlice'

const ProfilePage = () => {
    const { uid } = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { showToast, ToastComponent } = useToast()
    const currentUser = useAppSelector(state => state.user)
    const isOwnProfile = currentUser.firebase_uid === uid
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ username: '', avatar: '' })
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (uid) {
            getUserProfile(uid as string)
                .then(data => {
                    if (data) {
                        setProfile(data)
                        setEditForm({ username: data.username, avatar: data.avatar || '' })
                    } else {
                        setProfile(null)
                    }
                })
                .catch(() => setProfile(null))
                .finally(() => setIsLoading(false))
        }
    }, [uid])

    const handleLogout = async () => {
        try {
            await logoutFromBackend()
            dispatch(clearUser())
            router.push('/auth')
        } catch (err) {
            showToast("Logout failed", "error")
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const updated = await updateMyProfile(editForm)
            if (updated) {
                setProfile({ ...profile, ...updated })
                dispatch(setUser(updated))
                setIsEditing(false)
                showToast("Profile updated successfully", "success")
            }
        } catch (err) {
            showToast("Update failed", "error")
        } finally {
            setIsSaving(false)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const result = await uploadAvatar(file)
            if (result?.url) {
                const newProfile = { ...profile, avatar: result.url };
                setProfile(newProfile)
                setEditForm({ ...editForm, avatar: result.url })
                dispatch(setUser({
                    id: profile.id,
                    firebase_uid: profile.firebase_uid,
                    email: profile.email,
                    username: profile.username,
                    avatar: result.url
                }))
                showToast("Avatar updated", "success")
            }
        } catch (err) {
            showToast("Upload failed", "error")
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                    <User className="w-10 h-10 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Profile not found</h2>
                <p className="text-zinc-500 max-w-xs mb-8">
                    The user you are looking for does not exist or has private visibility settings.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden">
                    <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-8">
                        <div className="relative group">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Avatar 
                                onClick={() => isEditing && fileInputRef.current?.click()}
                                className={`w-24 h-24 border-2 border-zinc-800 ring-2 ring-primary/20 ring-offset-2 ring-offset-zinc-900 shadow-2xl transition-all ${isEditing ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''}`}
                            >
                                <AvatarImage src={profile.avatar} alt={profile.username} />
                                <AvatarFallback className="bg-zinc-800 text-zinc-500">
                                    <User className="w-10 h-10" />
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-white shadow-xl pointer-events-none">
                                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <CardTitle className="text-3xl font-bold tracking-tight">
                                {profile.username}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                                <Mail className="w-4 h-4" />
                                {profile.email}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {isOwnProfile && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white font-semibold">
                                                {isSaving ? "Saving..." : <><Check className="w-4 h-4 mr-2" /> Save</>}
                                            </Button>
                                            <Button onClick={() => setIsEditing(false)} variant="outline" className="border-zinc-800 hover:bg-zinc-800">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className='flex flex-col gap-2'>
                                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-zinc-800 hover:bg-zinc-800 gap-2 cursor-pointer">
                                                <Settings className="w-4 h-4" /> Edit Profile
                                            </Button>
                                            <Button onClick={handleLogout} variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white gap-2 cursor-pointer border border-rose-500">
                                                <LogOut className="w-4 h-4" /> Log out
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardHeader>
                    
                    {isEditing && (
                        <CardContent className="border-t border-zinc-800 p-8 pt-6 bg-zinc-900/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Username</label>
                                    <Input 
                                        value={editForm.username} 
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800 focus:ring-primary/20 h-11"
                                        placeholder="Display Name"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-zinc-500">Knowledge Units</p>
                                <p className="text-4xl font-bold tracking-tight">{profile.stats.notes}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-zinc-500">Learning Paths</p>
                                <p className="text-4xl font-bold tracking-tight">{profile.stats.roadmaps}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                                <Layout className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {ToastComponent}
        </div>
    )
}

export default ProfilePage