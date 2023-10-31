import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [percent, setPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [totalvl, settotalvl] = useState(0);

  useEffect(() => {
    console.log(totalvl);
  }, [totalvl]);
  // const { isLoaded, isSignedIn, user } = useUser();
  // const { isLoaded, userId, sessionId, getToken } = useAuth();

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };
  // if (!isLoaded || !userId) {
  //   return null;
  // }

  const postsCollectionRef = collection(db, "posts");

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [deletePost]);

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);
  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  const uploadImages = async () => {
    setUploading(true);
    let totalval0 = 1;

    try {
      for (const selectedFile of selectedFiles) {
        if (!selectedFile) continue;

        // Check if the image already exists in Firebase Storage
        const storageRef = ref(storage, `/lightning/${selectedFile.name}`);
        let storageSnapshot = "";
        try {
          storageSnapshot = await getDownloadURL(storageRef);
        } catch (error) {
          storageSnapshot = "";
          console.log(error);
        }
        if (!storageSnapshot) {
          const uploadTask = uploadBytesResumable(storageRef, selectedFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setPercent(`Uploading ${selectedFile.name}: ${percent}%`);
            },
            (err) => console.log(err),
            async () => {
              // Get the image URL
              const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              const docRef = doc(db, "data", "Lightning");
              const docSnapshot = await getDoc(docRef);
              let selectedFileName = selectedFile?.name;
              let filename = selectedFileName.replace(".png", "").replaceAll("-", " ");
              filename = capitalizeFirstLetter(filename);

              if (docSnapshot.exists()) {
                // If the document exists, update its data structure
                const data = docSnapshot.data();
                const newData = {
                  ...data?.data,
                  data: [
                    ...(data.data.data || []), // Existing data or empty array
                    {
                      image: imageUrl,
                      title: filename,
                    },
                  ],
                  title: "Lightning",
                };

                // Update Firestore document
                await setDoc(docRef, { data: newData });
                console.log(`Image ${selectedFile.name} uploaded and data saved to Firestore.`);
              } else {
                // If the document doesn't exist, create it with initial data structure
                const initialData = {
                  data: [
                    {
                      image: imageUrl,
                      title: filename,
                    },
                  ],
                  title: "Lightning",
                };
                await setDoc(docRef, { data: initialData });
                console.log(`Image ${selectedFile.name} uploaded and data saved to Firestore.`);
              }
            }
          );
        } else {
          console.log(` ${selectedFile.name} already exists`);
          settotalvl(totalvl + 1);
          console.log(totalval0);
          totalval0 += 1;
        }
      }
    } catch (error) {
      console.error("Error uploading images and saving data:", error);
    } finally {
      setUploading(false);
      setSelectedFiles([]);
    }
  };

  // const uploadImages = async () => {
  //   setUploading(true);

  //   try {
  //     for (const selectedFile of selectedFiles) {
  //       if (!selectedFile) continue;

  //       // Upload the image to Firebase Storage
  //       const storageRef = ref(storage, `/files/${selectedFile.name}`);
  //       const uploadTask = uploadBytesResumable(storageRef, selectedFile);

  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  //           setPercent(`Uploading ${selectedFile.name}: ${percent}%`);
  //         },
  //         (err) => console.log(err),
  //         async () => {
  //           // Get the image URL
  //           const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

  //           // Save imageUrl to Firestore
  //           const docRef = collection(db, "images");
  //           await addDoc(docRef, {
  //             imageUrl: imageUrl,
  //           });

  //           console.log(
  //             `Image ${selectedFile.name} uploaded and URL saved to Firestore:`,
  //             imageUrl
  //           );
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error uploading images and saving URLs:", error);
  //   } finally {
  //     setUploading(false);
  //     setSelectedFiles([]);
  //   }
  // };

  // const uploadImage = async () => {
  //   if (!selectedFile) {
  //     alert("Please select an image to upload.");
  //     return;
  //   }

  //   // Upload the image to Firebase Storage
  //   try {
  //     // Upload the image to Firebase Storage
  //     const storageRef = ref(storage, `/files/${selectedFile.name}`); // Use ref to create a reference
  //     // await uploadBytes(storageRef, selectedFile); // Use uploadBytes to upload the file
  //     await uploadBytesResumable(storageRef, selectedFile);
  //     // Get the image URL
  //     // const imageUrl = await getDownloadURL(storageRef);

  //     const uploadTask = uploadBytesResumable(storageRef, selectedFile);
  //     // const imageUrl = await getDownloadURL(storageRef);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

  //         // update progress
  //         setPercent(percent);
  //       },
  //       (err) => console.log(err),
  //       () => {
  //         // download url
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
  //           console.log(url);
  //           const docRef = collection(db, "images");
  //           await addDoc(docRef, {
  //             imagesUrl: url,
  //           });
  //           console.log("Image uploaded and URL saved to Firestore:", url);
  //         });
  //       }
  //     );
  //     // Save imageUrl to Firestore
  //   } catch (error) {
  //     console.error("Error uploading image and saving URL:", error);
  //   }
  // };
  return (
    <div className="homePage">
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadImages} disabled={uploading || selectedFiles?.length === 0}>
        Upload Images
      </button>
      {uploading && <p>Uploading...</p>}
      <p>{percent}</p>
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="postHeader">
              <div className="title">
                <h1> {post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    {" "}
                    &#128465;
                  </button>
                )}
              </div>
            </div>
            <div className="postTextContainer"> {post.postText} </div>
            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
