"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("src/helper");
const socket = io();
const $allMessages = document.querySelector("#all-messages");
const $shareLocationButton = document.querySelector("#share-location");
const $formSubmitButton = document.querySelector("#submit");
const $messageForm = document.querySelector("#message-form");
const $chatBoxTemplate = document.querySelector("#chat-box-template").innerHTML;
socket.on("sendMessage", (message) => {
    const htmlToRender = Mustache.render($chatBoxTemplate, { message });
    $allMessages.insertAdjacentHTML("beforeend", htmlToRender);
});
socket.on("leaving message", (message) => {
    console.log(message);
});
socket.on("locationReceived", (location) => {
    const link = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    $allMessages.insertAdjacentElement("beforeend", (0, helper_1.makeLinkObj)(link));
});
$shareLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation)
        return alert("GeoLocation is not supported by your browser");
    $shareLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("shareLocation", {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
        });
        $shareLocationButton.removeAttribute("disabled");
    });
});
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $formSubmitButton.setAttribute("disabled", "disabled");
    const message = e.target.elements.message.value;
    document.getElementById("message").value = "";
    document.querySelector("#message").focus();
    if (!message)
        return $formSubmitButton.removeAttribute("disabled");
    socket.emit("client-sent", message);
    $formSubmitButton.removeAttribute("disabled");
});
