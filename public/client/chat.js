const users = [];

const socket = io();

//Elements
const $allMessages = document.querySelector("#messages");
const $shareLocationButton = document.querySelector("#send-location");
const $messageForm = document.querySelector("#message-form");
const $formSubmitButton = $messageForm.querySelector('button');
const $formInput = $messageForm.querySelector('input');
const $sidebar = document.querySelector('#sidebar');

//Template
const $messageTemplate =
  document.querySelector("#message-template")?.innerHTML;
const $locationTemplate =
  document.querySelector("#location-template")?.innerHTML;
const $sidebarTemplate =
  document.querySelector("#sidebar-template")?.innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//Functions
const errorCallback = (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
}

const autoScroll = () => {
  const $lastMessage = $allMessages.lastElementChild

  const lastMessageStyles = getComputedStyle($lastMessage)
  const lastMessageMargin = parseInt(lastMessageStyles.marginBottom)
  const lastMessageHeight = $lastMessage + lastMessageMargin

  const viewHeight = $allMessages.offsetHeight
  const containerHeight = $allMessages.scrollHeight
  const scrollValue = $allMessages.scrollTop
  const currentPosition = viewHeight + scrollValue


  if (currentPosition >= containerHeight - lastMessageHeight)
    $allMessages.scrollTop = $allMessages.scrollHeight

}


socket.on('roomData', ({ room, users }) => {
  const htmlToRender = Mustache.render($sidebarTemplate, { room, users })
  $sidebar.innerHTML = htmlToRender

})

socket.on("sendMessage", (data) => {
  const htmlToRender = Mustache.render($messageTemplate, data);
  $allMessages.insertAdjacentHTML("beforeend", htmlToRender);
  autoScroll()
});

socket.on("locationReceived", (data) => {
  const htmlToRender = Mustache.render($locationTemplate, data);
  $allMessages.insertAdjacentHTML("beforeend", htmlToRender);
  autoScroll()

});

$shareLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("GeoLocation is not supported by your browser");

  $shareLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("shareLocation", {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    }, errorCallback);

    $shareLocationButton.removeAttribute("disabled");
  });
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $formSubmitButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  $formInput.value = "";
  $formInput.focus();
  // if (!message) return $formSubmitButton.removeAttribute("disabled");
  socket.emit("client-sent", message, errorCallback);
  $formSubmitButton.removeAttribute("disabled");
});

socket.emit('join', { username, room }, errorCallback)


// const makeLinkObj = (href) => {
//   const textContent = `${moment(new Date().getTime()).format("h:mm A")} - `;
//   const textElement = Object.assign(document.createElement("span"), {
//     textContent,
//   });

//   const hyperLinkElement = Object.assign(document.createElement("a"), {
//     target: "_blank",
//     href,
//     textContent: `This location is Shared`,
//   });
//   const parentElement = document.createElement("div");

//   parentElement.appendChild(textElement);
//   parentElement.appendChild(hyperLinkElement);
//   return parentElement;
// };





// const addUser = ({ id, username, room }) => {
//   username = username.trim().toLowerCase();
//   room = room.trim().toLowerCase();

//   if (!username || !room) return { error: "Username and room are required" };
//   if (users.find((u) => u.username === username && u.room === room))
//     return { error: "This user id already exist" };

//   users.push({ id, username, room });
// };

// const removeUser = (id) => {
//   if (validateId(id))
//     return { error: "id is required and it must be a number" };

//   const index = users.findIndex((u) => u.id === id);
//   if (index === -1) return { error: "No user found against the given id" };
//   return users.splice(index, 1)[0];
// };

// const validateId = (id) => {
//   return !(!id || !(id instanceof Number));
// };
// const getUser = (id) => {
//   if (validateId(id))
//     return { error: "id is required and it must be a number" };
//   return users.find((u) => u.id === id);
// };

// const getUsersInRoom = (room) => {
//   room = room.trim().toLowerCase();
//   if (!room || !(room instanceof String))
//     return {
//       error: "room is required and it should be a string",
//     };
//   return users.filter((u) => room === u.room);
// };
