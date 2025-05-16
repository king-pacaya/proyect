//Bookmark
  const modal = document.getElementById("modal");
  const modalShow = document.getElementById("show-modal");
  const modalClose = document.getElementById("close-model");
  const bookmarkForm = document.getElementById("bookmark-form");
  const websiteNameEl = document.getElementById("website-name");
  const websiteUrlEl = document.getElementById("website-url");
  const bookmarksContainer = document.getElementById("bookmarks-container");

  let bookmarks = [];

  // Show Modal , focus in Input
  let showModal = () => {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
  };
  // Close Modal
  let closeModal = () => modal.classList.remove("show-modal");

  // Modal Events Listeners
  modalShow.addEventListener("click", showModal);
  modalClose.addEventListener("click", closeModal);
  // close when click outside the modal
  window.addEventListener("click", (e) => (e.target === modal ? closeModal() : false));

  // Validate Form
  let Validate = (nameValue, urlValue) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
      alert("please submit values for both fields.");
      return false;
    }
    if (!urlValue.match(regex)) {
      alert("please provide a valid web address");
      return false;
    }
    // Valid
    return true;
  };

  // Build Bookmarks DOM
  let buildBookmarks = () => {
    // Remove all bookmark elements
    bookmarksContainer.textContent = "";
    // Build Items
    bookmarks.forEach((bookmark) => {
      const { name, url } = bookmark;

      //Link Cyan
      const item = document.createElement("div")
      item.classList.add("bitem");

      const link = document.createElement("a");
      link.classList.add("blink");
      link.setAttribute("href", `${url}`);
      link.setAttribute("target", "_blank");
      link.textContent = name;

      //Close Icon PCLN
      const closeIcon = document.createElement("i");
      closeIcon.classList.add("fas", "fa-times");
      closeIcon.setAttribute("title", "Delete Bookmark");
      closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

      //Favicon Green
      const favicon = document.createElement("img");
      favicon.classList.add("bimg");
      favicon.setAttribute("src", `https://www.google.com/s2/favicons?domain=${url}`);
      favicon.setAttribute("alt", "favicon");


      // Apend bookmark container
      item.append(closeIcon, favicon, link);
      bookmarksContainer.appendChild(item);
    });
  };

  //  Fetch Bookmarks
  let fetchBookmarks = () => {
    // Get Bookmarks from localStorage if available
    if (localStorage.getItem("bookmarks")) {
      bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
      // Create bookmarks array in localStorage
      bookmarks = [
        {
          name: "Duck Duck Go",
          url: "https://duckduckgo.com",
        },
        {
          name: "Youtube",
          url: "https://www.youtube.com",
        },
        {
          name: "Google",
          url: "https://www.google.com",
        },
        {
          name: "Dashboard v1.0",
          url: "https://king-pacaya.github.io/dashboard-v1.0/",
        }
      ];
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
  };

  // Delete Bookmark
  let deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) => {
      if (bookmark.url === url) {
        bookmarks.splice(i, 1);
      }
    });
    //   Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
  };
  // Handle Data from form
  let storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
      urlValue = `https://${urlValue}`;
    }

    if (!Validate(nameValue, urlValue)) {
      return false;
    }
    const bookmark = {
      name: nameValue,
      url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
  };

  // Event Listener
  bookmarkForm.addEventListener("submit", storeBookmark);

  // on Load , Fetch Bookmarks
  fetchBookmarks();