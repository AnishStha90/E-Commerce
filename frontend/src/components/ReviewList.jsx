import React from "react";

export default function ReviewList({ reviews }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border rounded p-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{review.user.name}</h4>
            <span className="text-gray-500 text-sm">{review.date}</span>
          </div>
          <p className="text-gray-700 mt-1">{review.comment}</p>
          <div className="mt-1">
            {Array.from({ length: review.rating }, (_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
