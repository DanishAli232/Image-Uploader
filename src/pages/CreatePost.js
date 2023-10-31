import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const postsCollectionRef = collection(db, "posts");

  let navigate = useNavigate();

  const createPost = async () => {
    console.log(auth);

    await addDoc(postsCollectionRef, {
      title,
      postText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    navigate("/");
  };

  const architectureCollection = doc(db, "promptsData", "Architecture");

  // Step 1: Fetch the current data from the "architecture" document
  async function updateChineseArray() {
    try {
      const docSnapshot = await getDoc(architectureCollection);
      if (docSnapshot.exists()) {
        const currentData = docSnapshot.data();

        // Step 2: Update the "chinese" array with new data
        const newChineseData = [
          {
            name: "newChineseItem",
          },
          // ...other updated items
        ];

        currentData.chinese = newChineseData;

        // Step 3: Set the updated data back to the "architecture" document
        await updateDoc(architectureCollection, currentData);
        console.log("Data updated successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  updateChineseArray();

  const setPromptsData = () => {
    const promptsCollection = collection(db, "promptsData");
    console.log(promptsCollection);
    const architectureCollection = doc(db, "promptsData", "Architecture12");
    const architectureData = {
      spanish: [
        {
          name: "spanish12",
        },
      ],
      french: [
        {
          name: "french",
        },
      ],
      english: [
        {
          name: "english",
        },
      ],
      chinese: [
        {
          name: "chinese",
        },
      ],
      title: "Architecture",
    };

    setDoc(architectureCollection, architectureData)
      .then(() => {
        console.log("Data added successfully");
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    // setPromptsData();
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div className="inputGp">
          <label> Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <button onClick={createPost}> Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
