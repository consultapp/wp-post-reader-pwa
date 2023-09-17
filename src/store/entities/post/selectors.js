import { createSelector } from "@reduxjs/toolkit";
import { LOADING_STATUS } from "../../../constants";

export const selectPostModule = (state) => state.post;
const selectPostId = (_, { postId }) => postId;
const selectPageIndex = (_, { pageIndex = 1 }) => pageIndex;
// const selectSlug = (_, { slug }) => slug;

// ID
export const selectPostIds = createSelector(
  [selectPostModule],
  (post) => post.ids
);
// export const selectPostIds = (state) => selectPostModule(state).ids;
export const selectPostById = createSelector(
  [selectPostModule, selectPostId],
  (post, postId) => post.entities[postId]
);
// export const selectPostById = (state, { postId }) =>
//   selectPostModule(state).entities[postId];

export const selectIfPostAlreadyLoaded = createSelector(
  [selectPostIds, selectPostId],
  (post, postId) => post.includes(postId)
);
// export const selectIfPostAlreadyLoaded = (state, { postId }) =>
//   selectPostIds(state).includes(postId);

// Slug
export const selectPostSlugToId = createSelector(
  [selectPostModule],
  (post) => post.slugToId || {}
);

export const selectPostBySlug = (state, { slug }) =>
  selectPostById(state, {
    postId: selectPostSlugToId(state)[encodeURI(slug).toLowerCase()],
  });

// Status
export const selectPostLoadingStatus = createSelector(
  [selectPostModule],
  (post) => post.loadingStatus
);

export const selectIsPostLoading = createSelector(
  [selectPostLoadingStatus],
  (status) => status === LOADING_STATUS.pending
);

export const selectIsPostRejected = createSelector(
  [selectPostLoadingStatus],
  (status) => status === LOADING_STATUS.rejected
);

export const selectIsPostStatus404 = createSelector(
  [selectPostModule],
  (post) => post.status404
);

export const selectIsPostNotFound = createSelector(
  [selectPostLoadingStatus, selectIsPostStatus404],
  (a, b) => a === LOADING_STATUS.rejected && b
);

// pageIndex + Page

export const selectPostsByPageIndex = createSelector(
  [selectPostModule, selectPageIndex],
  (post, pageIndex) =>
    Object.values(post.entities || {}).filter(
      (item) => item?.pageIndex === Number(pageIndex)
    )
);

export const selectPostsIdsByPageIndex = createSelector(
  [selectPostModule, selectPageIndex],
  (post, pageIndex) =>
    Object.values(post.entities || {}).reduce((acc, item) => {
      if (item?.pageIndex === Number(pageIndex)) {
        acc.push(item.id);
      }
      return acc;
    }, [])
);

export const selectLoadedPostsPages = createSelector(
  [selectPostModule],
  (post) => post.loadedPages
);

export const selectIsPostPageLoaded = createSelector(
  [selectLoadedPostsPages, selectPageIndex],
  (items, pageIndex) => items.includes(Number(pageIndex))
);
