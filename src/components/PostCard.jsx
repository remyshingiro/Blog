import { Link } from "react-router-dom";

function PostCard({post}) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* extracting only title from the post accepted prop */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-3">
        {/* extracting post content */}
        {post.content}
      </p>

      <Link
      // dynamically changing link to match post id
        to={`/post/${post.id}`}
        className="text-blue-600 font-medium hover:underline"
      >
        Read More →
      </Link>
    </div>
  );
}

export default PostCard;