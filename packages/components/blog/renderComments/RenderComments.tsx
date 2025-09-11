'use client';
import React, { useState } from 'react';
import { BlogCommentDB, BlogFromDB, BlogPost } from '../../../types/blog';
import styles from './RenderComments.module.css';
import api from '../../../services/api';
import CommentForm from '../commentForm/CommentForm';
import ConfirmationAlert from '../../confirmationAlert/ConfirmationAlert';
import Image from 'next/image';

interface RenderCommentsProps {
  blog: BlogFromDB;
  comments: BlogPost['comments'];
  isDashboard: boolean;
  parentId?: string | null;
  isPreview?: boolean;
  onRefresh?: (blogId: string) => void;
}

const RenderComments: React.FC<RenderCommentsProps> = ({
  blog,
  comments,
  isDashboard,
  parentId = null,
  isPreview = false,
  onRefresh,
}) => {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [deleteCom, setDeleteCom] = useState<string | null>(null);

  const filteredComments = comments?.filter((comment) =>
    parentId ? comment.parentId === parentId : !comment.parentId || comment.parentId === ''
  );

  if (!filteredComments || filteredComments.length === 0) return null;
  return (
    <ul className={styles.comment_ul}>
      {filteredComments.map((comment) => (
        <li
          key={comment._id}
          className={styles.li_preview}
          style={{ marginLeft: parentId ? 32 : 0 }}
        >
          <section className={styles.section}>
            <Image
              className={styles.image}
              src={comment.profileImage}
              alt="Avatar"
              width={40}
              height={40}
            />
            <article className={styles.card}>
              <div className={styles.article_div}>
                <p>
                  <strong>{comment.author}</strong>
                </p>
                <p className={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
              <p>{comment.content}</p>
              {!isPreview ? (
                <>
                  {!comment.approved && (
                    <div className={styles.buttons}>
                      <button
                        className={styles.button_replay}
                        onClick={async () => {
                          await api.patch(
                            `/api/blogs/id/${blog._id}/comments/${comment._id}/approve`
                          );
                          {
                            onRefresh && onRefresh(blog._id);
                          }
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.button_delete}
                        onClick={() => setDeleteCom(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {comment.approved && (
                    <div className={styles.buttons}>
                      <button
                        className={styles.button_replay}
                        onClick={() => {
                          setReplyingToId(comment._id);
                        }}
                      >
                        Respond
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className={styles.button_replay}
                  onClick={() => setReplyingToId(replyingToId === comment._id ? null : comment._id)}
                >
                  {replyingToId === comment._id ? 'Cancel' : 'Respond'}
                </button>
              )}
              {replyingToId === comment._id && (
                <div className={styles.replyForm}>
                  <CommentForm
                    blogId={blog._id}
                    isDashboard={isDashboard}
                    parentId={comment._id}
                    onRefresh={() => {
                      {
                        onRefresh && onRefresh(blog._id);
                      }
                      setReplyingToId(null);
                    }}
                    onClose={() => setReplyingToId(null)}
                  />
                </div>
              )}
            </article>
          </section>

          {deleteCom === comment._id && (
            <ConfirmationAlert
              title="Are you sure you want to delete this comment?"
              message=""
              onCancel={() => setDeleteCom(null)}
              onConfirm={async () => {
                await api.delete(`/api/blogs/id/${blog._id}/comments/${comment._id}`);
                {
                  onRefresh && onRefresh(blog._id);
                }
              }}
            />
          )}

          <RenderComments
            blog={blog}
            comments={comments}
            isDashboard={isDashboard}
            parentId={comment._id}
            isPreview={isPreview}
            onRefresh={onRefresh}
          />
        </li>
      ))}
    </ul>
  );
};

export default RenderComments;
