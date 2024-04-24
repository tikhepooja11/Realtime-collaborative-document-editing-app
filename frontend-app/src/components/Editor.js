import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const socket = io("http://localhost:3000"); // Connect to the backend server

function Editor() {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const loggedInUserFullName = loggedInUser?.fullname;
  const [room, setRoom] = useState("");
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [clientId, setClientId] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      alert(`${loggedInUser.fullname} connected`);
    }

    // Handle received messages
    socket.on("received_message", (msg) => {
      setMessagesReceived((prevMessages) => [...prevMessages, msg.message]);
    });

    // Handle document content updates
    socket.on("document-content-update", (updatedContent) => {
      setDocumentContent(updatedContent);
    });

    socket.on("typing_indicator", ({ fullname, isTyping }) => {
      setTypingUsers((prevUsers) => {
        if (isTyping) {
          // Add userId if it's not already in the list
          if (!prevUsers.includes(fullname)) {
            return [...prevUsers, fullname];
          }
        } else {
          // Remove userId from the list
          return prevUsers.filter((user) => user !== fullname);
        }
        return prevUsers; // Return previous state if no change needed
      });
    });

    socket.on("updateStyleBold", (bold) => {
      setBold(bold);
    });
    socket.on("updateStyleItalic", (italic) => {
      setItalic(italic);
    });
    socket.on("updateStyleUnderline", (underline) => {
      setUnderline(underline);
    });

    // Listen for 'new-document-created' event from the server
    socket.on("save-document-success", (documentCreationData) => {
      alert(`${documentCreationData.title} document saved successfully`);
      navigate("/view-documents");
    });

    return () => {
      // Clean up event listeners on component unmount
      socket.off("received_message");
      socket.off("document-content-update");
      socket.off("typing_indicator");
      socket.off("updateStyleBold");
      socket.off("updateStyleItalic");
      socket.off("updateStyleUnderline");
      socket.off("save-document-success");

      // socket.off("new-document-created");
      // socket.disconnect();
    };
  }, [loggedInUser]); // Empty dependency array to run once on mount

  console.log(JSON.stringify(typingUsers));
  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("send_message", {
        message: inputMessage,
        room,
      });
      setInputMessage(""); // Clear input after sending message
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const handleTextAreaChange = (e) => {
    const newContent = e.target.value;
    setDocumentContent(newContent); // Update local document content
    if (!isTyping) {
      socket.emit("user_start_typing", {
        roomId: room,
        fullname: loggedInUserFullName,
        email: loggedInUser.email,
      });
      setIsTyping(true);
    }
    socket.emit("edit-document", { room, content: newContent });
  };

  const handleTypingStopped = () => {
    // Emit "user_start_typing" event to backend
    if (isTyping) {
      socket.emit("user_stop_typing", {
        roomId: room,
        fullname: loggedInUserFullName,
        email: loggedInUser.email,
      });
      setIsTyping(false);
    }
  };

  const handleBold = () => {
    const newBoldState = !bold;
    setBold(newBoldState);
    socket.emit("updateStyleBold", newBoldState);
  };

  const handleItalic = () => {
    const newItalicState = !italic;
    setItalic(newItalicState);
    socket.emit("updateStyleItalic", newItalicState);
  };

  const handleUnderline = () => {
    const newUnderlineState = !underline;
    setUnderline(newUnderlineState);
    socket.emit("updateStyleUnderline", newUnderlineState);
  };

  const handleViewDocument = () => {
    navigate("/view-documents");
  };

  const handleSaveDocument = () => {
    // Emit 'new-document' event with the document title and content
    socket.emit("save-document", {
      title: documentTitle,
      content: documentContent,
      clientId: socket.id,
      fullname: loggedInUser.fullname,
      email: loggedInUser.email,
    });
  };

  const handleCreateNewDocument = () => {
    setDocumentTitle("");
    setDocumentContent("");
    alert(`Good to go, Here is your fresh document...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400  to-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8 md:w-3/4 bg-gradient-to-r from-purple-500 to-purple-300 rounded-lg shadow-lg">
        <p className="mb-4 font-bold text-center">
          Client Name: {loggedInUserFullName}
        </p>
        <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
          <input
            type="text"
            className="w-full md:w-auto border rounded py-2 px-4 mb-2 md:mb-0 md:mr-2"
            placeholder="Enter room number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>

        <div className="flex mb-4 justify-center">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter document title..."
            style={{ maxWidth: "100%" }}
          />
        </div>

        {typingUsers.length > 0 && (
          <p className="ml-5 text-center">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.join(", ")} are typing...`}
          </p>
        )}

        <div className="flex justify-between mb-4 mt-6">
          <div className="flex">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none"
              onClick={() => handleBold()}
            >
              Bold
            </button>
            <button
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
              onClick={() => handleItalic()}
            >
              Italic
            </button>
            <button
              className="ml-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none"
              onClick={() => handleUnderline()}
            >
              Underline
            </button>
          </div>
          <div>
            <button
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
              onClick={handleSaveDocument}
            >
              Save
            </button>
            <button
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              onClick={handleViewDocument}
            >
              View All
            </button>
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={handleCreateNewDocument}
            >
              Create New
            </button>
          </div>
        </div>

        <textarea
          className="w-full h-80 border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500"
          value={documentContent}
          onChange={handleTextAreaChange}
          onBlur={handleTypingStopped}
          placeholder="Type your document content here..."
          style={{
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline ? "underline" : "none",
          }}
        />

        <div className="flex justify-between">
          <input
            type="text"
            className="w-full md:w-auto border rounded py-2 px-4 mb-2 md:mb-0 md:mr-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>

        <h2 className="mt-6 mb-2 font-bold">Messages:</h2>
        <ul>
          {messagesReceived.map((msg, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded mb-2">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Editor;
