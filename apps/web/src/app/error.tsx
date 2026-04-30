"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div>
      <h2>Что-то пошло не так!</h2>
      {error.message}
    </div>
  );
}
