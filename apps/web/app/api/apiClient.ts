export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        ...options,
        credentials: 'include',
    };

    let response = await fetch(url, defaultOptions);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    isRefreshing = false;
                    onRefreshed("refreshed");
                    return await fetch(url, defaultOptions);
                } else {
                    isRefreshing = false;
                    if (!window.location.pathname.startsWith('/auth')) {
                        window.location.href = '/auth';
                    }
                }
            } catch (e) {
                isRefreshing = false;
                if (!window.location.pathname.startsWith('/auth')) {
                    window.location.href = '/auth';
                }
            } finally {
                isRefreshing = false;
            }
        } else {
            return new Promise((resolve) => {
                addRefreshSubscriber(() => {
                    resolve(fetch(url, defaultOptions));
                });
            });
        }
    }

    return response;
}
