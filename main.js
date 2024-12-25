document.addEventListener("DOMContentLoaded", () => {
  
  const modal = document.getElementById("modal-screen");
  const overlay = document.getElementById("modal-overlay");
  const openModalBtn = document.getElementById("openModal");
  const addWorkmodalscreen = document.getElementById("add-modal-screen");
  const closeModalBtn = document.getElementById("closeButton");
  const closeModalBtntwo = document.querySelector(".mode-edition");
  const token = localStorage.getItem("authentificationToken");

  getWorks();
  getCategorie();

  async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const works = await response.json();
    console.log(works);
    displayWorkswith(works, "page");
    return works;
  }

  async function getCategorie() {
    const response = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const categories = await response.json();

    console.log(categories);
    const btnCategories = document.querySelector(".btn-categories");
    if (btnCategories) {
        createbtn(categories);
    }
    giveCategories(categories);
  }
  function giveCategories(categories) {
    const categoriesSelect=document.getElementById('categorySelect');
   
     categories.forEach(category => {
         const option = document.createElement('option');
         option.value = category.id; 
         option.textContent = category.name;
         categoriesSelect.appendChild(option);
     });
   }
  function createbtn(categories) {
    const btnCategories = document.querySelector(".btn-categories");
    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.classList.add("active");
    buttonAll.addEventListener("click", () => filterWorks("all", buttonAll));
    btnCategories.appendChild(buttonAll);

    categories.forEach((categorie) => {
      const button = document.createElement("button");
      button.textContent = categorie.name;
      button.dataset.categorieId = categorie.id;
      button.addEventListener("click", () => filterWorks(categorie.id, button));
      btnCategories.appendChild(button);
    });
  }

  function filterWorks(categoryId, clickedButton) {
    const figures = document.querySelectorAll(".gallery figure");
    const buttons = document.querySelectorAll(".btn-categories button");
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
    clickedButton.classList.add("active");
    figures.forEach((figure) => {
      if (categoryId === "all" || figure.dataset.categorieId == categoryId) {
        figure.style.display = "block";
      } else {
        figure.style.display = "none";
      }
    });
  }

  function displayWorkswith(works, type) {
    if (type === "page") {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        figure.dataset.categorieId = work.categoryId;
        figure.dataset.id = work.id;
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    }
    if (type === "modale") {
      const galleryModal = document.querySelector(".gallery-modal");
      galleryModal.innerHTML = "";
      works.forEach((work) => {
        const figureModal = document.createElement("figure");
        const imgModal = document.createElement("img");
        const iconPoubelle = document.createElement("img");
        iconPoubelle.dataset.id = work.id;
        imgModal.src = work.imageUrl;
        iconPoubelle.src = "./assets/icons/iconpoubelle.svg";
        iconPoubelle.classList.add("icon-poubelle");
        iconPoubelle.addEventListener("click", () => deleteWork(work.id, figureModal));
        figureModal.appendChild(imgModal);
        galleryModal.appendChild(figureModal);
        figureModal.appendChild(iconPoubelle);
      });
    }
  }

  async function deleteWork(workId, figureElement) {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      figureElement.remove();
      const works = await getWorks();
      displayWorkswith(works, "page");      
    } else {
      console.log(`echec de la supression de${workId}.`);
    }
  }
 
  function openModal() {
    modal.style.display = "block";
    overlay.style.display = "block";
    getWorks().then((works) => {
      displayWorkswith(works, "modale");
    });
  }

  function closeModal() {
    
    modal.style.display = "none";
    overlay.style.display = "none";
    addWorkmodalscreen.style.display = "none";
  }

  if (modal) {
    closeModalBtntwo.addEventListener("click", openModal);
    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    function logout() {
      localStorage.removeItem("authentificationToken");
      window.location.href = "index.html";
    }
    const logOutlink = document.querySelector(".log-out");
    logOutlink.addEventListener("click", logout);

    const buttonOpenaddworkmodal = document.getElementById("addWorkbutton");
    const addWorkmodalscreen = document.getElementById("add-modal-screen");
    const returnButton = document.getElementById("returnButton");
    buttonOpenaddworkmodal.addEventListener("click", openworkmodalscreen);
    function openworkmodalscreen() {
      modal.style.display = "none";
      addWorkmodalscreen.style.display = "block";
    }
    function returnback() {
      modal.style.display = "block";
      addWorkmodalscreen.style.display = "none";
    }
    returnButton.addEventListener("click", returnback);
  };
  function closeAddWorkModal() {
    const addWorkmodalscreen = document.getElementById("add-modal-screen");
    const overlay = document.getElementById("modal-overlay");
    addWorkmodalscreen.style.display = "none";
    overlay.style.display = "none";
}

 
const closeButtonAddWorkModal = document.getElementById("closeButtonAddWorkModal");
closeButtonAddWorkModal.addEventListener("click", closeAddWorkModal);

document.getElementById('imageInput').addEventListener('change', function(event) {
  const file = event.target.files[0]; 
  const maxSize = 4 * 1024 * 1024; 


      if (file.size > maxSize) {
          alert("La taille de l'image ne doit pas dépasser 4 Mo.");
          event.target.value = "";
          document.getElementById('previewImage').style.display = 'none';
          return;
      }

  if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
          const previewImage = document.getElementById('previewImage');
          previewImage.style.display='block';
          previewImage.src = e.target.result;  
      }

      reader.readAsDataURL(file); 
  }else {
    console.log("testet")
  }
});

document.getElementById('uploadForm').addEventListener('input', function() {
  document.querySelector('.send-image').disabled = !this.checkValidity();
});


document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this); 

  
      const response = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('authentificationToken')}`, 
              'Accept': 'application/json'
          },
          body: formData
         
      });
      console.log(formData);
      if (response.ok) {
          const data = await response.json();
          console.log('c est bon', data);
          const updatedWorks = await getWorks(); 
            displayWorkswith(updatedWorks, "page");  
            displayWorkswith(updatedWorks, "modale");
            this.reset();
            document.getElementById('previewImage').style.display = 'none';
            document.getElementById('submitButton').disabled = true;
            closeAddWorkModal();
      } else {
          const errorData = await response.json();
          console.error('Erreur :', errorData);
         
      }
  } 
);
});
