
# NEXT.JS AUTHENTICATION MIDDLEWARE

This file controls access to protected routes in your application.
Think of it as a security guard that checks if users are allowed to visit certain pages.

**Key Concepts for Beginners:**
1. Middleware - Code that runs between a request and response
2. Authentication - Verifying who a user is
3. Protected Routes - Pages that only logged-in users can see

```jsx
// ./middleware
import { withAuth } from "next-auth/middleware"
export default withAuth({
    pages: {
        signIn: "/signin"
    }
})
export const config = {
    matcher: ["/dashboard/:path*"]
}
```