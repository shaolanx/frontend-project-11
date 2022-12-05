export default (state, elements, i18n) => {
  const { modalTitle, modalDescr, modalRead } = elements.modal;
  const { buttonCloseRead } = elements.modal.modalClose;

  const currentPost = state.posts.find((post) => post.postId === state.modalPostId);
  modalTitle.textContent = currentPost.title;
  modalDescr.textContent = currentPost.description;
  modalRead.setAttribute('href', `${currentPost.link}`);
  modalRead.textContent = i18n.t('modal.read');
  buttonCloseRead.textContent = i18n.t('modal.close');
};
