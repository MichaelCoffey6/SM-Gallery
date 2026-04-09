// src/scripts/const.js
var $ = (sel, ctx = document) => ctx.querySelector(sel);
var $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
var cl = console.log;
var app = $("#app");
var appHeaderText = $("#appHeaderText");
var appMain = $("main");
var showPictures = $("#showPictures");
var showAlbums = $("#showAlbums");
var showImport = $("#showImport");
var zipFileTmpl = $("#zipFileTmpl");
var pictureTmpl = $("#pictureTmpl");
var picturesTmpl = $("#picturesTmpl");
var albumTmpl = $("#albumTmpl");
var sortPics = $("#sortPics");
var sortByDateChk = $("#sortByDateChk");
var sortAscChk = $("#sortAscChk");
var sortDesChk = $("#sortDesChk");
var sortAccept = $("#sortAccept");
var sortCancel = $("#sortCancel");
var duplicateConfirmation = $("#duplicateConfirmation");
var deleteConfirmation = $("#deleteConfirmation");
var imgViewer = $("#imgViewer");
var imgViewerSlider = $("#imgViewerSlider");
var imgViewerScroll = $("#imgViewerScroll");
var imgViewerInfo = $("#imgViewerInfo");
var imgDetails = $("#imgDetails");
var imgDetailsHeader = $("#imgDetailsHeader");
var imgDate = $("#imgDate");
var imgName = $("#imgName");
var imgSize = $("#imgSize");
var imgPath = $("#imgPath");
var imgLength = $("#imgLength");
var mainHeader = $("#mainHeader");
var mainHeaderTitle = $("#mainHeaderTitle");
var selectedCount = $("#selectedCount");
var currAlbumThumb = $("#currAlbumThumb");
var selectAll = $("#selectAll");
var backBtn = $("#backBtn");
var moreOptsChk = $("#moreOptsChk");
var editPicsBtn = $("#editPicsBtn");
var sortPicsBtn = $("#sortPicsBtn");
var detailsBtn = $("#detailsBtn");
var videoControls = $("#videoControls");
var videoTimeBar = $("#videoTimeBar");
var videoNow = $("#videoNow");
var videoNowBtn = $("#videoNowBtn");
var videoCurrTime = $("#videoCurrTime");
var videoDuration = $("#videoDuration");
var videoMuteBtn = $("#videoMuteBtn");
var videoBackBtn = $("#videoBackBtn");
var videoPlayBtn = $("#videoPlayBtn");
var videoAdvanceBtn = $("#videoAdvanceBtn");
var picInPicBtn = $("#picInPicBtn");
var imgSubOpts = $("#imgSubOpts");
var addFavoriteBtn = $("#addFavoriteBtn");
var deleteBtn = $("#deleteBtn");
var shareBtn = $("#shareBtn");
var pictures = $("#pictures");
var albums = $("#albums");
var albumPics = $("#albumPics");
var imports = $("#imports");
var importedFiles = $("#importedFiles");
var zipInp = $("#zipInp");
var navigationBar = $("#navigationBar");
var deleteSelBtn = $("#deleteSelBtn");
var shareSelBtn = $("#shareSelBtn");
var https = "https:";
var importsName = "@imports";
var favoritesName = "@favorites";
var mutedProp = "muted";
var pauseProp = "pause";
var playProp = "play";
var reader = new FileReader();
var currDate = /* @__PURE__ */ new Date();
var currDay = currDate.toDateString();
var currYear = currDate.getFullYear();
var canvas = document.createElement("canvas");
var canvasCtx = canvas.getContext("2d");
var screens = {
  [showPictures.id]: pictures,
  [showImport.id]: imports,
  [showAlbums.id]: {
    albums,
    albumPics
  }
};
var State = {
  imgOpen: false,
  videoOpen: false,
  appHeaderOpen: true,
  selectionMode: false,
  verticalScroll: false,
  prevInpSection: showPictures,
  prevInpSectionGallery: showPictures,
  prevVideoCallbacks: [],
  detailsObserver: {},
  imgs: {
    [favoritesName]: Promise.resolve("./src/assets/favorite on.svg")
  },
  pics: {},
  files: {},
  albumsPicturesSel: /* @__PURE__ */ new Set(),
  details: {
    visible: false,
    anim: true,
    exit: false
  },
  albumsOpts: {
    [favoritesName]: {
      sortByOpt: sortByDateChk,
      sortOrderOpt: sortDesChk
    }
  },
  pointerVideoTime: {
    pointerType: {},
    pointerDown: false,
    pointerStart: 0,
    pointerX: 0,
    duration: 0,
    newTimeX: 0,
    newTime: 0,
    video: null,
    videoTimeBarW: videoTimeBar.clientWidth
  }
};

// src/scripts/types.js
var MIMETYPES = {
  png: ["image/png"],
  jpg: ["image/jpeg", "image/jpg"],
  webp: ["image/webp"],
  avif: ["image/avif"],
  bmp: ["image/bmp", "image/x-ms-bmp", "image/x-bmp", "image/x-bitmap"],
  gif: ["image/gif"],
  svg: ["image/svg+xml"],
  mp4: ["video/mp4", "application/mp4"],
  webm: ["video/webm"],
  zip: ["application/zip", "application/x-zip", "application/x-zip-compressed"]
};
var FILETYPES = {
  image: [
    MIMETYPES.png,
    MIMETYPES.jpg,
    MIMETYPES.webp,
    MIMETYPES.bmp,
    MIMETYPES.avif,
    MIMETYPES.gif
  ].flat(),
  video: [
    MIMETYPES.mp4,
    MIMETYPES.webm
  ].flat()
};
var POINTERTYPES = {
  mouse: "mouse",
  touch: "touch"
};

// src/scripts/utils.js
var numTo2 = (num) => String(num).padStart(2, "0");
var tryP = async (prom) => {
  try {
    const res = prom instanceof Promise ? await prom : await prom();
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};
var getPicSize = (item) => {
  if (item instanceof HTMLImageElement) {
    return {
      w: item.width,
      h: item.height
    };
  }
  return {
    w: item.videoWidth,
    h: item.videoHeight
  };
};
var arr = (iter) => new Proxy({}, {
  get(_, key) {
    if (key in Array.prototype) {
      const value = Array.prototype[key];
      if (typeof value === "function") {
        return (...args) => Array.prototype[key].apply(iter, args);
      }
      return value;
    }
    return iter[key];
  }
});
var convertBytes = (n) => {
  if (n === 0) return "0 bytes";
  const k = Math.floor(Math.log10(n) / 3);
  const rank = "KMGT"[k - 1];
  const count = (n / Math.pow(1e3, k)).toFixed(2).replace(/.00$/, "");
  return count + " " + (rank ? rank + "B" : "bytes");
};
var formatSeconds = (seconds) => {
  const hours = numTo2(Math.floor(seconds / 3600));
  const minutes = numTo2(Math.floor(seconds % 3600 / 60));
  return `${+hours ? hours + ":" : ""}${minutes}:${numTo2(Math.floor(seconds))}`;
};

// src/scripts/popup.js
var confirmation = (popupFixed, fileType) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const fileTypeCont = $(".fileTypeCont", popupFixed);
  const acceptBtn = $(".acceptBtn", popupFixed);
  const cancelBtn = $(".cancelBtn", popupFixed);
  fileTypeCont.innerText = fileType;
  popupFixed.hidden = false;
  acceptBtn.onclick = resolve;
  cancelBtn.onclick = reject;
  return promise;
};

