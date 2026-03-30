import React from 'react'
import { CardContent } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'

const EditingPanel = ({ editForm, setEditForm, isEditing }: {
    editForm: { username: string, avatar: string },
    setEditForm: (editForm: { username: string, avatar: string }) => void,
    isEditing: boolean
}) => {
    if (isEditing) return (
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
    )
}

export default EditingPanel