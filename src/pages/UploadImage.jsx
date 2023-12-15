import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "../App.css";
// import DatauriParser from "datauri/parser";
// import path from "path";

import Select from "react-select";
import axios from "axios";
// import cloudinary from "../cloudinary";

const UploadImage = () => {
  const [title, settitle] = useState("Logos");
  const [subtitle, setsubtitle] = useState("Abstract");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [percent, setPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [totalvl, settotalvl] = useState(0);

  const titleoptions = [
    { value: "UI/UX", label: "UI/UX" },
    { value: "Logos", label: "Logos" },
    { value: "Architecture", label: "Architecture" },
    { value: "VideoGameDesign", label: "VideoGameDesign" },
    { value: "MockupPhotos", label: "MockupPhotos" },
  ];

  const subtitleoptions = [
    { value: "none", label: "none" },
    { value: "Pictorialmark", label: "Pictorialmark" },
    { value: "Lettermark", label: "Lettermark" },
    { value: "Mascots", label: "Mascots" },
    { value: "Emblems", label: "Emblems" },
    { value: "Abstract", label: "Abstract" },
    { value: "Landingpage", label: "Landingpage" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Appdesign", label: "Appdesign" },
    { value: "Illustrations", label: "Illustrations" },
    { value: "Modern", label: "Modern" },
    { value: "Nature", label: "Nature" },
    { value: "Iconiclandmarks", label: "Iconiclandmarks" },
    { value: "Futuristic", label: "Futuristic" },
    { value: "Highrise", label: "Highrise" },
    { value: "3Dmodel", label: "3Dmodel" },
    { value: "Brutalist", label: "Brutalist" },
    { value: "Gamecharacters", label: "Gamecharacters" },
    { value: "Armour", label: "Armour" },
    { value: "Smartphonesmockups", label: "Smartphonesmockups" },
    { value: "tabletmockups", label: "tabletmockups" },
    { value: "Admockups", label: "Admockups" },
  ];

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const handleChangeTitle = (titlefile) => {
    settitle(titlefile);
  };

  const handleChangeSubtitle = (subtitlefile) => {
    setsubtitle(subtitlefile);
  };

  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    console.log(title);
    console.log(subtitle);
  }, [title, subtitle]);

  // const createImage = async (img, buffers) => {
  //   try {
  //     const parser = new DatauriParser();
  //     const base64Image = parser.format(
  //       path.extname(img.name).toString(),
  //       buffers
  //     );

  //     const uploadedImageResponse = await cloudinary.uploader.upload(
  //       base64Image.content,
  //       { folder: "gallery", resource_type: "image" }
  //     );
  //     return uploadedImageResponse.url;
  //   } catch (error) {
  //     console.log("🚀 ~ file: route.js:69 ~ createImage ~ error:", error);
  //   }
  // };

  //Upload Images in Firebase Storage
  const uploadImages = async () => {
    setUploading(true);
    let totalval0 = 1;

    try {
      for (const selectedFile of selectedFiles) {
        if (!selectedFile) continue;

        // Check if the image already exists in Firebase Storage
        const storageRef = ref(
          storage,
          `/${title}_${subtitle}/${selectedFile.name}`
        );
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
              const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setPercent(`Uploading ${selectedFile.name}: ${percent}%`);
            },
            (err) => console.log(err),
            async () => {
              // Get the image URL
              const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              const docRef = doc(db, "templates", `${title}_${subtitle}`);
              const docSnapshot = await getDoc(docRef);
              let selectedFileName = selectedFile?.name;
              let filename = selectedFileName
                .replace(".png", "")
                .replaceAll("-", " ");
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
                  title: title,
                  subtitle: subtitle,
                };

                // Update Firestore document
                await setDoc(docRef, { data: newData });
                console.log(
                  `Image ${selectedFile.name} uploaded and data saved to Firestore.`
                );
              } else {
                // If the document doesn't exist, create it with initial data structure
                const initialData = {
                  data: [
                    {
                      image: imageUrl,
                      title: filename,
                    },
                  ],
                  title: title,
                  subtitle: subtitle,
                };
                await setDoc(docRef, { data: initialData });
                console.log(
                  `Image ${selectedFile.name} uploaded and data saved to Firestore.`
                );
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
      window.location.reload();
    }
  };
  const uploadCloudinaryImages = async () => {
    console.log("Uploading");
    setUploading(true);

    try {
      for (const selectedFile of selectedFiles) {
        if (!selectedFile) continue;
        let imageUrl = "";
        if (selectedFile) {
          const formdata = new FormData();
          formdata.append("image", selectedFile);
          try {
            let { data } = await axios.post(
              "http://localhost:5000/createimage/create",
              formdata
            );
            imageUrl = data;
          } catch (error) {
            console.log(error);
          }
        }
        const docRef = doc(db, "filters", `${title}_${subtitle}`);
        const docSnapshot = await getDoc(docRef);
        let selectedFileName = selectedFile?.name;
        let filename = selectedFileName
          .replace(".png", "")
          .replaceAll("-", " ");
        filename = capitalizeFirstLetter(filename);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const newData = {
            ...data?.data,
            data: [
              ...(data.data.data || []),
              {
                image: imageUrl,
                title: filename,
              },
            ],
            title: title,
            subtitle,
          };

          await setDoc(docRef, { data: newData });
          console.log(
            `Image ${selectedFile.name} uploaded and data saved to Firestore.`
          );
        } else {
          const initialData = {
            data: [
              {
                image: imageUrl,
                title: filename,
              },
            ],
            title: title,
            subtitle,
          };
          await setDoc(docRef, { data: initialData });
          console.log(
            `Image ${selectedFile.name} uploaded and data saved to Firestore.`
          );
        }
      }
    } catch (error) {
      console.error("Error uploading images and saving data:", error);
    } finally {
      setUploading(false);
      setSelectedFiles([]);
      // window.location.reload();
    }
  };
  return (
    <div>
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "15px",
          padding: "20px",
        }}
      >
        <Select
          style={{ width: "250px" }}
          value={title}
          onChange={handleChangeTitle}
          options={titleoptions}
          placeholder="Enter Title"
        />
        <Select
          style={{ width: "250px" }}
          value={subtitle}
          onChange={handleChangeSubtitle}
          options={subtitleoptions}
          placeholder="Enter Subtitle"
        />
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "15px",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        <input
          style={{
            padding: "10px",
            outline: "none",
            border: "1px solid #00000057",
            width: "300px",
          }}
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => {
            settitle(e.target.value);
          }}
        />
        <input
          style={{
            padding: "10px",
            outline: "none",
            border: "1px solid #00000057",
            width: "300px",
          }}
          type="text"
          placeholder="Enter SubTitle"
          value={subtitle}
          onChange={(e) => {
            setsubtitle(e.target.value);
          }}
        />
      </div>
      <div className="uploaddiv">
        <div style={{ marginBottom: "12px", marginTop: "80px" }}>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            id="uploadimages"
            style={{ display: "none" }}
          />
          <label
            className="uploadlabel"
            htmlFor="uploadimages"
            disabled={uploading}
          >
            Upload Images
          </label>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "9px",
            justifyContent: "center",
            padding: "20px 51px",
          }}
        >
          {Array.isArray(selectedFiles) &&
            selectedFiles.length > 0 &&
            selectedFiles.map((item, id) => (
              <div style={{ position: "relative" }}>
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    objectPosition: "center",
                    border: "1px solid #00000012",
                  }}
                  src={URL.createObjectURL(item)}
                  alt="icon"
                />
              </div>
            ))}
        </div>
        {selectedFiles.length > 0 && (
          <button
            className="uploadbtn"
            onClick={() => uploadCloudinaryImages()}
          >
            {uploading ? `Uploading... ${percent}` : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
