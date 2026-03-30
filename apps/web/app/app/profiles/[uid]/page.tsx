"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@workspace/ui/components/card'
import { getUserProfile, updateMyProfile, uploadAvatar } from '@/app/api/users'
import { logoutFromBackend } from '@/app/api/router'
import { useToast } from '@/components/toast'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setUser, logout as clearUser } from '@/app/store/userSlice'
import EditingPanel from '@/components/profile/editingPanel'
import ProfileGrid from '@/components/profile/profileGrid'
import ProfileHeader from '@/components/profile/profileHeader'
import NotFoundProfile from '@/components/profile/notFoundProfile'

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
    const [editForm, setEditForm] = useState<{ username: string, avatar: string }>({ username: '', avatar: '' })
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

    if (isLoading) return null
    if (!profile) return <NotFoundProfile />

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden">
                    <ProfileHeader
                        profile={profile}
                        isEditing={isEditing}
                        isUploading={isUploading}
                        handleFileChange={handleFileChange}
                        fileInputRef={fileInputRef}
                        handleSave={handleSave}
                        handleLogout={handleLogout}
                        setIsEditing={setIsEditing}
                        isOwnProfile={isOwnProfile}
                        isSaving={isSaving}
                    />
                    <EditingPanel editForm={editForm} setEditForm={setEditForm} isEditing={isEditing} />
                </Card>
                <ProfileGrid profile={profile} />
            </div>
            {ToastComponent}
        </div>
    )
}

export default ProfilePage