// src/scripts/sortGallery.js
var sortImgViewerScroll = () => {
  $$(".pictureImg").forEach(({ dataset }) => {
    const { imgGroupId } = dataset;
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement;
    imgViewerScroll.append(viewPicture);
  });
};
var sortPicsByName = (ascending) => {
  if (ascending) {
    albumPics.replaceChildren.apply(
      albumPics,
      Array.from(albumPics.children).sort((picture1, picture2) => {
        const { name: a } = picture1.dataset;
        const { name: b } = picture2.dataset;
        return a.normalize("NFD").localeCompare(
          b.normalize("NFD"),
          "es",
          { sensitivity: "base" }
        );
      })
    );
    sortImgViewerScroll();
    return;
  }
  albumPics.replaceChildren.apply(
    albumPics,
    Array.from(albumPics.children).sort((picture1, picture2) => {
      const { name: a } = picture2.dataset;
      const { name: b } = picture1.dataset;
      return a.normalize("NFD").localeCompare(
        b.normalize("NFD"),
        "es",
        { sensitivity: "base" }
      );
    })
  );
  sortImgViewerScroll();
};
var sortPicsByDate = (ascending) => {
  if (app.classList.contains("albumOpen")) {
    albumPics.replaceChildren.apply(
      albumPics,
      ascending ? Array.from(albumPics.children).sort(
        (picture1, picture2) => picture1.dataset.time - picture2.dataset.time
      ) : Array.from(albumPics.children).sort(
        (picture1, picture2) => picture2.dataset.time - picture1.dataset.time
      )
    );
    sortImgViewerScroll();
    return;
  }
  $$(".picturesSection").forEach((section) => {
    const picturesOfTheDate = $(".picturesOfTheDate", section);
    picturesOfTheDate.replaceChildren.apply(
      picturesOfTheDate,
      ascending ? Array.from(picturesOfTheDate.children).sort(
        (picture1, picture2) => picture1.dataset.time - picture2.dataset.time
      ) : Array.from(picturesOfTheDate.children).sort(
        (picture1, picture2) => picture2.dataset.time - picture1.dataset.time
      )
    );
  });
  sortImgViewerScroll();
};
var sortAlbums = () => {
  albums.replaceChildren.apply(
    albums,
    Array.from(albums.children).sort((album1, album2) => {
      const { albumName: a } = album2.dataset;
      const { albumName: b } = album1.dataset;
      return a.normalize("NFD").localeCompare(
        b.normalize("NFD"),
        "es",
        { sensitivity: "base" }
      );
    })
  );
  const importsAlbum = $(`.albumCont[data-album-path="${importsName}"]`);
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`);
  if (importsAlbum) albums.prepend(importsAlbum);
  if (favoritesAlbum) albums.prepend(favoritesAlbum);
};
var onSortAccept = () => {
  sortPics.parentElement.hidden = true;
  const currAlbum = $(".albumCont.open");
  const currSortOpt = $("[name=sortBy]:checked");
  const currOrderOpt = $("[name=sortOrder]:checked");
  const ascending = currOrderOpt === sortAscChk;
  const { albumPath } = currAlbum.dataset;
  State.albumsOpts[albumPath].sortByOpt = currSortOpt;
  State.albumsOpts[albumPath].sortOrderOpt = currOrderOpt;
  if (currSortOpt === sortByDateChk) sortPicsByDate(ascending);
  else sortPicsByName(ascending);
};
var onSortCancel = () => {
  const currAlbum = $(".albumCont.open");
  const { albumPath } = currAlbum.dataset;
  sortPics.parentElement.hidden = true;
  State.albumsOpts[albumPath].sortByOpt.checked = true;
  State.albumsOpts[albumPath].sortOrderOpt.checked = true;
};
var openSortOpts = () => {
  const sortPicsCont = sortPics.parentElement;
  const { hidden } = sortPicsCont;
  sortPicsCont.hidden = !hidden;
};

// src/scripts/navigation.js
var getParams = () => {
  const { search } = window.location;
  return new URLSearchParams(search);
};
var navigate = (params) => {
  const { origin, pathname } = window.location;
  const { page, view, selectionMode, details } = params;
  const currParams = getParams();
  const currPage = currParams.get("page");
  page && currParams.set("page", page);
  view && currParams.set("view", view);
  details && currParams.set("details", details);
  selectionMode && currParams.set("selectionMode", selectionMode);
  const newParams = currParams.size ? `?${currParams.toString()}` : "";
  const newURL = `${origin}${pathname}${newParams}`;
  window.history.pushState({}, "", newURL);
};
var changeImportSection = () => {
  if (!showImport.checked) {
    app.classList.add("imports");
    window.dispatchEvent(new Event("popstate"));
    return;
  }
  for (const importPicture of $$(".importPicture")) {
    if (importPicture.parentElement.classList.contains("importFile")) continue;
    const { imgGroupId } = importPicture.dataset;
    const pictureImg = $(`.pictureImg[data-img-group-id="${imgGroupId}"]`);
    importPicture.append(pictureImg);
  }
};
var changeScreen = (sibligs) => {
  if (name === showPictures.name) {
    const currentLabelSection = $(`label[for=${id}] span`);
    appHeaderText.innerText = currentLabelSection.innerText;
    State.prevInpSection = input;
    if (State.prevInpSection === showAlbums && app.classList.contains("albumOpen")) {
      navigation.back();
    }
    if (input !== showImport) {
      State.prevInpSectionGallery = input;
      changeImportSection();
    }
  }
  if (State.selectionMode) {
    navigation.back();
  }
  sibligs.forEach(({ id: id2, checked }) => {
    const label = $(`label[for=${id2}]`);
    const action = checked ? "add" : "remove";
    label.classList[action]("checked");
  });
};

// src/scripts/selection.js
var checkSelection = (container, once) => {
  const unselectedIcon = $(".unselectedIcon", container);
  unselectedIcon.style.scale = 0;
  container.classList.add("selected");
  selectedCount.innerText = $$(".picture.selected, .albumCont.selected, .importPicture.selected").length;
  if (!once) return;
  if (app.classList.contains("albumOpen")) {
    const album = $(".albumCont.open");
    const picturesSelected2 = $$(`.picture.selected[data-album-path="${album.dataset.albumPath}"]`);
    const albumPictures = $$(".picture:not([hidden])");
    State.albumsPicturesSel.add(container);
    selectedCount.innerText = State.albumsPicturesSel.size;
    if (picturesSelected2.length !== albumPictures.length) return;
    checkSelection(selectAll);
    return;
  }
  if (showAlbums.checked) {
    const albumsSel = $$(".albumCont.selected");
    const visibleAlbums = $$(".albumCont:not([hidden])");
    if (visibleAlbums.length === albumsSel.length) {
      checkSelection(selectAll);
    }
    return;
  }
  if (showImport.checked) {
    const importationSel = $$(".importPicture.selected");
    if ($$(".importPicture").length === importationSel.length) {
      checkSelection(selectAll);
    }
    return;
  }
  const picturesSection = container.parentElement.parentElement;
  const picturesCont = $(".picturesOfTheDate", picturesSection);
  const picturesSelected = $$(".picture.selected", picturesSection);
  if (picturesSelected.length !== picturesCont.children.length) return;
  const picturesHeader = $("header", picturesSection);
  const allPicturesSel = $$(".picture.selected");
  checkSelection(picturesHeader);
  if (Object.keys(State.pics).length !== allPicturesSel.length) return;
  checkSelection(selectAll);
};
var uncheckSelection = (container, once) => {
  const unselectedIcon = $(".unselectedIcon", container);
  container.classList.remove("selected");
  unselectedIcon.style.scale = 1;
  selectedCount.innerText = $$(".picture.selected, .albumCont.selected").length;
  if (!once) return;
  if (app.classList.contains("albumOpen")) {
    const album = $(".albumCont.open");
    const picturesSelected = $$(`.picture.selected[data-album-path="${album.dataset.albumPath}"]`);
    const albumPictures = $$(".picture:not([hidden])");
    State.albumsPicturesSel.delete(container);
    selectedCount.innerText = State.albumsPicturesSel.size;
    if (picturesSelected.length === albumPictures.length) return;
    uncheckSelection(selectAll);
    return;
  }
  if (showAlbums.checked) {
    const albumsSel = $$(".albumCont.selected");
    const visibleAlbums = $$(".albumCont:not([hidden])");
    if (visibleAlbums.length !== albumsSel.length) {
      uncheckSelection(selectAll);
    }
    return;
  }
  if (showImport.checked) {
    const importationSel = $$(".importPicture.selected");
    if ($$(".importPicture").length !== importationSel.length) {
      uncheckSelection(selectAll);
    }
    return;
  }
  const picturesHeader = $("header", container.parentElement.parentElement);
  uncheckSelection(picturesHeader);
  uncheckSelection(selectAll);
};
var toggleMultipleSelection = (container, getPictures) => {
  const unselectedIcon = $(".unselectedIcon", container);
  container.addEventListener("click", () => {
    const allPicturesForEval = getPictures();
    if (container.classList.contains("selected")) {
      uncheckSelection(container);
      if (app.classList.contains("albumOpen")) {
        for (const picture of $$(".picture:not([hidden])")) {
          uncheckSelection(picture);
          State.albumsPicturesSel.delete(picture);
          selectedCount.innerText = State.albumsPicturesSel.size;
        }
        return;
      }
      for (const picture of allPicturesForEval) {
        uncheckSelection(picture);
      }
      const picturesHeaders = $$(".picturesSection header");
      const picturesHeadersSel = $$(".picturesSection header.selected");
      if (picturesHeadersSel.length !== picturesHeaders.length) {
        uncheckSelection(selectAll);
      }
      if (container !== selectAll) return;
      for (const picturesHeader of picturesHeaders) {
        uncheckSelection(picturesHeader);
      }
      return;
    }
    if (State.selectionMode) {
      checkSelection(container);
      if (app.classList.contains("albumOpen")) {
        for (const picture of $$(".picture:not([hidden])")) {
          checkSelection(picture);
          State.albumsPicturesSel.add(picture);
          selectedCount.innerText = State.albumsPicturesSel.size;
        }
        return;
      }
      for (const picture of allPicturesForEval) {
        checkSelection(picture);
      }
      const picturesHeaders = $$(".picturesSection header");
      const picturesHeadersSel = $$(".picturesSection header.selected");
      if (picturesHeadersSel.length === picturesHeaders.length) {
        checkSelection(selectAll);
      }
      if (container !== selectAll) return;
      for (const picturesHeader of picturesHeaders) {
        checkSelection(picturesHeader);
      }
      return;
    }
  });
};
var toggleSelection = (container, section) => {
  const unselectedIcon = $(".unselectedIcon", container);
  let timeoutId = NaN;
  container.addEventListener("pointerdown", () => {
    if (State.imgOpen) return;
    const albumOpen = app.classList.contains("albumOpen");
    const isAlbumThumb = container.classList.contains("albumCont");
    if (albumOpen && isAlbumThumb) return;
    if (container.classList.contains("selected")) {
      uncheckSelection(container, true);
      return;
    }
    if (State.selectionMode) {
      checkSelection(container, true);
      return;
    }
    timeoutId = setTimeout(() => {
      const currSection = albumOpen ? albumPics : section;
      State.selectionMode = true;
      app.classList.add("selectionMode");
      currSection.classList.add("selectionMode");
      navigate({ selectionMode: true });
      setTimeout(() => {
        app.classList.add("unselectionMode");
        currSection.classList.add("unselectionMode");
        checkSelection(container, true);
      }, 250);
    }, 1500);
  });
  container.addEventListener("pointerup", () => {
    clearTimeout(timeoutId);
  });
  container.addEventListener("pointerleave", () => {
    clearTimeout(timeoutId);
  });
};
var closeSelectionMode = () => {
  State.albumsPicturesSel.clear();
  State.selectionMode = false;
  app.style.pointerEvents = "none";
  app.classList.remove("unselectionMode");
  pictures.classList.remove("unselectionMode");
  albums.classList.remove("unselectionMode");
  albumPics.classList.remove("unselectionMode");
  imports.classList.remove("unselectionMode");
  $$("#selectAll, .picture, .picturesSection header, .albumCont, .importPicture, .importFile").forEach((container) => {
    const unselectedIcon = $(".unselectedIcon", container);
    container.classList.remove("selected");
    unselectedIcon.style.scale = "";
  });
  setTimeout(() => {
    pictures.classList.remove("selectionMode");
    albums.classList.remove("selectionMode");
    albumPics.classList.remove("selectionMode");
    imports.classList.remove("selectionMode");
    app.classList.remove("selectionMode");
    app.style.pointerEvents = "auto";
    selectedCount.innerText = 0;
  }, 300);
};
var openSelectionMode = () => {
  const section = State.prevInpSection === showAlbums ? albums : screens[State.prevInpSection.id];
  const albumOpen = app.classList.contains("albumOpen");
  const currSection = albumOpen ? albumPics : section;
  State.selectionMode = true;
  app.classList.add("selectionMode");
  currSection.classList.add("selectionMode");
  navigate({ selectionMode: true });
  setTimeout(() => {
    app.classList.add("unselectionMode");
    currSection.classList.add("unselectionMode");
  }, 250);
};
toggleMultipleSelection(selectAll, (albumOpen) => {
  if (showPictures.checked) {
    return $$("section.selectionMode .picture");
  }
  if (showAlbums.checked && !app.classList.contains("albumOpen")) {
    return $$(".albumCont");
  }
  if (showImport.checked) {
    return $$(".importPicture");
  }
});

// src/scripts/createContainers.js
var createPictureElement = ({ picture, albumPath, day, time, year }) => {
  const picturesElement = $(`.picturesSection[data-day="${day}"]`) ?? picturesTmpl.content.cloneNode(true);
  const isTemplate = picturesElement instanceof DocumentFragment;
  const picturesSection = isTemplate ? picturesElement.firstElementChild : picturesElement;
  const picturesHeader = $("header", picturesSection);
  const picturesDate = $(".picturesDate", picturesSection);
  const picturesCont = $(".picturesOfTheDate", picturesSection);
  picturesSection.dataset.time = time;
  picturesSection.dataset.day = day;
  if (isTemplate) {
    const year2 = +day.slice(-4);
    const formatDate = year2 !== currYear ? day.slice(4) : day.slice(4, -4);
    picturesDate.innerText = day === currDay ? "Today" : formatDate;
    toggleMultipleSelection(picturesHeader, () => picturesCont.children);
  }
  picturesCont.append(picture);
  pictures.append(picturesSection);
};
var createAlbumElement = (absolutePath, albumNameStr) => {
  const albumCont = albumTmpl.content.cloneNode(true).firstElementChild;
  const albumThumb = $(".albumThumb", albumCont);
  const albumLength = $(".albumLength", albumCont);
  const albumName = $(".albumName", albumCont);
  const albumThumbImg = new Image();
  State.imgs[absolutePath].then(async (uri) => {
    const picture = State.pics[absolutePath] ?? {};
    const { isVideo } = picture.dataset ?? {};
    albumThumbImg.fetchpriority = "high";
    albumThumbImg.decoding = "async";
    if (+isVideo) {
      const pictureImg = $(".pictureImg", picture);
      await pictureImg.decode().catch((e) => 0);
      const { src: minURI } = pictureImg;
      albumThumbImg.src = minURI;
    } else albumThumbImg.src = uri;
    await albumThumbImg.decode().catch((e) => 0);
    const max = Math.max(albumThumbImg.width, albumThumbImg.height);
    if (max < 200) albumThumbImg.style.imageRendering = "pixelated";
  });
  albumName.innerText = albumNameStr;
  albumThumb.append(albumThumbImg);
  albums.append(albumCont);
  return albumCont;
};

// src/scripts/viewerScroll.js
import { addScrollSnap } from "./addScrollSnap.js";

// src/scripts/videoPlayer.js
var onPointerMove = (event) => {
  const { touches, constructor } = event;
  const {
    pointerType,
    pointerDown,
    pointerStart,
    pointerX,
    videoTimeBarW,
    duration,
    newTimeX: prevTimeX,
    video
  } = State.pointerVideoTime;
  if (!pointerDown || pointerType !== constructor) return;
  const { clientX } = pointerType === TouchEvent ? touches[0] : event;
  const newTimeX = Math.max(0, pointerStart + (clientX - pointerX));
  const maxTimeX = Math.min(newTimeX, videoTimeBarW);
  const newTime = Math.min(Math.floor(duration / videoTimeBarW * newTimeX), duration);
  const newTimeP = Math.floor(100 / videoTimeBarW * maxTimeX);
  const nowFormat = formatSeconds(newTime);
  videoNow.style.width = `${newTimeP}%`;
  videoNowBtn.style.left = `${newTimeP}%`;
  videoCurrTime.innerText = nowFormat;
  State.pointerVideoTime.newTimeX = maxTimeX;
  State.pointerVideoTime.newTime = newTime;
};
var onPointerUp = ({ constructor }) => {
  const { pointerType, pointerDown, newTime } = State.pointerVideoTime;
  if (!pointerDown || pointerType !== constructor) return;
  State.pointerVideoTime.pointerDown = false;
  State.pointerVideoTime.video.currentTime = newTime;
};
var onVideoJumpTimeStart = ({ pointerType, clientX }) => {
  const video = $("#imgViewerImg.video");
  const { pointerVideoTime } = State;
  const { duration, currentTime } = video;
  const videoTimeBarW = videoTimeBar.clientWidth;
  pointerVideoTime.video = video;
  pointerVideoTime.duration = duration;
  pointerVideoTime.videoTimeBarW = videoTimeBarW;
  pointerVideoTime.pointerX = clientX;
  pointerVideoTime.pointerStart = videoTimeBarW / duration * video.currentTime;
  pointerVideoTime.pointerDown = true;
  pointerVideoTime.pointerType = pointerType === POINTERTYPES.touch ? TouchEvent : MouseEvent;
};
var onVideoMuted = () => {
  const video = $("#imgViewerImg.video");
  video.proxy.muted = !video.classList.contains("muted");
};
var onExitPiP = ({ target: video }) => {
  video.proxy.pause();
};
var onPiP = () => {
  const video = $("#imgViewerImg.video");
  if (!document.pictureInPictureEnabled) {
    alert("PiP not supported. Check browser compatibility for details.");
    return;
  }
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
    return;
  }
  video.requestPictureInPicture();
};
var onVideoProgress = ({ target: video }) => {
  if (State.pointerVideoTime.pointerDown) return;
  const currentTime = Math.floor(video.currentTime);
  const timeNow = Math.floor(100 / video.duration * currentTime);
  const nowFormat = formatSeconds(currentTime);
  videoNow.style.width = `${timeNow}%`;
  videoNowBtn.style.left = `${timeNow}%`;
  videoCurrTime.innerText = nowFormat;
};
var onVideoEnd = ({ target: video }) => {
  video.classList.remove("played");
  video.currentTime = 0;
};
var onVideoJumpTime = ({ target }) => {
  const video = $("#imgViewerImg.video");
  if (target === videoBackBtn) {
    video.currentTime = video.currentTime - 5;
    return;
  }
  video.currentTime = video.currentTime + 5;
};
var onVideoPlayPause = () => {
  const video = $("#imgViewerImg.video");
  video.paused ? video.proxy.play() : video.proxy.pause();
};
var onPlayPausePiP = ({ target: video }) => {
  video.paused ? video.proxy.pause() : video.proxy.play();
};
var onVideoFocus = (video, prevVideo) => {
  prevVideo?.classList.remove("video");
  prevVideo?.removeEventListener("timeupdate", onVideoProgress);
  prevVideo?.removeEventListener("ended", onVideoEnd);
  prevVideo?.removeEventListener("play", onPlayPausePiP);
  prevVideo?.removeEventListener("pause", onPlayPausePiP);
  video.classList.add("video");
  video.addEventListener("timeupdate", onVideoProgress);
  video.addEventListener("ended", onVideoEnd);
  video.addEventListener("play", onPlayPausePiP);
  video.addEventListener("pause", onPlayPausePiP);
  videoDuration.innerText = formatSeconds(video.duration);
};

// src/scripts/viewerScroll.js
var onViewerPointerDown = () => State.verticalScroll = false;
var onViewerHorizontalSnap = (newMainView, prevMainView) => {
  $("#imgViewerMinImg")?.removeAttribute("id");
  $("#imgViewerImg")?.removeAttribute("id");
  const imgViewerImg = $(".imgViewerImg", newMainView);
  const imgViewerMinImg = $(".imgViewerMinImg", newMainView);
  imgViewerImg.id = "imgViewerImg";
  imgViewerMinImg.id = "imgViewerMinImg";
  const { imgGroupId, details, isVideo } = imgViewerImg.dataset;
  const prevVideo = $(".imgViewerImg.video");
  const currPicture = $(".picture.view");
  const newPicture = $(`.picture[data-img-group-id="${imgGroupId}"]`);
  const newPictureImg = $(".pictureImg", newPicture);
  const currPreview = $(".pictureImg", currPicture);
  const newPreview = $(".pictureImg", newPicture);
  const action = newPictureImg.classList.contains("favorite") ? "add" : "remove";
  addFavoriteBtn.classList[action]("favorite");
  currPicture?.classList.remove("view");
  newPicture?.classList.add("view");
  currPreview.style.display = "";
  newPreview.style.display = "none";
  prevVideo?.proxy.pause?.();
  if (State.videoOpen = +isVideo) onVideoFocus(imgViewerImg, prevVideo);
  updateDetailsInfo(JSON.parse(details));
};
var onViewerHorizontalSnapEnd = (newMainView, prevMainView, sameMainView) => {
  if (sameMainView) return;
  if (prevMainView?.previousSibling)
    $(".imgViewerImg", prevMainView.previousSibling).style.display = "none";
  if (prevMainView?.nextSibling)
    $(".imgViewerImg", prevMainView.nextSibling).style.display = "none";
  if (newMainView.previousSibling)
    $(".imgViewerImg", newMainView.previousSibling).style.display = "block";
  if (newMainView.nextSibling)
    $(".imgViewerImg", newMainView.nextSibling).style.display = "block";
  $(".imgViewerImg", newMainView).style.display = "block";
};
var onViewerScroll = () => {
  if (app.classList.contains("inTransition")) return;
  const { innerHeight } = window;
  const scrollBottom = imgViewer.scrollHeight - imgViewer.clientHeight;
  const currScroll = Math.round(imgViewer.scrollTop);
  const opacityInverse = currScroll / 300;
  const opacity = 1 - +opacityInverse.toFixed(2);
  if (!mainHeader.style.opacity) {
    const pointerEvents = opacity ? "auto" : "none";
    imgSubOpts.style.opacity = opacity;
    imgSubOpts.style.pointerEvents = pointerEvents;
    if (State.videoOpen) {
      videoControls.style.opacity = opacity;
      videoControls.style.pointerEvents = pointerEvents;
    }
  }
  if (currScroll < scrollBottom - 120) {
    mainHeader.style.backgroundColor = "";
    mainHeaderTitle.style.opacity = "";
    return;
  }
  const detailsOpacity = (scrollBottom - 30 - currScroll) / 60;
  imgDetailsHeader.style.opacity = detailsOpacity;
  mainHeaderTitle.style.opacity = 1 - detailsOpacity;
  mainHeader.style.backgroundColor = "#000";
};
var onViewerVerticalSnapEnd = (_, a, isSameSection) => {
  const currScroll = Math.round(imgViewer.scrollTop);
  if (!isSameSection) {
    if (currScroll === 0) {
      history.back();
    } else {
      State.details.visible = true;
      navigate({ details: true });
    }
  }
  const scrollBottom = imgViewer.scrollHeight - imgViewer.clientHeight;
  const detailsOpacity = (scrollBottom - 30 - currScroll) / 60;
  imgDetailsHeader.style.opacity = detailsOpacity;
  mainHeaderTitle.style.opacity = 1 - detailsOpacity;
  mainHeader.style.backgroundColor = currScroll ? "#000" : "";
};
var viewerPictureConfig = {
  scrollCont: imgViewerScroll,
  initScrollChild: $("& > picture:not([hidden])", imgViewerScroll),
  mainScrollChildId: "imgViewerMainView",
  onSnap: onViewerHorizontalSnap,
  onSnapEnd: onViewerHorizontalSnapEnd,
  getScrollChildren: () => Array.from($$("#imgViewerScroll > picture:not([hidden])")),
  evalException: () => State.details.visible || State.verticalScroll,
  onScroll: () => State.verticalScroll = false,
  onCancel: () => State.verticalScroll = true
};
var viewerSectionConfig = {
  vertical: true,
  scrollCont: imgViewer,
  initScrollChild: imgViewerSlider,
  onSnapEnd: onViewerVerticalSnapEnd,
  getScrollChildren: () => Array.from($$("#imgViewerSlider, #imgViewerInfo")),
  onCancel: () => State.verticalScroll = false
};
var changeViewerSection = addScrollSnap(viewerSectionConfig);
var changeViewerPicture = addScrollSnap(viewerPictureConfig);

// src/scripts/imgViewer.js
var updateImgViewSize = (imageWidth, imageHeight, img, minImg) => {
  const {
    innerWidth: containerWidth,
    innerHeight: containerHeight
  } = window;
  if (imageWidth / imageHeight > containerWidth / containerHeight) {
    img.style.width = "100%";
    img.style.height = "";
    if (minImg) {
      minImg.style.width = "100%";
      minImg.style.height = "";
    }
  } else {
    img.style.width = "";
    img.style.height = "100%";
    if (minImg) {
      minImg.style.width = "";
      minImg.style.height = "100%";
    }
  }
};
var updateDetailsInfo = ({ date, length, size, albumPath, fileName }) => {
  imgDate.innerText = date;
  imgName.innerText = fileName;
  imgPath.innerText = albumPath;
  imgLength.innerText = convertBytes(length);
  imgSize.innerText = size;
};
var openDetails = () => {
  changeViewerSection(imgViewerInfo, true, onViewerVerticalSnapEnd);
};
var onViewerClick = () => {
  if (mainHeader.style.opacity) {
    mainHeader.addEventListener("transitionend", () => {
      videoControls.style.pointerEvents = "";
      mainHeader.style.pointerEvents = "";
      imgSubOpts.style.pointerEvents = "auto";
    }, { once: true });
    videoControls.style.opacity = "";
    mainHeader.style.opacity = "";
    imgSubOpts.style.opacity = "1";
    return;
  }
  videoControls.style.opacity = "0";
  mainHeader.style.opacity = "0";
  imgSubOpts.style.opacity = "0";
  videoControls.style.pointerEvents = "none";
  mainHeader.style.pointerEvents = "none";
  imgSubOpts.style.pointerEvents = "none";
};
var onPictureClose = async () => {
  const imgViewerImg = $("#imgViewerImg");
  const imgViewerMinImg = $("#imgViewerMinImg");
  const picture = $(".picture.view");
  const img = $(".pictureImg", picture);
  const viewPicture = $(`[data-snap-id="${viewerPictureConfig.mainScrollChildId}"]`);
  const prevVideo = $(".imgViewerImg.video");
  if (viewPicture.previousSibling) $(".imgViewerImg", viewPicture.previousSibling).style.display = "none";
  if (viewPicture.nextSibling) $(".imgViewerImg", viewPicture.nextSibling).style.display = "none";
  if (prevVideo) {
    if (!document.pictureInPictureElement) {
      prevVideo.proxy.pause();
      prevVideo.currentTime = 0;
    }
    imgViewerImg.style.display = "none";
    imgViewerMinImg.style.display = "block";
  }
  app.scrollTop = 220;
  app.classList.add("inTransition");
  addFavoriteBtn.classList.remove("favorite");
  videoControls.style.opacity = "";
  mainHeader.style.opacity = "";
  videoControls.style.pointerEvents = "";
  mainHeader.style.pointerEvents = "";
  await document.startViewTransition(() => {
    img.style.display = "block";
    imgViewerImg.style.display = "none";
    imgViewerMinImg.style.display = "none";
    imgViewer.style.opacity = 0;
    navigationBar.style.opacity = 1;
    imgSubOpts.style.opacity = 0;
    imgSubOpts.style.pointerEvents = "none";
  }).finished;
  imgViewer.scrollTop = 0;
  imgViewer.style.pointerEvents = "";
  imgSubOpts.style.pointerEvents = "";
  app.classList.remove("imgView");
  app.classList.remove("inTransition");
  picture.classList.remove("view");
  State.imgOpen = false;
};
var onPictureClick = async ({
  img,
  bigImg,
  minImg,
  picture,
  viewPicture,
  isVideo,
  details,
  initWidth,
  initHeight
}) => {
  if (State.selectionMode) return;
  if (img.classList.contains("favorite")) {
    addFavoriteBtn.classList.add("favorite");
  }
  changeViewerPicture(viewPicture);
  const prevVideo = $(".imgViewerImg.video");
  $(".picture.view")?.classList.remove("view");
  $("#imgViewerImg")?.removeAttribute("id");
  $("#imgViewerMinImg")?.removeAttribute("id");
  if (viewPicture.previousSibling) $(".imgViewerImg", viewPicture.previousSibling).style.display = "block";
  if (viewPicture.nextSibling) $(".imgViewerImg", viewPicture.nextSibling).style.display = "block";
  if (isVideo) {
    onVideoFocus(bigImg, prevVideo);
    if (!document.pictureInPictureElement) {
      bigImg.proxy.pause();
      bigImg.currentTime = 0;
    }
  }
  app.classList.add("imgView");
  picture.classList.add("view");
  bigImg.id = "imgViewerImg";
  minImg.id = "imgViewerMinImg";
  minImg.style.display = "none";
  imgViewer.style.setProperty("--initWidth", initWidth);
  imgViewer.style.setProperty("--initHeight", initHeight);
  imgViewer.style.pointerEvents = "auto";
  imgSubOpts.style.pointerEvents = "auto";
  State.imgOpen = true;
  updateDetailsInfo(details);
  updateImgViewSize(initWidth, initHeight, bigImg, minImg);
  navigate({ view: true });
  await document.startViewTransition(() => {
    img.style.display = "none";
    minImg.style.display = "block";
    imgViewer.style.opacity = 1;
    imgSubOpts.style.opacity = 1;
    navigationBar.style.opacity = 0;
  }).finished;
  await tryP(bigImg.decode());
  minImg.style.display = "none";
  bigImg.style.display = "block";
};

// src/scripts/loadPictures.js
var getMinImg = async (img, mimetype) => {
  const { w: initWidth, h: initHeight } = getPicSize(img);
  const max = Math.max(initWidth, initHeight);
  if (MIMETYPES.svg.includes(mimetype) || MIMETYPES.gif.includes(mimetype) || img instanceof HTMLImageElement && max < 400) return {
    initWidth,
    initHeight,
    max
  };
  const scale = max / 400;
  const [width, height] = max > 400 ? [
    Math.round(initWidth / scale),
    Math.round(initHeight / scale)
  ] : [
    initWidth,
    initHeight
  ];
  if (img instanceof HTMLVideoElement) {
    await new Promise((resolve) => {
      img.addEventListener("timeupdate", resolve, { once: true });
      img.currentTime = Math.round(img.duration / 2);
      setTimeout(resolve, 500);
    });
    canvas.width = width;
    canvas.height = height;
    canvasCtx.fillStyle = "#000000";
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.drawImage(img, 0, 0, width, height);
    img.currentTime = 0;
  } else {
    canvas.width = width;
    canvas.height = height;
    canvasCtx.drawImage(img, 0, 0, width, height);
  }
  return {
    minURI: canvas.toDataURL("image/png"),
    initWidth,
    initHeight,
    max
  };
};
var onAlbumClick = (albumCont, albumPath, absolutePath, hidePicture) => {
  if (State.selectionMode && !app.classList.contains("albumOpen")) return;
  $(".albumCont.open")?.classList.remove("open");
  albumCont.classList.add("open");
  appHeaderText.innerText = albumCont.dataset.albumName;
  const { sortByOpt, sortOrderOpt } = State.albumsOpts[albumPath];
  const ascending = sortOrderOpt === sortAscChk;
  sortByOpt.checked = true;
  sortOrderOpt.checked = true;
  for (const picture of $$(".picture")) {
    const pictureImg = $(".pictureImg", picture);
    const imgGroupId = picture.dataset.imgGroupId;
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement;
    picture.hidden = viewPicture.hidden = hidePicture(picture, pictureImg);
    albumPics.append(picture);
  }
  if (sortByOpt === sortByDateChk) sortPicsByDate(ascending);
  else sortPicsByName(ascending);
  State.imgs[absolutePath].then(async (uri) => {
    currAlbumThumb.src = uri;
    await currAlbumThumb.decode().catch((e) => 0);
    const max = Math.max(currAlbumThumb.width, currAlbumThumb.height);
    if (max < 200) currAlbumThumb.style.imageRendering = "pixelated";
  });
  const albumsSelected = $$(`.albumCont.selected`);
  const visibleAlbums = $$(".albumCont:not([hidden])");
  if (albumsSelected.length !== visibleAlbums.length)
    uncheckSelection(selectAll);
  else checkSelection(selectAll);
  if (app.classList.contains("albumOpen")) return;
  app.classList.add("albumOpen");
  app.scrollTop = 220;
  navigate({ page: "album" });
};
var onFavoritesAlbumClick = () => {
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`);
  onAlbumClick(
    favoritesAlbum,
    favoritesName,
    favoritesName,
    (_, pictureImg) => !pictureImg.classList.contains("favorite")
  );
};
var loadUint = async (uint, { file, picture, importPicture = null, time, day, fileName, albumPath }) => {
  const { name: path, date } = file;
  const imgGroupId = crypto.randomUUID();
  const viewPicture = document.createElement("picture");
  const b64 = uint.toBase64();
  const min = date.getMinutes().toString().padStart(2, "0");
  const hour24 = date.getHours();
  const dayFormat = day.slice(4).split("").toSpliced(-5, 0, ",").join("");
  const ext = path.split(".").at(-1);
  const mimetype = MIMETYPES[ext].at(0) ?? "application/octet-stream";
  const uri = `data:${mimetype};base64,${b64}`;
  const isVideo = +FILETYPES.video.includes(mimetype);
  const fileObj = new File([uint], fileName, { type: mimetype, lastModified: time });
  const minImg = new Image();
  const img = new Image();
  const bigImg = isVideo ? document.createElement("video") : new Image();
  const [hour, APM] = hour24 > 12 ? [hour24 - 12, "PM"] : [hour24, "AM"];
  State.files[imgGroupId] = [uint, fileObj];
  img.classList.add("pictureImg");
  minImg.classList.add("imgViewerMinImg");
  bigImg.classList.add("imgViewerImg");
  minImg.style.display = "none";
  bigImg.style.display = "none";
  bigImg.src = uri;
  if (importPicture) {
    importPicture.dataset.imgGroupId = imgGroupId;
  }
  picture.dataset.isVideo = String(isVideo);
  picture.dataset.imgGroupId = imgGroupId;
  img.dataset.imgGroupId = imgGroupId;
  minImg.dataset.imgGroupId = imgGroupId;
  bigImg.dataset.imgGroupId = imgGroupId;
  bigImg.dataset.imgGroupId = imgGroupId;
  bigImg.dataset.isVideo = String(isVideo);
  if (isVideo) {
    const videoProxy = new Proxy(bigImg, {
      get(_, prop) {
        const value = bigImg[prop];
        if (prop === playProp) {
          return () => {
            bigImg.classList.add("played");
            bigImg.play();
          };
        }
        if (prop === pauseProp) {
          return () => {
            bigImg.classList.remove("played");
            Object(bigImg).pause();
          };
        }
        return value instanceof Function ? (...args) => value.apply(bigImg, args) : value;
      },
      set(_, prop, val) {
        if (prop === mutedProp) {
          bigImg.classList[val ? "add" : "remove"]("muted");
        }
        bigImg[prop] = val;
        return true;
      }
    });
    const decoded = new Promise(
      (resolve) => bigImg.oncanplaythrough = resolve
    );
    bigImg.proxy = videoProxy;
    bigImg.decode = () => decoded;
  }
  await tryP(bigImg.decode());
  const { minURI = uri, initWidth, initHeight, max } = await getMinImg(bigImg, mimetype);
  const aspectRatio = `${initWidth} / ${initHeight}`;
  img.src = minImg.src = minURI;
  const details = {
    date: `${dayFormat} ${hour}:${min} ${APM}`,
    size: `${initWidth}x${initHeight}`,
    length: uint.length,
    albumPath,
    fileName
  };
  const picAdditionalInfo = {
    img,
    bigImg,
    minImg,
    picture,
    viewPicture,
    isVideo,
    details,
    initWidth,
    initHeight
  };
  bigImg.dataset.details = JSON.stringify(details);
  if (max < 200) {
    bigImg.style.imageRendering = "pixelated";
    minImg.style.imageRendering = "pixelated";
    img.style.imageRendering = "pixelated";
  }
  picture.prepend(img);
  viewPicture.append(minImg, bigImg);
  imgViewerScroll.append(viewPicture);
  viewPicture.addEventListener("click", onViewerClick);
  picture.addEventListener("click", () => onPictureClick(picAdditionalInfo));
  toggleSelection(picture, pictures);
  updateImgViewSize(initWidth, initHeight, bigImg, minImg);
  return uri;
};
var loadPicture = ([path, file], zipName, albumNames, isImported, zipFileCont) => {
  const { date } = file;
  const day = date.toDateString();
  const time = date.getTime();
  const year = date.getFullYear();
  const picture = pictureTmpl.content.cloneNode(true).firstElementChild;
  const pathRoutes = path.split("/");
  const [albumName, fileName, albumPath] = pathRoutes.length > 1 ? pathRoutes.slice(-2).concat(pathRoutes.slice(0, -1).join("/")) : [zipName, pathRoutes.at(0), zipName];
  const uintAdditionalInfo = {
    picture,
    file,
    fileName,
    albumPath,
    day,
    time
  };
  const absolutePath = `${zipName}/${path}`;
  picture.dataset.absolutePath = absolutePath;
  picture.dataset.albumPath = albumPath;
  picture.dataset.day = day;
  picture.dataset.time = time;
  picture.dataset.name = fileName;
  if (isImported && !zipFileCont) {
    const importPicture = pictureTmpl.content.cloneNode(true).firstElementChild;
    uintAdditionalInfo.importPicture = importPicture;
    importPicture.classList.add("importPicture");
    importPicture.classList.remove("picture");
    importedFiles.prepend(importPicture);
    toggleSelection(importPicture, imports);
  } else {
    const importName = $("span", zipFileCont);
    if (isImported && zipFileCont && !importName.innerText) {
      const pressTimeout = { id: 0 };
      const importPicture = $(".importPicture", zipFileCont);
      zipFileCont.dataset.absolutePath = absolutePath;
      zipFileCont.dataset.albumPath = albumPath;
      zipFileCont.dataset.albumName = albumName;
      importName.innerText = zipName;
      importedFiles.prepend(zipFileCont);
      toggleSelection(zipFileCont, imports, pressTimeout);
    }
  }
  const uintProm = file.async("uint8array").then((uint) => loadUint(uint, uintAdditionalInfo));
  State.imgs[absolutePath] = uintProm;
  State.pics[absolutePath] = picture;
  createPictureElement({ picture, albumPath, day, time, year });
  const albumLength = $(`.albumCont[data-album-path="${albumPath}"] .albumLength`);
  if (albumName in albumNames) {
    albumLength.innerText = ++albumNames[albumName];
    return;
  }
  if (albumName === importsName && albumLength) {
    albumLength.innerText = $$(`.picture[data-album-path="${importsName}"]`).length;
    return;
  }
  const albumCont = createAlbumElement(absolutePath, albumName);
  albumCont.dataset.albumPath = albumPath;
  albumCont.dataset.albumName = albumName;
  albumCont.dataset.absolutePath = absolutePath;
  albumNames[albumName] = 1;
  State.albumsOpts[albumPath] = {
    sortByOpt: sortByDateChk,
    sortOrderOpt: sortDesChk
  };
  albumCont.addEventListener("click", () => onAlbumClick(
    albumCont,
    albumPath,
    absolutePath,
    (picture2) => picture2.dataset.albumPath !== albumPath
  ));
  toggleSelection(albumCont, albums);
};
var loadPictures = async (picturesEntries, zipName, isImported, zipFileCont) => {
  const albumNames = {};
  const picturesSorted = picturesEntries.toSorted(
    ([, file1], [, file2]) => file2.date.getTime() - file1.date.getTime()
  );
  picturesSorted.forEach((entrie) => loadPicture(entrie, zipName, albumNames, isImported, zipFileCont));
  pictures.replaceChildren.apply(
    pictures,
    Array.from(pictures.children).sort(
      (section1, section2) => section2.dataset.time - section1.dataset.time
    )
  );
  await Promise.all(Object.values(State.imgs));
  sortAlbums();
  sortPicsByDate();
};
var createFavoritesAlbum = () => {
  const favoritesAlbum = createAlbumElement(favoritesName, favoritesName);
  favoritesAlbum.hidden = true;
  favoritesAlbum.dataset.albumPath = favoritesName;
  favoritesAlbum.dataset.albumName = favoritesName;
  favoritesAlbum.dataset.absolutePath = favoritesName;
  favoritesAlbum.addEventListener("click", onFavoritesAlbumClick);
  toggleSelection(favoritesAlbum, albums);
};

