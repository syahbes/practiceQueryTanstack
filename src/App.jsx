import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  {
    id: 1,
    title: "Post 1",
  },
  {
    id: 2,
    title: "Post 2",
  },
];

function App() {
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostMutation = useMutation({
    mutationFn: title =>{
      return wait(1000).then(() =>
      POSTS.push({
        id: crypto.randomUUID(),
        title,
      }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    }
  })

  if (postQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (postQuery.isError) {
    return <pre>{JSON.stringify(postQuery.error, null, 2)}</pre>;
  }

  return (
    <div>
      {postQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("new post")}>
        add new
      </button>
    </div>
  );
}


function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

//branching
export default App;
