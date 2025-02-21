// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useParams } from "react-router";

const mockCommunities = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Community ${i + 1}`,
  description: `This is the description for Community ${i + 1}.`,
  members: Math.floor(Math.random() * 100000) + 1000,
  imageUrl: `https://placeholder.com/100x100.png?text=C${i + 1}`,
}));

const Header = () => (
  <header className="flex justify-between items-center bg-black text-white p-4">
    <div className="flex items-center gap-4">
      <img
        src="https://via.placeholder.com/30"
        alt="Logo"
        className="rounded-full"
      />
      <h1 className="text-lg font-bold">Reddit</h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <FiSearch className="absolute top-2 left-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search Reddit"
          className="pl-8 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
        />
      </div>
      <button className="bg-blue-500 px-4 py-2 rounded-lg">Get App</button>
      <button className="border border-blue-500 px-4 py-2 rounded-lg">
        Log In
      </button>
    </div>
  </header>
);

const CommunityCard = ({ community }) => (
  <div className="flex items-center justify-center gap-3">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-500">{community.id}</span>
      <img
        src={community.imageUrl}
        alt={community.name}
        className="h-8 w-8 rounded-full"
      />
    </div>
    <div className="flex-1 space-y-0.5">
      <h3 className="text-sm font-medium text-gray-100">{community.name}</h3>
      <p className="text-xs text-gray-400 line-clamp-2">
        {community.description}
      </p>
      <span className="block text-xs text-gray-500">
        {community.members} members
      </span>
    </div>
  </div>
);

const CommunitiesList = ({ communities }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {communities.map((community) => (
      <div key={community.id} className="p-4">
        <CommunityCard community={community} />
      </div>
    ))}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-4 mt-8">
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`px-4 py-2 rounded-lg ${
          index + 1 === currentPage
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

const Community = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockCommunities.length / itemsPerPage);

  const displayedCommunities = mockCommunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold">Best of Reddit</h2>
        <p className="text-gray-600">Explore Reddit's top communities.</p>
        <CommunitiesList communities={displayedCommunities} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
    </div>
  );
};

function CommunityChannel() {
  const { id } = useParams();
  const community = mockCommunities.find((c) => c.id === parseInt(id));
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Admin",
      content: `Welcome to ${community?.name}!`,
      time: "Now",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          content: newMessage,
          time: "Now",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold">{community?.name}</h1>
        <p className="text-gray-600">{community?.description}</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.user === "You" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                message.user === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <strong>{message.user}:</strong> {message.content}
            </p>
            <span className="block text-xs text-gray-500 mt-1">
              {message.time}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export { Community, CommunityChannel };
