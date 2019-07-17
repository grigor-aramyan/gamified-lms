export function checkAuthenticationAndRedirect(isAuthenticated) {
    if (!isAuthenticated) {
        window.location.replace('/');
    }
}