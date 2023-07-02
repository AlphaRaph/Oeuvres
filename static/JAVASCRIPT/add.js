window.addEventListener("DOMContentLoaded", (event) => {

    let uploadButton = document.getElementById("upload-button");
    let chosenImage = document.getElementById("chosen-image");
    let fileName = document.getElementById("file-name");
    let container = document.getElementById("drag-and-drop-box")
    let error = document.getElementById("error");
    let imageDisplay = document.getElementById("image-display");
    
    const fileHandler = (file, name, type) => {
        if (type.split("/")[0] !== "image") {
          //File Type Error
          error.innerText = "Please upload an image file";
          return false;
        }
        error.innerText = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          let img = document.getElementById("image-display-image");
          let legend = document.getElementById("image-display-figcaption");
          let label = document.getElementById("upload-button-label");
          img.src = reader.result;
          legend.innerText = name;
          imageDisplay.style.backgroundColor = "white";
          label.innerText = "Changer l'image";
          container.style.height = "";
        };
    };
    
    //Upload Button
    uploadButton.addEventListener("change", () => {
        // imageDisplay.innerHTML = "";
        // Array.from(uploadButton.files).forEach((file) => {
        //   fileHandler(file, file.name, file.type);
        // });
        file = Array.from(uploadButton.files)[0];
        fileHandler(file, file.name, file.type);
    });
    
    container.addEventListener(
        "dragenter",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          container.classList.add("active");
        },
        false
    );
    
    container.addEventListener(
        "dragleave",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          container.classList.remove("active");
        },
        false
    );
    
    container.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          container.classList.add("active");
        },
        false
    );
    
    container.addEventListener(
        "drop",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          container.classList.remove("active");
          let draggedData = e.dataTransfer;
          let files = draggedData.files;
          uploadButton.files = files;
          Array.from(files).forEach((file) => {
            fileHandler(file, file.name, file.type);
          });
        },
        false
    );
    
    window.onload = () => {
        error.innerText = "";
        container.style.height = "100%";
    };
});