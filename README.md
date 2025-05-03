# Smart Notes Frontend

The frontend for the Smart Notes Application, built with Next.js, TypeScript, and `react-draft-wysiwyg` for rich text editing. It provides a UI for user authentication, note creation, and editing, integrated with the Smart Notes Backend.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Backend**: The Smart Notes Backend must be running (see Backend README)

## Setup Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ashusketch382/smartNotesFrontend.git
   cd smartNotesFrontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install --legacy-peer-deps
   ```

   - **Note**: `--legacy-peer-deps` is required due to `react-draft-wysiwyg` compatibility with React 19.

3. **Configure Environment Variables**:

   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` with your values:
     ```env
     NEXT_PUBLIC_API_URL=<backend-url> # e.g., http://localhost:5000 or https://your-backend-url.com
     ```
   - **Note**: Set `NEXT_PUBLIC_API_URL` to the backend’s URL (local or deployed).

4. **Run the Frontend**:
   ```bash
   npm run dev
   ```
   - The app will run at `http://localhost:3000`.
   - Routes include:
     - `/`: Homepage (redirects to `/signin` if unauthenticated)
     - `/signin`: Login page
     - `/signup`: Signup page
     - `/notes/edit/:id`: Create/edit notes
     - `/dashboard`: User dashboard

## Build for Production

```bash
npm run build
npm run start
```

## Troubleshooting

- **API Errors**:
  - Ensure the backend is running and `NEXT_PUBLIC_API_URL` is correct.
  - Check Network tab in browser DevTools for API call errors.
- **Text Editor**:
  - If `react-draft-wysiwyg` fails, verify `@types/draft-js` is installed (`npm i --save-dev @types/draft-js`).
- **Routing**:
  - If `/signin` or `/signup` don’t load, check `app/signin/page.tsx` and `app/signup/page.tsx` exist.

## Notes

- The app uses `AuthContext` for authentication, redirecting unauthenticated users to `/signin`.
- Ensure MongoDB is set up via Docker or another method (see [Backend](https://github.com/ashusketch382/smartNotesBackend) README).
