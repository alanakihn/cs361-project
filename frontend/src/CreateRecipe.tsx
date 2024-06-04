import { useContext, useState } from "react";
import Header from "./components/Header";
import { AuthContext } from "./components/AuthContext";
import { IoIosSend } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { uploadImage } from "./api/images";
import { createRecipe } from "./api/catalog";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
  const { authToken, details } = useContext(AuthContext);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeBody, setRecipeBody] = useState("");
  const [recipeImages, setRecipeImages] = useState<File[]>([]);
  const [shareLoading, setShareLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setRecipeImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setRecipeImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRecipeSubmit = (e: any) => {
    e.preventDefault();
    setShareLoading(true);

    if (!authToken || !details) return;
    
    // firstly upload each file
    const filePromises = recipeImages.map((file) => {
      return uploadImage(authToken, file);
    });

    Promise.all(filePromises).then((fileIds) => {
      if (fileIds.includes(null)) {
        setShareLoading(false);
        alert("Image uploads failed! Try again later.");
        return;
      }

      createRecipe(authToken, {
        title: recipeTitle,
        description: recipeBody,
        image_links: fileIds.map((fileId) => fileId!!.id),
        author_uid: details?.uid,
      }).then((result) => {
          setShareLoading(false);
          if (!result) {
            alert("Recipe upload failed! Try again later.");
          } else {
            navigate("/recipes");
          }
        });
    });
  }

  return (
    <Header pageName="Create a Recipe">
      <div className="flex justify-center">
        <div className="w-[800px] mt-10 rounded border shadow bg-gray-100">
          <form className="flex flex-col items-center" onSubmit={handleRecipeSubmit}>
            <div className="w-full flex justify-center bg-orange-500 rounded-tl rounded-tr">
              <input 
                id="titleInput"
                placeholder="Enter recipe title..."
                className="w-[700px] p-2 font-bold h-[50px] my-2 text-2xl rounded"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                required
              />
            </div>

            <div className="my-2">
              <textarea 
                id="bodyInput"
                placeholder="Describe your recipe..."
                className="w-[700px] p-2 text-lg rounded"
                value={recipeBody}
                rows={7}
                onChange={(e) => setRecipeBody(e.target.value)}
                required
              />
            </div>

            <div className="w-full mt-1 p-2 bg-white border-t border-b">
              <div className="mb-1 w-full flex justify-center">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
                <label htmlFor="fileInput" className="button-primary cursor-pointer">
                  Add an image
                </label>
              </div>
              <div className="w-full overflow-x-scroll flex">
                {recipeImages.map((image, index) => (
                  <div key={index} className="m-1">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`recipe-${index}`}
                      className="w-[250px] h-[250px] object-cover rounded"
                    />
                    <button
                      type="button"
                      className="text-red-500 bg-white border rounded p-1 px-2 hover:bg-red-100 mt-2"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="flex items-center button-primary my-2" type="submit" disabled={shareLoading}>
              { !shareLoading ?
                <IoIosSend size={35} /> : <AiOutlineLoading3Quarters className="animate-spin" size={35} /> }
              <p className="ml-2 text-lg">
                { !shareLoading ? 
                  'Share to Community' : 'Sharing to Community...'
                }
              </p>
            </button>
          </form>
        </div>
      </div>
    </Header>
  );
};

export { CreateRecipe };
