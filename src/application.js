import axios from 'axios';
import * as yup from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import onChange from 'on-change';
import i18n from 'i18next';

import render from './render.js';
import resources from './locales/index.js';
import parse from './parse.js';

const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

const validate = (link, collection) => {
  const schemaStr = yup.string().required().url().trim();
  const schemaMix = yup.mixed().notOneOf(collection);
  return schemaStr.validate(link)
    .then((url) => schemaMix.validate(url));
};

const updatePosts = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => {
    getData(feed.url)
      .then((rss) => {
        const { posts } = parse(rss.data.contents);
        const newPosts = posts.filter((post) => {
          const collPostsLinks = watchedState.posts.map((postInState) => postInState.postLink);
          return !collPostsLinks.includes(post.postLink);
        });

        newPosts.forEach((post) => {
          post.postId = uniqueId();
          post.feedId = feed.id;
        });
        watchedState.posts = [...watchedState.posts, ...newPosts];
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
      });
    return watchedState;
  });
  Promise.all(promises)
    .finally(() => setTimeout(() => {
      updatePosts(watchedState);
    }, 5000));
};

export default () => {
  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => {
      const elements = {
        body: document.querySelector('body'),
        form: document.querySelector('form'),
        input: document.querySelector('#url-input'),
        submitButton: document.querySelector('[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        postsContainer: document.querySelector('.posts'),
        feedsContainer: document.querySelector('.feeds'),
        modal: {
          modal: document.querySelector('.modal'),
          modalTitle: document.querySelector('.modal-title'),
          modalDescr: document.querySelector('.modal-body'),
          modalRead: document.querySelector('.modal-read'),
          modalClose: {
            buttonClose: document.querySelector('.close'),
            buttonCloseRead: document.querySelector('.btn-secondary'),
          },
        },
      };

      const initialState = {
        form: {
          status: 'filling',
          error: '',
        },
        feeds: [],
        posts: [],
        postsVisits: [],
        modalPostId: '',
      };

      const watchedState = onChange(initialState, render(initialState, elements, i18next));
      setTimeout(updatePosts(watchedState), 5000);

      const addRss = (parsedRss, url) => {
        const { feed, posts } = parsedRss;
        feed.id = uniqueId();
        feed.url = url;
        watchedState.feeds.push(feed);
        posts.forEach((post) => {
          const feedId = feed.id;
          const postId = uniqueId();
          const { title, description, link } = post;
          watchedState.posts.push({
            title, description, link, feedId, postId,
          });
        });
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.form.status = 'sending';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const rssLinks = watchedState.feeds.map((feed) => feed.url);
        validate(url, rssLinks)
          .then((validUrl) => getData(validUrl))
          .then((rss) => {
            const parsedRss = parse(rss.data.contents);
            addRss(parsedRss, url);
            watchedState.form.error = '';
            watchedState.form.status = 'finished';
          }).catch((err) => {
            watchedState.form.error = err.type ?? err.message.toLowerCase();
            watchedState.form.status = 'failed';
          });
      });

      elements.postsContainer.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        watchedState.modalPostId = id;
        watchedState.postsVisits.push(id);
      });
    });
};
