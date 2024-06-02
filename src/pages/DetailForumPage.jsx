import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import LayoutForumApp from '../layouts/LayoutForumApp';
import SidebarForum from '../layouts/SidebarForum';
import CardUser from '../components/forumapp/CardUser';
import RecentEvents from '../components/forumapp/RecentEvent';
import MainbarForum from '../layouts/MainbarForum';
import DetailPost from '../components/DetailPost';
import ListParticipant from '../components/ListParticipant';
import CreateComment from '../components/forumapp/CreateComment';
import ListComment from '../components/forumapp/ListComment';

const events = [
  {
    id: '21ad3',
    title: 'COVID-19',
  },
  {
    id: '21ad3f',
    title: 'Comptabilité - Problème Baisse de Charges',
  },
];

const detailForum = {
  category: 'event',
  title: 'Comptabilité - Problème Baisse de Charges',
  owner: {
    name: 'Ervalsa Dwi Nanda',
    avatar: 'https://i.pravatar.cc/300',
    headTItle: 'Software Engineer',
  },
  createdAt: '21 August 2023',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};

const participant = Array.from({ length: 20 }, (_, index) => ({
  name: `Participant ${index + 1}`,
  avatar: `https://i.pravatar.cc/300?u=${index}`,
  headTItle: `Software Engineer ${index + 1}`,
}));

const comments = [
  {
    owner: {
      name: 'Ervalsa Dwi Nanda',
      avatar: 'https://i.pravatar.cc/300',
      headTItle: 'Software Engineer',
    },
    createdAt: '21 August 2023',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

function DetailForumPage() {
  return (
    <LayoutForumApp>
      <SidebarForum>
        <CardUser
          name="Ervalsa Dwi Nanda"
          image="https://i.pravatar.cc/300"
          headTItle="Software Engineer"
        />
        <RecentEvents events={events} />
      </SidebarForum>
      <MainbarForum>
        <DetailPost
          title={detailForum.title}
          content={detailForum.content}
          owner={detailForum.owner}
          createdAt={detailForum.createdAt}
          category={detailForum.category}
        />
        <ListParticipant participant={participant} />
        <CreateComment />
        <ListComment comments={comments} />
      </MainbarForum>
    </LayoutForumApp>
  );
}

export default DetailForumPage;
