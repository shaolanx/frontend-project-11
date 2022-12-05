// ---------------------------------------Content render------------------------------------- //

const getFeeds = (state, i18n) => {
  const { feeds } = state;
  const feedListEl = document.createElement('div');
  feedListEl.classList.add('card', 'border-0');

  const feedEl = document.createElement('div');
  feedEl.classList.add('card-body');
  feedEl.innerHTML = `<h2 class="card-title h4">${i18n.t('feeds')}</h2>`;
  feedListEl.append(feedEl);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'border-end-0');
  feedListEl.append(ulEl);

  feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    title.classList.add('h6', 'm-0');
    description.classList.add('m-0', 'small', 'text-black-50');

    title.textContent = feed.title;
    description.textContent = feed.description;

    liEl.append(title);
    liEl.append(description);

    ulEl.append(liEl);
  });
  return feedListEl;
};

const getPosts = (state, i18n) => {
  const { posts } = state;
  const postsListEl = document.createElement('div');
  postsListEl.classList.add('card', 'border-0');

  const postEl = document.createElement('div');
  postEl.classList.add('card-body');
  postEl.innerHTML = `<h2 class="card-title h4">${i18n.t('posts')}</h2>`;
  postsListEl.append(postEl);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  postsListEl.append(ulEl);

  posts.forEach((post) => {
    const liEl = document.createElement('li');
    const title = document.createElement('a');
    const button = document.createElement('button');

    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    if (state.postsVisits.includes(post.postId)) {
      title.classList.add('fw-normal', 'link-secondary');
    } else {
      title.classList.add('fw-bold');
    }

    title.setAttribute('href', `${post.link}`);
    title.setAttribute('data-id', `${post.postId}`);
    title.setAttribute('target', '_blank');
    title.setAttribute('rel', 'noopener noreferrer');

    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${post.postId}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');

    title.textContent = post.title;
    button.textContent = i18n.t('postButtonRead');

    liEl.append(title);
    liEl.append(button);

    ulEl.append(liEl);
  });
  return postsListEl;
};

const contentRender = (state, elements, i18n) => {
  const { feedsContainer, postsContainer } = elements;
  feedsContainer.replaceChildren();
  postsContainer.replaceChildren();
  const feeds = getFeeds(state, i18n);
  const posts = getPosts(state, i18n);
  feedsContainer.append(feeds);
  postsContainer.append(posts);
};

// ---------------------------------------Form render---------------------------------------- //

const formRenderSuccess = (elements, i18n) => {
  const {
    input,
    form,
    feedback,
    submitButton,
  } = elements;
  submitButton.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('feedback.success');
  form.reset();
  input.focus();
};

const formRenderError = (state, elements, i18n) => {
  const { input, feedback, submitButton } = elements;
  submitButton.disabled = false;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18n.t([`feedback.${state.form.error}`, 'feedback.invalidUnknown']);
};

const formRender = (state, elements, i18n) => {
  switch (state.form.status) {
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    case 'finished':
      formRenderSuccess(elements, i18n);
      break;
    case 'failed':
      formRenderError(state, elements, i18n);
      break;
    default:
      throw new Error(`Unknown state: ${state.formStatus}`);
  }
};

// ---------------------------------------Modal render--------------------------------------- //

const renderModalContent = (state, elements, i18n) => {
  const { modalTitle, modalDescr, modalRead } = elements.modal;
  const { buttonCloseRead } = elements.modal.modalClose;

  const currentPost = state.posts.find((post) => post.postId === state.modalPostId);
  modalTitle.textContent = currentPost.title;
  modalDescr.textContent = currentPost.description;
  modalRead.setAttribute('href', `${currentPost.link}`);
  modalRead.textContent = i18n.t('modal.read');
  buttonCloseRead.textContent = i18n.t('modal.close');
};

// ---------------------------------------Switch render-------------------------------------- //

export default (state, elements, i18n) => (path) => {
  switch (path) {
    case 'form.status':
    case 'form.error':
      formRender(state, elements, i18n);
      break;
    case 'modalPostId':
      renderModalContent(state, elements, i18n);
      break;
    case 'feeds':
    case 'posts':
      contentRender(state, elements, i18n);
      break;
    case 'postsVisits':
      contentRender(state, elements, i18n);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
};
