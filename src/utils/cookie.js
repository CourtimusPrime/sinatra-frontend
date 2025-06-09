const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sinatra_user_id="));

const getUserCookie = () => cookie.split("=").pop()

export { cookie, getUserCookie };