// src/scripts/loadFiles.js
var fileWorker = new Worker("./src/scripts/testFileWorker.js");
var useFileWorker = async (file) => {
  const { promise, resolve } = Promise.withResolvers();
  fileWorker.onmessage = ({ data }) => resolve(data);
  fileWorker.postMessage(file);
  const entries = await promise;
  entries.forEach(([, fileObj]) => fileObj.async = async () => fileObj.uint);
  return entries;
};
var loadFiles = () => {
  for (const file of zipInp.files) {
    if (!file) continue;
    loadZip(file, true);
  }
};
var loadZip = async (file, isImported) => {
  const { name: name2, type, lastModifiedDate, lastModified = Date.now() } = file;
  if (!Object.values(MIMETYPES).flat().includes(type)) {
    alert(`Invalid file: mimetype ${type} isn't valid`);
    cl(name2);
    return;
  }
  const popupFixed = duplicateConfirmation.parentElement;
  if (MIMETYPES.zip.includes(type)) {
    const hasImported2 = Object.values(State.pics).filter(
      ({ dataset }) => new RegExp(`^${name2} \\([0-9]+\\)$`).test(dataset.albumPath) || dataset.albumPath === name2
    ).reduce((arr2, { dataset }) => {
      const { albumPath } = dataset;
      !arr2.includes(albumPath) && arr2.push(albumPath);
      return arr2;
    }, []);
    if (hasImported2.length) {
      const [, cancel] = await tryP(confirmation(popupFixed, "file"));
      popupFixed.hidden = true;
      zipInp.value = "";
      if (cancel) return;
    }
    const folderEntries = await useFileWorker(file);
    const zipFileCont = zipFileTmpl.content.cloneNode(true).firstElementChild;
    zipFileCont.addEventListener("click", () => {
      if (State.selectionMode) return;
      $("[for=showAlbums]").click();
      const { albumPath, albumName } = zipFileCont.dataset;
      const albumCont = $(`.albumCont[data-album-path="${albumPath}"]`);
      albumCont.dispatchEvent(new Event("click"));
    });
    zipInp.value = "";
    loadPictures(folderEntries, hasImported2.length ? `${name2} (${hasImported2.length})` : name2, isImported, zipFileCont);
    State.prevInpSectionGallery.click();
    return;
  }
  const data = await file.bytes();
  const hasImported = Object.values(State.files).some(
    ([uint]) => uint.every((byte, i) => byte === data[i])
  );
  if (hasImported) {
    const [fileType] = Object.entries(FILETYPES).find(([, types]) => types.includes(type));
    const [, cancel] = await tryP(confirmation(popupFixed, fileType));
    popupFixed.hidden = true;
    zipInp.value = "";
    if (cancel) return;
  }
  zipInp.value = "";
  const fakeZipEntries = [[
    name2,
    {
      name: name2,
      date: "lastModifiedDate" in file ? lastModifiedDate : new Date(lastModified),
      async: async () => data
    }
  ]];
  loadPictures(fakeZipEntries, importsName, isImported);
  State.prevInpSectionGallery.click();
};

