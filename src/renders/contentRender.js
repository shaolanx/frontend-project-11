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

    title.setAttribute('href', `${post.postLink}`);
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

export default contentRender;
