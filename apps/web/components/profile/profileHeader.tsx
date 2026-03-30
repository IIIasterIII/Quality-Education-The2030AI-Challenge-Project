import React from 'react'
import { CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar'
import { User, Mail, Camera, Loader2 } from 'lucide-react'
import EditingButton from './editingButton'

const ProfileHeader = ({ profile, isEditing, isUploading, handleFileChange, fileInputRef, handleSave, handleLogout, setIsEditing, isOwnProfile, isSaving }: {
    profile: any,
    isEditing: boolean,
    isUploading: boolean,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
    handleSave: () => void,
    handleLogout: () => void,
    setIsEditing: (editing: boolean) => void,
    isOwnProfile: boolean,
    isSaving: boolean,
}) => {
    return (
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
                <EditingButton
                    isOwnProfile={isOwnProfile}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    handleSave={handleSave}
                    handleLogout={handleLogout}
                    setIsEditing={setIsEditing} />
            </div>
        </CardHeader>
    )
}

export default ProfileHeader