const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUserProfile = async (uid: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/users/${uid}`, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        console.error("Error getting user profile", err);
        return null;
    }
};

export const updateMyProfile = async (data: { username?: string; avatar?: string }) => {
    try {
        const response = await fetch(`${BACKEND_URL}/users/me`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        console.error("Error updating profile", err);
        return null;
    }
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(`${BACKEND_URL}/users/avatar`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        console.error("Error uploading avatar", err);
        return null;
    }
};
