import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";

const MyContext = createContext();

export const useMyContext = () => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("useMyContext must be used inside MyContextProvider");
  }

  return context;
};

const NEW_DAWN_ID = "the-new-dawn";

export const MyContextProvider = ({ children }) => {
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [newDawnProfile, setNewDawnProfile] = useState(null);

  const [users, setUsers] = useState([]);
  const [documentaries, setDocumentaries] = useState([]);
  const [archives, setArchives] = useState([]);
  const [news, setNews] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [records, setRecords] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);

  const [selectedDocumentaryCategory, setSelectedDocumentaryCategory] =
    useState("watch-documentary");

  const [selectedArchiveCategory, setSelectedArchiveCategory] =
    useState("records");

  const [loading, setLoading] = useState(true);

  const newDawnDocRef = doc(db, "newDawn", NEW_DAWN_ID);

  const subCollectionRef = (name) =>
    collection(db, "newDawn", NEW_DAWN_ID, name);

  const subDocumentRef = (collectionName, docId) =>
    doc(db, "newDawn", NEW_DAWN_ID, collectionName, docId);

  useEffect(() => {
    if (!currentUser) return;

    const createMainNewDawnDocument = async () => {
      try {
        await setDoc(
          newDawnDocRef,
          {
            title: "The New Dawn",
            slogan: "Leadership in Action - A State in Motion",
            organization: "Shevet-city Communications",
            partner: "Niger State Government",
            description:
              "A strategic multimedia programme for public engagement and enlightenment dedicated to the good people of Niger State.",
            website: "https://www.nigerstate-newdawn.com",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error creating New Dawn main document:", error);
      }
    };

    createMainNewDawnDocument();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onSnapshot(newDawnDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setNewDawnProfile({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    const collectionsToListen = [
      { name: "users", setter: setUsers },
      { name: "documentary", setter: setDocumentaries },
      { name: "archives", setter: setArchives },
      { name: "news", setter: setNews },
      { name: "inbox", setter: setInboxMessages },
      { name: "videos", setter: setVideos },
      { name: "photos", setter: setPhotos },
      { name: "records", setter: setRecords },
      { name: "platforms", setter: setPlatforms },
      { name: "messages", setter: setMessages },
      { name: "comments", setter: setComments },
    ];

    const unsubscribers = collectionsToListen.map(({ name, setter }) => {
      const q = query(subCollectionRef(name), orderBy("createdAt", "desc"));

      return onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            firestorePath: docItem.ref.path,
            ...docItem.data(),
          }));

          setter(data);
        },
        (error) => {
          console.error(`Error listening to ${name}:`, error);
        }
      );
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const publishedDocumentaries = useMemo(() => {
    return documentaries.filter((item) => item.status !== "draft");
  }, [documentaries]);

  const publishedArchives = useMemo(() => {
    return archives.filter((item) => item.status !== "draft");
  }, [archives]);

  const publishedNews = useMemo(() => {
    return news.filter((item) => item.status !== "draft");
  }, [news]);

  const unreadInboxMessages = useMemo(() => {
    return inboxMessages.filter((item) => item.status === "unread");
  }, [inboxMessages]);

  const documentaryByCategory = useMemo(() => {
    return {
      watchDocumentary: publishedDocumentaries.filter(
        (item) => (item.category || "watch-documentary") === "watch-documentary"
      ),
      trailers: publishedDocumentaries.filter(
        (item) => item.category === "trailers"
      ),
      behindScenes: publishedDocumentaries.filter(
        (item) => item.category === "behind-scenes"
      ),
      photoHighlights: publishedDocumentaries.filter(
        (item) => item.category === "photo-highlights"
      ),
      broadcast: publishedDocumentaries.filter(
        (item) => item.category === "broadcast"
      ),
    };
  }, [publishedDocumentaries]);

  const archiveByCategory = useMemo(() => {
    return {
      records: publishedArchives.filter(
        (item) => (item.category || "records") === "records"
      ),
      videos: publishedArchives.filter((item) => item.category === "videos"),
      leadershipHub: publishedArchives.filter(
        (item) => item.category === "leadership-hub"
      ),
      platforms: publishedArchives.filter(
        (item) => item.category === "platforms"
      ),
    };
  }, [publishedArchives]);

  const signedInUserData = useMemo(() => {
    if (!currentUser) return null;
    return users.find((user) => user.uid === currentUser.uid) || null;
  }, [currentUser, users]);

  const signUpNewDawnUser = async ({
    name,
    email,
    password,
    phone,
    role = "viewer",
  }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    await setDoc(
      doc(db, "newDawn", NEW_DAWN_ID, "users", userCredential.user.uid),
      {
        uid: userCredential.user.uid,
        name,
        email,
        phone: phone || "",
        role,
        status: "active",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return userCredential.user;
  };

  const signInNewDawnUser = async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  };

  const logoutNewDawnUser = async () => {
    await signOut(auth);
  };

  const markInboxMessageAsRead = async (docId) => {
    if (!currentUser) {
      throw new Error("You must be signed in to update inbox messages.");
    }

    if (!docId) {
      throw new Error("Missing inbox message ID.");
    }

    await updateDoc(subDocumentRef("inbox", docId), {
      status: "read",
      updatedAt: serverTimestamp(),
    });
  };

  const deleteInboxMessage = async (docId) => {
    if (!currentUser) {
      throw new Error("You must be signed in to delete inbox messages.");
    }

    if (!docId) {
      throw new Error("Missing inbox message ID.");
    }

    await deleteDoc(subDocumentRef("inbox", docId));
  };

  const addDocumentary = async (data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to add documentary content.");
    }

    return await addDoc(subCollectionRef("documentary"), {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "watch-documentary",
      mediaType: data.mediaType || "video",
      mediaUrl: data.mediaUrl || "",
      thumbnailUrl: data.thumbnailUrl || "",
      source: data.source || "Cloudinary",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      createdBy: currentUser?.uid || null,
      createdByEmail: currentUser?.email || "",
      createdByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateDocumentary = async (docId, data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to update documentary content.");
    }

    if (!docId) {
      throw new Error("Missing documentary document ID.");
    }

    await updateDoc(subDocumentRef("documentary", docId), {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "watch-documentary",
      mediaType: data.mediaType || "video",
      mediaUrl: data.mediaUrl || "",
      thumbnailUrl: data.thumbnailUrl || "",
      source: data.source || "Cloudinary",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      updatedBy: currentUser?.uid || null,
      updatedByEmail: currentUser?.email || "",
      updatedByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      updatedAt: serverTimestamp(),
    });
  };

  const deleteDocumentary = async (docId) => {
    if (!currentUser) {
      throw new Error("You must be signed in to delete documentary content.");
    }

    if (!docId) {
      throw new Error("Missing documentary document ID.");
    }

    await deleteDoc(subDocumentRef("documentary", docId));
  };

  const addArchive = async (data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to add archive content.");
    }

    return await addDoc(subCollectionRef("archives"), {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "records",
      mediaType: data.mediaType || "video",
      mediaUrl: data.mediaUrl || "",
      thumbnailUrl: data.thumbnailUrl || "",
      source: data.source || "Cloudinary",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      createdBy: currentUser?.uid || null,
      createdByEmail: currentUser?.email || "",
      createdByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateArchive = async (docId, data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to update archive content.");
    }

    if (!docId) {
      throw new Error("Missing archive document ID.");
    }

    await updateDoc(subDocumentRef("archives", docId), {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "records",
      mediaType: data.mediaType || "video",
      mediaUrl: data.mediaUrl || "",
      thumbnailUrl: data.thumbnailUrl || "",
      source: data.source || "Cloudinary",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      updatedBy: currentUser?.uid || null,
      updatedByEmail: currentUser?.email || "",
      updatedByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      updatedAt: serverTimestamp(),
    });
  };

  const deleteArchive = async (docId) => {
    if (!currentUser) {
      throw new Error("You must be signed in to delete archive content.");
    }

    if (!docId) {
      throw new Error("Missing archive document ID.");
    }

    await deleteDoc(subDocumentRef("archives", docId));
  };

  const addNews = async (data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to add news.");
    }

    return await addDoc(subCollectionRef("news"), {
      title: data.title || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      createdBy: currentUser?.uid || null,
      createdByEmail: currentUser?.email || "",
      createdByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateNews = async (docId, data) => {
    if (!currentUser) {
      throw new Error("You must be signed in to update news.");
    }

    if (!docId) {
      throw new Error("Missing news document ID.");
    }

    await updateDoc(subDocumentRef("news", docId), {
      title: data.title || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      status: data.status || "published",

      fileName: data.fileName || "",
      fileType: data.fileType || "",
      fileSize: data.fileSize || 0,
      storageProvider: data.storageProvider || "cloudinary",

      updatedBy: currentUser?.uid || null,
      updatedByEmail: currentUser?.email || "",
      updatedByName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "",
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNews = async (docId) => {
    if (!currentUser) {
      throw new Error("You must be signed in to delete news.");
    }

    if (!docId) {
      throw new Error("Missing news document ID.");
    }

    await deleteDoc(subDocumentRef("news", docId));
  };

  const searchByKeyword = (items, keyword) => {
    if (!items || !Array.isArray(items) || typeof keyword !== "string") {
      return [];
    }

    const lowerCaseKeyword = keyword.toLowerCase();

    const containsKeyword = (value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerCaseKeyword);
      }

      if (Array.isArray(value)) {
        return value.some(containsKeyword);
      }

      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(containsKeyword);
      }

      return false;
    };

    return items.filter((item) => containsKeyword(item));
  };

  const capitalizeWords = (text) =>
    text?.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <MyContext.Provider
      value={{
        loading,
        currentUser,
        signedInUserData,
        newDawnProfile,

        selectedDocumentaryCategory,
        setSelectedDocumentaryCategory,
        selectedArchiveCategory,
        setSelectedArchiveCategory,

        users,

        documentaries,
        publishedDocumentaries,
        documentaryByCategory,

        archives,
        publishedArchives,
        archiveByCategory,

        news,
        publishedNews,

        inboxMessages,
        unreadInboxMessages,
        markInboxMessageAsRead,
        deleteInboxMessage,

        videos,
        photos,
        records,
        platforms,
        messages,
        comments,

        signUpNewDawnUser,
        signInNewDawnUser,
        logoutNewDawnUser,

        addDocumentary,
        updateDocumentary,
        deleteDocumentary,

        addArchive,
        updateArchive,
        deleteArchive,

        addNews,
        updateNews,
        deleteNews,

        searchByKeyword,
        capitalizeWords,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;