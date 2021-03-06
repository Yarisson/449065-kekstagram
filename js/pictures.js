'use strict';

var getRandomNumber = function (a, b) {
  var rand = a + Math.round(((b - a) * Math.random()));
  return rand;
};

var commentsExamples = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var getArrayPictures = function () {
  var tempPictures = [];
  var tempComments = [];
  for (var i = 0; i < 24; i++) {
    var objectPhoto = { };
    var indexPhoto = i + 1;
    indexPhoto = indexPhoto + '';
    objectPhoto.url = 'photos/' + indexPhoto + '.jpg';
    objectPhoto.likes = getRandomNumber(15, 200);
    for (var j = 0; j < 2; j++) {
      tempComments[j] = commentsExamples[getRandomNumber(0, 5)];
    }
    objectPhoto.comments = tempComments;
    tempPictures[i] = objectPhoto;
  }
  return tempPictures;
};

var pictures = getArrayPictures();
var pictureTemplate = document.querySelector('#picture-template').content; // Переменная блока темплейт
var renderPicture = function (picture, index) { // Функция создания ДОМ-элементов на основе шаблона  темплейт для массива pictures

  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').setAttribute('src', picture.url);
  pictureElement.querySelector('img').setAttribute('data-element-id', index);
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  return pictureElement;
};

var picturesDraw = document.querySelector('.pictures');
var paintingPictures = function (array) { // Функция отрисовки ДОМ-элементов методом document fragment массива pictures
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length - 1; i++) {
    fragment.appendChild(renderPicture(array[i], i));
  }
  picturesDraw.appendChild(fragment);
};

paintingPictures(pictures);

var STEP_SIZE = 25;
var MAX_IMAGE_SIZE = 100;
var HIDDEN_CLASS = 'hidden';
var ESC_KEY = 27;

var pictureElements = document.querySelectorAll('.picture');
var galleryOverlayComments = document.querySelector('.comments-count');
var galleryOverlayLikes = document.querySelector('.likes-count');
var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
var galleryOverlay = document.querySelector('.gallery-overlay');
var uploadFile = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadCancel = document.querySelector('#upload-cancel');
var uploadEffectLevelValue = document.querySelector('.upload-effect-level-value');
var uploadEffectControls = document.querySelector('.upload-effect-controls');
var uploadResizeControlsValue = document.querySelector('.upload-resize-controls-value'); // масштабирование изображения
var uploadResizeValueIncrease = document.querySelector('.upload-resize-controls-button-inc');
var uploadResizeValueDecrease = document.querySelector('.upload-resize-controls-button-dec');
var effectImagePreview = document.querySelector('.effect-image-preview');

var galleryOverlayClick = function (evt) {
  evt.preventDefault();

  var currentId = evt.target.getAttribute('data-element-id');
  galleryOverlay.classList.remove(HIDDEN_CLASS);
  galleryOverlayImage.setAttribute('src', pictures[currentId].url);
  galleryOverlayComments.textContent = pictures[currentId].comments.length;
  galleryOverlayLikes.textContent = pictures[currentId].likes;
};

var galleryOverlayClickClose = function () {
  galleryOverlay.classList.add(HIDDEN_CLASS);
};

var galleryEsc = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    galleryOverlay.classList.add(HIDDEN_CLASS);
  }
};

var onUploadDialogPress = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    uploadOverlay.classList.add(HIDDEN_CLASS);
  }
};

var uploadFileClose = function () {
  document.removeEventListener('keydown', onUploadDialogPress);
  uploadOverlay.classList.add(HIDDEN_CLASS);
};

var uploadFileOpen = function () {
  uploadOverlay.classList.remove(HIDDEN_CLASS);
  document.addEventListener('keydown', onUploadDialogPress);
};

var resizeIncrease = function () {
  var sizeValue = parseInt(uploadResizeControlsValue.value, 10);
  if (sizeValue < MAX_IMAGE_SIZE) {
    sizeValue = (sizeValue + STEP_SIZE);
    uploadResizeControlsValue.setAttribute('value', sizeValue + '%');
    effectImagePreview.style.transform = 'scale(' + sizeValue / MAX_IMAGE_SIZE + ')';
  }
};

var resizeDecrease = function () {
  var sizeValue = parseInt(uploadResizeControlsValue.value, 10);
  if (sizeValue > STEP_SIZE) {
    sizeValue = (sizeValue - STEP_SIZE);
    uploadResizeControlsValue.setAttribute('value', sizeValue + '%');
    effectImagePreview.style.transform = 'scale(' + sizeValue / MAX_IMAGE_SIZE + ')';
  }
};

var uploadLevelPin = function (evt) {
  var value = evt.target.parentElement.getAttribute('for').substring(14);
  effectImagePreview.classList.remove('effect-chrome', 'effect-heat', 'effect-phobos', 'effect-marvin', 'effect-sepia', 'effect-none');

  if (value === 'chrome') {
    effectImagePreview.classList.add('effect-chrome');
    uploadEffectLevelValue.setAttribute('style', 'filter: grayscale(1)');
  } else if (value === 'sepia') {
    effectImagePreview.classList.add('effect-sepia');
    uploadEffectLevelValue.setAttribute('style', 'filter: sepia(1)');
  } else if (value === 'marvin') {
    effectImagePreview.classList.add('effect-marvin');
    uploadEffectLevelValue.setAttribute('style', 'filter: invert(100%)');
  } else if (value === 'phobos') {
    effectImagePreview.classList.add('effect-phobos');
    uploadEffectLevelValue.setAttribute('style', 'filter: blur(3, px)');
  } else if (value === 'heat') {
    effectImagePreview.classList.add('effect-heat');
    uploadEffectLevelValue.setAttribute('style', 'filter: brightness(3)');
  } else {
    effectImagePreview.classList.add('effect-none');
    uploadEffectLevelValue.setAttribute('style', 'filter: none');
  }
};

var init = function () {
  uploadResizeControlsValue.setAttribute('value', '100%');

  // добавляем обработчики событий для фото
  for (var i = 0; i < pictureElements.length; i++) {
    pictureElements[i].addEventListener('click', galleryOverlayClick);
    galleryOverlayClose.addEventListener('click', galleryOverlayClickClose);
    document.addEventListener('keydown', galleryEsc);
  }
};

init();

uploadFile.addEventListener('change', uploadFileOpen);
uploadCancel.addEventListener('click', uploadFileClose);
uploadResizeValueIncrease.addEventListener('click', resizeIncrease);
uploadResizeValueDecrease.addEventListener('click', resizeDecrease);
uploadEffectControls.addEventListener('mouseup', uploadLevelPin);
