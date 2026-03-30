import React from 'react'
import { Button } from '@workspace/ui/components/button'
import { Check, X, Settings, LogOut } from 'lucide-react'

const EditingButton = ({ isOwnProfile, isEditing, isSaving, handleSave, handleLogout, setIsEditing }: {
    isOwnProfile: boolean,
    isEditing: boolean,
    isSaving: boolean,
    handleSave: () => void,
    handleLogout: () => void,
    setIsEditing: (editing: boolean) => void
}) => {
    if (!isOwnProfile) return null
    if (isEditing) return (
        <>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white font-semibold">
                {isSaving ? "Saving..." : <><Check className="w-4 h-4 mr-2" /> Save</>}
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="border-zinc-800 hover:bg-zinc-800">
                <X className="w-4 h-4" />
            </Button>
        </>
    )

    return (
        <div className='flex flex-col gap-2'>
            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-zinc-800 hover:bg-zinc-800 gap-2 cursor-pointer">
                <Settings className="w-4 h-4" /> Edit Profile
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white 
            gap-2 cursor-pointer border border-rose-500">
                <LogOut className="w-4 h-4" /> Log out
            </Button>
        </div>
    )
}

export default EditingButton