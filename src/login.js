import { setUpPage, toggleModal } from './resources/common';

document.onload = setUpPage();

const forgotTrigger = document.querySelector(`#forgot-password`),
    forgotCloser = document.querySelector(`#forgot-modal .close img`),
    forgotModal = document.querySelectorAll(`#forgot-modal`);
toggleModal(forgotModal, [forgotTrigger, forgotCloser]);