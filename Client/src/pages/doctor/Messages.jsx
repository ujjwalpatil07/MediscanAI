import { useState } from "react";
import { Search, Phone, Video, Paperclip, Send } from "lucide-react";
import { generateMessages } from "../../utils/doctorDummyData";

export default function DoctorMessages() {
  const [messages] = useState(generateMessages);
  const [selectedChat, setSelectedChat] = useState(messages[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Messages
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for message"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-neutral-700 max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedChat(msg)}
                className={`p-4 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-neutral-700 ${selectedChat.id === msg.id
                    ? "bg-green-50 dark:bg-green-900/20"
                    : ""
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {msg.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {msg.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {msg.sender}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {msg.message}
                    </p>
                    {msg.callType && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">Voice Call</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {selectedChat.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedChat.sender}
                </h4>
                {selectedChat.online && (
                  <p className="text-xs text-green-500">Online</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {selectedChat.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-3 max-w-md">
                <p className="text-sm text-gray-900 dark:text-white">
                  Hi Doctor,
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  Today 7:45 am
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {selectedChat.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-3 max-w-md">
                <p className="text-sm text-gray-900 dark:text-white">
                  I am not fine. I am a cardio patient. I need your help
                  immediately.
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  Today 7:59 am
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
              <button className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}