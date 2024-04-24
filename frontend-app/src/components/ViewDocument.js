import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const ViewDocument = () => {
  const navigate = useNavigate();
  const [documentList, setDocumentList] = useState([]);
  const [expandedDocumentId, setExpandedDocumentId] = useState(null); // Track expanded document ID
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (loggedInUser) {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
          const userDocumentsResponse = await axios.get(
            `http://localhost:3000/documents/getDocumentsByUserId/${loggedInUser._id}`,
            config
          );
          console.log("documents response :", userDocumentsResponse.data);
          setDocumentList(userDocumentsResponse.data);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      }
    };

    fetchUserDocuments();
  }, [loggedInUser]);

  const handleDeleteDocument = async (documentId) => {
    console.log("inside handleDeleteDocument :", documentId);
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      await axios.delete(
        `http://localhost:3000/documents/deleteDocument/${documentId}`,
        config
      );
      // Remove the deleted document from the documentList
      setDocumentList((prevList) =>
        prevList.filter((document) => document._id !== documentId)
      );
      alert("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document");
    }
  };

  const handleToggleExpand = (documentId) => {
    if (expandedDocumentId === documentId) {
      // Collapse the document content if already expanded
      setExpandedDocumentId(null);
    } else {
      // Expand the document content
      setExpandedDocumentId(documentId);
    }
  };

  return (
    <div>
      <Header />
      {Array.isArray(documentList) && documentList.length > 0 ? (
        <div>
          <h1 className="text-2xl font-bold mb-4 mt-5">
            Listing all documents
          </h1>

          <ul className="space-y-4">
            {documentList.map((document) => (
              <li key={document._id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="flex-grow mr-4">{document.title}</span>
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleToggleExpand(document._id)}
                    >
                      {expandedDocumentId === document._id
                        ? "Collapse"
                        : "View"}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleDeleteDocument(document._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {expandedDocumentId === document._id && (
                  <div className="mt-4 bg-gray-200 p-4 rounded">
                    <p>{document.content}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h1 className="text-2xl text-center font-bold mb-4 text-red-600">
          All clear! No documents to display at the moment
        </h1>
      )}
      <div className="flex space-x-2 mt-5 justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate("/editor")}
        >
          Go back to Editor
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ViewDocument;