// src/scripts/deletePictureData.js
var deletePictureData = (picture) => {
  const { pics, imgs, files, albumsPicturesSel } = State;
  const { imgGroupId, absolutePath } = picture.dataset;
  const [, fileObj] = files[imgGroupId];
  const uintProm = imgs[absolutePath];
  const currPicture = pics[absolutePath];
  const importFile = $(`.importFile[data-img-group-id="${imgGroupId}"]`);
  const importPicture = $(`.importPicture[data-img-group-id="${imgGroupId}"]`);
  const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement;
  const newMainView = viewPicture.previousSibling;
  const prevMainView = viewPicture.nextSibling;
  State.files = Object.fromEntries(
    Object.entries(files).filter(([, file]) => file !== fileObj)
  );
  State.imgs = Object.fromEntries(
    Object.entries(imgs).filter(([, uint]) => uint !== uintProm)
  );
  State.pics = Object.fromEntries(
    Object.entries(pics).filter(([, pic]) => pic !== picture)
  );
  importFile?.remove();
  importPicture?.remove();
  if (!app.classList.contains("imgView")) {
    picture.remove();
    viewPicture.remove();
    return;
  }
  onViewerHorizontalSnap(newMainView, prevMainView);
  imgViewerScroll.style.pointerEvents = "none";
  changeViewerPicture(newMainView, true, () => {
    imgViewerScroll.style.pointerEvents = "";
    picture.remove();
    viewPicture.remove();
  });
};

