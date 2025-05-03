// app/page.tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome to Smart Notes</h1>
        <div className="text-center space-x-4">
          <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
          <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
