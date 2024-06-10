import React, { useCallback, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import LayoutForumApp from '../layouts/LayoutForumApp';
import MainbarForum from '../layouts/MainbarForum';
import CreatePost from '../components/forumapp/CreatePost';
import CardPost from '../components/forumapp/CardPost';
import SidebarContent from '../components/forumapp/SidebarContent';
import { asyncForumPostAndUsers } from '../states/shared/thunk';
import { incrementPage } from '../states/posts/slice';

function ForumPage() {
  const authUser = useSelector((state) => state.authUser);
  const status = useSelector((state) => state.posts.status);
  const page = useSelector((state) => state.posts.page);
  const hasMore = useSelector((state) => state.posts.hasMore);
  const posts = useSelector((state) => state.posts.data);
  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const loadMorePosts = useCallback(() => {
    if (status === 'loading' || !hasMore) return;
    dispatch(incrementPage());
    dispatch(asyncForumPostAndUsers(page));
  }, [status, hasMore, page, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(asyncForumPostAndUsers(page));
    }
  }, [status, page, dispatch]);

  const listPost = posts?.map((post) => ({
    ...post,
    owner: users.find((user) => user.id === post.ownerId),
  }));

  console.log(listPost);

  return (
    <LayoutForumApp>
      <SidebarContent user={authUser} />
      <MainbarForum>
        <CreatePost />
        <InfiniteScroll
          style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}
          dataLength={posts?.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <CircularProgress
              sx={{ display: 'block', margin: 'auto', marginY: 2 }}
            />
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              {status === 'loading' ? 'Loading...' : 'No more data'}
            </p>
          }>
          {listPost?.map((post, index) => (
            <CardPost
              key={index}
              id={post?.id}
              title={post?.title}
              description={post?.description}
              image={post?.image}
              category={post?.category}
              owner={post?.owner}
              startDate={post?.startDate}
              endDate={post?.endDate}
              createdAt={post?.createdAt}
              totalParticipants={post?.totalParticipants}
              maxParticipant={post?.maxParticipant}
            />
          ))}
        </InfiniteScroll>
      </MainbarForum>
    </LayoutForumApp>
  );
}

export default ForumPage;
