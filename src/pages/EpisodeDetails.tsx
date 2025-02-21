import { useParams } from "react-router";
import EpisodeDetailsPlayer from "../components/EpisodeDetailsPlayer";
import { useQuery } from "@apollo/client";
import LoaderSpinner from "../components/LoaderSpinner.js";
import { GET_PODCASTEPISODE } from "../query.js";
import { useState, useRef, useEffect } from "react";

function EpisodeDetails() {
  const { id } = useParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
    useState(false);
  const descriptionRef = useRef(null);

  const { loading, error, data } = useQuery(GET_PODCASTEPISODE, {
    variables: { uuid: id },
    fetchPolicy: "cache-and-network",
  });

  const episode = data?.getPodcastEpisode;

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseFloat(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxVisibleHeight = lineHeight * 2; // Maximum height for 4 lines
      setIsDescriptionOverflowing(
        descriptionRef.current.scrollHeight > maxVisibleHeight
      );
    }
  }, [episode]);

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center mt-10">
        <p className="text-center text-red-500">
          Something went wrong: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  if (!episode)
    return <p className="text-center text-lg mt-10">Episode not found.</p>;

  return (
    <div className="h-screen overflow-y-auto pb-14">
      {/* Episode Player */}
      <EpisodeDetailsPlayer episode={episode} />

      {/* Episode Description */}
      <div className="my-5">
        <h2 className="font-bold text-xl">Description:</h2>
        <div
          ref={descriptionRef}
          className={`mt-3 font-light text-lg break-words ${
            isDescriptionExpanded ? "" : "line-clamp-4"
          }`}
          style={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isDescriptionExpanded ? "none" : 4,
          }}
        >
          {episode?.description || "No description available."}
        </div>
        {isDescriptionOverflowing && (
          <button
            onClick={toggleDescription}
            className="mt-3 text-blue-500 font-medium"
          >
            {isDescriptionExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Episode Transcript */}
      <div className="my-5">
        <h2 className="font-bold text-xl">Transcript:</h2>
        <p
          className="font-light text-lg mt-3 overflow-auto max-h-96 break-words"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {episode?.transcript || "Transcript not available."}
        </p>
      </div>
      {/* Comment Section */}
      <Comments />
    </div>
  );
}

export default EpisodeDetails;

function Comments() {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/default-avatar.png",
      },
      content: "This episode was fantastic! Learned so much!",
      likes: 5,
      replies: [
        {
          id: 1.1,
          user: {
            name: "Jane Smith",
            avatar: "/default-avatar.png",
          },
          content: "Totally agree! It was amazing.",
        },
      ],
      showReplies: false,
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "/default-avatar.png",
      },
      content: "Really insightful discussion. Thanks for sharing!",
      likes: 3,
      replies: [],
      showReplies: false,
    },
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          user: {
            name: "Guest User",
            avatar: "/default-avatar.png",
          },
          content: newComment.trim(),
          likes: 0,
          replies: [],
          showReplies: false,
        },
      ]);
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleReplyToComment = (commentId, replyContent) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: `${comment.id}.${comment.replies.length + 1}`,
                  user: {
                    name: "Guest User",
                    avatar: "/default-avatar.png",
                  },
                  content: replyContent,
                },
              ],
            }
          : comment
      )
    );
  };

  const toggleReplies = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };
  return (
    <div className="my-5">
      <h2 className="font-bold text-xl">Comments:</h2>
      <div className="mt-3 space-y-5">
        {/* Add Comment Input */}
        <div className="flex gap-3 items-start">
          <textarea
            className="w-full border-b border-b-slate-400 border-solid outline-none p-3 bg-transparent placeholder:font-thin placeholder:text-lg text-xl font-semibold"
            rows={1}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-lg">{comment.user.name}</p>
                    <p className="font-light text-md">{comment.content}</p>
                    <div className="flex gap-5 mt-2 text-sm">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="text-blue-500"
                      >
                        Like ({comment.likes})
                      </button>
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-blue-500"
                      >
                        {comment.showReplies ? "Hide Replies" : "Show Replies"}{" "}
                        ({comment.replies.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies Section */}
                {comment.showReplies && (
                  <div className="ml-12 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 items-start">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-md">{reply.user.name}</p>
                          <p className="font-light text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                    <textarea
                      className="w-full border-b border-b-slate-400 border-solid outline-none p-2 bg-transparent placeholder:font-thin placeholder:text-sm text-sm"
                      rows={1}
                      placeholder="Write a reply..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReplyToComment(comment.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-light text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
