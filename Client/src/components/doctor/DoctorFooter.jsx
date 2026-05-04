export default function DoctorFooter() {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} MediscanAI. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/privacy-policy"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}