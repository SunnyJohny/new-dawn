import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
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
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [archives, setArchives] = useState([]);
  const [records, setRecords] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);

  const newDawnDocRef = doc(db, "newDawn", NEW_DAWN_ID);

  const subCollectionRef = (name) =>
    collection(db, "newDawn", NEW_DAWN_ID, name);

  useEffect(() => {
    const createMainNewDawnDocument = async () => {
      try {
        await setDoc(
          newDawnDocRef,
          {
            title: "The New Dawn",
            slogan: "Leadership in Action, A State in Motion",
            organization: "Shevet-city Communications",
            partner: "Niger State Government",
            description:
              "A strategic multimedia programme for public engagement and enlightenment dedicated to the good people of Niger State.",
            website: "https://shevet-citymedia.com",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error creating New Dawn main document:", error);
      }
    };

    createMainNewDawnDocument();
  }, []);

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
      { name: "videos", setter: setVideos },
      { name: "photos", setter: setPhotos },
      { name: "archives", setter: setArchives },
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

  // ✅ FIXED: safer published filter
  const publishedDocumentaries = useMemo(() => {
    return documentaries.filter((item) => item.status !== "draft");
  }, [documentaries]);

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

  // ✅ FIXED: addDocumentary improved
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
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "",
      createdAt: serverTimestamp(),
    });
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

        users,
        documentaries,
        publishedDocumentaries,
        documentaryByCategory,

        signUpNewDawnUser,
        signInNewDawnUser,
        logoutNewDawnUser,

        addDocumentary,

        searchByKeyword,
        capitalizeWords,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};