// src/scripts/pictureActions.js
var toggleFavoritePicture = () => {
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`);
  const img = $(".picture.view .pictureImg");
  img.classList.toggle("favorite");
  addFavoriteBtn.classList.toggle("favorite");
  const albumLength = $(".albumLength", favoritesAlbum);
  const favorites = $$(".pictureImg.favorite");
  albumLength.innerText = favorites.length;
  favoritesAlbum.hidden = !(favorites.length > 0);
};
var sharePicture = () => {
  if (location.protocol !== https) {
    alert("The protocol of this page doesn't support the Web Share API.");
    return;
  }
  if (!("share" in navigator)) {
    alert("Your browser doesn't support the Web Share API.");
    return;
  }
  const pictureImg = $(".picture.view .pictureImg");
  const { imgGroupId } = pictureImg.dataset;
  const [, fileObj] = State.files[imgGroupId];
  const { name: name2 } = fileObj;
  const files = [fileObj];
  if (!navigator.canShare({ files })) {
    alert("Your system doesn't support sharing these files.");
    return;
  }
  navigator.share({ files, title: name2 });
};
var deletePicture = async () => {
  const picture = $(".picture.view");
  const { imgGroupId } = picture.dataset;
  const [, fileObj] = State.files[imgGroupId];
  const [fileType] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type));
  const popupFixed = deleteConfirmation.parentElement;
  const lengthCont = $(".lengthCont", deleteConfirmation);
  const fileTypeCont = $(".fileTypeCont", deleteConfirmation);
  lengthCont.innerText = 1;
  fileTypeCont.innerText = fileType;
  popupFixed.hidden = false;
  const [, cancel] = await tryP(confirmation(popupFixed, fileType));
  popupFixed.hidden = true;
  if (cancel) return;
  deletePictureData(picture);
};

// src/scripts/selectionActions.js
var shareSelection = () => {
  navigation.back();
  if (location.protocol !== https) {
    alert("The protocol of this page doesn't support the Web Share API.");
    return;
  }
  if (!("share" in navigator)) {
    alert("Your browser doesn't support the Web Share API.");
    return;
  }
  const files = arr($$(".picture.selected, .albumCont.selected, .importFile.selected, .importPicture.selected")).map((container) => {
    if (container.classList.contains("albumCont") || container.classList.contains("importFile")) {
      const { albumPath } = container.dataset;
      const picturesCont = arr($$(`.picture[data-album-path="${albumPath}"]`));
      return picturesCont.map(({ dataset }) => {
        const { imgGroupId } = dataset;
        const [, fileObj] = State.files[imgGroupId];
        return fileObj;
      });
    }
    if (container.classList.contains("picture") || container.classList.contains("importPicture")) {
      const { imgGroupId } = container.dataset;
      const [, fileObj] = State.files[imgGroupId];
      return fileObj;
    }
  }).flat();
  if (!navigator.canShare({ files })) {
    alert("Your system doesn't support sharing these files.");
    return;
  }
  navigator.share({
    files,
    title: `${files.length} files`
  });
};
var deleteSelection = async () => {
  let fileType = "item(s)";
  const albumsSel = $$(".albumCont.selected, .importFile.selected");
  const popupFixed = deleteConfirmation.parentElement;
  const lengthCont = $(".lengthCont", deleteConfirmation);
  const fileTypeCont = $(".fileTypeCont", deleteConfirmation);
  const picturesSelected = arr($$(".picture.selected, .albumCont.selected, .importFile.selected, .importPicture.selected")).map((container) => {
    if (container.classList.contains("albumCont") || container.classList.contains("importFile")) {
      const { albumPath } = container.dataset;
      const picturesCont = $$(`.picture[data-album-path="${albumPath}"]`);
      return Array.from(picturesCont);
    }
    if (container.classList.contains("picture") || container.classList.contains("importPicture")) {
      const { imgGroupId } = container.dataset;
      return $(`.picture[data-img-group-id="${imgGroupId}"]`);
    }
  }).flat();
  const isSameType = picturesSelected.reduce((arr2, { dataset }) => {
    const { imgGroupId } = dataset;
    const [, fileObj] = State.files[imgGroupId];
    const [fileType2] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type));
    !arr2.includes(fileType2) && arr2.push(fileType2);
    return arr2;
  }, []).length === 1;
  if (isSameType) {
    const [picture] = picturesSelected;
    const { imgGroupId } = picture.dataset;
    const [, fileObj] = State.files[imgGroupId];
    const [formatType] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type));
    fileType = `${formatType}(s)`;
  }
  lengthCont.innerText = picturesSelected.length;
  fileTypeCont.innerText = fileType;
  popupFixed.hidden = false;
  const [, cancel] = await tryP(confirmation(popupFixed, fileType));
  navigation.back();
  popupFixed.hidden = true;
  if (cancel) return;
  if (albumsSel.length) {
    albumsSel.forEach((album) => {
      if (album.classList.contains("importFile")) {
        const { albumPath } = album.dataset;
        const albumCont = $(`.albumCont[data-album-path="${albumPath}"]`);
        albumCont.remove();
      }
      album.remove();
    });
  }
  picturesSelected.forEach(deletePictureData);
  $$(".picturesSection").forEach((picturesSection) => {
    const picturesOfTheDate = $(".picturesOfTheDate", picturesSection);
    if (!picturesOfTheDate.children.length) picturesSection.remove();
  });
};

// src/scripts/generalEvents.js
var onWindowResize = () => {
  app.style.setProperty("--windowW", window.innerWidth);
  app.style.setProperty("--windowH", window.innerHeight);
  if (!State.imgOpen) return;
  const imgViewerImg = $("#imgViewerImg");
  const imgViewerMinImg = $("#imgViewerMinImg");
  const initWidth = imgViewer.style.getPropertyValue("--initWidth");
  const initHeight = imgViewer.style.getPropertyValue("--initHeight");
  updateImgViewSize(initWidth, initHeight, imgViewerImg, imgViewerMinImg);
};
var onAppScroll = () => {
  const currScroll = Math.round(app.scrollTop);
  const isMainTop = currScroll === 220;
  const isTop = currScroll === 0;
  const pointerEvents = isMainTop || isTop ? "auto" : "none";
  const overflow = isMainTop ? "auto" : "hidden";
  const action = isTop ? "add" : "remove";
  app.classList[action]("appHeaderOpen");
  app.style.setProperty("--curr-scroll", currScroll);
  pictures.style.pointerEvents = pointerEvents;
  albums.style.pointerEvents = pointerEvents;
  albumPics.style.pointerEvents = pointerEvents;
  pictures.style.overflow = overflow;
  albums.style.overflow = overflow;
  albumPics.style.overflow = overflow;
};
var onMainClick = (event) => {
  moreOptsChk.checked = false;
};
$$("button, label").forEach((btn) => {
  btn.addEventListener("pointerdown", () => {
    btn.classList.add("hover");
  });
  btn.addEventListener("pointerup", () => {
    btn.classList.remove("hover");
  });
  btn.addEventListener("pointerleave", () => {
    btn.classList.remove("hover");
  });
});
$$("input[type=radio]").forEach((input2) => {
  const { id: id2, name: name2 } = input2;
  const sibligs = document.getElementsByName(name2);
  input2.addEventListener("change", () => changeScreen(sibligs));
});

// src/scripts/backMode.js
var closeAlbum = () => {
  appHeaderText.innerText = "Albums";
  app.classList.remove("albumOpen");
  $(".albumCont.open")?.classList.remove("open");
  for (const picture of $$(".picture")) {
    const { day } = picture.dataset;
    const { imgGroupId } = $(".pictureImg", picture).dataset;
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement;
    const picByDateCont = $(`.picturesSection[data-day="${day}"] .picturesOfTheDate`);
    picture.hidden = viewPicture.hidden = false;
    picByDateCont.append(picture);
  }
  sortPicsByDate();
};
var onBackPage = () => {
  if (navigation.canGoBack) {
    navigation.back();
  }
};
var onPopState = (event) => {
  const inTransition = app.classList.contains("inTransition");
  const imgOpen = app.classList.contains("imgView");
  const albumOpen = app.classList.contains("albumOpen");
  moreOptsChk.checked = false;
  app.scrollTo({
    top: 220,
    behavior: app.scrollTop ? "instant" : "smooth"
  });
  if (app.classList.contains("imports")) {
    app.classList.remove("imports");
    for (const pictureImg of $$(".importPicture .pictureImg")) {
      const { imgGroupId } = pictureImg.dataset;
      const picture = $(`.picture[data-img-group-id="${imgGroupId}"]`);
      picture.append(pictureImg);
    }
    return;
  }
  if (State.details.visible) {
    State.details.visible = false;
    changeViewerSection(imgViewerSlider, true);
    return;
  }
  if (State.selectionMode) {
    closeSelectionMode();
    return;
  }
  if (inTransition && albumOpen) {
    closeAlbum();
    return;
  }
  if (imgOpen) {
    onPictureClose();
    return;
  }
  if (albumOpen) {
    closeAlbum();
  }
};

// src/scripts/test/testPictures.js
var async = async () => Uint8Array.fromBase64("UklGRvAAAABXRUJQVlA4TOQAAAAvl8BJEBLHkSQ5ig94i4nnCAbgQ8eInUN2HHMPRb8Ism3I5nPB85Ug2zY1ghoc6v2fgC7/EthQsGf/+05ldrm8QLPJJzTbyz/0MC7vEM297tC2QZ6CbZiPbMPzkIkyN8gz1rJ5BrYp3E/l8gSM8qv8772GefxtGp43NEQN62iIGqI284T4OnCXyQ8Eb5/ZFn+YBXmF4BEed4QL8oq7zLb8q5lv1MsnBFfzBsfbIMKCPOIw13OY+YXgMbzg8hH/Ovx5xIS7YD7B1Z1vjMsvsNI3jPPvtDzBf7wu++e/BXtKm8fOHwA=");
var testPictures = {
  "pic1.png": {
    _data: {},
    dir: false,
    date: new Date(Date.now() + 100),
    name: "pic1.png",
    async
  },
  "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic2.png": {
    _data: {},
    dir: false,
    date: new Date((/* @__PURE__ */ new Date()).setFullYear(2020)),
    name: "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic2.png",
    async
  },
  "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic3.jpg": {
    _data: {},
    dir: true,
    date: /* @__PURE__ */ new Date(),
    name: "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic3.jpg",
    async
  },
  "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic4.jpg": {
    _data: {},
    dir: true,
    date: /* @__PURE__ */ new Date("Sat Jan 09 2024"),
    name: "folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic4.jpg",
    async
  },
  "folder1/folder2/pic5.jpg": {
    _data: {},
    dir: true,
    date: /* @__PURE__ */ new Date("Sat Jan 09 2024"),
    name: "folder1/folder2/pic5.jpg",
    async
  },
  "folder1/folder2/pic6.jpg": {
    _data: {},
    dir: true,
    date: /* @__PURE__ */ new Date(),
    name: "folder1/folder2/pic6.jpg",
    async
  }
};

// src/scripts/main.mjs
window.addEventListener("resize", onWindowResize);
window.addEventListener("popstate", onPopState);
window.addEventListener("touchmove", onPointerMove);
window.addEventListener("touchend", onPointerUp);
window.addEventListener("leavepictureinpicture", onExitPiP);
app.addEventListener("scroll", onAppScroll, { passive: true });
appMain.addEventListener("click", onMainClick);
showImport.addEventListener("change", changeImportSection);
backBtn.addEventListener("click", onBackPage);
videoNowBtn.addEventListener("pointerdown", onVideoJumpTimeStart);
videoMuteBtn.addEventListener("click", onVideoMuted);
videoBackBtn.addEventListener("click", onVideoJumpTime);
videoPlayBtn.addEventListener("click", onVideoPlayPause);
videoAdvanceBtn.addEventListener("click", onVideoJumpTime);
picInPicBtn.addEventListener("click", onPiP);
detailsBtn.addEventListener("click", openDetails);
editPicsBtn.addEventListener("click", openSelectionMode);
sortPicsBtn.addEventListener("click", openSortOpts);
sortAccept.addEventListener("click", onSortAccept);
sortCancel.addEventListener("click", onSortCancel);
zipInp.addEventListener("change", loadFiles);
imgViewer.addEventListener("scroll", onViewerScroll);
imgViewerScroll.addEventListener("pointerdown", onViewerPointerDown);
addFavoriteBtn.addEventListener("click", toggleFavoritePicture);
deleteBtn.addEventListener("click", deletePicture);
shareBtn.addEventListener("click", sharePicture);
deleteSelBtn.addEventListener("click", deleteSelection);
shareSelBtn.addEventListener("click", shareSelection);
createFavoritesAlbum();
app.scrollTop = 220;
app.style.setProperty("--windowW", window.innerWidth);
app.style.setProperty("--windowH", window.innerHeight);
navigationBar.style.setProperty("--navigation-bar-height", navigationBar.clientHeight);
var [zipTest, videoTest] = await Promise.all([
  fetch("./src/scripts/test/appTest.zip").then((res) => res.blob()),
  fetch("./src/scripts/test/Vanny.mp4").then((res) => res.blob())
]);
var testEntries = Object.entries(testPictures);
loadPictures(testEntries, "@zip");
loadZip(Object.assign(videoTest, { name: "Vanny.mp4" }));
loadZip(Object.assign(zipTest, { name: "zipTest.zip" }));
