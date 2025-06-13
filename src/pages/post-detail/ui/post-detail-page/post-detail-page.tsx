import { memo } from 'react';
import { useParams } from 'react-router';
import { PostForm } from '../post-form/post-form';
import classes from './post-detail-page.module.scss';
import { useGetPostQuery } from 'entities/post';

export default memo(function PostDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useGetPostQuery(+id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Ошибка!: {JSON.stringify(error)}</div>;
  }

  return (
    <div className={classes.postDetailPage}>
      <div>id: {data!.id}</div>
      <div>userId: {data!.userId}</div>
      <PostForm post={data!} />
    </div>
  );
});
