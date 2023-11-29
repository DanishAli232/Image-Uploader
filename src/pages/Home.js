import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);

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
      {/* <button onClick={() => createCoupons()}>upload</button> */}
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
